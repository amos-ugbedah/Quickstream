/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Crown, ShieldCheck, Calendar, LogOut, Zap } from 'lucide-react';

export default function Profile({ onLogout, user: propUser }) {
  const navigate = useNavigate();
  // Always favor the user object passed from App.jsx as it is synced with Firebase
  const user = propUser || JSON.parse(localStorage.getItem('user')) || {};
  const [daysLeft, setDaysLeft] = useState(0);
  const [expiryDate, setExpiryDate] = useState("");

  useEffect(() => {
    if (user.signupDate || user.vipExpiresAt) {
      const now = new Date().getTime();
      let expiryTime;

      if (user.isVIP && user.vipExpiresAt) {
        expiryTime = user.vipExpiresAt;
      } else {
        // 30-day Trial logic
        const start = new Date(user.signupDate).getTime();
        expiryTime = start + (30 * 24 * 60 * 60 * 1000);
      }
      
      const diffInMs = expiryTime - now;
      const remaining = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
      setDaysLeft(remaining > 0 ? remaining : 0);

      const expiry = new Date(expiryTime);
      setExpiryDate(expiry.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }));
    }
  }, [user]);

  const displayTitle = user.username || user.email?.split('@')[0] || 'User';

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-red-600">
      <Navbar onLogout={onLogout} user={user} isVIP={user.isVIP} />
      
      <main className="max-w-4xl mx-auto px-6 py-20">
        {/* IDENTITY CARD */}
        <div className="bg-[#0a0a0a] border border-white/5 rounded-[3.5rem] p-12 mb-8 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-10 transition-opacity">
             <Crown size={180} />
          </div>

          <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
            <div className="relative">
               {user.avatar ? (
                 <img src={user.avatar} className="w-28 h-28 rounded-[2.5rem] object-cover border-2 border-red-600 p-1.5" alt="Avatar" />
               ) : (
                 <div className="w-28 h-28 rounded-[2.5rem] bg-gradient-to-br from-red-600 to-red-900 flex items-center justify-center font-black text-4xl">
                   {displayTitle[0]}
                 </div>
               )}
               {user.isVIP && (
                 <div className="absolute -top-3 -right-3 bg-red-600 p-2 rounded-xl shadow-xl">
                    <Crown size={16} fill="white" />
                 </div>
               )}
            </div>
            
            <div className="text-center md:text-left">
               <h2 className="text-5xl font-black italic uppercase tracking-tighter mb-4">
                 {displayTitle}
               </h2>
               <div className="flex flex-wrap justify-center md:justify-start items-center gap-4">
                 <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest ${user.isVIP ? 'bg-red-600 text-white shadow-lg shadow-red-600/30' : 'bg-zinc-800 text-zinc-500'}`}>
                   {user.isVIP ? 'VIP ACCESS' : 'TRIAL PROTOCOL'}
                 </span>
                 <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-[0.2em]">NODE: {user.id?.toString().slice(-8) || '00000'}</p>
               </div>
            </div>
          </div>

          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-white/5 pt-10">
             <div>
                <p className="text-zinc-600 text-[8px] font-black uppercase tracking-widest mb-1">Status</p>
                <p className="text-[10px] font-black uppercase text-red-600">{user.isBanned ? 'RESTRICTED' : 'AUTHORIZED'}</p>
             </div>
             <div>
                <p className="text-zinc-600 text-[8px] font-black uppercase tracking-widest mb-1">Time Remaining</p>
                <p className="text-[10px] font-black uppercase">{daysLeft} Days</p>
             </div>
             <div className="col-span-2 text-right">
                <p className="text-zinc-600 text-[8px] font-black uppercase tracking-widest mb-1">Access Expiry</p>
                <p className="text-[10px] font-black uppercase text-zinc-400">{expiryDate || 'PERPETUAL'}</p>
             </div>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="p-10 bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] flex flex-col justify-between h-64">
              <ShieldCheck className="text-red-600 mb-4" size={32} />
              <div>
                 <h4 className="text-xl font-black uppercase italic mb-2">Security Vault</h4>
                 <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest leading-loose">
                    Your session is protected by AES-256 encryption. Multi-device login is currently restricted to VIP nodes.
                 </p>
              </div>
           </div>

           {!user.isVIP ? (
              <div 
                onClick={() => navigate('/upgrade')}
                className="p-10 bg-red-600 rounded-[2.5rem] flex flex-col justify-between h-64 cursor-pointer hover:scale-[1.02] transition-all shadow-2xl shadow-red-600/20"
              >
                 <Zap className="text-white animate-pulse" size={32} />
                 <div>
                    <h4 className="text-xl font-black uppercase italic mb-2 text-white">Upgrade Now</h4>
                    <p className="text-[9px] text-red-100 font-bold uppercase tracking-widest leading-loose">
                       Unlock unlimited archives, 4K rendering, and remove all redirect protocols.
                    </p>
                 </div>
              </div>
           ) : (
             <div 
                onClick={onLogout}
                className="p-10 bg-white/5 border border-white/10 rounded-[2.5rem] flex flex-col justify-between h-64 cursor-pointer hover:bg-red-600 transition-all group"
              >
                 <LogOut className="text-zinc-500 group-hover:text-white" size={32} />
                 <div>
                    <h4 className="text-xl font-black uppercase italic mb-2">Terminate Session</h4>
                    <p className="text-[9px] text-zinc-600 group-hover:text-white font-bold uppercase tracking-widest leading-loose">
                       Safely disconnect your terminal from the Vortex network.
                    </p>
                 </div>
              </div>
           )}
        </div>
      </main>
    </div>
  );
}