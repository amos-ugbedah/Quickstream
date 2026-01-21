/* eslint-disable */
import React, { useState, useMemo, useEffect } from 'react';
import { db } from '../firebase'; 
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore'; 

// FIXED IMPORT PATH: Accesses the public/movies.json or src/movies.json
import rawData from '../movies.json';

import Navbar from '../components/Navbar';
import MovieCard from '../components/MovieCard';
import PlayerModal from '../components/PlayerModal';
import FeaturedSlider from '../components/FeaturedSlider';
import { Crown, AlertTriangle, Sparkles, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Home({ user, onLogout }) {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [announcement, setAnnouncement] = useState(null);

  // 1. Normalize and Deduplicate Movie Data
  const movieData = useMemo(() => {
    const raw = Array.isArray(rawData) ? rawData : (rawData.movies || []);
    
    // Remove duplicates based on URL (the only truly unique identifier)
    const uniqueMap = new Map();
    raw.forEach(m => {
      if (!uniqueMap.has(m.url)) uniqueMap.set(m.url, m);
    });
    return Array.from(uniqueMap.values());
  }, []);

  const isVIP = user?.isVIP || false;
  const categories = ['All', 'African', 'Gay VIP', 'Lesbian', 'Bisexual', 'Trending', 'Hardcore'];

  // 2. Real-time Broadcast Listener
  useEffect(() => {
    const q = query(collection(db, "broadcasts"), orderBy("timestamp", "desc"), limit(1));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const data = snapshot.docs[0].data();
        // Check if user is in the intended audience
        if (data.target === "all" || (data.target === "trial" && !isVIP) || (data.target === "vip" && isVIP)) {
          setAnnouncement(data.message);
        }
      }
    });
    return () => unsubscribe();
  }, [isVIP]);

  // 3. Helper for Grouping by Date
  const getDateLabel = (dateString) => {
    if (!dateString) return "Legacy Archives";
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) return "Today's Harvest";
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday's Archives";
    
    const diffTime = Math.abs(today - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 7) return `${diffDays} Days Ago`;
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
  };

  // 4. Filter and Sort Logic
  const filteredMovies = useMemo(() => {
    let filtered = movieData.filter(movie => {
      const matchesCategory = activeCategory === 'All' || movie.category === activeCategory;
      const matchesSearch = movie.title.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
    
    // Sort by newest first
    return filtered.sort((a, b) => new Date(b.added_on) - new Date(a.added_on));
  }, [movieData, searchQuery, activeCategory]);

  // 5. Group Movies for UI Sections
  const groupedMovies = useMemo(() => {
    const groups = {};
    filteredMovies.forEach(movie => {
      const label = getDateLabel(movie.added_on);
      if (!groups[label]) groups[label] = [];
      groups[label].push(movie);
    });
    return groups;
  }, [filteredMovies]);

  const featuredMovies = useMemo(() => {
    return [...movieData].sort((a, b) => new Date(b.added_on) - new Date(a.added_on)).slice(0, 5);
  }, [movieData]);

  // Scroll to top on category change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeCategory]);

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-red-600 pb-20">
      
      {/* FLOATING SUPPORT BUTTON */}
      <button 
        onClick={() => navigate('/support')}
        className="fixed bottom-8 right-8 z-[100] bg-red-600 text-white w-14 h-14 rounded-full shadow-[0_10px_40px_rgba(220,38,38,0.5)] hover:scale-110 active:scale-95 transition-all flex items-center justify-center border border-white/10"
      >
        <MessageCircle size={24} />
      </button>

      {/* GLOBAL ANNOUNCEMENT BAR */}
      {announcement && (
        <div className="bg-red-600 text-white py-3 px-6 sticky top-0 z-[100] animate-in slide-in-from-top duration-500">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
               <Sparkles size={14} className="animate-pulse" />
               <p className="text-[10px] md:text-xs font-black uppercase tracking-widest">{announcement}</p>
            </div>
            <button onClick={() => setAnnouncement(null)} className="text-[10px] font-black underline opacity-70">DISMISS</button>
          </div>
        </div>
      )}

      <Navbar 
        setActiveCategory={setActiveCategory} 
        setSearchQuery={setSearchQuery} 
        onLogout={onLogout} 
        isVIP={isVIP} 
        user={user} 
      />

      {/* FEATURED SLIDER (Only on Home/All) */}
      {activeCategory === 'All' && !searchQuery && (
        <FeaturedSlider movies={featuredMovies} onSelect={(m) => setSelectedMovie(m)} />
      )}

      {/* CATEGORY BAR */}
      <div className="sticky top-0 md:top-24 z-40 bg-[#050505]/90 backdrop-blur-2xl border-b border-white/5">
        <div className="max-w-7xl mx-auto overflow-x-auto no-scrollbar py-6 px-6 md:px-10">
          <div className="flex items-center gap-4 min-w-max">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2 rounded-full text-[9px] font-black uppercase tracking-[0.2em] transition-all border ${
                  activeCategory === cat ? "bg-red-600 border-red-600 text-white shadow-lg shadow-red-600/20" : "bg-white/5 border-white/10 text-zinc-500 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 md:px-10 py-12">
        {/* VIP PROMO CARD */}
        {!isVIP && user && (
          <div 
            className="mb-16 p-8 rounded-[3rem] bg-gradient-to-br from-red-600/20 via-[#0a0a0a] to-transparent border border-red-600/10 flex flex-col md:flex-row items-center justify-between gap-6 cursor-pointer group hover:border-red-600/30 transition-all" 
            onClick={() => navigate('/upgrade')}
          >
            <div className="flex items-center gap-8">
                <div className="w-20 h-20 bg-red-600 rounded-[2rem] flex items-center justify-center shadow-2xl group-hover:rotate-12 transition-transform">
                  <Crown size={40} className="text-white" />
                </div>
                <div>
                    <h4 className="text-2xl font-black uppercase italic tracking-tighter">Upgrade to Vortex VIP</h4>
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.3em] mt-2">Zero Ads • 4K Streams • Direct Downloads</p>
                </div>
            </div>
            <button className="w-full md:w-auto bg-white text-black px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all">
              Initialize Upgrade
            </button>
          </div>
        )}

        {/* MOVIE GRID GROUPS */}
        {Object.keys(groupedMovies).length > 0 ? (
          Object.entries(groupedMovies).map(([dateLabel, movies]) => (
            <div key={dateLabel} className="mb-24">
              <div className="flex items-center gap-6 mb-12">
                <h3 className="text-white text-[12px] font-black uppercase tracking-[0.4em] italic">{dateLabel}</h3>
                <div className="w-full h-[1px] bg-gradient-to-r from-red-600/40 via-red-600/5 to-transparent"></div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
                {movies.map((movie, i) => (
                  <MovieCard 
                    key={movie.url || i} 
                    movie={movie} 
                  />
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="py-40 text-center flex flex-col items-center justify-center opacity-20">
              <AlertTriangle size={64} className="mb-6" />
              <h3 className="text-white font-black uppercase text-xl tracking-widest">Archive Link Severed</h3>
              <p className="text-[10px] uppercase mt-2">No matching data found in the current vault</p>
          </div>
        )}
      </main>

      {/* PLAYER MODAL (Managed by Route or State) */}
      {selectedMovie && (
        <PlayerModal 
          movie={selectedMovie} 
          onClose={() => setSelectedMovie(null)} 
        />
      )}
    </div>
  );
}