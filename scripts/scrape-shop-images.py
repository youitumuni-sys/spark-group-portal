"""全店舗のトップ画像URLを取得して public/api/shop-images.json に保存"""
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

JS_SHOP_IMAGE = r"""() => {
    // Find first shop image (shps*pc.jpeg) - these are the main shop photos
    const imgs = document.querySelectorAll('img');
    for (const img of imgs) {
        let src = img.src || img.dataset.src || '';
        if (src.startsWith('//')) src = 'https:' + src;
        if (src.includes('shps') && src.includes('pc.jpeg')) return src;
    }
    // Fallback: background-image
    const bgEls = document.querySelectorAll('[style*="background-image"]');
    for (const el of bgEls) {
        const m = el.style.backgroundImage.match(/url\(["']?(.*?shps.*?pc\.jpeg.*?)["']?\)/);
        if (m) {
            let src = m[1];
            if (src.startsWith('//')) src = 'https:' + src;
            return src;
        }
    }
    return '';
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
            url = f"{BASE}/{shop['area']}/{shop['slug']}/"
            for attempt in range(3):
                try:
                    await page.goto(url, wait_until="domcontentloaded", timeout=30000)
                    await page.wait_for_timeout(2000)
                    image_url = await page.evaluate(JS_SHOP_IMAGE)
                    all_data[shop["id"]] = image_url
                    status = "OK" if image_url else "NO IMAGE"
                    print(f"[{i+1}/9] {shop['name']}: {status} - {image_url[:100] if image_url else '-'}")
                    break
                except Exception as ex:
                    print(f"[{i+1}/9] {shop['name']}: retry {attempt+1} - {ex}")
                    await page.wait_for_timeout(3000)

        await browser.close()

        # Save to both lib/ (for build-time import) and public/api/ (for client fetch)
        out = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "lib", "shop-images.json")
        out2 = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "public", "api", "shop-images.json")
        for path in [out, out2]:
            os.makedirs(os.path.dirname(path), exist_ok=True)
            with open(path, "w", encoding="utf-8") as f:
                json.dump(all_data, f, ensure_ascii=False, indent=2)

        ok = sum(1 for v in all_data.values() if v)
        print(f"\n=== {ok}/9 店舗の画像URLを保存 ===")

asyncio.run(main())
