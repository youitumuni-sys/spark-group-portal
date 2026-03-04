"""全店舗の本日出勤キャストを取得（attend ページ）"""
import asyncio, sys, json, os
sys.stdout.reconfigure(encoding='utf-8')
from playwright.async_api import async_playwright

SHOPS = [
    {"id": "clshop001", "slug": "ooku_ume",                "area": "A2701/A270101", "name": "大奥 梅田店"},
    {"id": "clshop002", "slug": "ooku_nam",                 "area": "A2702/A270201", "name": "大奥 難波店"},
    {"id": "clshop003", "slug": "pururun-komachi_umeda",    "area": "A2701/A270101", "name": "ぷるるん小町 梅田店"},
    {"id": "clshop004", "slug": "pururun-komachi_kyobashi", "area": "A2701/A270105", "name": "ぷるるん小町 京橋店"},
    {"id": "clshop005", "slug": "spark_umeda",              "area": "A2701/A270101", "name": "スパーク 梅田店"},
    {"id": "clshop006", "slug": "spark_nihonbashi",         "area": "A2701/A270104", "name": "スパーク 日本橋店"},
    {"id": "clshop007", "slug": "pururun-madamu_nanba",     "area": "A2702/A270201", "name": "ぷるるんマダム 難波店"},
    {"id": "clshop008", "slug": "pururun-madamu_juso",      "area": "A2701/A270103", "name": "ぷるるんマダム 十三店"},
    {"id": "clshop009", "slug": "ooku_nihombashi",          "area": "A2702/A270202", "name": "大奥 日本橋店"},
]

# attend page: .shukkin-list-container .item-0 has today's cast
# Each cast: div.girl with background-image, .profile children
JS_ATTEND = r"""() => {
    // Today's container = .item-0
    const container = document.querySelector('.shukkin-list-container .item-0');
    if (!container) {
        // Fallback: try .schedulelist (some shops use this)
        const items = document.querySelectorAll('.schedulelist > li > a.shukkin_link');
        if (items.length > 0) {
            const casts = [];
            for (const a of items) {
                const clockEl = a.querySelector('.schedule_clock');
                const nameEl = a.querySelector('.schedule_name');
                const sizeEl = a.querySelector('.schedule_size');
                const img = a.querySelector('.schedule_img img');
                let imgSrc = img ? (img.src || img.dataset.src || '') : '';
                if (imgSrc.startsWith('//')) imgSrc = 'https:' + imgSrc;
                const nameText = nameEl ? nameEl.textContent.trim() : '';
                const nameMatch = nameText.match(/^(.+?)\s*\[(\d+)歳\]/);
                casts.push({
                    name: nameMatch ? nameMatch[1].trim() : nameText.split('\n')[0].trim(),
                    age: nameMatch ? parseInt(nameMatch[2]) : null,
                    image: imgSrc,
                    time: clockEl ? clockEl.textContent.trim() : '',
                    size: sizeEl ? sizeEl.textContent.trim() : '',
                });
            }
            return casts;
        }
        return [];
    }

    // Find all girl links inside item-0
    const links = container.querySelectorAll('a[href*="/girlid-"]');
    const casts = [];
    for (const a of links) {
        const girlDiv = a.querySelector('.girl');
        const profile = a.querySelector('.profile');
        if (!profile) continue;

        // Image from background-image
        let image = '';
        if (girlDiv) {
            const bg = girlDiv.style.backgroundImage || '';
            const m = bg.match(/url\(["']?(.*?)["']?\)/);
            if (m) {
                image = m[1];
                if (image.startsWith('//')) image = 'https:' + image;
            }
        }

        const timeEl = profile.querySelector('.shukkin_detail_time');
        const nameEl = profile.querySelector('.name_font_size');
        const ageEl = profile.querySelector('.year_font_size');
        const sizeEl = profile.querySelector('.bust_font_size');

        let timeText = timeEl ? timeEl.textContent.trim() : '';
        // Remove font-awesome icon text
        timeText = timeText.replace(/^\s*/, '').trim();

        const name = nameEl ? nameEl.textContent.trim() : '';
        const ageText = ageEl ? ageEl.textContent.trim() : '';
        const ageMatch = ageText.match(/(\d+)/);
        const size = sizeEl ? sizeEl.textContent.trim() : '';

        casts.push({
            name: name,
            age: ageMatch ? parseInt(ageMatch[1]) : null,
            image: image,
            time: timeText,
            size: size,
        });
    }
    return casts;
}"""

BASE = "https://www.cityheaven.net/osaka"

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        ctx = await browser.new_context(user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36")
        page = await ctx.new_page()
        await page.goto(f"{BASE}/?nenrei=y", wait_until="domcontentloaded")
        await page.wait_for_timeout(1500)

        all_data = {}
        for i, shop in enumerate(SHOPS):
            # Try attend page first (has richer data), fallback to shop top
            for url_suffix in ["attend/", ""]:
                url = f"{BASE}/{shop['area']}/{shop['slug']}/{url_suffix}"
                for attempt in range(3):
                    try:
                        await page.goto(url, wait_until="domcontentloaded", timeout=30000)
                        await page.wait_for_timeout(4000)
                        casts = await page.evaluate(JS_ATTEND)
                        if len(casts) > 0 or url_suffix == "":
                            all_data[shop["id"]] = casts
                            names = ", ".join([f"{c['name']}({c['time']})" for c in casts[:3]])
                            src = "attend" if url_suffix else "top"
                            print(f"[{i+1}/9] {shop['name']}: {len(casts)}人出勤 ({src}) - {names}")
                            break
                        break  # No data from attend, try top page
                    except Exception as ex:
                        print(f"[{i+1}/9] {shop['name']}: retry {attempt+1} - {ex}")
                        await page.wait_for_timeout(3000)
                if shop["id"] in all_data:
                    break

        await browser.close()

        out = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "public", "api", "schedule.json")
        os.makedirs(os.path.dirname(out), exist_ok=True)
        with open(out, "w", encoding="utf-8") as f:
            json.dump(all_data, f, ensure_ascii=False, indent=2)

        total = sum(len(v) for v in all_data.values())
        print(f"\n=== {total}名の出勤データを {out} に保存 ===")

asyncio.run(main())
