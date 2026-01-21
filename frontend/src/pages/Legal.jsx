import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Scale, Fingerprint, ChevronLeft } from 'lucide-react';

export default function Legal() {
  const navigate = useNavigate();

  const sections = [
    {
      icon: <ShieldAlert className="text-red-600" size={24} />,
      title: "Age Requirement",
      content: "QuickStream is a premium VOD platform. By accessing this site, you affirm that you are at least 18 years of age (or the age of majority in your jurisdiction). If you are under 18, leave immediately."
    },
    {
      icon: <Fingerprint className="text-red-600" size={24} />,
      title: "Data Protection",
      content: "We use end-to-end encryption for user sessions. Your email is used solely for account recovery and VIP synchronization. We do not sell user data to third-party advertisers."
    },
    {
      icon: <Scale className="text-red-600" size={24} />,
      title: "Subscription Policy",
      content: "VIP access is granted for the duration of the selected plan. Refunds are only processed if the service is unreachable for more than 48 consecutive hours. Sharing VIP accounts may result in a permanent ban."
    }
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 md:p-20 selection:bg-red-600">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-10 font-black uppercase text-[10px] tracking-widest"
        >
          <ChevronLeft size={16} /> Back to Vault
        </button>

        <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter mb-4">
          Legal <span className="text-red-600">Protocols</span>
        </h1>
        <p className="text-gray-500 uppercase font-bold text-[10px] tracking-[0.4em] mb-16">
          Version 2.0.26 // QuickStream Compliance
        </p>

        <div className="grid gap-12">
          {sections.map((section, idx) => (
            <div key={idx} className="bg-white/[0.02] border border-white/5 p-8 rounded-[2.5rem] hover:bg-white/[0.04] transition-all">
              <div className="flex items-center gap-4 mb-4">
                {section.icon}
                <h2 className="text-xl font-black uppercase tracking-tight">{section.title}</h2>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed font-medium uppercase tracking-wide">
                {section.content}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-20 p-10 border-t border-white/5 text-center">
          <p className="text-[10px] text-gray-700 font-black uppercase tracking-[0.5em]">
            QuickStream © 2026 // All Rights Reserved
          </p>
        </div>
      </div>
    </div>
  );
}