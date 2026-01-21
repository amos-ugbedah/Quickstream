/* eslint-disable */
import React from 'react';
import { Send, Terminal, Loader2 } from 'lucide-react';

export default function Maintenance() {
  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center text-white font-sans p-6 text-center overflow-hidden relative">
      {/* Background Decorative Element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-red-600/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Branding */}
      <div className="relative mb-8">
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic leading-none">
          Quick<span className="text-red-600">Stream</span>
          <span className="text-zinc-800 text-2xl not-italic ml-2 font-black">.ICU</span>
        </h1>
        <div className="absolute -bottom-4 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-red-600 to-transparent animate-pulse" />
      </div>

      {/* Status Terminal */}
      <div className="bg-[#0a0a0a] border border-white/5 p-6 rounded-3xl mb-10 w-full max-w-md text-left font-mono shadow-2xl">
        <div className="flex gap-2 mb-4">
          <div className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
          <div className="w-2 h-2 rounded-full bg-zinc-800" />
          <div className="w-2 h-2 rounded-full bg-zinc-800" />
        </div>
        <p className="text-[10px] text-red-600 font-bold uppercase mb-1 tracking-widest">{`> SYSTEM_STATUS: INDEXING_VOD_CORE`}</p>
        <p className="text-[10px] text-zinc-500 uppercase">{`> PROGRESS: 84% COMPLETE`}</p>
        <p className="text-[10px] text-zinc-500 uppercase">{`> ESTIMATED_UPLINK: 48 HOURS`}</p>
      </div>

      <h2 className="text-2xl md:text-3xl font-black uppercase italic mb-4 tracking-tighter">Under Heavy Reconstruction</h2>
      <p className="max-w-md text-zinc-500 text-[11px] md:text-xs font-bold uppercase tracking-widest leading-relaxed mb-10">
        Our engineers are migrating our <span className="text-white">Global VOD API</span> to high-speed Nigerian nodes. 
        Launching 5,000+ ultra-high bitrate scenes soon.
      </p>

      {/* The Telegram Hook */}
      <a 
        href="https://t.me/your_channel_link" 
        target="_blank"
        rel="noopener noreferrer"
        className="group relative bg-[#24A1DE] hover:bg-[#1e87bb] text-white px-10 py-5 rounded-[2rem] font-black uppercase text-[10px] tracking-[0.2em] flex items-center gap-4 transition-all hover:scale-105 active:scale-95 shadow-[0_20px_40px_rgba(36,161,222,0.3)]"
      >
        <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
        Join Secure Telegram
      </a>

      <div className="mt-20 flex flex-col items-center gap-4 opacity-20">
        <Loader2 className="animate-spin text-zinc-500" size={24} />
        <p className="text-[8px] text-zinc-600 uppercase font-black tracking-[0.5em]">
          Powered by React High-Speed VOD Clusters
        </p>
      </div>
    </div>
  );
}