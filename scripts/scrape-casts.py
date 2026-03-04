"""全店舗キャストデータ再取得"""
import asyncio, sys, json
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

JS_CASTS = r"""() => {
    const items = document.querySelectorAll('.girllist > li');
    const casts = [];
    for (const item of items) {
        const img = item.querySelector('.girllistimg img');
        const text = item.querySelector('.girllisttext');
        if (!text) continue;
        const fullText = text.textContent || '';
        // name is first non-empty text
        let name = '';
        for (const n of text.childNodes) {
            const t = n.textContent.trim();
            if (t && !t.includes('\u6b73') && !t.includes('\u66f4\u65b0') && !t.includes('\u53e3\u30b3\u30df') && !t.includes('NEW') && t.length < 20) {
                name = t;
                break;
            }
        }
        const ageMatch = fullText.match(/(\d+)\u6b73/);
        const heightMatch = fullText.match(/T(\d+)/);
        const sizeMatch = fullText.match(/(\d+)\s*\([A-Z]+\)\s*[\uff65\u30fb]\s*(\d+)\s*[\uff65\u30fb]\s*(\d+)/);
        const bustMatch = fullText.match(/(\d+)\s*\([A-Z]+\)/);

        let imgSrc = img ? (img.src || img.dataset.src || '') : '';
        if (imgSrc.startsWith('//')) imgSrc = 'https:' + imgSrc;

        casts.push({
            name: name,
            image: imgSrc,
            age: ageMatch ? parseInt(ageMatch[1]) : null,
            height: heightMatch ? parseInt(heightMatch[1]) : null,
            bust: bustMatch ? parseInt(bustMatch[1]) : null,
            waist: sizeMatch ? parseInt(sizeMatch[2]) : null,
            hip: sizeMatch ? parseInt(sizeMatch[3]) : null,
        });
    }
    const h2s = document.querySelectorAll('h2');
    let total = casts.length;
    for (const h of h2s) {
        const m = h.textContent.match(/(\d+)\u4eba\u4e2d/);
        if (m) { total = parseInt(m[1]); break; }
    }
    return { total, casts };
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
            url = f"{BASE}/{shop['area']}/{shop['slug']}/girllist/"
            for attempt in range(3):
                try:
                    await page.goto(url, wait_until="domcontentloaded", timeout=30000)
                    await page.wait_for_timeout(2000)
                    data = await page.evaluate(JS_CASTS)
                    all_data[shop["id"]] = data
                    top3 = ", ".join([f"{c['name']}({c['age']})" for c in data["casts"][:3]])
                    print(f"[{i+1}/9] {shop['name']}: {data['total']}人 (取得{len(data['casts'])}人) - {top3}")
                    break
                except Exception as ex:
                    print(f"[{i+1}/9] {shop['name']}: retry {attempt+1} - {ex}")
                    await page.wait_for_timeout(3000)

        await browser.close()

        import os
        out = os.path.join(os.path.dirname(os.path.abspath(__file__)), "cast-data.json")
        with open(out, "w", encoding="utf-8") as f:
            json.dump(all_data, f, ensure_ascii=False, indent=2)
        print(f"\n=== {out} に保存 ===")

asyncio.run(main())
