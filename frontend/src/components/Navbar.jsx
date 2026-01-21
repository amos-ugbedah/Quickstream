import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth, db } from '../firebase'; 
import { onAuthStateChanged } from 'firebase/auth';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ShieldCheck, Crown, MailPlus, Zap, LogOut } from 'lucide-react';

export default function Navbar({ setActiveCategory, setSearchQuery, onLogout, isVIP }) {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [newsEmail, setNewsEmail] = useState("");
  const [subbed, setSubbed] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // Admin check for your specific email
      if (user && user.email === "ugbedahamos@gmail.com") {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // NEWSLETTER HANDLER (No signup required)
  const handleNewsletter = async (e) => {
    e.preventDefault();
    if (!newsEmail) return;
    try {
      await addDoc(collection(db, "newsletter_subscribers"), {
        email: newsEmail,
        timestamp: serverTimestamp()
      });
      setSubbed(true);
      setNewsEmail("");
      setTimeout(() => setSubbed(false), 3000);
    } catch (err) {
      console.error("Newsletter error:", err);
    }
  };

  const handleLogoClick = () => {
    if (setActiveCategory) setActiveCategory('All');
    if (setSearchQuery) setSearchQuery('');
    navigate('/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="max-w-7xl mx-auto p-4 lg:px-10 lg:pt-10 lg:pb-4 sticky top-0 z-[60]">
      <div className="flex flex-col gap-6 bg-[#0a0a0a]/90 backdrop-blur-2xl p-6 rounded-[2.5rem] border border-white/5 shadow-2xl xl:flex-row xl:items-center xl:justify-between">
        
        {/* LOGO SECTION */}
        <div className="flex items-center justify-between xl:justify-start gap-6">
          <div className="flex flex-col items-start">
            <button onClick={handleLogoClick} className="group cursor-pointer transition-transform active:scale-95">
              <img src="/logo.png" alt="Logo" className="h-10 md:h-12 object-contain" />
            </button>
            <div className="flex items-center gap-2 mt-1">
              <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${isVIP ? 'bg-yellow-500 shadow-[0_0_10px_#eab308]' : 'bg-green-500 shadow-[0_0_10px_#22c55e]'}`}></span>
              <p className="text-[8px] text-gray-500 tracking-[0.3em] uppercase font-black">
                {isVIP ? 'VIP Access Enabled' : 'VIP Server Online'}
              </p>
            </div>
          </div>

          {/* MOBILE ACTIONS (Shown only on small screens) */}
          <div className="flex xl:hidden gap-2">
            {isAdmin && (
              <Link to="/vortex-terminal-x99" className="p-3 bg-red-600 rounded-2xl text-white">
                <ShieldCheck size={18} />
              </Link>
            )}
          </div>
        </div>

        {/* SEARCH & NEWSLETTER GROUP */}
        <div className="flex flex-col md:flex-row gap-4 w-full xl:max-w-2xl">
          {/* SEARCH */}
          <div className="flex-1 relative group">
            <input 
              type="text" 
              placeholder="Search scenes..." 
              className="w-full bg-black/50 border border-white/5 rounded-2xl py-3.5 px-6 text-xs focus:outline-none focus:border-red-600/50 transition-all text-gray-300 shadow-inner"
              onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
            />
          </div>

          {/* NEWSLETTER INPUT */}
          <form onSubmit={handleNewsletter} className="flex-1 relative flex gap-2">
            <input 
              type="email" 
              value={newsEmail}
              onChange={(e) => setNewsEmail(e.target.value)}
              placeholder={subbed ? "Subscribed!" : "Drop email for New Scenes..."} 
              className={`w-full bg-white/5 border ${subbed ? 'border-green-500/50' : 'border-white/5'} rounded-2xl py-3.5 px-6 text-xs focus:outline-none transition-all text-gray-300`}
            />
            <button type="submit" className="absolute right-2 top-1.5 bottom-1.5 px-4 bg-white/10 hover:bg-white/20 rounded-xl transition-colors">
              <MailPlus size={14} className={subbed ? "text-green-500" : "text-gray-400"} />
            </button>
          </form>
        </div>

        {/* NAVIGATION ACTIONS */}
        <div className="flex items-center justify-center gap-3">
          {isAdmin && (
            <Link 
              to="/vortex-terminal-x99" 
              className="hidden xl:flex items-center gap-2 bg-zinc-900 text-white px-4 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 transition-all border border-white/5"
            >
              <ShieldCheck size={14} />
              Admin
            </Link>
          )}

          {/* VIP BUTTON: DYNAMIC BASED ON STATUS */}
          {isVIP ? (
            <div className="flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-[0_0_20px_rgba(234,179,8,0.1)]">
              <Crown size={14} />
              VIP Member
            </div>
          ) : (
            <Link to="/upgrade" className="flex items-center gap-2 bg-red-600 text-white px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-[0_10px_20px_rgba(220,38,38,0.3)]">
              <Zap size={14} />
              Get 24h Pass
            </Link>
          )}

          <div className="h-10 w-[1px] bg-white/5 mx-2 hidden md:block"></div>

          <button onClick={onLogout} className="group p-3 hover:bg-white/5 rounded-2xl transition-all">
            <LogOut size={18} className="text-gray-600 group-hover:text-red-500" />
          </button>
        </div>
      </div>
    </header>
  );
}