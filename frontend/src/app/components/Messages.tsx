import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Send, FileText, Search, MessageSquare, ArrowLeft, MoreVertical } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { initSocket, joinChat, sendMessage as socketSendMessage, onNewMessage, offNewMessage } from '../services/socket';
import { handleApiError } from '../utils/errorHandler';

interface ChatPreview {
  _id: string;
  project?: {
    _id: string;
    name: string;
    image?: string;
  } | null;
  investor?: { _id: string; name: string } | null;
  entrepreneur?: { _id: string; name: string } | null;
  lastMessage?: {
    text: string;
    date: Date;
  };
  unreadCount?: {
    investor: number;
    entrepreneur: number;
  };
}

interface Message {
  _id: string;
  sender: string | { _id: string };
  text: string;
  timestamp?: Date;
  createdAt?: Date;
}

interface ActiveChat {
  _id: string;
  project: {
    _id: string;
    name: string;
  };
  messages: Message[];
}

export function Messages() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const { user } = useAuth();
  const scrollRef = useRef<HTMLDivElement>(null);

  const [chats, setChats] = useState<ChatPreview[]>([]);
  const [activeChat, setActiveChat] = useState<ActiveChat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const isChatOpen = !!id;

  // Fetch all user's chats
  useEffect(() => {
    fetchChats();
  }, []);

  // Fetch specific chat when ID changes
  useEffect(() => {
    if (id) {
      fetchActiveChat(id);
      initSocket();
      joinChat(id);
      onNewMessage((data: any) => {
        if (data.chatId === id && data.message) {
          const msg = data.message;
          setMessages(prev => [...prev, {
            _id: msg._id || `socket-${Date.now()}`,
            sender: msg.sender?._id ?? msg.sender,
            text: msg.text,
            timestamp: msg.timestamp || msg.createdAt || new Date()
          }]);
        }
        fetchChats();
      });
      return () => {
        offNewMessage();
      };
    } else {
      setActiveChat(null);
      setMessages([]);
    }
  }, [id]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const fetchChats = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/chat');
      setChats(data.chats || []);
    } catch (error) {
      console.error('Messages fetch error:', handleApiError(error));
    } finally {
      setLoading(false);
    }
  };


  const fetchActiveChat = async (chatId: string) => {
    try {
      const { data } = await api.get(`/chat/${chatId}`);
      const chat = data.chat;
      if (!chat) return;
      setActiveChat(chat);
      // Backend uses createdAt; normalize for display
      const msgs = (chat.messages || []).map((m: any) => ({
        ...m,
        sender: m.sender?._id ?? m.sender,
        timestamp: m.createdAt || m.timestamp,
        _id: m._id || String(m.createdAt) || Math.random().toString()
      }));
      setMessages(msgs);
      await api.put(`/chat/${chatId}/read`);
    } catch (error) {
      console.error('Error fetching chat:', handleApiError(error));
    }
  };

  const handleSendMessage = async () => {
    const textToSend = inputText.trim();
    if (!textToSend || !id) return;

    const tempId = Date.now().toString();
    const tempMessage: Message = {
      _id: tempId,
      sender: user?.id || '',
      text: textToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, tempMessage]);
    setInputText('');

    try {
      await api.post(`/chat/${id}/message`, { text: textToSend });
      socketSendMessage(id, {
        sender: user?.id,
        text: textToSend,
        timestamp: new Date()
      });
    } catch (error) {
      console.error('Error sending message:', handleApiError(error));
      setMessages(prev => prev.filter(m => m._id !== tempId));
      setInputText(textToSend);
      alert('Failed to send message');
    }
  };

  const filteredChats = chats.filter(chat =>
    (chat.project?.name ?? '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getUnreadCount = (chat: ChatPreview) => {
    const counts = chat.unreadCount;
    if (!counts) return 0;
    return user?.role === 'investor' ? (counts.investor ?? 0) : (counts.entrepreneur ?? 0);
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Top Navbar */}
      <div className="h-16 border-b border-slate-200 flex items-center px-6 justify-between bg-white shrink-0">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/dashboard')} 
            className="text-slate-400 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="font-black text-slate-900 tracking-tight">Messages</span>
        </div>
        {chats.length > 0 && (
          <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">
            {chats.length}
          </span>
        )}
      </div>

      <div className="flex-1 flex overflow-hidden">
        
        {/* SIDEBAR: ACTIVE CHATS */}
        <div className={`w-full md:w-80 border-r border-slate-200 flex-col bg-slate-50/50 
          ${isChatOpen ? 'hidden md:flex' : 'flex'}`}>
          
          <div className="p-4 border-b border-slate-200 bg-white">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search conversations..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-100 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500" 
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filteredChats.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                <MessageSquare className="w-16 h-16 text-slate-300 mb-4" />
                <p className="text-slate-500 font-medium mb-2">No conversations yet</p>
                <p className="text-sm text-slate-400">
                  {user?.role === 'investor'
                    ? 'Request to connect on a project to start chatting'
                    : 'You’ll see chats here when investors ask to connect on your projects'}
                </p>
              </div>
            ) : (
              filteredChats.map((chat) => {
                const unread = getUnreadCount(chat);
                const isActive = activeChat?._id === chat._id;
                const projectName = chat.project?.name ?? 'Chat';
                const initial = projectName.charAt(0).toUpperCase();
                // Investors see "Project – with [Entrepreneur]"; Entrepreneurs see "Project – from [Investor]"
                const otherPartyName = user?.role === 'investor'
                  ? chat.entrepreneur?.name
                  : chat.investor?.name;
                const subtitle = otherPartyName
                  ? (user?.role === 'investor' ? `with ${otherPartyName}` : `from ${otherPartyName}`)
                  : '';
                return (
                  <button
                    key={chat._id}
                    onClick={() => navigate(`/messages/${chat._id}`)}
                    className={`w-full p-4 flex items-center gap-3 border-b border-slate-100/50 transition-all ${
                      isActive 
                        ? 'bg-white shadow-sm ring-1 ring-slate-200' 
                        : 'hover:bg-slate-100'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-2xl bg-blue-600 flex-shrink-0 flex items-center justify-center text-white font-black">
                      {initial}
                    </div>
                    <div className="text-left flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-bold text-slate-900 truncate">
                          {projectName}
                        </p>
                        {unread > 0 && (
                          <span className="ml-2 bg-blue-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full flex-shrink-0">
                            {unread}
                          </span>
                        )}
                      </div>
                      {subtitle ? (
                        <p className="text-[10px] text-slate-500 truncate font-medium uppercase tracking-wide">
                          {subtitle}
                        </p>
                      ) : null}
                      <p className="text-[11px] text-slate-500 truncate">
                        {chat.lastMessage?.text || 'No messages yet'}
                      </p>
                      {chat.lastMessage?.date && (
                        <p className="text-[9px] text-slate-400 mt-1">
                          {new Date(chat.lastMessage.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric'
                          })}
                        </p>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* MAIN CHAT AREA */}
        <div className={`flex-1 flex-col bg-white 
          ${!isChatOpen ? 'hidden md:flex' : 'flex'}`}>
          
          {activeChat ? (
            <>
              {/* Active Chat Header */}
              <div className="px-6 py-3 border-b border-slate-100 flex justify-between items-center bg-white shadow-sm">
                <div className="flex items-center gap-3">
                  {/* Mobile Back Button */}
                  <button 
                    onClick={() => navigate('/messages')} 
                    className="md:hidden p-2 hover:bg-slate-100 rounded-lg"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black">
                      {(activeChat.project?.name ?? 'C').charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-slate-900">{activeChat.project?.name ?? 'Chat'}</h3>
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Online</p>
                      </div>
                    </div>
                  </div>
                </div>
                <button className="p-2 hover:bg-slate-100 rounded-lg">
                  <MoreVertical className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              {/* Messages Container */}
              <div 
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/20"
              >
                {messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                      <p className="text-slate-500 font-medium">No messages yet</p>
                      <p className="text-sm text-slate-400 mt-1">Start the conversation!</p>
                    </div>
                  </div>
                ) : (
                  messages.map((m) => {
                    const senderId = typeof m.sender === 'object' && m.sender !== null && '_id' in m.sender ? (m.sender as { _id: string })._id : String(m.sender);
                    const isOwn = senderId === user?.id;
                    const ts = m.timestamp || (m as any).createdAt;
                    return (
                    <div
                      key={m._id}
                      className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[75%] flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}>
                        <div className={`px-5 py-3 rounded-2xl text-sm ${
                          isOwn
                            ? 'bg-blue-600 text-white rounded-tr-none'
                            : 'bg-white border border-slate-200 rounded-tl-none'
                        }`}>
                          {m.text}
                        </div>
                        <span className="text-[9px] text-slate-400 mt-1 px-2">
                          {ts ? new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                        </span>
                      </div>
                    </div>
                    );
                  })
                )}
              </div>

              {/* Bottom Input */}
              <div className="p-4 bg-white border-t border-slate-100">
                <div className="flex gap-3 max-w-5xl mx-auto">
                  <input 
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type a message..." 
                    className="flex-1 bg-slate-100 rounded-2xl px-6 py-3.5 text-sm outline-none focus:ring-2 focus:ring-blue-600"
                  />
                  <button 
                    onClick={handleSendMessage}
                    className="bg-blue-600 hover:bg-blue-700 text-white p-3.5 rounded-2xl transition-all active:scale-95"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-300 p-6">
              <MessageSquare className="w-20 h-20 mb-4" />
              <p className="text-lg font-bold text-slate-400">Select a conversation</p>
              <p className="text-sm text-slate-400 mt-2">Choose a chat from the sidebar to start messaging</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}