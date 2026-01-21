/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { auth, db } from './firebase'; 
import { doc, onSnapshot } from 'firebase/firestore';

// Pages
import Home from './pages/Home';
import Auth from './pages/Auth';
import Profile from './pages/Profile';
import Subscription from './pages/Upgrade'; 
import Success from './pages/Success';         
import Settings from './pages/Settings';
import Admin from './pages/Admin';
import Legal from './pages/Legal';
import Support from './pages/Support';
import Maintenance from './pages/Maintenance'; 
import Redirect from './pages/Redirect'; 
import PlayerPage from './pages/PlayerPage'; 

// Components
import Footer from './components/Footer';
import StatusDashboard from './components/StatusDashboard'; // NEW: System monitoring

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

export default function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [isMaintenance, setIsMaintenance] = useState(false);

  // Listen for Global Maintenance Mode
  useEffect(() => {
    const unsubStatus = onSnapshot(doc(db, "settings", "status"), (doc) => {
      if (doc.exists()) setIsMaintenance(doc.data().maintenanceMode || false);
    });
    return () => unsubStatus();
  }, []);

  // Sync User Data & Check Ban Status
  useEffect(() => {
    if (!user?.id) return;
    const unsubUser = onSnapshot(doc(db, "users", user.id.toString()), (doc) => {
      if (doc.exists()) {
        const userData = doc.data();
        if (userData.isBanned) {
          handleLogout();
          alert("ACCESS DENIED: Your terminal has been restricted for protocol violations.");
          return;
        }
        const updatedUser = { ...user, ...userData };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
    });
    return () => unsubUser();
  }, [user?.id]);

  const handleLogin = () => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) setUser(JSON.parse(savedUser));
  };
  
  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('recent_clips');
    setUser(null);
  };

  // If maintenance is active, nothing else renders
  if (isMaintenance) return <Maintenance />;

  const isVIP = user?.isVIP || false;

  return (
    <Router>
      <ScrollToTop />
      
      {/* THE STATUS DASHBOARD 
         Always visible at the bottom-left to monitor Resolver/Proxy/Vault health.
      */}
      <StatusDashboard />

      <div className="flex flex-col min-h-screen bg-[#050505] selection:bg-red-600 selection:text-white">
        <div className="flex-grow">
          <Routes>
            {/* Core Experience */}
            <Route path="/" element={<Home user={user} onLogout={handleLogout} />} />
            <Route path="/redirect" element={<Redirect />} />
            <Route path="/play/:id" element={<PlayerPage user={user} />} />
            
            {/* Information */}
            <Route path="/legal" element={<Legal />} />
            <Route path="/support" element={<Support />} />
            
            {/* Auth Gateways */}
            <Route path="/auth" element={!user ? <Auth onLogin={handleLogin} /> : <Navigate to="/" />} />
            <Route path="/profile" element={user ? <Profile user={user} onLogout={handleLogout} /> : <Navigate to="/auth" />} />
            
            {/* VIP Tiers */}
            <Route path="/upgrade" element={user ? <Subscription user={user} /> : <Navigate to="/auth" />} />
            <Route path="/success" element={user ? <Success /> : <Navigate to="/auth" />} />
            <Route path="/settings" element={user ? <Settings user={user} /> : <Navigate to="/auth" />} />
            
            {/* Admin Terminal */}
            <Route path="/vortex-terminal-x99" element={user?.email === "ugbedahamos@gmail.com" ? <Admin /> : <Navigate to="/" />} />
            
            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
        
        {/* Footer with VIP context */}
        <Footer isVIP={isVIP} />
      </div>
    </Router>
  );
}