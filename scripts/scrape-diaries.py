"""
写メ日記スクレイピング（10分cron用・軽量版）
CityHeaven各店舗の最新写メ日記を取得 → public/api/diaries.json

Usage:
  python scripts/scrape-diaries.py
  crontab: */10 * * * * cd /path/to/spark-group-portal && python scripts/scrape-diaries.py
"""
import asyncio, json, sys, os
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

BASE = "https://www.cityheaven.net/osaka"

JS_DIARY = """() => {
    const entries = [];
    const items = document.querySelectorAll('article.diary_item');
    for (let i = 0; i < Math.min(items.length, 3); i++) {
        const item = items[i];
        const titleEl = item.querySelector('.diary_title');
        const timeEl = item.querySelector('.diary_time');
        const nameEl = item.querySelector('.diary_writer');
        const linkEl = item.querySelector('a[href*="/diary/"]');

        // 画像: photoframe > movieframe(poster or img)
        let image = '';
        let isVideo = false;
        const photoImg = item.querySelector('.diary_photoframe img');
        if (photoImg) {
            image = photoImg.src || photoImg.dataset.src || '';
        } else {
            const movieFrame = item.querySelector('.diary_movieframe');
            if (movieFrame) {
                isVideo = true;
                const video = movieFrame.querySelector('video');
                if (video && video.poster) {
                    image = video.poster.startsWith('//') ? 'https:' + video.poster : video.poster;
                } else {
                    const mImg = movieFrame.querySelector('img');
                    if (mImg) image = mImg.src || mImg.dataset.src || '';
                }
            }
        }

        entries.push({
            image,
            isVideo,
            title: titleEl ? titleEl.textContent.trim() : '',
            time: timeEl ? timeEl.textContent.trim() : '',
            castName: nameEl ? nameEl.textContent.trim() : '',
            url: linkEl ? linkEl.href : '',
        });
    }
    return entries;
}"""

async def main():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    out_path = os.path.join(script_dir, "..", "public", "api", "diaries.json")

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        ctx = await browser.new_context(user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36")
        page = await ctx.new_page()

        # Age gate bypass
        await page.goto(f"{BASE}/?nenrei=y", wait_until="domcontentloaded")
        await page.wait_for_timeout(1500)

        all_diaries = []
        for i, shop in enumerate(SHOPS):
            try:
                await page.goto(f"{BASE}/{shop['area']}/{shop['slug']}/diarylist/", wait_until="domcontentloaded", timeout=15000)
                await page.wait_for_timeout(1000)
                entries = await page.evaluate(JS_DIARY)
                for e in entries:
                    e["shopId"] = shop["id"]
                    e["shopName"] = shop["name"]
                    if not e.get("castName"):
                        e["castName"] = ""
                all_diaries.extend(entries)
                print(f"[{i+1}/{len(SHOPS)}] {shop['name']}: {len(entries)}件")
            except Exception as ex:
                print(f"[{i+1}/{len(SHOPS)}] {shop['name']}: error - {ex}")

        await browser.close()

    result = {
        "updatedAt": __import__('datetime').datetime.now().isoformat(),
        "entries": all_diaries,
    }
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(result, f, ensure_ascii=False, indent=2)
    print(f"\n=== {len(all_diaries)}件 → {out_path} ===")

asyncio.run(main())
