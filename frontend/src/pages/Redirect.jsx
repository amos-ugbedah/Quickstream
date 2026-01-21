/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Loader2, ShieldCheck, Zap, Lock } from 'lucide-react';

const Redirect = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('Initializing Proxy...');
  
  const targetUrl = searchParams.get('url');

  useEffect(() => {
    if (!targetUrl) {
      navigate('/');
      return;
    }

    const triggerRedirect = async () => {
      // Stage 1: Initial Hook
      await new Promise(r => setTimeout(r, 1000));
      setStatus('Bypassing Archive Firewall...');

      // Stage 2: THE AD TRIGGER
      // This happens while the user thinks the "firewall" is being bypassed
      const adsterraLink = "YOUR_ADSTERRA_DIRECT_LINK_HERE";
      window.open(adsterraLink, '_blank', 'noopener,noreferrer');

      // Stage 3: Post-Ad Scrubbing
      await new Promise(r => setTimeout(r, 1200));
      setStatus('Scrubbing Tracking Data...');

      // Stage 4: Authentication
      await new Promise(r => setTimeout(r, 800));
      setStatus('Handshake Confirmed. Enjoy.');
      
      await new Promise(r => setTimeout(r, 500));
      navigate(decodeURIComponent(targetUrl));
    };

    triggerRedirect();
  }, [targetUrl, navigate]);

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center text-white overflow-hidden">
      
      {/* SCANNER GRID BACKGROUND */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(circle, #ff0000 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <div className="relative mb-16">
        <div className="absolute inset-0 bg-red-600/30 blur-[100px] animate-pulse rounded-full" />
        <div className="relative z-10 w-32 h-32 border-2 border-white/10 rounded-[2.5rem] bg-black/80 flex items-center justify-center shadow-2xl">
           <Loader2 className="text-red-600 animate-spin" size={48} strokeWidth={4} />
           <Lock size={14} className="absolute bottom-4 right-4 text-zinc-600" />
        </div>
      </div>

      <div className="text-center space-y-8 relative z-10">
        <div>
           <h2 className="text-[14px] font-black uppercase tracking-[0.5em] text-red-600 mb-2">
             {status}
           </h2>
           <div className="w-64 h-1 bg-white/5 mx-auto rounded-full overflow-hidden">
              <div className="h-full bg-red-600 transition-all duration-1000 ease-out" 
                   style={{ width: status.includes('Enjoy') ? '100%' : '60%' }} />
           </div>
        </div>
        
        <div className="flex items-center justify-center gap-10 opacity-20">
          <div className="flex flex-col items-center gap-2">
            <ShieldCheck size={20} />
            <span className="text-[7px] font-black uppercase tracking-widest">Encrypted</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Zap size={20} />
            <span className="text-[7px] font-black uppercase tracking-widest">Direct Node</span>
          </div>
        </div>
      </div>

      {/* TERMINAL LOGS */}
      <div className="absolute bottom-12 left-12 opacity-10 font-mono text-[9px] leading-relaxed hidden md:block">
        <p className="text-green-500">{`> INCOMING REQUEST: ${targetUrl}`}</p>
        <p>{`> ENCRYPTING TUNNEL... OK`}</p>
        <p>{`> AD-GATING ENABLED... OK`}</p>
        <p>{`> STREAM READY`}</p>
      </div>
    </div>
  );
};

export default Redirect;