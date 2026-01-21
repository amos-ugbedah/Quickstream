import subprocess
import schedule
import time
from datetime import datetime

def run_scraper():
    print(f"⏰ [{datetime.now().strftime('%H:%M:%S')}] Updating Vault...")
    subprocess.run(["python", "scraper.py"])

# Run once at start
run_scraper()

# Run every 4 hours to keep the list fresh
schedule.every(4).hours.do(run_scraper)

while True:
    schedule.run_pending()
    time.sleep(60)