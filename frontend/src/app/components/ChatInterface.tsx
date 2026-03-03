import { useState, useRef, useEffect, use } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, CheckCircle2, AlertCircle, FileText, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { initSocket, joinChat, sendMessage as socketSend, onNewMessage } from '../services/socket';

interface Message {
  _id: string;
  sender: string;
  text: string;
  timestamp: Date;
}

interface Chat {
  _id: string;
  project: {
    _id: string;
    name: string;
    fundingGoal: number;
    roi: string;
  };
  messages: Message[];
}

export function ChatInterface() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const [chat, setChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const [showTermsSheet, setShowTermsSheet] = useState(false);
  const [termsAgreed, setTermsAgreed] = useState(false);

  useEffect(() => {
    if (!id) return;

    fetchChat();
    const socket = initSocket();

    socket.on('connect', () => {
      console.log('Socket ready! Joining room:', id);
      joinChat(id);
    });

    onNewMessage((data: any) => {
      if (data.chatId === id) {
        setMessages(prev => [...prev, data.message]);
      }
    });

    return () => {
      socket?.off('connect');
      socket?.disconnect();
    };
  }, [id]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const fetchChat = async () => {
    try {
      const { data } = await api.get(`/chat/${id}`);
      setChat(data.chat);
      setMessages(data.chat.messages || []);
    } catch (error) {
      console.error('Error fetching chat:', error);
    } finally {
      setLoading(false);
    }
  };


  const handleSendMessage = async () => {
    if (!inputText.trim() || !id) return;

    try {
      await api.post(`/chat/${id}/message`, { text: inputText });
      socketSend(id, { 
        sender: user?.id, 
        text: inputText,
        timestamp: new Date()
      });
      setInputText('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading chat...</div>;
  }

  if (!chat) {
    return <div className="p-10 text-center">Chat not found</div>;
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-RW', {
      style: 'currency',
      currency: 'RWF',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="h-screen flex flex-col bg-slate-50 overflow-hidden">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between shadow-sm z-20">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
              {chat.project.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-sm font-black text-slate-900 leading-none mb-1">{chat.project.name}</h1>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Online</p>
              </div>
            </div>
          </div>
        </div>
        <button
          onClick={() => setShowTermsSheet(true)}
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-600 transition-all active:scale-95"
        >
          <FileText className="w-4 h-4" />
          Terms
        </button>
      </div>

      {/* Pinned Investment Banner */}
      <div className="bg-blue-50/50 border-b border-blue-100 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-4 h-4 text-blue-600" />
          <p className="text-xs font-bold text-slate-600">
            Target: <span className="text-blue-700">{formatCurrency(chat.project.fundingGoal)}</span>
          </p>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 scroll-smooth">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`flex ${message.sender === user?.id ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[85%] md:max-w-[60%] flex flex-col ${message.sender === user?.id ? 'items-end' : 'items-start'}`}>
              <div
                className={`px-5 py-3.5 rounded-[2rem] text-sm leading-relaxed shadow-sm ${
                  message.sender === user?.id
                    ? 'bg-blue-600 text-white rounded-tr-none'
                    : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
                }`}
              >
                {message.text}
              </div>
              <span className="text-[10px] font-bold text-slate-400 mt-2 px-2 uppercase tracking-tighter">
                {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Terms Sheet Modal */}
      {showTermsSheet && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Investment Terms Sheet</h3>
              <button onClick={() => setShowTermsSheet(false)} className="p-2 hover:bg-slate-100 rounded-full">
                <X className="w-6 h-6 text-slate-400" />
              </button>
            </div>

            <div className="space-y-4 mb-8">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Proposed Funding</p>
                <p className="text-xl font-black text-blue-600">{formatCurrency(chat.project.fundingGoal)}</p>
              </div>
              
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Expected Returns</p>
                <p className="text-sm text-slate-700">{chat.project.roi}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowTermsSheet(false)}
                className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all"
              >
                Back
              </button>
              <button
                onClick={async () => {
                  try {
                    // You can call an API endpoint to agree to terms here
                    setTermsAgreed(true);
                    alert("Terms accepted!");
                    setShowTermsSheet(false);
                  } catch (error) {
                    console.error('Error accepting terms:', error);
                  }
                }}
                className="flex-1 py-4 bg-green-600 text-white rounded-2xl font-bold shadow-lg shadow-green-100 hover:bg-green-700 transition-all active:scale-95"
              >
                Accept Terms
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Message Input */}
      <div className="bg-white border-t border-slate-200 p-4 md:p-6">
        <div className="max-w-4xl mx-auto flex gap-3">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Discuss terms or ask a question..."
            className="flex-1 bg-slate-100 border-none rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-blue-500 transition-all"
          />
          <button
            onClick={handleSendMessage}
            className="bg-blue-600 hover:bg-slate-900 text-white p-4 rounded-2xl shadow-lg shadow-blue-100 transition-all active:scale-90"
          >
            <Send className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}