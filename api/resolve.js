import axios from 'axios';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  
  const { video_id } = req.query; // This is the full URL from movies.json

  if (!video_id) {
    return res.status(400).json({ error: 'Missing target URL' });
  }

  try {
    const response = await axios.get(video_id, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/121.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Referer': new URL(video_id).origin
      },
      timeout: 8000
    });

    const html = response.data;
    
    /**
     * ADVANCED EXTRACTION PATTERN
     * Captures: .m3u8, .mp4, .webm, and .m3u8 with query strings (tokens)
     * Avoids: script source files (.js)
     */
    const streamPatterns = [
        /(https?:\/\/[^"']+\.m3u8[^"']*)/i,
        /(https?:\/\/[^"']+\.mp4[^"']*)/i,
        /["'](https?:\/\/[^"']+\.webm[^"']*)["']/i
    ];

    let streamUrl = null;

    for (let pattern of streamPatterns) {
        const match = html.match(pattern);
        if (match) {
            // Clean up backslashes often found in JSON/JS strings in HTML
            streamUrl = match[1] ? match[1].replace(/\\/g, '') : match[0].replace(/\\/g, '').replace(/["']/g, '');
            break; 
        }
    }

    if (streamUrl) {
      return res.status(200).json({ 
        url: streamUrl,
        timestamp: new Date().toISOString()
      });
    }

    return res.status(404).json({ error: 'No stream detected in source' });

  } catch (error) {
    console.error('Extraction Error:', error.message);
    return res.status(500).json({ 
        error: 'Source blocked extraction', 
        details: error.message 
    });
  }
}