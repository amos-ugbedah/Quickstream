/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { Play, Flame, Calendar, ChevronRight } from 'lucide-react';

export default function FeaturedSlider({ movies, onSelect }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Get the first 5 movies for the slider
  const featured = movies?.slice(0, 5) || [];

  useEffect(() => {
    if (featured.length === 0) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featured.length);
    }, 6000); // Rotate every 6 seconds
    return () => clearInterval(timer);
  }, [featured.length]);

  if (featured.length === 0) return null;

  const current = featured[currentIndex];

  return (
    <div className="relative w-full h-[500px] md:h-[700px] overflow-hidden bg-black">
      
      {/* BACKGROUND IMAGE WITH ZOOM EFFECT */}
      <div 
        key={current.id}
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out scale-105 animate-pulse-slow"
        style={{ 
            backgroundImage: `url(${current.thumbnail})`,
            backgroundPosition: 'center 20%' 
        }}
      >
        {/* CINEMATIC OVERLAYS */}
        {/* Deep bottom gradient for the content area */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent" />
        {/* Left side shadow for text contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/20 to-transparent" />
        {/* Subtle digital grain */}
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      </div>

      {/* FLOATING INTERFACE CONTENT */}
      <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-20 z-20">
        <div className="max-w-5xl animate-in fade-in slide-in-from-left-10 duration-1000">
          
          {/* BADGES */}
          <div className="flex items-center gap-3 mb-6">
            <span className="flex items-center gap-1 bg-red-600 text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-[0_0_20px_rgba(220,38,38,0.5)]">
              <Flame size={12} fill="currentColor" /> Trending Now
            </span>
            <span className="flex items-center gap-1 bg-white/10 backdrop-blur-xl border border-white/10 text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest">
              <Calendar size={12} /> Live Archive
            </span>
          </div>
          
          {/* TITLE */}
          <h1 className="text-4xl md:text-7xl lg:text-8xl font-black text-white uppercase italic tracking-tighter leading-[0.85] mb-8 drop-shadow-2xl">
            {current.title}
          </h1>

          {/* ACTION BUTTONS */}
          <div className="flex items-center gap-6">
            <button 
              onClick={() => onSelect(current)}
              className="group flex items-center gap-3 bg-white text-black font-black uppercase px-10 py-5 rounded-2xl hover:bg-red-600 hover:text-white transition-all duration-300 transform active:scale-95 shadow-2xl"
            >
              <Play size={24} fill="currentColor" className="group-hover:scale-110 transition-transform" /> 
              <span>Watch Scene</span>
              <ChevronRight size={20} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
            </button>

            <div className="hidden md:block border-l border-white/20 pl-6">
              <p className="text-white/40 text-[10px] uppercase font-black tracking-[0.3em] mb-1">Production</p>
              <p className="text-white text-xl font-black uppercase italic tracking-tight">{current.category} VIP</p>
            </div>
          </div>
        </div>
      </div>

      {/* NAVIGATION DOTS (RIGHT SIDE) */}
      <div className="absolute bottom-10 right-10 flex flex-col gap-3 z-30">
        {featured.map((_, i) => (
          <button 
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`h-1.5 transition-all duration-500 rounded-full ${
                i === currentIndex ? 'w-12 bg-red-600' : 'w-4 bg-white/20 hover:bg-white/40'
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
      
      {/* BOTTOM EDGE OVERLAY FOR SEAMLESS BLENDING */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#050505] to-transparent z-10" />
    </div>
  );
}