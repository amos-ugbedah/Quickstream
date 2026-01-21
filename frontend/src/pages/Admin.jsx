/*eslint-disable  */
import React, { useState, useEffect, useMemo } from 'react';
import { db, auth } from '../firebase';
import { collection, getDocs, doc, updateDoc, deleteDoc, addDoc, serverTimestamp, onSnapshot } from 'firebase/firestore';
import { Send, Megaphone, Trash2, ShieldAlert, Mail, Activity, Search, RefreshCw, Power } from 'lucide-react';
import emailjs from '@emailjs/browser'; 

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [pinInput, setPinInput] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  // BULK MESSAGE STATE
  const [broadcastMsg, setBroadcastMsg] = useState("");
  const [targetGroup, setTargetGroup] = useState("all"); 
  const [sending, setSending] = useState(false);
  const [emailProgress, setEmailProgress] = useState({ current: 0, total: 0 }); 

  const SECRET_ADMIN_PIN = "1234"; 

  // --- FETCH DATA ---
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "users"));
      const userList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(userList);
    } catch (err) { console.error("Fetch Error:", err); }
    setLoading(false);
  };

  // Listen for Maintenance Status
  useEffect(() => {
    const unsub = onSnapshot(doc(db, "settings", "status"), (doc) => {
      if (doc.exists()) setMaintenanceMode(doc.data().maintenanceMode);
    });
    return () => unsub();
  }, []);

  useEffect(() => { if (isUnlocked) fetchUsers(); }, [isUnlocked]);

  // --- REVENUE CALCULATION ---
  const totalRevenue = useMemo(() => {
    return users.filter(u => u.isVIP).length * 1000;
  }, [users]);

  // --- TOGGLE MAINTENANCE ---
  const toggleMaintenance = async () => {
    try {
      await updateDoc(doc(db, "settings", "status"), { maintenanceMode: !maintenanceMode });
    } catch (err) { alert("Failed to toggle system: " + err.message); }
  };

  // --- MANUAL UPGRADE ---
  const handleManualUpgrade = async (userId, planType) => {
    try {
        const userRef = doc(db, "users", userId);
        let duration = planType === '24H' ? (24 * 60 * 60 * 1000) : (180 * 24 * 60 * 60 * 1000);
        const expiryDate = Date.now() + duration;

        await updateDoc(userRef, { 
          isVIP: true, 
          vipExpiresAt: expiryDate,
          plan: planType,
          lastUpdated: new Date().toISOString() 
        });
        
        alert(`ACCESS GRANTED: User upgraded to VIP.`);
        fetchUsers();
    } catch (err) { alert(err.message); }
  };

  const toggleBan = async (userId, currentBanStatus) => {
    try {
        const userRef = doc(db, "users", userId);
        await updateDoc(userRef, { isBanned: !currentBanStatus });
        fetchUsers();
    } catch (err) { alert(err.message); }
  };

  const deleteUser = async (userId) => {
    if (window.confirm("CRITICAL: Permanently delete this user record?")) {
      try {
        await deleteDoc(doc(db, "users", userId));
        fetchUsers();
      } catch (err) { alert("Delete failed: " + err.message); }
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter(user => 
      user.email?.toLowerCase().includes(search.toLowerCase()) ||
      user.username?.toLowerCase().includes(search.toLowerCase())
    );
  }, [users, search]);

  const handlePinCheck = (e) => {
    const val = e.target.value;
    setPinInput(val);
    if (val === SECRET_ADMIN_PIN) setIsUnlocked(true);
  };

  // --- BROADCAST LOGIC ---
  const handleBroadcast = async () => {
    if (!broadcastMsg.trim()) return alert("Message cannot be empty");
    const recipients = users.filter(u => {
      if (targetGroup === "vip") return u.isVIP;
      if (targetGroup === "trial") return !u.isVIP;
      return true;
    });
    
    if (recipients.length === 0) return alert("No targets found.");
    if (!window.confirm(`Initiate broadcast to ${recipients.length} terminals?`)) return;

    setSending(true);
    setEmailProgress({ current: 0, total: recipients.length });
    
    try {
      await addDoc(collection(db, "broadcasts"), {
        message: broadcastMsg,
        target: targetGroup,
        timestamp: serverTimestamp(),
      });

      for (let i = 0; i < recipients.length; i++) {
        const user = recipients[i];
        try {
          await emailjs.send("quickstream_gmail", "template_lgzw2fl", {
            to_name: user.username || "Subscriber",
            to_email: user.email, 
            message: broadcastMsg,   
          }, "7W0nRnXorDxMLZLZ6");
          setEmailProgress(prev => ({ ...prev, current: i + 1 }));
          await new Promise(r => setTimeout(r, 1000)); 
        } catch (mailErr) { console.error(mailErr); }
      }
      alert("BROADCAST COMPLETE");
      setBroadcastMsg("");
    } catch (err) { alert(err.message); }
    setSending(false);
  };

  // --- SECURITY GATE ---
  if (auth.currentUser?.email !== "ugbedahamos@gmail.com") {
    return (
      <div className="h-screen bg-black flex flex-col items-center justify-center">
        <ShieldAlert className="text-red-600 mb-4 animate-pulse" size={64} />
        <h1 className="text-red-600 font-black text-2xl uppercase tracking-[0.5em]">Unauthorized Access</h1>
      </div>
    );
  }

  if (!isUnlocked) {
    return (
      <div className="h-screen bg-[#050505] flex flex-col items-center justify-center p-6">
        <div className="w-16 h-1 w-full max-w-xs bg-red-600 mb-8" />
        <h2 className="text-white font-black uppercase tracking-[0.3em] text-[10px] mb-6">Master Encryption Key</h2>
        <input 
          type="password" maxLength={4} value={pinInput} onChange={handlePinCheck} placeholder="●●●●"
          className="bg-white/5 border border-white/10 rounded-2xl py-6 text-center text-4xl font-black text-red-600 outline-none w-64 focus:border-red-600 transition-all"
          autoFocus
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-16">
            <div>
              <h1 className="text-4xl font-black uppercase italic tracking-tighter">Vortex<span className="text-red-600">Terminal</span></h1>
              <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-[0.4em] mt-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> System Core Stable
              </p>
            </div>
            
            <div className="flex gap-4">
               <button onClick={toggleMaintenance} className={`flex items-center gap-2 px-6 py-3 rounded-2xl border transition-all text-[10px] font-black uppercase tracking-widest ${maintenanceMode ? 'bg-red-600 border-red-600' : 'bg-white/5 border-white/10'}`}>
                  <Power size={14}/> {maintenanceMode ? 'System Offline' : 'System Online'}
               </button>
               <button onClick={fetchUsers} className="p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all">
                  <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
               </button>
            </div>
        </header>

        {/* STATS TILES */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-[#0a0a0a] border border-white/5 p-8 rounded-[2rem]">
            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-2">Total Archives</p>
            <p className="text-5xl font-black">{users.length}</p>
          </div>
          <div className="bg-red-600/5 border border-red-600/20 p-8 rounded-[2rem]">
            <p className="text-red-600/50 text-[10px] font-black uppercase tracking-widest mb-2">VIP Nodes</p>
            <p className="text-5xl font-black text-red-600">{users.filter(u => u.isVIP).length}</p>
          </div>
          <div className="bg-green-600/5 border border-green-600/20 p-8 rounded-[2rem]">
            <p className="text-green-600/50 text-[10px] font-black uppercase tracking-widest mb-2">Terminal Revenue</p>
            <p className="text-5xl font-black text-green-500">₦{totalRevenue.toLocaleString()}</p>
          </div>
        </div>

        {/* BROADCAST CENTER */}
        <div className="bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] p-8 mb-12">
            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-zinc-500 mb-6 flex items-center gap-2">
               <Megaphone size={16} className="text-red-600" /> Neural Broadcast
            </h2>
            <div className="flex flex-col lg:flex-row gap-6">
                <textarea 
                  value={broadcastMsg} onChange={(e) => setBroadcastMsg(e.target.value)}
                  placeholder="Enter message for broadcast..."
                  className="flex-grow bg-white/5 border border-white/10 rounded-2xl p-6 text-sm font-medium outline-none focus:border-red-600 h-32 transition-all"
                />
                <div className="lg:w-80 flex flex-col gap-4">
                    <select 
                      value={targetGroup} onChange={(e) => setTargetGroup(e.target.value)}
                      className="bg-zinc-900 border border-white/10 rounded-xl p-4 text-[10px] font-black uppercase tracking-widest text-white outline-none"
                    >
                      <option value="all">Broadcast: All Terminals</option>
                      <option value="vip">Broadcast: VIP Only</option>
                      <option value="trial">Broadcast: Trial Only</option>
                    </select>
                    <button 
                      onClick={handleBroadcast} disabled={sending}
                      className="bg-red-600 hover:bg-red-700 disabled:opacity-50 h-full rounded-2xl flex items-center justify-center gap-3 transition-all"
                    >
                      <Send size={18} />
                      <span className="text-xs font-black uppercase tracking-widest">{sending ? 'Processing...' : 'Execute'}</span>
                    </button>
                </div>
            </div>
            {sending && (
                <div className="mt-6">
                   <div className="flex justify-between text-[8px] font-black uppercase mb-2">
                      <span>Uploading Data...</span>
                      <span>{emailProgress.current} / {emailProgress.total}</span>
                   </div>
                   <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-red-600 transition-all duration-500" style={{ width: `${(emailProgress.current/emailProgress.total)*100}%` }} />
                   </div>
                </div>
            )}
        </div>

        {/* USER DIRECTORY */}
        <div className="bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] overflow-hidden">
          <div className="p-8 border-b border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
              <h2 className="text-xs font-black uppercase tracking-[0.3em] text-zinc-500">Terminal Directory</h2>
              <div className="relative w-full md:w-96">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" />
                <input 
                  type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                  placeholder="SEARCH IDENTITY..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-[10px] font-black uppercase outline-none focus:border-red-600 transition-all"
                />
              </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-white/[0.02] text-[9px] uppercase font-black text-zinc-600 tracking-widest">
                <tr>
                  <th className="p-8">Terminal Identity</th>
                  <th className="p-8">Protocol Status</th>
                  <th className="p-8">Expiry Log</th>
                  <th className="p-8 text-right">Overrides</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {filteredUsers.map(user => (
                  <tr key={user.id} className="border-t border-white/5 hover:bg-white/[0.01] transition-colors">
                    <td className="p-8">
                      <p className="font-black text-zinc-200 uppercase text-xs">{user.username || 'Anonymous'}</p>
                      <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-tighter mt-1">{user.email}</p>
                    </td>
                    <td className="p-8">
                      <span className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest ${user.isVIP ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' : 'bg-zinc-800 text-zinc-500'}`}>
                        {user.isVIP ? 'VIP ACCESS' : 'FREE USER'}
                      </span>
                    </td>
                    <td className="p-8">
                       <p className="text-[10px] font-black text-zinc-500 uppercase">
                          {user.vipExpiresAt ? new Date(user.vipExpiresAt).toLocaleDateString() : 'NO ACTIVE LOG'}
                       </p>
                    </td>
                    <td className="p-8 flex gap-3 justify-end">
                      {!user.isVIP ? (
                        <>
                          <button onClick={() => handleManualUpgrade(user.id, '24H')} className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-[8px] font-black rounded-lg uppercase transition-all">Grant 24H</button>
                          <button onClick={() => handleManualUpgrade(user.id, '6MONTHS')} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-[8px] font-black rounded-lg uppercase transition-all">Grant 6MO</button>
                        </>
                      ) : (
                        <button className="px-4 py-2 bg-green-600/10 text-green-500 text-[8px] font-black rounded-lg uppercase cursor-default">Active</button>
                      )}
                      <button onClick={() => toggleBan(user.id, user.isBanned)} className={`p-2 rounded-lg transition-all ${user.isBanned ? 'bg-red-600 text-white' : 'bg-white/5 hover:bg-white/10 text-zinc-500'}`}>
                         <Activity size={14}/>
                      </button>
                      <button onClick={() => deleteUser(user.id)} className="p-2 bg-white/5 hover:bg-red-600 text-zinc-500 hover:text-white rounded-lg transition-all">
                         <Trash2 size={14}/>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}