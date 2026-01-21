/*eslint-disable  */
import React, { useState } from 'react';
import { auth, googleProvider, db } from '../firebase';
import { signInWithPopup } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { ShieldCheck, Mail, Lock } from 'lucide-react';

export default function Auth({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const finalizeLogin = async (userData) => {
    try {
      const userRef = doc(db, "users", userData.id.toString());
      const userSnap = await getDoc(userRef);

      let finalData = userData;

      if (userSnap.exists()) {
        finalData = userSnap.data();
      } else {
        await setDoc(userRef, userData);
      }

      localStorage.setItem('user', JSON.stringify(finalData));
      onLogin();
    } catch (error) {
      console.error("Database Error:", error);
      localStorage.setItem('user', JSON.stringify(userData));
      onLogin();
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      const userData = {
        username: user.displayName,
        email: user.email,
        avatar: user.photoURL,
        isVIP: false,
        signupDate: new Date().toISOString(),
        id: user.uid
      };
      
      await finalizeLogin(userData);
    } catch (error) {
      console.error("Google Sign-In Error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 font-sans relative overflow-hidden">
      {/* Visual background flair */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-900/10 via-transparent to-transparent opacity-50"></div>

      <div className="w-full max-w-md bg-[#0a0a0a] border border-white/5 p-10 rounded-[3rem] shadow-2xl text-center relative z-10">
        
        <div className="mb-8">
            <h1 className="text-2xl font-black italic uppercase tracking-tighter text-white">
                Quick<span className="text-red-600">Stream</span>
            </h1>
            <p className="text-gray-500 text-[9px] uppercase tracking-[0.4em] font-black mt-2">
                Official Access Terminal
            </p>
        </div>

        <div className="flex flex-col gap-4 mb-8">
            <button 
                onClick={handleGoogleLogin}
                className="flex items-center justify-center gap-3 w-full py-4 bg-white text-black rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-200 transition-all shadow-xl"
            >
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-4 h-4" alt="Google" />
                Continue with Google
            </button>
            
            <div className="flex items-center gap-4 my-2">
                <div className="h-[1px] bg-white/5 flex-1"></div>
                <span className="text-[8px] text-gray-700 font-bold uppercase">Secret Entry</span>
                <div className="h-[1px] bg-white/5 flex-1"></div>
            </div>

            <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
                <div className="relative">
                    <Mail className="absolute left-4 top-4 text-gray-600" size={16} />
                    <input 
                        type="email" name="email" placeholder="Email Address" 
                        className="w-full bg-black border border-white/5 rounded-2xl py-4 pl-12 pr-6 text-xs text-white focus:border-red-600 outline-none transition-all"
                    />
                </div>
                <div className="relative">
                    <Lock className="absolute left-4 top-4 text-gray-600" size={16} />
                    <input 
                        type="password" name="password" placeholder="Password" 
                        className="w-full bg-black border border-white/5 rounded-2xl py-4 pl-12 pr-6 text-xs text-white focus:border-red-600 outline-none transition-all"
                    />
                </div>
                <button className="w-full py-4 bg-zinc-900 text-gray-400 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all">
                    {isLogin ? 'Enter Vault' : 'Create Account'}
                </button>
            </form>
        </div>

        <p className="text-gray-600 text-[9px] font-bold uppercase tracking-widest leading-relaxed">
            By entering, you agree to our <br/> 
            <span className="text-white">Encrypted Privacy Protocols</span>
        </p>
      </div>
    </div>
  );
}