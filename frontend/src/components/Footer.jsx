/* eslint-disable */
import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Mail, MessageCircle, Globe, ChevronRight, Zap } from 'lucide-react';

export default function Footer({ isVIP }) {
  return (
    <footer className="w-full bg-[#050505] border-t border-white/5 pt-12 pb-10 px-6 mt-20">
      <div className="max-w-7xl mx-auto">
        
        {/* --- ADVERTISEMENT BANNER SECTION --- */}
        {!isVIP && (
          <div className="mb-16 w-full flex flex-col items-center">
            <span className="text-[8px] font-black text-gray-700 uppercase tracking-[0.5em] mb-4">Sponsored Archive Link</span>
            <div className="w-full max-w-4xl h-32 md:h-40 bg-white/5 border border-dashed border-white/10 rounded-3xl flex items-center justify-center relative overflow-hidden group">
              {/* This is where you paste your JuicyAds/Adsterra code */}
              <div className="text-center group-hover:scale-110 transition-transform duration-500">
                <Zap size={24} className="text-gray-800 mx-auto mb-2" />
                <p className="text-[10px] font-black text-gray-700 uppercase tracking-widest">Ad Placement #001</p>
                <p className="text-[8px] text-gray-800 font-bold uppercase mt-1">Upgrade to VIP to disable all terminal ads</p>
              </div>
              
              {/* Optional: Overlay gradient for a premium feel */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-600/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Info */}
          <div className="md:col-span-2">
            <h2 className="text-2xl font-black tracking-tighter mb-4 italic flex items-center gap-2">
              QUICK<span className="text-red-600">STREAM</span>
              <span className="text-[10px] not-italic bg-white/5 px-2 py-1 rounded text-gray-500 tracking-widest uppercase">Vortex-V2</span>
            </h2>
            <p className="text-gray-500 text-[11px] font-bold uppercase leading-relaxed max-w-sm tracking-widest">
              Global decentralized archive for high-speed content delivery. 
              Secure. Encrypted. Unrestricted.
            </p>
          </div>

          {/* Protocols (Links) */}
          <div>
            <h3 className="text-[10px] font-black uppercase text-gray-700 tracking-[0.3em] mb-6">Protocols</h3>
            <ul className="space-y-4 text-[11px] font-black uppercase tracking-widest text-gray-400">
              <li>
                <Link to="/legal" className="hover:text-red-600 transition-colors flex items-center gap-2 group">
                  <ChevronRight size={10} className="text-red-600" />
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/legal" className="hover:text-red-600 transition-colors flex items-center gap-2 group">
                  <ChevronRight size={10} className="text-red-600" />
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/support" className="hover:text-red-600 transition-colors flex items-center gap-2 group">
                  <ChevronRight size={10} className="text-red-600" />
                  Support Terminal
                </Link>
              </li>
            </ul>
          </div>

          {/* Social / Contact */}
          <div>
            <h3 className="text-[10px] font-black uppercase text-gray-700 tracking-[0.3em] mb-6">Contact</h3>
            <div className="flex gap-4">
              <a href="#" className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center hover:bg-red-600 transition-all border border-white/5 hover:border-red-500 group">
                <Mail size={20} className="group-hover:scale-110 transition-transform" />
              </a>
              <a href="#" className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center hover:bg-green-600 transition-all border border-white/5 hover:border-green-500 group">
                <MessageCircle size={20} className="group-hover:scale-110 transition-transform" />
              </a>
              <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/5 opacity-20">
                <Globe size={20} />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Metadata */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col items-center md:items-start">
             <p className="text-[9px] text-gray-700 font-black uppercase tracking-[0.5em]">
               © 2026 QUICKSTREAM GLOBAL // DECENTRALIZED DATA TERMINAL
             </p>
             <p className="text-[7px] text-gray-800 font-bold uppercase mt-1 tracking-[0.2em]">User Identification: {isVIP ? 'Verified VIP' : 'Anonymous Guest'}</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 ${isVIP ? 'opacity-100' : 'opacity-20'}`}>
              <ShieldCheck size={12} className={isVIP ? 'text-green-500' : 'text-gray-500'} />
              <span className="text-[8px] font-black uppercase tracking-widest">{isVIP ? 'VIP Shield Active' : 'Unsecured Link'}</span>
            </div>
            <div className="h-1 w-24 bg-white/5 rounded-full overflow-hidden">
               <div className="h-full bg-red-600 w-1/3 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}