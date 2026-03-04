"""
本日出勤の定期同期（毎日9:00 + 30分間隔で日中更新）
+ 店舗画像URLの日次更新（1日1回）
バックグラウンドで常駐し、scrape-schedule.pyを定期実行する

Usage:
  pythonw scripts/schedule-sync.py          # 非表示で常駐
  python  scripts/schedule-sync.py          # コンソール表示あり
  python  scripts/schedule-sync.py --once   # 1回だけ実行
"""
import subprocess, sys, os, time
from datetime import datetime

INTERVAL = 30 * 60  # 30分
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
SCHEDULE_SCRAPER = os.path.join(SCRIPT_DIR, "scrape-schedule.py")
IMAGE_SCRAPER = os.path.join(SCRIPT_DIR, "scrape-shop-images.py")
PYTHON = sys.executable
CWD = os.path.join(SCRIPT_DIR, "..")

def run_script(script, label, timeout=300):
    try:
        result = subprocess.run(
            [PYTHON, script],
            cwd=CWD,
            capture_output=True, text=True, encoding="utf-8", timeout=timeout
        )
        ts = time.strftime("%Y-%m-%d %H:%M:%S")
        if result.returncode == 0:
            last_line = [l for l in result.stdout.strip().splitlines() if l][-1] if result.stdout.strip() else "OK"
            print(f"[{ts}] [{label}] {last_line}", flush=True)
        else:
            print(f"[{ts}] [{label}] ERROR: {result.stderr[:200]}", flush=True)
    except Exception as ex:
        print(f"[{time.strftime('%Y-%m-%d %H:%M:%S')}] [{label}] EXCEPTION: {ex}", flush=True)

def update_shop_images():
    """店舗画像スクレイピング → lib/shop-images.json + public/api/shop-images.json 更新"""
    run_script(IMAGE_SCRAPER, "shop-images", timeout=180)

if __name__ == "__main__":
    if "--once" in sys.argv:
        run_script(SCHEDULE_SCRAPER, "schedule")
        update_shop_images()
    else:
        sys.stdout.reconfigure(encoding="utf-8")
        print(f"出勤同期開始 (間隔: {INTERVAL // 60}分、9:00〜翌3:00)", flush=True)
        last_image_update_date = None
        while True:
            now = datetime.now()
            hour = now.hour
            today = now.strftime("%Y-%m-%d")

            # 9:00〜翌3:00の間だけ出勤データを更新（営業時間帯）
            if 9 <= hour or hour < 3:
                run_script(SCHEDULE_SCRAPER, "schedule")
            else:
                print(f"[{time.strftime('%Y-%m-%d %H:%M:%S')}] 営業時間外 - スキップ", flush=True)

            # 店舗画像は1日1回だけ更新（初回実行時）
            if last_image_update_date != today:
                print(f"[{time.strftime('%Y-%m-%d %H:%M:%S')}] 店舗画像の日次更新...", flush=True)
                update_shop_images()
                last_image_update_date = today

            time.sleep(INTERVAL)
