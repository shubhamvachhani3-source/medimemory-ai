"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const router = useRouter();
  
  // State management
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError("");
  };

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        // --- LOGIN LOGIC ---
        const formData = new URLSearchParams();
        formData.append("username", email);
        formData.append("password", password);

        const response = await fetch("http://127.0.0.1:8000/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: formData,
        });

        if (!response.ok) throw new Error("Invalid email or password");

        const data = await response.json();
        
        // Save the secure token to the browser
        localStorage.setItem("medimemory_token", data.access_token);
        
        // Push the user to the new dashboard!
        window.location.href = "/dashboard";
        
      } else {
        // --- REGISTRATION LOGIC ---
        const response = await fetch("http://127.0.0.1:8000/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password, full_name: fullName || "Doctor" }),
        });

        if (!response.ok) throw new Error("Registration failed. Email might exist.");

        setIsLogin(true);
        setError("Registration successful! Please log in.");
      }
    } catch (err: any) {
      setError(err.message || "Connection failed. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-blue-600"></div>
      
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        {/* Header Section */}
        <div className="bg-blue-600 p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-4 shadow-inner">
            <span className="text-blue-600 text-3xl font-bold">M+</span>
          </div>
          <h1 className="text-white text-2xl font-bold">MediMemory AI</h1>
          <p className="text-blue-100 text-sm mt-1">Secure Medical Intelligence Portal</p>
        </div>

        {/* Form Section */}
        <div className="p-8">
          <h2 className="text-xl font-semibold text-slate-800 mb-6 text-center">
            {isLogin ? "Doctor Login" : "Create Practitioner Account"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-slate-900"
                  placeholder="Dr. Jane Smith"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                required
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-slate-900"
                placeholder="doctor@hospital.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <input
                type="password"
                required
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-slate-900"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600 text-center font-medium">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-lg transform transition active:scale-[0.98] disabled:opacity-70"
            >
              {loading ? "Processing..." : isLogin ? "Sign In" : "Register Now"}
            </button>
          </form>

          {/* Toggle Link */}
          <div className="mt-6 text-center">
            <button
              onClick={toggleMode}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium transition"
            >
              {isLogin 
                ? "New to MediMemory? Create an account" 
                : "Already have an account? Sign in"}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 p-4 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-400">
            HIPAA Compliant Data Encryption Active
          </p>
        </div>
      </div>
    </main>
  );
}