import axios from 'axios';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const { video_id } = req.query; // This is the full URL from movies.json

  if (!video_id) return res.status(400).json({ error: 'Missing URL' });

  try {
    const response = await axios.get(video_id, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/121.0.0.0 Safari/537.36',
      },
      timeout: 7000
    });

    const html = response.data;
    
    // Pattern to find high-quality streams in the page source
    const streamPattern = /(https?:\/\/[^"']+\.(m3u8|mp4)[^"']*)/;
    const match = html.match(streamPattern);

    if (match) {
      // Return the direct link to the frontend
      return res.status(200).json({ url: match[0].replace(/\\/g, '') });
    }

    return res.status(404).json({ error: 'No stream detected' });
  } catch (error) {
    return res.status(500).json({ error: 'Source blocked extraction' });
  }
}