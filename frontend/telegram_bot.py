import requests
import json
import os

# --- AUTHENTICATED CONFIGURATION ---
BOT_TOKEN = "8524697118:AAH9W1UWdi2s2TPPFSe_IQAPKkd-tf1e-RY"
# Replace this with your actual Channel Username (must start with @)
CHANNEL_ID = "@YourChannelUsername" 
WEBSITE_URL = "https://QuickStream.icu"

def send_to_telegram():
    try:
        # Path to your database in the frontend/src folder
        db_path = os.path.join('src', 'movies.json')
        
        with open(db_path, 'r') as f:
            movies = json.load(f)

        if not movies:
            print("⚠️ Database empty. Run fetcher.py first.")
            return

        # Get the latest movie entry
        latest = movies[-1]
        
        # Professional Layout for Higher Click-Through Rate (CTR)
        message = (
            f"🎬 *NEW PREMIUM UPDATE*\n"
            f"━━━━━━━━━━━━━━━━━━\n"
            f"📺 *Title:* {latest['title']}\n"
            f"📂 *Category:* #{latest['category']}\n"
            f"⭐ *Quality:* 4K Ultra HD\n"
            f"━━━━━━━━━━━━━━━━━━\n\n"
            f"🔗 *WATCH FULL VIDEO HERE:* \n"
            f"{WEBSITE_URL}/redirect?url={latest['url']}\n\n"
            f"🔞 _Join @YourChannelUsername for daily updates_"
        )

        url = f"https://api.telegram.org/bot{BOT_TOKEN}/sendMessage"
        payload = {
            "chat_id": CHANNEL_ID,
            "text": message,
            "parse_mode": "Markdown",
            "disable_web_page_preview": False # Keeps the thumbnail preview active
        }

        response = requests.post(url, data=payload)
        
        if response.status_code == 200:
            print(f"🚀 [SUCCESS] Posted '{latest['title']}' to Telegram!")
        else:
            print(f"❌ [ERROR] {response.status_code}: {response.text}")

    except FileNotFoundError:
        print("❌ Error: movies.json not found in src/ folder.")
    except Exception as e:
        print(f"❌ unexpected Error: {e}")

if __name__ == "__main__":
    send_to_telegram()