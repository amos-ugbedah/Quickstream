/* eslint-disable */
import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';

const SmartPlayer = ({ movie, onEnded }) => {
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  // YOUR CLOUDFLARE WORKER URL
  const CF_PROXY = "https://vortex-proxy.ugbedahamos.workers.dev/?url=";

  useEffect(() => {
    if (!movie?.url) return;

    const resolveAndPlay = async () => {
      setLoading(true);
      setError(false);

      try {
        // 1. Call Vercel Resolver to get a fresh link from the page URL
        // Note: Using /api/extract to match the handler below
        const apiResponse = await fetch(`/api/extract?video_id=${encodeURIComponent(movie.url)}`);
        const data = await apiResponse.json();

        if (!data.url) throw new Error("Could not resolve URL");

        // 2. Wrap in Deep Proxy
        const finalUrl = `${CF_PROXY}${encodeURIComponent(data.url)}`;

        if (Hls.isSupported()) {
          if (hlsRef.current) hlsRef.current.destroy();

          const hls = new Hls({
            enableWorker: true,
            maxBufferLength: 30,
            xhrSetup: (xhr, u) => {
              if (u.startsWith('http') && !u.includes('vortex-proxy')) {
                xhr.open('GET', `${CF_PROXY}${encodeURIComponent(u)}`, true);
              }
            }
          });

          hls.loadSource(finalUrl);
          hls.attachMedia(videoRef.current);
          
          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            setLoading(false);
            videoRef.current.play().catch(() => {});
          });

          hls.on(Hls.Events.ERROR, (event, data) => {
            if (data.fatal) {
              console.error("HLS Fatal Error:", data.type);
              if (retryCount < 2) {
                setRetryCount(prev => prev + 1);
              } else {
                setError(true);
                setLoading(false);
              }
            }
          });

          hlsRef.current = hls;
        } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
          // Native HLS for Safari/iOS
          videoRef.current.src = finalUrl;
          videoRef.current.oncanplay = () => setLoading(false);
        }
      } catch (err) {
        console.error("Pipeline Failed:", err);
        setError(true);
        setLoading(false);
      }
    };

    resolveAndPlay();

    return () => {
      if (hlsRef.current) hlsRef.current.destroy();
    };
  }, [movie?.url, retryCount]); // Re-runs on manual retry or URL change

  return (
    <div className="relative w-full h-full bg-black overflow-hidden group">
      <video 
        ref={videoRef} 
        className="w-full h-full object-contain transition-transform duration-700 scale-[1.03]" 
        controls 
        autoPlay 
        onEnded={onEnded} 
      />

      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black z-50">
          <div className="flex flex-col items-center gap-3 text-white">
            <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-[10px] uppercase font-black tracking-widest animate-pulse">Establishing Secure Node...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-zinc-900 z-50 text-white p-6 text-center">
          <div>
            <p className="text-red-600 font-black mb-2 tracking-tighter text-xl">DECRYPTION FAILED</p>
            <p className="text-[10px] text-zinc-500 uppercase">The archive link has been restricted by the host.</p>
            <button 
                onClick={() => setRetryCount(0)} 
                className="mt-4 px-6 py-2 bg-red-600 text-[10px] font-black hover:bg-red-700 uppercase transition-colors rounded-sm"
            >
                Retry Connection
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartPlayer;