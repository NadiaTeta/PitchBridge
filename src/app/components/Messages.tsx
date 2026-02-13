import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Send, FileText, Search, MessageSquare, ArrowLeft, MoreVertical } from 'lucide-react';
import { mockProjects } from '@/app/data/mockData';
import { useAuth } from '@/app/context/AuthContext';

export function Messages() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const { user } = useAuth();
  const scrollRef = useRef<HTMLDivElement>(null);

  const connectedProjects = mockProjects.filter(p => user?.portfolio?.includes(p.id));
  const activeProject = mockProjects.find((p) => p.id === id);

  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');

  // FIX: Logic to handle "Mobile View" toggle
  // If we have an ID, we show the chat. If not, we show the list.
  const isChatOpen = !!id;

  useEffect(() => {
    if (activeProject) {
      setMessages([{
        id: '1',
        sender: 'entrepreneur',
        text: `Hello! I'm the founder of ${activeProject.name}.`,
        timestamp: new Date(),
      }]);
    }
  }, [id]);

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Top Navbar */}
      <div className="h-16 border-b border-slate-200 flex items-center px-6 justify-between bg-white shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/investor/discover')} className="text-slate-400 hover:text-slate-900 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="font-black text-slate-900 tracking-tight">Messages</span>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        
        {/* SIDEBAR: ACTIVE CONNECTIONS */}
        {/* FIX: Use hidden/flex conditionally based on ID presence on mobile */}
        <div className={`w-full md:w-80 border-r border-slate-200 flex-col bg-slate-50/50 
          ${isChatOpen ? 'hidden md:flex' : 'flex'}`}>
          
          <div className="p-4 border-b border-slate-200 bg-white">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type="text" placeholder="Search..." className="w-full pl-10 pr-4 py-2 bg-slate-100 rounded-xl text-xs outline-none" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {connectedProjects.map((proj) => (
              <button
                key={proj.id}
                onClick={() => navigate(`/messages/${proj.id}`)}
                className={`w-full p-4 flex items-center gap-3 border-b border-slate-100/50 ${
                  activeProject?.id === proj.id ? 'bg-white shadow-sm ring-1 ring-slate-200' : 'hover:bg-slate-100'
                }`}
              >
                <div className="w-12 h-12 rounded-2xl bg-blue-600 flex-shrink-0 flex items-center justify-center text-white font-black">
                  {proj.name.charAt(0)}
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-slate-900">{proj.name}</p>
                  <p className="text-[10px] text-slate-500">Tap to chat</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* MAIN CHAT AREA */}
        {/* FIX: Use hidden/flex conditionally based on ID presence on mobile */}
        <div className={`flex-1 flex-col bg-white 
          ${!isChatOpen ? 'hidden md:flex' : 'flex'}`}>
          
          {activeProject ? (
            <>
              {/* Active Chat Header */}
              <div className="px-6 py-3 border-b border-slate-100 flex justify-between items-center bg-white shadow-sm">
                <div className="flex items-center gap-3">
                  {/* Mobile Back Button for Chat */}
                  <button onClick={() => navigate('/messages')} className="md:hidden p-2">
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">{activeProject.name}</h3>
                </div>
              </div>

              {/* Messages Container */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/20">
                {messages.map((m) => (
                  <div key={m.id} className={`flex ${m.sender === 'investor' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[75%] px-5 py-3 rounded-2xl text-sm ${
                      m.sender === 'investor' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white border border-slate-200 rounded-tl-none'
                    }`}>
                      {m.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom Input */}
              <div className="p-4 bg-white border-t border-slate-100">
                <div className="flex gap-3 max-w-5xl mx-auto">
                  <input 
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Message..." 
                    className="flex-1 bg-slate-100 rounded-2xl px-6 py-3.5 text-sm outline-none focus:ring-2 focus:ring-blue-600"
                  />
                  <button className="bg-blue-600 text-white p-3.5 rounded-2xl"><Send className="w-5 h-5" /></button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-300">
              Select a conversation to start
            </div>
          )}
        </div>
      </div>
    </div>
  );
}