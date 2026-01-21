/* eslint-disable */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play } from 'lucide-react';

export default function MovieCard({ movie }) {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  // 1. Precise "New" badge logic (checks if added within 24h)
  const isNew = movie.added_on ? (Date.now() - new Date(movie.added_on).getTime()) / 36e5 < 24 : false;

  const handleInteraction = () => {
    // We navigate using the encoded URL or ID
    // Redirect is used to ensure the PlayerPage gets a clean mounting state
    const targetPath = `/play/${movie.id}`;
    navigate(`/redirect?url=${encodeURIComponent(targetPath)}`);
  };

  return (
    <div 
      onClick={handleInteraction} 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group bg-[#0a0a0a] rounded-[2rem] overflow-hidden border border-white/5 hover:border-red-600/40 transition-all duration-500 cursor-pointer transform hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.7)]"
    >
      {/* Thumbnail / Preview Section */}
      <div className="aspect-video relative overflow-hidden bg-zinc-900">
        {isHovered && movie.preview_video ? (
          <div className="absolute inset-0 z-20">
             <video 
               src={movie.preview_video} 
               autoPlay 
               loop 
               muted 
               playsInline 
               className="w-full h-full object-cover" 
             />
          </div>
        ) : (
          <img 
            src={movie.thumbnail || "https://via.placeholder.com/600x400?text=Vortex+Archive"} 
            className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-all duration-1000 group-hover:scale-110" 
            alt={movie.title} 
            loading="lazy"
          />
        )}
        
        {/* Overlay Badges */}
        <div className="absolute top-4 left-4 flex gap-2 z-30">
            {isNew && (
              <div className="bg-red-600 text-white text-[7px] font-black px-2 py-0.5 rounded-sm tracking-tighter animate-pulse">
                NEW ARCHIVE
              </div>
            )}
            <div className="bg-black/60 backdrop-blur-md text-white/70 text-[7px] font-black px-2 py-0.5 rounded-sm border border-white/10 uppercase tracking-widest">
              {movie.category}
            </div>
        </div>

        {/* Play Icon on Hover */}
        <div className={`absolute inset-0 flex items-center justify-center z-30 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
             <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center shadow-xl shadow-red-600/40">
                <Play size={20} fill="white" className="text-white ml-1" />
             </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="p-5">
        <h3 className="text-[11px] font-black text-zinc-400 group-hover:text-white line-clamp-2 h-8 leading-tight uppercase tracking-tight transition-colors">
            {movie.title}
        </h3>
        
        <div className="flex justify-between items-center mt-4 pt-3 border-t border-white/5">
            <div className="flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-green-500" />
                <p className="text-[7px] text-zinc-600 font-bold uppercase tracking-[0.2em]">{movie.site || 'Secure Node'}</p>
            </div>
            <p className="text-[7px] text-red-600 font-black uppercase tracking-tighter">
                {movie.is_stream === false ? 'Direct Resolve' : 'Encrypted Stream'}
            </p>
        </div>
      </div>
    </div>
  );
}