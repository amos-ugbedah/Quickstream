import requests
from bs4 import BeautifulSoup
import json
import os
import re
import random
from datetime import datetime, timedelta

TARGETS = [
    {"url": "https://spankbang.com/s/nigerian/?o=all", "cat": "African", "site": "SpankBang"},
    {"url": "https://spankbang.com/s/ebony+lesbian/?o=all", "cat": "Lesbian", "site": "SpankBang"},
    {"url": "https://www.eporner.com/search/african/", "cat": "African", "site": "Epors"},
    {"url": "https://best.xvideos.com/?k=african+raw&sort=uploaddate", "cat": "African", "site": "XVideos"},
    {"url": "https://xhamster.com/search/african-american?sort=newest", "cat": "African", "site": "XHamster"}
]

def extract_unique_id(url):
    match = re.search(r'(video|viewkey=|/v/|/video-)([a-zA-Z0-9_-]+)', url)
    return match.group(2) if match else url

def fetch_master_vault():
    headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0 Safari/537.36'}
    base_dir = os.path.dirname(os.path.abspath(__file__))
    output_path = os.path.join(base_dir, "..", "frontend", "src", "movies.json")

    existing_movies = []
    if os.path.exists(output_path):
        try:
            with open(output_path, 'r', encoding='utf-8') as f:
                raw_data = json.load(f)
                limit_date = datetime.now() - timedelta(days=30)
                # FIX: Use .get() to prevent KeyError if some entries are malformed
                existing_movies = [m for m in raw_data if m.get('added_on') and datetime.strptime(m['added_on'], "%Y-%m-%d %H:%M:%S") > limit_date]
        except: existing_movies = []

    # FIX: Safely extract seen IDs
    seen_ids = {m.get('video_id') for m in existing_movies if m.get('video_id')}
    new_movies = []
    
    print(f"🚀 VORTEX: Harvesting New Metadata...")

    for target in TARGETS:
        try:
            res = requests.get(target['url'], headers=headers, timeout=15)
            soup = BeautifulSoup(res.content, 'html.parser')
            containers = soup.find_all(['div', 'li', 'article'], class_=re.compile(r'video|item|v-box|thumb'))
            
            for item in containers[:25]: 
                link_tag = item.find('a', href=True)
                img_tag = item.find('img')
                if not link_tag or not img_tag: continue
                
                href = link_tag['href']
                full_url = href if href.startswith('http') else f"https://{target['url'].split('/')[2]}{href}"

                video_id = extract_unique_id(full_url)
                if video_id in seen_ids: continue

                title = (link_tag.get('title') or img_tag.get('alt') or "Premium Scene").strip()
                thumb = img_tag.get('data-src') or img_tag.get('src') or img_tag.get('data-thumb')

                new_movies.append({
                    "id": random.getrandbits(31), # React safe ID
                    "video_id": video_id,
                    "title": title[:70],
                    "url": full_url, 
                    "category": target['cat'],
                    "site": target['site'],
                    "thumbnail": thumb if thumb else "",
                    "added_on": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                })
                seen_ids.add(video_id)
                print(f"✅ Added: {title[:30]}")
                        
        except Exception as e:
            print(f"⚠️ Error on {target['site']}: {e}")

    final_list = (new_movies + existing_movies)
    final_list.sort(key=lambda x: x.get('added_on', ""), reverse=True)

    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(final_list, f, indent=4)
    print(f"🏆 Vault Updated. Total Movies: {len(final_list)}")

if __name__ == "__main__":
    fetch_master_vault() 