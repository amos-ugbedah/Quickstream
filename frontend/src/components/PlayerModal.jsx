/* eslint-disable */
import React, { useState, useEffect, useMemo } from 'react';
import { X, Download, Lock, PlayCircle, ShieldAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SmartPlayer from './SmartPlayer'; 
import rawMovieData from '../movies.json'; 

export default function PlayerModal({ movie, onClose }) {
  // 1. Handle different JSON structures (Array vs Object)
  const movieData = useMemo(() => {
    return Array.isArray(rawMovieData) ? rawMovieData : (rawMovieData.movies || []);
  }, []);

  // 2. VIP Status & State
  const savedUser = JSON.parse(localStorage.getItem('user'));
  const isVIP = savedUser?.isVIP || false;
  const [activeMovie, setActiveMovie] = useState(movie);
  const navigate = useNavigate();

  // 3. Prevent background scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, []);

  // 4. Update active movie if the prop changes
  useEffect(() => { 
    setActiveMovie(movie); 
  }, [movie]);

  // 5. Filter Related Movies by Category
  const relatedMovies = useMemo(() => {
    if (!activeMovie) return [];
    return movieData
      .filter(m => m.category === activeMovie.category && m.id !== activeMovie.id)
      .slice(0, 12); // Increased for better scrolling
  }, [activeMovie, movieData]);

  if (!activeMovie) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-4 lg:p-8 animate-in fade-in zoom-in-95 duration-300">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={onClose} />
      
      {/* Modal Container */}
      <div className="relative w-full h-full max-w-7xl bg-[#080808] md:rounded-[2rem] overflow-hidden shadow-[0_0_50px_rgba(0,0,0,1)] border border-white/10 flex flex-col lg:flex-row">
        
        {/* LEFT SIDE: Video Player Area */}
        <div className="flex-grow flex flex-col relative bg-black group">
            
            {/* Player Header - Auto-hides on hover (optional) */}
            <div className="absolute top-0 left-0 right-0 p-5 z-50 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent transition-opacity duration-300 group-hover:opacity-100">
                <div className="flex items-center gap-4">
                    <button onClick={onClose} className="lg:hidden w-10 h-10 flex items-center justify-center bg-white/10 rounded-full backdrop-blur-md">
                        <X size={20} className="text-white" />
                    </button>
                    <div className="overflow-hidden">
                      <h2 className="text-white text-[11px] font-black uppercase tracking-widest truncate max-w-[200px] md:max-w-md">
                        {activeMovie.title}
                      </h2>
                      <div className="flex items-center gap-2">
                         <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
                         <p className="text-red-600 text-[8px] font-black uppercase tracking-[0.2em]">Live Resolver Active</p>
                      </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button 
                      onClick={() => navigate('/upgrade')} 
                      className="bg-white/5 hover:bg-white/10 p-3 rounded-full border border-white/10 transition-all"
                      title={isVIP ? "Download Ready" : "Upgrade to Download"}
                    >
                        {isVIP ? <Download size={18} className="text-green-500" /> : <Lock size={18} className="text-yellow-500" />}
                    </button>
                    <button 
                      onClick={onClose} 
                      className="hidden lg:flex w-12 h-12 items-center justify-center bg-white/5 hover:bg-red-600 rounded-full border border-white/10 transition-all text-white"
                    >
                      <X size={24} />
                    </button>
                </div>
            </div>

            {/* THE PLAYER: Key forces a hard reset when the URL changes */}
            <div className="flex-grow w-full h-full bg-black">
                <SmartPlayer 
                  key={activeMovie.url} 
                  movie={activeMovie} 
                  onEnded={() => {
                    if (relatedMovies.length > 0) setActiveMovie(relatedMovies[0]);
                  }}
                />
            </div>
        </div>

        {/* RIGHT SIDE: Sidebar (Related Content) */}
        <div className="w-full lg:w-[350px] bg-[#0A0A0A] border-l border-white/5 flex flex-col h-[40vh] lg:h-auto">
            
            <div className="p-5 border-b border-white/5 bg-black/40 backdrop-blur-md flex items-center justify-between">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 flex items-center gap-2">
                    <PlayCircle size={14} className="text-red-600" /> Related Vault
                </h3>
                <span className="text-[8px] font-bold text-zinc-600 px-2 py-0.5 border border-zinc-800 rounded">
                    {activeMovie.category}
                </span>
            </div>

            <div className="flex-grow overflow-y-auto custom-scrollbar p-4 space-y-3">
                {relatedMovies.length > 0 ? (
                  relatedMovies.map((m, idx) => (
                    <div 
                        key={m.id || idx} 
                        onClick={() => setActiveMovie(m)} 
                        className={`flex gap-3 group cursor-pointer p-2 rounded-xl transition-all border ${
                            activeMovie.id === m.id ? 'bg-white/10 border-white/20' : 'hover:bg-white/[0.03] border-transparent hover:border-white/5'
                        }`}
                    >
                        <div className="relative w-24 h-14 flex-shrink-0 rounded-lg overflow-hidden shadow-lg bg-zinc-900">
                            <img 
                                src={m.thumbnail} 
                                alt="" 
                                className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" 
                                loading="lazy"
                            />
                            {activeMovie.id === m.id && (
                                <div className="absolute inset-0 flex items-center justify-center bg-red-600/20">
                                    <div className="w-1 h-3 bg-red-600 animate-bounce mx-0.5" />
                                    <div className="w-1 h-4 bg-red-600 animate-bounce [animation-delay:-0.2s] mx-0.5" />
                                    <div className="w-1 h-3 bg-red-600 animate-bounce [animation-delay:-0.4s] mx-0.5" />
                                </div>
                            )}
                        </div>
                        <div className="flex flex-col justify-center min-w-0">
                            <h4 className={`text-[10px] font-bold uppercase truncate transition-colors ${
                                activeMovie.id === m.id ? 'text-white' : 'text-zinc-500 group-hover:text-zinc-200'
                            }`}>
                                {m.title}
                            </h4>
                            <span className="text-[7px] font-black text-zinc-700 uppercase mt-1 tracking-widest">
                                {m.site || 'Premium Source'}
                            </span>
                        </div>
                    </div>
                  ))
                ) : (
                    <div className="flex flex-col items-center justify-center h-40 text-center opacity-20">
                        <ShieldAlert size={32} className="mb-2" />
                        <p className="text-[10px] uppercase font-black">No similar archives</p>
                    </div>
                )}
            </div>
            
            {/* Sidebar Footer */}
            <div className="p-4 bg-black/20 border-t border-white/5">
                 <button 
                    onClick={() => navigate('/')} 
                    className="w-full py-3 bg-white/5 hover:bg-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest text-zinc-400 transition-all border border-white/5"
                 >
                    Return to Terminal
                 </button>
            </div>
        </div>
      </div>
    </div>
  );
}