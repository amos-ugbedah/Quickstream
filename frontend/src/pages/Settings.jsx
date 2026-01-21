/* eslint-disable */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, EyeOff, Zap, Lock, ArrowLeft } from 'lucide-react';

export default function Settings({ user }) {
  const navigate = useNavigate();
  const [stealth, setStealth] = useState(true);
  const [force4k, setForce4k] = useState(true);

  if (!user?.isVIP) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center">
          <Lock size={64} className="text-zinc-800 mb-6" />
          <h2 className="text-4xl font-black uppercase text-white mb-4 italic leading-tight">Access <span className="text-red-600">Denied</span></h2>
          <p className="text-zinc-500 text-[10px] font-bold mb-8 uppercase tracking-[0.3em]">VIP Security Clearance Required</p>
          <button onClick={() => navigate('/upgrade')} className="px-10 py-4 bg-red-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:scale-105 transition-transform">Get VIP Pass</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 md:p-12 selection:bg-red-600">
      <div className="max-w-3xl mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-zinc-500 hover:text-white mb-10 text-[10px] font-black uppercase tracking-widest transition-all">
          <ArrowLeft size={16} /> Exit Vault
        </button>

        <div className="bg-[#0a0a0a] border border-white/5 rounded-[3.5rem] p-8 md:p-16 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent opacity-20" />
          
          <div className="flex items-center gap-4 mb-12">
             <ShieldCheck size={32} className="text-red-600" />
             <h2 className="text-3xl font-black italic uppercase tracking-tighter">VIP <span className="text-red-600">Security Vault</span></h2>
          </div>
          
          <div className="space-y-10">
            <div className="flex justify-between items-center group">
              <div>
                <div className="flex items-center gap-2 mb-1">
                   <EyeOff size={14} className="text-red-600" />
                   <p className="font-black text-sm uppercase tracking-widest">Ultra Stealth Mode</p>
                </div>
                <p className="text-[9px] text-zinc-500 uppercase font-bold">Scrubbing global trackers from your session...</p>
              </div>
              <button onClick={() => setStealth(!stealth)} className={`w-14 h-7 rounded-full transition-all relative ${stealth ? 'bg-red-600' : 'bg-zinc-800'}`}>
                <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all ${stealth ? 'right-1' : 'left-1'}`} />
              </button>
            </div>

            <div className="flex justify-between items-center group">
              <div>
                <div className="flex items-center gap-2 mb-1">
                   <Zap size={14} className="text-yellow-500" />
                   <p className="font-black text-sm uppercase tracking-widest">4K Stream Forcing</p>
                </div>
                <p className="text-[9px] text-zinc-500 uppercase font-bold">Always bypass auto-quality to force 2160p...</p>
              </div>
              <button onClick={() => setForce4k(!force4k)} className={`w-14 h-7 rounded-full transition-all relative ${force4k ? 'bg-red-600' : 'bg-zinc-800'}`}>
                <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all ${force4k ? 'right-1' : 'left-1'}`} />
              </button>
            </div>

            <div className="p-8 bg-red-600/5 border border-red-600/10 rounded-3xl relative">
              <div className="absolute top-4 right-4 animate-pulse">
                 <div className="w-2 h-2 rounded-full bg-red-600" />
              </div>
              <p className="text-red-600 text-[9px] font-black uppercase mb-3 italic tracking-widest">Terminal Information</p>
              <p className="text-[10px] text-zinc-400 uppercase font-black leading-loose tracking-tighter">
                IDENTIFIED: #QS-{user.id?.toString().slice(-6) || 'UNKNOWN'}<br/>
                LOCATION: OPTIMIZED NIGERIAN NODE<br/>
                ENCRYPTION: AES-256 ACTIVE
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}