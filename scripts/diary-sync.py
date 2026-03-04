"""
写メ日記の定期同期（30分間隔）
バックグラウンドで常駐し、scrape-diaries.pyを定期実行する

Usage:
  pythonw scripts/diary-sync.py          # 非表示で常駐
  python  scripts/diary-sync.py          # コンソール表示あり
  python  scripts/diary-sync.py --once   # 1回だけ実行
"""
import subprocess, sys, os, time

INTERVAL = 30 * 60  # 30分
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
SCRAPER = os.path.join(SCRIPT_DIR, "scrape-diaries.py")
PYTHON = sys.executable

def run_scraper():
    try:
        result = subprocess.run(
            [PYTHON, SCRAPER],
            cwd=os.path.join(SCRIPT_DIR, ".."),
            capture_output=True, text=True, encoding="utf-8", timeout=120
        )
        ts = time.strftime("%Y-%m-%d %H:%M:%S")
        if result.returncode == 0:
            last_line = [l for l in result.stdout.strip().splitlines() if l][-1] if result.stdout.strip() else "OK"
            print(f"[{ts}] {last_line}", flush=True)
        else:
            print(f"[{ts}] ERROR: {result.stderr[:200]}", flush=True)
    except Exception as ex:
        print(f"[{time.strftime('%Y-%m-%d %H:%M:%S')}] EXCEPTION: {ex}", flush=True)

if __name__ == "__main__":
    if "--once" in sys.argv:
        run_scraper()
    else:
        sys.stdout.reconfigure(encoding="utf-8")
        print(f"写メ日記同期開始 (間隔: {INTERVAL // 60}分)", flush=True)
        while True:
            run_scraper()
            time.sleep(INTERVAL)
