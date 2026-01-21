/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { ShieldCheck, Activity, Database } from 'lucide-react';

// 1. Move helper components OUTSIDE the main component
const StatusItem = ({ icon: Icon, label, state }) => (
  <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/5">
    <Icon size={12} className={state === 'online' ? 'text-green-500' : 'text-red-500'} />
    <span className="text-[8px] font-black uppercase tracking-widest text-gray-400">{label}:</span>
    <span className={`text-[8px] font-black uppercase ${state === 'online' ? 'text-green-500' : 'text-red-500'}`}>
      {state}
    </span>
  </div>
);

const StatusDashboard = () => {
  const [status, setStatus] = useState({
    api: 'checking',
    proxy: 'checking',
    vault: 'checking'
  });

  const CF_PROXY = "https://vortex-proxy.ugbedahamos.workers.dev/?url=https://google.com";

  useEffect(() => {
    const checkSystems = async () => {
      // Check Vercel API
      try {
        const apiRes = await fetch('/api/resolve'); 
        setStatus(prev => ({ ...prev, api: apiRes.status !== 404 ? 'online' : 'offline' }));
      } catch {
        setStatus(prev => ({ ...prev, api: 'offline' }));
      }

      // Check Cloudflare Proxy
      try {
        const proxyRes = await fetch(CF_PROXY);
        setStatus(prev => ({ ...prev, proxy: proxyRes.ok ? 'online' : 'offline' }));
      } catch {
        setStatus(prev => ({ ...prev, proxy: 'offline' }));
      }

      // Check Movie Data
      try {
        // Use a relative path that works in both dev and prod
        const vaultRes = await fetch('/movies.json'); 
        setStatus(prev => ({ ...prev, vault: vaultRes.ok ? 'online' : 'offline' }));
      } catch {
        setStatus(prev => ({ ...prev, vault: 'offline' }));
      }
    };

    checkSystems();
    // Re-check every 5 minutes
    const interval = setInterval(checkSystems, 300000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-6 left-6 z-[200] flex flex-wrap gap-2 pointer-events-none opacity-40 hover:opacity-100 transition-opacity duration-500">
      <StatusItem icon={Activity} label="Resolver" state={status.api} />
      <StatusItem icon={ShieldCheck} label="Proxy" state={status.proxy} />
      <StatusItem icon={Database} label="Vault" state={status.vault} />
    </div>
  );
};

export default StatusDashboard;