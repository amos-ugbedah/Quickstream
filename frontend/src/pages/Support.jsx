/* eslint-disable */
import React from 'react';
import { Mail, MessageCircle, ArrowLeft, ShieldQuestion, CreditCard, Play, Headphones } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Support({ user }) {
  const navigate = useNavigate();

  const faqs = [
    { q: "Activation Delay?", a: "Manual transfers take 5-10 minutes. Send your Opay receipt to our agent for speed.", icon: <CreditCard size={18}/> },
    { q: "Playback Error?", a: "VIP nodes require Chrome or Safari. Clear cache if video doesn't load instantly.", icon: <Play size={18}/> },
    { q: "Account Locked?", a: "Multi-device logins are monitored. Use one terminal per session to avoid bans.", icon: <ShieldQuestion size={18}/> }
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 md:p-16 selection:bg-red-600">
      <div className="max-w-4xl mx-auto">
        <button onClick={() => navigate(-1)} className="p-4 bg-white/5 rounded-2xl hover:bg-red-600 transition-all mb-12 group">
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        </button>

        <div className="flex items-center gap-4 mb-4">
           <Headphones className="text-red-600" size={32} />
           <h1 className="text-5xl font-black italic uppercase tracking-tighter">Support <span className="text-red-600">Center</span></h1>
        </div>
        <p className="text-zinc-600 font-bold text-[10px] uppercase tracking-[0.5em] mb-16">System Diagnostics & User Assistance</p>

        <div className="grid md:grid-cols-2 gap-8 mb-24">
          <a href={`mailto:support@yourdomain.com?subject=Support Request: ${user?.email}`} className="p-10 bg-[#0a0a0a] border border-white/5 rounded-[3rem] hover:border-red-600/30 transition-all group">
            <div className="w-16 h-16 bg-red-600/10 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
               <Mail className="text-red-600" size={32} />
            </div>
            <h3 className="text-xl font-black uppercase mb-2">Technical Node</h3>
            <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest leading-relaxed">Response within 12 hours for all technical inquiries.</p>
          </a>

          <a href="https://wa.me/2347032287331" target="_blank" rel="noreferrer" className="p-10 bg-[#0a0a0a] border border-white/5 rounded-[3rem] hover:border-green-600/30 transition-all group">
            <div className="w-16 h-16 bg-green-600/10 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
               <MessageCircle className="text-green-500" size={32} />
            </div>
            <h3 className="text-xl font-black uppercase mb-2">WhatsApp Agent</h3>
            <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest leading-relaxed">Instant verification and manual VIP activation.</p>
          </a>
        </div>

        <div className="space-y-4">
          <h2 className="text-[10px] font-black uppercase text-zinc-800 tracking-[0.4em] mb-8 px-6">Common Protocols (FAQ)</h2>
          <div className="grid gap-4">
            {faqs.map((faq, i) => (
              <div key={i} className="p-8 bg-white/[0.02] border border-white/5 rounded-[2.5rem] hover:bg-white/[0.04] transition-all">
                <div className="flex items-center gap-4 text-red-600 mb-4">
                  {faq.icon}
                  <h4 className="text-xs font-black uppercase tracking-widest">{faq.q}</h4>
                </div>
                <p className="text-zinc-500 text-[10px] leading-loose uppercase font-bold tracking-widest pl-9">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}