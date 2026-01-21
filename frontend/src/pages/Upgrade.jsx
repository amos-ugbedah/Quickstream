/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Zap, Clock, Crown, MessageCircle, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function Upgrade({ onLogout, user }) {
  const navigate = useNavigate();
  const [isGatewayReady, setIsGatewayReady] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const whatsappNumber = "2347032287331"; // Clean number for wa.me link

  useEffect(() => {
    const checkFLW = setInterval(() => {
      if (window.FlutterwaveCheckout) {
        setIsGatewayReady(true);
        clearInterval(checkFLW);
      }
    }, 1000);
    return () => clearInterval(checkFLW);
  }, []);

  const handleInstantPay = (plan) => {
    if (!user?.email) {
      navigate('/auth');
      return;
    }

    setLoading(true);
    const amount = plan === '24H' ? 50 : 1000;
    const publicKey = import.meta.env.VITE_FLW_PUBLIC_KEY;

    window.FlutterwaveCheckout({
      public_key: publicKey,
      tx_ref: `QS-VIP-${Date.now()}`,
      amount: amount,
      currency: "NGN",
      customer: { email: user.email, name: user.username || "Vortex User" },
      callback: (response) => {
        if (response.status === "successful") {
          // Standardize Expiry: 24 Hours or 6 Months
          const duration = plan === '24H' ? (24 * 60 * 60 * 1000) : (6 * 30 * 24 * 60 * 60 * 1000);
          const expiryTime = Date.now() + duration;
          
          const updatedUser = { 
            ...user, 
            isVIP: true, 
            vipExpiresAt: expiryTime 
          };
          
          localStorage.setItem('user', JSON.stringify(updatedUser));
          window.location.href = '/success';
        }
        setLoading(false);
      },
      onclose: () => setLoading(false),
    });
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-red-600">
      <Navbar onLogout={onLogout} user={user} isVIP={user?.isVIP} />
      
      <main className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-20">
          <ShieldCheck className="mx-auto text-red-600 mb-6" size={56} />
          <h2 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter mb-6">
            Elite <span className="text-red-600">Clearance</span>
          </h2>
          <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-[0.5em]">Select your node access duration</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          {/* 24 HOUR */}
          <div className="bg-[#0a0a0a] border border-white/5 p-10 rounded-[3.5rem] flex flex-col items-center group hover:bg-white/[0.02] transition-all">
            <Clock className="text-zinc-700 mb-6 group-hover:text-red-600 transition-colors" size={40} />
            <h3 className="text-xl font-black uppercase mb-2">24H Express</h3>
            <p className="text-4xl font-black mb-8 italic text-zinc-400">₦50</p>
            <ul className="text-[9px] font-black text-zinc-600 uppercase space-y-4 mb-12 text-center tracking-widest">
              <li>• Zero Redirects</li>
              <li>• Mobile Optimization</li>
              <li>• Standard Priority</li>
            </ul>
            <button onClick={() => handleInstantPay('24H')} disabled={loading || !isGatewayReady}
              className="w-full py-5 bg-zinc-900 text-white rounded-[2rem] font-black text-[10px] uppercase tracking-widest hover:bg-white hover:text-black transition-all">
              Initialize
            </button>
          </div>

          {/* 6 MONTH VIP */}
          <div className="bg-[#0a0a0a] border-2 border-red-600 p-12 rounded-[4rem] flex flex-col items-center relative scale-110 shadow-2xl shadow-red-600/20 z-10">
            <div className="absolute -top-4 bg-red-600 px-6 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] shadow-lg">Recommended</div>
            <Crown className="text-red-600 mb-6 animate-bounce" size={48} />
            <h3 className="text-2xl font-black uppercase mb-2 italic">6-Month VIP</h3>
            <p className="text-5xl font-black mb-8 italic">₦1,000</p>
            <ul className="text-[9px] font-black text-white uppercase space-y-4 mb-12 text-center tracking-[0.2em]">
              <li className="text-red-600 underline underline-offset-8">UNLIMITED 4K ARCHIVES</li>
              <li>• GLOBAL VIP SERVER NODES</li>
              <li>• EARLY SCENE ACCESS</li>
            </ul>
            <button onClick={() => handleInstantPay('6M')} disabled={loading || !isGatewayReady}
              className="w-full py-6 bg-red-600 text-white rounded-[2rem] font-black text-[10px] uppercase tracking-[0.2em] hover:scale-105 transition-all shadow-xl shadow-red-600/40">
              {loading ? "CONNECTING..." : "ACTIVATE VIP"}
            </button>
          </div>

          {/* MANUAL TRANSFER */}
          <div className="bg-[#0a0a0a] border border-white/5 p-10 rounded-[3.5rem] flex flex-col items-center group opacity-80 hover:opacity-100 transition-all">
            <MessageCircle className="text-green-500 mb-6" size={40} />
            <h3 className="text-xl font-black uppercase mb-2">Direct Link</h3>
            <p className="text-[9px] text-zinc-600 font-bold uppercase mb-8 text-center tracking-widest">Transfer to Opay Node</p>
            <div className="bg-black/50 p-6 rounded-3xl w-full mb-10 text-center border border-white/5">
              <p className="text-[8px] text-zinc-700 uppercase font-black mb-2 tracking-widest">OPAY TERMINAL</p>
              <p className="text-xl font-mono font-black text-green-500 tracking-tighter">7032287331</p>
            </div>
            <button onClick={() => window.open(`https://wa.me/${whatsappNumber}`, '_blank')}
              className="w-full py-5 bg-green-600 text-white rounded-[2rem] font-black text-[10px] uppercase tracking-widest hover:bg-green-700 transition-all">
              Verify Proof
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}