/* eslint-disable */
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Crown, CheckCircle2, ShieldCheck, Zap, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function Success() {
  const navigate = useNavigate();
  // Get data from localStorage where Upgrade.jsx just saved it
  const user = JSON.parse(localStorage.getItem('user')) || {};

  useEffect(() => {
    const duration = 4 * 1000;
    const animationEnd = Date.now() + duration;
    const colors = ['#dc2626', '#ffffff', '#eab308'];

    const frame = () => {
      confetti({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0 }, colors });
      confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1 }, colors });
      if (Date.now() < animationEnd) requestAnimationFrame(frame);
    };
    frame();
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-6 overflow-hidden relative">
      <div className="absolute w-[600px] h-[600px] bg-red-600/10 blur-[150px] rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      
      <div className="max-w-md w-full bg-[#0a0a0a] border border-white/5 rounded-[4rem] p-12 text-center relative z-10 shadow-[0_50px_100px_rgba(0,0,0,0.9)]">
        <div className="relative inline-block mb-10">
            <div className="absolute inset-0 bg-yellow-500 blur-3xl opacity-30 animate-pulse" />
            <div className="w-28 h-28 bg-gradient-to-tr from-yellow-600 to-yellow-400 rounded-[2.5rem] flex items-center justify-center relative shadow-2xl border border-yellow-400/50 transform -rotate-6">
                <Crown size={56} className="text-white drop-shadow-xl" />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-2xl p-1.5 border-4 border-[#0a0a0a]">
                <CheckCircle2 size={24} className="text-white" />
            </div>
        </div>

        <h1 className="text-4xl font-black uppercase italic tracking-tighter mb-4">
            Uplink <span className="text-red-600">Secure</span>
        </h1>
        
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 mb-10">VIP Membership Activated</p>

        <div className="space-y-4 mb-12 text-left">
            <div className="flex items-center gap-4 p-5 bg-white/[0.02] rounded-3xl border border-white/5 group hover:bg-white/5 transition-colors">
                <div className="w-10 h-10 rounded-2xl bg-red-600/10 flex items-center justify-center">
                    <ShieldCheck className="text-red-600" size={20} />
                </div>
                <div>
                    <p className="text-[10px] font-black uppercase tracking-widest">Ghost Protocol</p>
                    <p className="text-[8px] text-zinc-600 font-bold uppercase mt-0.5">Your data is now untraceable</p>
                </div>
            </div>
            <div className="flex items-center gap-4 p-5 bg-white/[0.02] rounded-3xl border border-white/5 group hover:bg-white/5 transition-colors">
                <div className="w-10 h-10 rounded-2xl bg-yellow-600/10 flex items-center justify-center">
                    <Zap className="text-yellow-500" size={20} />
                </div>
                <div>
                    <p className="text-[10px] font-black uppercase tracking-widest">Ad-Blocker: ON</p>
                    <p className="text-[8px] text-zinc-600 font-bold uppercase mt-0.5">All redirects neutralized</p>
                </div>
            </div>
        </div>

        <button 
            onClick={() => navigate('/')}
            className="w-full bg-white text-black py-5 rounded-[2rem] font-black uppercase text-[10px] tracking-[0.2em] flex items-center justify-center gap-3 transition-all hover:bg-red-600 hover:text-white group"
        >
            Enter The Vault
            <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
        </button>

        <p className="mt-10 text-[7px] text-zinc-700 font-black uppercase tracking-[0.5em] leading-loose">
            SECURE REF: QS-{Math.random().toString(36).substr(2, 8).toUpperCase()}
        </p>
      </div>
    </div>
  );
}