import asyncio, json, sys
sys.stdout.reconfigure(encoding='utf-8')
from playwright.async_api import async_playwright

SHOPS = [
    {"id": "clshop001", "slug": "ooku_ume", "area": "A2701/A270101"},
    {"id": "clshop002", "slug": "ooku_nanba", "area": "A2701/A270102"},
    {"id": "clshop003", "slug": "pururun-komachi_umeda", "area": "A2701/A270101"},
    {"id": "clshop004", "slug": "pururun-komachi_kyobashi", "area": "A2701/A270105"},
    {"id": "clshop005", "slug": "spark_umeda", "area": "A2701/A270101"},
    {"id": "clshop006", "slug": "spark_nihonbashi", "area": "A2701/A270104"},
    {"id": "clshop007", "slug": "pururun-madamu_nanba", "area": "A2702/A270201"},
    {"id": "clshop008", "slug": "pururun-madamu_juso", "area": "A2701/A270103"},
    {"id": "clshop009", "slug": "ooku_nihonbashi", "area": "A2701/A270104"},
]

JS_EXTRACT = """() => {
    const result = {};
    // Average score
    const avgEl = document.querySelector('.review-total');
    result.avgScore = avgEl ? avgEl.textContent.trim() : '';

    // Individual reviews
    const items = document.querySelectorAll('.review-item');
    result.reviews = [];
    for (let i = 0; i < Math.min(items.length, 3); i++) {
        const item = items[i];
        const star = item.querySelector('.review-item-rate');
        const title = item.querySelector('.review-item-title');
        const content = item.querySelector('.review-item-content');
        const date = item.querySelector('.review-item-post-date');
        const cast = item.querySelector('.review-item-shopnameButton');
        result.reviews.push({
            score: star ? star.textContent.trim() : '',
            title: title ? title.textContent.trim() : '',
            comment: content ? content.textContent.trim().slice(0, 120) : '',
            date: date ? date.textContent.trim() : '',
            cast: cast ? cast.textContent.trim().split('\\n')[0].trim() : '',
        });
    }
    return result;
}"""

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        ctx = await browser.new_context(user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36")
        page = await ctx.new_page()

        await page.goto("https://www.cityheaven.net/osaka/?nenrei=y", wait_until="domcontentloaded")
        await page.wait_for_timeout(2000)
        await page.goto("https://www.cityheaven.net/osaka/A2701/A270101/ooku_ume/", wait_until="domcontentloaded")
        await page.wait_for_timeout(2000)

        all_results = {}
        for shop in SHOPS:
            url = f"https://www.cityheaven.net/osaka/{shop['area']}/{shop['slug']}/reviews/"
            print(f"Fetching: {shop['slug']}")
            try:
                await page.goto(url, wait_until="domcontentloaded", timeout=15000)
                await page.wait_for_timeout(1500)
                data = await page.evaluate(JS_EXTRACT)
                print(f"  avg={data['avgScore']}  reviews={len(data['reviews'])}")
                for r in data['reviews']:
                    print(f"    {r['score']} | {r['title'][:40]} | {r['comment'][:50]}")
                all_results[shop['id']] = data
            except Exception as e:
                print(f"  Error: {e}")
                all_results[shop['id']] = {"avgScore": "", "reviews": []}

        await browser.close()

    with open("C:/tools/multi-agent-shogun/projects/spark-group-portal/scripts/reviews_data.json", "w", encoding="utf-8") as f:
        json.dump(all_results, f, ensure_ascii=False, indent=2)
    print("\nSaved to reviews_data.json")

asyncio.run(main())
