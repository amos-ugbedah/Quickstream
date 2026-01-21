/* eslint-disable */
import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SmartPlayer from '../components/SmartPlayer'; 
import { ArrowLeft, Share2, Info, AlertCircle } from 'lucide-react';
import rawMovieData from '../movies.json'; 

const PlayerPage = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [serverOnline, setServerOnline] = useState(true);

  const movieData = useMemo(() => {
    return Array.isArray(rawMovieData) ? rawMovieData : (rawMovieData.movies || []);
  }, []);

  // Use URL or ID to find the movie in the local vault
  const movie = useMemo(() => 
    movieData?.find((m) => String(m.id) === String(id) || String(m.video_id) === String(id)), 
    [id, movieData]
  );

  const related = useMemo(() => 
    movieData.filter((m) => m.category === movie?.category && String(m.id) !== String(id))
    .slice(0, 8), 
    [movie, id, movieData]
  );

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!movie) {
      const t = setTimeout(() => navigate('/'), 3000);
      return () => clearTimeout(t);
    }
  }, [id, movie, navigate]);

  if (!movie) return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center">
      <AlertCircle className="text-red-600 mb-4 animate-bounce" size={48} />
      <div className="text-[10px] font-black uppercase tracking-[0.4em] text-red-600">
        Entry Deleted or Restricted
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-red-600">
      <nav className="p-5 border-b border-white/5 flex items-center justify-between bg-black/60 backdrop-blur-2xl sticky top-0 z-50">
        <button onClick={() => navigate('/')} className="p-3 bg-white/5 hover:bg-red-600 rounded-2xl transition-all group">
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        </button>
        <div className="flex flex-col items-center max-w-[60%]">
            <span className="text-[7px] font-black text-zinc-500 uppercase tracking-widest">Now Decrypting</span>
            <h2 className="text-[10px] font-black uppercase tracking-widest truncate w-full text-center">{movie.title}</h2>
        </div>
        <button className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-all">
          <Share2 size={20} />
        </button>
      </nav>

      <div className="max-w-7xl mx-auto p-4 lg:p-10">
        {/* THE PLAYER FRAME */}
        <div className="rounded-[2.5rem] overflow-hidden border border-white/5 bg-black aspect-video mb-10 shadow-[0_30px_60px_rgba(0,0,0,0.8)] relative group">
          <SmartPlayer 
            movie={movie} 
            isVIP={user?.isVIP}
            onEnded={() => navigate(`/play/${related[0]?.id}`)} 
          />
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-20 border-b border-white/5 pb-12">
            <div className="flex-grow">
               <span className="bg-red-600/10 text-red-600 text-[8px] font-black uppercase tracking-[0.3em] px-3 py-1 rounded-md mb-4 block w-fit">
                  {movie.category} // ARCHIVE NODE {movie.id}
               </span>
               <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter leading-none mb-6">
                  {movie.title}
               </h1>
               <div className="flex gap-6 opacity-40">
                  <div className="flex items-center gap-2">
                     <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                     <span className="text-[9px] font-black uppercase tracking-widest">Live Stream Active</span>
                  </div>
                  <div className="flex items-center gap-2">
                     <span className="text-[9px] font-black uppercase tracking-widest">Source: {movie.site || 'Secure Node'}</span>
                  </div>
               </div>
            </div>
            
            <div className="w-full md:w-72 p-6 bg-white/[0.02] border border-white/5 rounded-3xl">
                <div className="flex items-center gap-2 mb-4">
                   <Info size={14} className="text-red-600" />
                   <span className="text-[9px] font-black uppercase tracking-widest">Security Protocol</span>
                </div>
                <p className="text-[9px] leading-relaxed text-zinc-500 font-bold uppercase">
                   This stream is end-to-end encrypted. Any attempt to sniff the source URL will result in an immediate terminal ban.
                </p>
            </div>
        </div>

        {/* RELATED SECTION */}
        <h3 className="text-xs font-black uppercase tracking-[0.4em] text-zinc-600 mb-8">Related Archives</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
           {related.map(m => (
             <div key={m.id} onClick={() => navigate(`/play/${m.id}`)} className="cursor-pointer group">
                <div className="aspect-video rounded-2xl overflow-hidden border border-white/5 mb-3 bg-zinc-900 relative">
                   <img src={m.thumbnail} className="w-full h-full object-cover opacity-40 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" />
                   <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60" />
                </div>
                <p className="text-[9px] font-black uppercase leading-tight text-zinc-500 group-hover:text-red-600 transition-colors line-clamp-2">
                   {m.title}
                </p>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

export default PlayerPage;