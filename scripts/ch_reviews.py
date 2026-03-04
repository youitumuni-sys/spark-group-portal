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

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        ctx = await browser.new_context(user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36")
        page = await ctx.new_page()

        await page.goto("https://www.cityheaven.net/osaka/?nenrei=y", wait_until="domcontentloaded")
        await page.wait_for_timeout(2000)
        await page.goto("https://www.cityheaven.net/osaka/A2701/A270101/ooku_ume/", wait_until="domcontentloaded")
        await page.wait_for_timeout(2000)

        # First explore HTML structure on one page
        url = "https://www.cityheaven.net/osaka/A2701/A270101/ooku_ume/reviews/"
        await page.goto(url, wait_until="domcontentloaded", timeout=15000)
        await page.wait_for_timeout(2000)

        html = await page.content()
        with open("C:/tools/multi-agent-shogun/projects/spark-group-portal/scripts/review_page.html", "w", encoding="utf-8") as f:
            f.write(html)
        print("Saved full HTML")

        # Try to find review content
        data = await page.evaluate("""() => {
            const result = {};
            // Get all class names that contain 'review' or 'kuchi'
            const allEls = document.querySelectorAll('*');
            const classSet = new Set();
            for (const el of allEls) {
                for (const c of el.classList) {
                    if (c.toLowerCase().includes('review') || c.toLowerCase().includes('kuchi')) {
                        classSet.add(c);
                    }
                }
            }
            result.reviewClasses = Array.from(classSet);

            // Get review text blocks
            const texts = [];
            for (const cls of classSet) {
                const els = document.querySelectorAll('.' + CSS.escape(cls));
                for (let i = 0; i < Math.min(els.length, 2); i++) {
                    const t = els[i].textContent.trim();
                    if (t.length > 10 && t.length < 500) {
                        texts.push({cls: cls, text: t.slice(0, 150)});
                    }
                }
            }
            result.texts = texts.slice(0, 10);
            return result;
        }""")

        print(f"Review classes: {data['reviewClasses']}")
        for t in data['texts'][:8]:
            print(f"  .{t['cls']}: {t['text'][:100]}")

        await browser.close()

asyncio.run(main())
