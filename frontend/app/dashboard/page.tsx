"use client";

import React, { useState, useRef, useEffect } from 'react';
import { 
  Activity, Users, FileText, BrainCircuit, 
  Search, Bell, Upload, Plus, ChevronRight, 
  CheckCircle2, Loader2, MessageSquare, X, Send, Bot, User
} from 'lucide-react';

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  
  // Chat State
  const [activePatient, setActivePatient] = useState<any>(null);
  const [messages, setMessages] = useState<{role: 'user' | 'ai', text: string}[]>([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isAiTyping, setIsAiTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isAiTyping]);

  const stats = [
    { label: "Total Patients", value: "1,284", icon: Users, color: "text-blue-600", bg: "bg-blue-100" },
    { label: "Records Processed", value: "3,842", icon: FileText, color: "text-indigo-600", bg: "bg-indigo-100" },
    { label: "AI Insights Generated", value: "12,490", icon: BrainCircuit, color: "text-purple-600", bg: "bg-purple-100" },
    { label: "System Health", value: "99.9%", icon: Activity, color: "text-emerald-600", bg: "bg-emerald-100" },
  ];

  const recentPatients = [
    { id: "PT-8472", name: "Eleanor Vance", age: 42, condition: "Hypertension", lastUpdate: "2 hours ago", status: "Analyzed" },
    { id: "PT-8471", name: "Marcus Webb", age: 58, condition: "Type 2 Diabetes", lastUpdate: "5 hours ago", status: "Pending PDF" },
    { id: "PT-8470", name: "Sarah Jenkins", age: 31, condition: "Asthma", lastUpdate: "1 day ago", status: "Analyzed" },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    setUploadSuccess(false);
    setTimeout(() => {
      setIsUploading(false);
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 4000);
    }, 3000);
  };

  const openChat = (patient: any) => {
    setActivePatient(patient);
    setMessages([
      { role: 'ai', text: `Knowledge graph loaded for ${patient.name}. I have analyzed their medical records. What would you like to know?` }
    ]);
  };

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentMessage.trim()) return;

    // Add user message
    const newMessages = [...messages, { role: 'user' as const, text: currentMessage }];
    setMessages(newMessages);
    setCurrentMessage("");
    setIsAiTyping(true);

    // Simulate AI extraction response
    setTimeout(() => {
      let aiResponse = "I'm analyzing the medical record to find that information.";
      const query = newMessages[newMessages.length - 1].text.toLowerCase();
      
      if (activePatient.id === "PT-8472") {
        if (query.includes("medication") || query.includes("taking")) {
          aiResponse = "Based on the ingested PDF, Eleanor is currently prescribed Lisinopril 10mg daily and Amlodipine 5mg daily for essential hypertension.";
        } else if (query.includes("allergy") || query.includes("allergic")) {
          aiResponse = "The patient has a known allergy to Penicillin, which causes hives.";
        }
      }

      setMessages(prev => [...prev, { role: 'ai', text: aiResponse }]);
      setIsAiTyping(false);
    }, 1500);
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans relative">
      
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col hidden md:flex z-10">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center font-bold text-xl">M</div>
          <span className="text-xl font-bold tracking-tight">MediMemory <span className="text-blue-400">AI</span></span>
        </div>
        <nav className="flex-1 px-4 mt-6 space-y-2">
          <a href="#" className="flex items-center gap-3 px-4 py-3 bg-blue-600/20 text-blue-400 rounded-xl transition-colors">
            <Activity size={20} />
            <span className="font-medium">Dashboard</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors">
            <Users size={20} />
            <span className="font-medium">Patient Index</span>
          </a>
        </nav>
        <div className="p-4 mb-4">
          <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
            <p className="text-xs text-slate-400 uppercase font-semibold mb-2">Hackathon Demo</p>
            <p className="text-sm text-slate-300">Using fictional records only. Not for clinical use.</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 flex flex-col h-full transition-all duration-300 ${activePatient ? 'mr-96' : ''} overflow-y-auto`}>
        {/* Top Navigation */}
        <header className="h-20 px-8 flex items-center justify-between bg-white border-b border-slate-200 sticky top-0 z-10">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Search patients, conditions, or records..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-700"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors">
              <Bell size={24} />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="w-10 h-10 rounded-full bg-blue-100 border-2 border-blue-200 flex items-center justify-center text-blue-700 font-bold">Dr</div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-8 max-w-7xl mx-auto w-full relative">
          {uploadSuccess && (
            <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-emerald-100 border border-emerald-200 text-emerald-800 px-6 py-3 rounded-xl shadow-lg flex items-center gap-3 animate-bounce z-50">
              <CheckCircle2 size={24} className="text-emerald-600" />
              <div>
                <p className="font-bold">Upload Successful</p>
                <p className="text-sm">Patient data extracted to Knowledge Graph.</p>
              </div>
            </div>
          )}

          <div className="flex justify-between items-end mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Overview</h1>
              <p className="text-slate-500 mt-1">Welcome back. Here is today's clinical intelligence summary.</p>
            </div>
            <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept=".pdf" />
            <button 
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-all shadow-sm ${
                isUploading ? "bg-slate-100 text-slate-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200 hover:shadow-md"
              }`}
            >
              {isUploading ? <><Loader2 size={20} className="animate-spin" /> Extracting AI Data...</> : <><Upload size={20} /> Upload PDF Record</>}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {stats.map((stat, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}><stat.icon size={24} /></div>
                </div>
                <h3 className="text-3xl font-bold text-slate-900">{stat.value}</h3>
                <p className="text-sm font-medium text-slate-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Patient Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-lg font-bold text-slate-900">Recent Patient Records</h2>
            </div>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white text-xs uppercase tracking-wider text-slate-500 border-b border-slate-200">
                  <th className="px-6 py-4 font-semibold">Patient ID</th>
                  <th className="px-6 py-4 font-semibold">Name & Age</th>
                  <th className="px-6 py-4 font-semibold">Primary Condition</th>
                  <th className="px-6 py-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentPatients.map((patient, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4 text-sm font-mono text-slate-500">{patient.id}</td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-900">{patient.name}</div>
                      <div className="text-xs text-slate-500">{patient.age} years old</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-700">{patient.condition}</td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => openChat(patient)}
                        className="inline-flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg font-medium hover:bg-slate-50 hover:text-blue-600 transition-colors shadow-sm"
                      >
                        <MessageSquare size={16} /> Ask AI
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* AI Chat Slide-out Panel */}
      <div className={`fixed top-0 right-0 h-full w-96 bg-white border-l border-slate-200 shadow-2xl transform transition-transform duration-300 ease-in-out z-20 flex flex-col ${activePatient ? 'translate-x-0' : 'translate-x-full'}`}>
        {/* Chat Header */}
        <div className="h-20 px-6 flex items-center justify-between border-b border-slate-200 bg-slate-50">
          <div>
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <BrainCircuit size={20} className="text-blue-600" /> Cognee Assistant
            </h3>
            <p className="text-xs text-slate-500 mt-1">Analyzing: <span className="font-semibold text-slate-700">{activePatient?.name}</span></p>
          </div>
          <button onClick={() => setActivePatient(null)} className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Chat Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-white">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 border border-slate-200'}`}>
                {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>
              <div className={`px-4 py-3 rounded-2xl max-w-[80%] text-sm ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200'}`}>
                {msg.text}
              </div>
            </div>
          ))}
          
          {isAiTyping && (
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 border border-slate-200 flex items-center justify-center shrink-0">
                <Bot size={16} />
              </div>
              <div className="px-4 py-4 rounded-2xl bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200 flex items-center gap-1.5">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input Area */}
        <div className="p-4 bg-white border-t border-slate-200">
          <form onSubmit={sendMessage} className="relative flex items-center">
            <input 
              type="text" 
              placeholder="Ask about medications, allergies..." 
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm text-slate-700"
            />
            <button 
              type="submit" 
              disabled={!currentMessage.trim() || isAiTyping}
              className="absolute right-2 p-2 text-white bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed rounded-lg transition-colors"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>

    </div>
  );
}
