/* refresh.js - ESM Version for Root Folder */
import fs from 'fs';
import axios from 'axios';
import path from 'path';
import { fileURLToPath } from 'url';

// Recreate __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * PATH UPDATE:
 * Now targeting frontend/src/movies.json as requested.
 */
const FILE_PATH = path.join(__dirname, 'frontend', 'src', 'movies.json');

const delay = ms => new Promise(res => setTimeout(res, ms));

async function refreshLinks() {
    console.log('\n--- 🛠️ VORTEX ESM REFRESHER STARTING ---');
    console.log(`📂 Target: ${FILE_PATH}`);
    
    try {
        if (!fs.existsSync(FILE_PATH)) {
            console.error(`❌ ERROR: Could not find movies.json at: ${FILE_PATH}`);
            console.log('Ensure you are running this from the root "movie-aggregator" folder.');
            return;
        }

        const rawData = fs.readFileSync(FILE_PATH, 'utf8');
        let data = JSON.parse(rawData);
        
        // Handle both Array and Object formats ({ movies: [] })
        const isArray = Array.isArray(data);
        const moviesList = isArray ? data : (data.movies || []);

        let updateCount = 0;
        let failCount = 0;

        console.log(`📡 Manifest loaded: ${moviesList.length} entries detected.`);

        for (let i = 0; i < moviesList.length; i++) {
            const movie = moviesList[i];
            const sourceUrl = movie.video_id; 

            if (!sourceUrl || !sourceUrl.startsWith('http')) {
                console.log(`⏭️ SKIPPING: ${movie.title?.substring(0, 20)} (Invalid ID/URL)`);
                continue;
            }

            // Human-like delay (1.5s to 3s)
            await delay(1500 + Math.random() * 1500);

            try {
                const response = await axios.get(sourceUrl, {
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
                        'Referer': 'https://www.google.com/',
                    },
                    timeout: 10000 
                });

                // Regex to find the master M3U8 link in the page source
                const m3u8Regex = /https:[^"']+\.m3u8[^"']*/;
                const match = response.data.match(m3u8Regex);
                
                if (match) {
                    const freshUrl = match[0].replace(/\\/g, ''); 
                    
                    if (movie.url !== freshUrl) {
                        movie.url = freshUrl;
                        movie.added_on = new Date().toISOString(); 
                        console.log(`✅ UPDATED: ${movie.title.substring(0, 30)}...`);
                        updateCount++;
                    } else {
                        console.log(`🟢 STABLE:  ${movie.title.substring(0, 30)}...`);
                    }
                } else {
                    console.log(`⚠️ NO LINK: ${movie.title.substring(0, 30)}...`);
                }
            } catch (err) {
                console.log(`❌ FAIL:    ${movie.title.substring(0, 30)}... (Status: ${err.response?.status || 'Timeout'})`);
                failCount++;
            }
        }

        // Re-wrap if it was originally an object
        const finalData = isArray ? moviesList : { ...data, movies: moviesList };
        fs.writeFileSync(FILE_PATH, JSON.stringify(finalData, null, 4));
        
        console.log('\n--- 📊 SUMMARY ---');
        console.log(`✨ Refreshed: ${updateCount}`);
        console.log(`💀 Failed:    ${failCount}`);
        console.log(`💾 Saved to:  ${FILE_PATH}`);
        console.log('--- ✅ DONE ---\n');

    } catch (error) {
        console.error('🛑 CRITICAL ERROR:', error.message);
    }
}

refreshLinks();