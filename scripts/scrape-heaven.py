"""
CityHeaven自動スクレイピング
口コミ・キャスト一覧・写メ日記を取得 → lib/heaven-data.json

Usage:
  npm run scrape
  npm run build:full   (scrape + build)
"""
import asyncio, json, sys, os
sys.stdout.reconfigure(encoding='utf-8')
from playwright.async_api import async_playwright

SHOPS = [
    {"id": "clshop001", "slug": "ooku_ume",                "area": "A2701/A270101", "name": "大奥 梅田店"},
    {"id": "clshop003", "slug": "pururun-komachi_umeda",    "area": "A2701/A270101", "name": "ぷるるん小町 梅田店"},
    {"id": "clshop004", "slug": "pururun-komachi_kyobashi", "area": "A2701/A270105", "name": "ぷるるん小町 京橋店"},
    {"id": "clshop005", "slug": "spark_umeda",              "area": "A2701/A270101", "name": "スパーク 梅田店"},
    {"id": "clshop006", "slug": "spark_nihonbashi",         "area": "A2701/A270104", "name": "スパーク 日本橋店"},
    {"id": "clshop002", "slug": "ooku_nam",                  "area": "A2702/A270201", "name": "大奥 難波店"},
    {"id": "clshop007", "slug": "pururun-madamu_nanba",     "area": "A2702/A270201", "name": "ぷるるんマダム 難波店"},
    {"id": "clshop008", "slug": "pururun-madamu_juso",      "area": "A2701/A270103", "name": "ぷるるんマダム 十三店"},
    {"id": "clshop009", "slug": "ooku_nihombashi",          "area": "A2702/A270202", "name": "大奥 日本橋店"},
]

BASE = "https://www.cityheaven.net/osaka"

JS_REVIEWS = """() => {
    const result = { totalCount: 0, reviews: [] };
    const totalEl = document.querySelector('.review-total');
    if (totalEl) {
        const m = totalEl.textContent.match(/(\\d[\\d,]*)/);
        if (m) result.totalCount = parseInt(m[1].replace(/,/g, ''));
    }
    const items = document.querySelectorAll('.review-item');
    for (let i = 0; i < Math.min(items.length, 5); i++) {
        const item = items[i];
        const rate = item.querySelector('.review-item-rate');
        const title = item.querySelector('.review-item-title');
        const date = item.querySelector('.review-item-post-date');
        const post = item.querySelector('.review-item-post');
        let score = '';
        if (rate) { const m = rate.textContent.match(/(\\d+\\.?\\d*)/); if (m) score = m[1]; }
        let dateStr = '';
        if (date) { const m = date.textContent.match(/(\\d{4}).+(\\d{2}).+(\\d{2})/); if (m) dateStr = m[1]+'/'+m[2]+'/'+m[3]; }
        let comment = '';
        if (post) { comment = post.textContent.trim().slice(0, 200); }
        result.reviews.push({ score, title: title ? title.textContent.trim() : '', date: dateStr, comment });
    }
    return result;
}"""

JS_CASTS = """() => {
    const result = { total: 0, casts: [] };
    const h2 = document.querySelector('h2');
    if (h2) { const m = h2.textContent.match(/(\\d+)/); if (m) result.total = parseInt(m[1]); }
    const cards = document.querySelectorAll('.girl-list-item');
    for (let i = 0; i < Math.min(cards.length, 5); i++) {
        const c = cards[i];
        const img = c.querySelector('img[src*="grpb"], img[data-src*="grpb"]');
        const nameEl = c.querySelector('.girl-list-item-name, .name');
        const imgSrc = img ? (img.src || img.dataset.src || '') : '';
        const name = nameEl ? nameEl.textContent.trim() : '';
        if (name) result.casts.push({ name, image: imgSrc });
    }
    return result;
}"""

JS_DIARY = """() => {
    const entries = [];
    const items = document.querySelectorAll('.diary-list-item');
    for (let i = 0; i < Math.min(items.length, 2); i++) {
        const item = items[i];
        const img = item.querySelector('img[src*="grdr"], img[data-src*="grdr"]');
        const titleEl = item.querySelector('.diary-list-item-title, .title');
        const timeEl = item.querySelector('.diary-list-item-time, .time, time');
        entries.push({
            image: img ? (img.src || img.dataset.src || '') : '',
            title: titleEl ? titleEl.textContent.trim() : '',
            time: timeEl ? timeEl.textContent.trim() : '',
        });
    }
    return entries;
}"""

async def main():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    out_path = os.path.join(script_dir, "..", "lib", "heaven-data.json")

    # Load existing data to preserve manual entries
    existing = {}
    if os.path.exists(out_path):
        with open(out_path, "r", encoding="utf-8") as f:
            existing = json.load(f)

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        ctx = await browser.new_context(user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36")
        page = await ctx.new_page()

        print("[*] Age gate bypass...")
        await page.goto(f"{BASE}/?nenrei=y", wait_until="domcontentloaded")
        await page.wait_for_timeout(2000)
        await page.goto(f"{BASE}/{SHOPS[0]['area']}/{SHOPS[0]['slug']}/", wait_until="domcontentloaded")
        await page.wait_for_timeout(2000)

        data = dict(existing)  # keep existing entries for shops not in SHOPS list

        for i, shop in enumerate(SHOPS):
            sid = shop["id"]
            entry = {"reviews": {"totalCount": 0, "reviews": []}, "casts": {"total": 0, "casts": []}, "diaries": []}
            print(f"\n[{i+1}/{len(SHOPS)}] {shop['name']}")

            # Reviews
            try:
                await page.goto(f"{BASE}/{shop['area']}/{shop['slug']}/reviews/", wait_until="domcontentloaded", timeout=15000)
                await page.wait_for_timeout(1500)
                entry["reviews"] = await page.evaluate(JS_REVIEWS)
                print(f"  reviews: {entry['reviews']['totalCount']}件")
            except Exception as e:
                print(f"  reviews error: {e}")

            # Casts
            try:
                await page.goto(f"{BASE}/{shop['area']}/{shop['slug']}/girllist/", wait_until="domcontentloaded", timeout=15000)
                await page.wait_for_timeout(1500)
                entry["casts"] = await page.evaluate(JS_CASTS)
                print(f"  casts: {entry['casts']['total']}名, {len(entry['casts']['casts'])}名取得")
            except Exception as e:
                print(f"  casts error: {e}")

            # Diary
            try:
                await page.goto(f"{BASE}/{shop['area']}/{shop['slug']}/diarylist/", wait_until="domcontentloaded", timeout=15000)
                await page.wait_for_timeout(1500)
                dr = await page.evaluate(JS_DIARY)
                for d in dr:
                    d["shopId"] = sid
                    d["shopName"] = shop["name"]
                entry["diaries"] = dr
                print(f"  diary: {len(dr)}件")
            except Exception as e:
                print(f"  diary error: {e}")

            data[sid] = entry

        await browser.close()

    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"\n=== Saved to {out_path} ===")

asyncio.run(main())
