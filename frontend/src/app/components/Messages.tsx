import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Send,
  Search,
  MessageSquare,
  ArrowLeft,
  MoreVertical,
  Phone,
  Video,
  Paperclip,
  Trash2,
  FileText,
  Image as ImageIcon,
  Film,
  X,
  CheckCheck,
  ShieldCheck,
  FolderOpen,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  initSocket,
  joinChat,
  sendMessage as socketSendMessage,
  onNewMessage,
  offNewMessage,
} from '../services/socket';
import { handleApiError } from '../utils/errorHandler';

interface ChatPreview {
  _id: string;
  project?: { _id: string; name: string; image?: string } | null;
  investor?: { _id: string; name: string } | null;
  entrepreneur?: { _id: string; name: string } | null;
  lastMessage?: { text: string; date: Date };
  unreadCount?: { investor: number; entrepreneur: number };
}

interface AttachmentItem {
  id: string;
  file: File;
  previewUrl?: string;
  type: 'image' | 'video' | 'document';
}

interface Message {
  _id: string;
  sender: string | { _id: string };
  text: string;
  timestamp?: Date;
  createdAt?: Date;
  attachments?: AttachmentItem[];
  status?: 'sending' | 'sent' | 'failed';
}

interface ActiveChat {
  _id: string;
  project: { _id: string; name: string; image?: string };
  messages: Message[];
}

export function Messages() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [chats, setChats] = useState<ChatPreview[]>([]);
  const [activeChat, setActiveChat] = useState<ActiveChat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sending, setSending] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<AttachmentItem[]>([]);
  const [openMessageMenu, setOpenMessageMenu] = useState<string | null>(null);
  const [activeCall, setActiveCall] = useState<null | 'audio' | 'video'>(null);

  const isChatOpen = !!id;

  useEffect(() => { fetchChats(); }, []);

  useEffect(() => {
    if (id) {
      fetchActiveChat(id);
      initSocket();
      joinChat(id);
      onNewMessage((data: any) => {
        if (data.chatId === id && data.message) {
          const msg = data.message;
          setMessages((prev) => [...prev, {
            _id: msg._id || `socket-${Date.now()}`,
            sender: msg.sender?._id ?? msg.sender,
            text: msg.text || '',
            timestamp: msg.timestamp || msg.createdAt || new Date(),
            attachments: msg.attachments || [],
            status: 'sent',
          }]);
        }
        fetchChats();
      });
      return () => offNewMessage();
    } else {
      setActiveChat(null);
      setMessages([]);
    }
  }, [id]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, selectedFiles]);

  useEffect(() => {
    return () => { selectedFiles.forEach((item) => { if (item.previewUrl) URL.revokeObjectURL(item.previewUrl); }); };
  }, [selectedFiles]);

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
      const msgs = (chat.messages || []).map((m: any) => ({
        ...m,
        sender: m.sender?._id ?? m.sender,
        timestamp: m.createdAt || m.timestamp,
        _id: m._id || String(m.createdAt) || Math.random().toString(),
        attachments: m.attachments || [],
        status: 'sent',
      }));
      setMessages(msgs);
      await api.put(`/chat/${chatId}/read`);
    } catch (error) {
      console.error('Error fetching chat:', handleApiError(error));
    }
  };

  const filteredChats = useMemo(() =>
    chats.filter((chat) => (chat.project?.name ?? '').toLowerCase().includes(searchQuery.toLowerCase())),
    [chats, searchQuery]
  );

  const getUnreadCount = (chat: ChatPreview) => {
    const counts = chat.unreadCount;
    if (!counts) return 0;
    return user?.role === 'investor' ? (counts.investor ?? 0) : (counts.entrepreneur ?? 0);
  };

  const getInitials = (text: string) => text?.charAt(0).toUpperCase() || 'C';

  const formatChatDate = (date?: Date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatMessageTime = (date?: Date) => {
    if (!date) return '';
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleSelectFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newItems: AttachmentItem[] = files.map((file) => {
      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');
      return {
        id: `${file.name}-${Date.now()}-${Math.random()}`,
        file,
        previewUrl: isImage || isVideo ? URL.createObjectURL(file) : undefined,
        type: isImage ? 'image' : isVideo ? 'video' : 'document',
      };
    });
    setSelectedFiles((prev) => [...prev, ...newItems]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeSelectedFile = (attachmentId: string) => {
    setSelectedFiles((prev) => {
      const target = prev.find((item) => item.id === attachmentId);
      if (target?.previewUrl) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((item) => item.id !== attachmentId);
    });
  };

  const handleStartCall = (type: 'audio' | 'video') => setActiveCall(type);
  const handleEndCall = () => setActiveCall(null);

  const handleSendMessage = async () => {
    const textToSend = inputText.trim();
    if ((!textToSend && selectedFiles.length === 0) || !id || sending) return;

    const tempId = `temp-${Date.now()}`;
    const tempMessage: Message = {
      _id: tempId,
      sender: user?.id || '',
      text: textToSend,
      timestamp: new Date(),
      attachments: selectedFiles,
      status: 'sending',
    };
    setMessages((prev) => [...prev, tempMessage]);
    setInputText('');
    setSelectedFiles([]);
    setSending(true);

    try {
      await api.post(`/chat/${id}/message`, { text: textToSend });
      socketSendMessage(id, { sender: user?.id, text: textToSend, timestamp: new Date(), attachments: [] });
      setMessages((prev) => prev.map((m) => (m._id === tempId ? { ...m, status: 'sent' } : m)));
      fetchChats();
    } catch (error) {
      console.error('Error sending message:', handleApiError(error));
      setMessages((prev) => prev.map((m) => (m._id === tempId ? { ...m, status: 'failed' } : m)));
      alert('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    const previousMessages = [...messages];
    setOpenMessageMenu(null);
    setMessages((prev) => prev.filter((m) => m._id !== messageId));
    try {
      await api.delete(`/chat/${id}/message/${messageId}`);
    } catch (error) {
      console.error('Delete message error:', handleApiError(error));
      setMessages(previousMessages);
    }
  };

  const renderAttachmentPreview = (attachment: AttachmentItem) => {
    if (attachment.type === 'image' && attachment.previewUrl) {
      return (
        <div key={attachment.id} className="relative h-20 w-20 overflow-hidden rounded-xl border border-slate-200">
          <img src={attachment.previewUrl} alt={attachment.file.name} className="h-full w-full object-cover" />
          <button onClick={() => removeSelectedFile(attachment.id)} className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-slate-900/70 text-white">
            <X className="h-3 w-3" />
          </button>
        </div>
      );
    }
    if (attachment.type === 'video' && attachment.previewUrl) {
      return (
        <div key={attachment.id} className="relative h-20 w-20 overflow-hidden rounded-xl border border-slate-200 bg-slate-900">
          <video src={attachment.previewUrl} className="h-full w-full object-cover opacity-60" />
          <div className="absolute inset-0 flex items-center justify-center"><Film className="h-5 w-5 text-white" /></div>
          <button onClick={() => removeSelectedFile(attachment.id)} className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-slate-900/70 text-white">
            <X className="h-3 w-3" />
          </button>
        </div>
      );
    }
    return (
      <div key={attachment.id} className="relative flex min-w-[180px] items-center gap-2.5 rounded-xl border border-slate-200 bg-white px-3 py-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
          <FileText className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-semibold text-slate-900">{attachment.file.name}</p>
          <p className="text-[10px] text-slate-400">{(attachment.file.size / 1024 / 1024).toFixed(2)} MB</p>
        </div>
        <button onClick={() => removeSelectedFile(attachment.id)} className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-red-50 hover:text-red-500">
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    );
  };

  const renderMessageAttachments = (attachments?: AttachmentItem[]) => {
    if (!attachments || attachments.length === 0) return null;
    return (
      <div className="mb-2 space-y-1.5">
        {attachments.map((attachment) => {
          if (attachment.type === 'image' && attachment.previewUrl)
            return <img key={attachment.id} src={attachment.previewUrl} alt={attachment.file.name} className="max-h-52 w-full rounded-xl object-cover" />;
          if (attachment.type === 'video' && attachment.previewUrl)
            return <video key={attachment.id} src={attachment.previewUrl} controls className="max-h-52 w-full rounded-xl" />;
          return (
            <div key={attachment.id} className="flex items-center gap-2.5 rounded-xl border border-white/20 bg-white/10 px-3 py-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20"><FileText className="h-4 w-4" /></div>
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold">{attachment.file.name}</p>
                <p className="text-[10px] opacity-70">{(attachment.file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center" style={{ backgroundColor: '#eef0f5' }}>
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />
          <p className="mt-3 text-sm font-medium text-slate-500">Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: '#eef0f5' }}>
      <input ref={fileInputRef} type="file" multiple accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,image/*,video/*" className="hidden" onChange={handleSelectFiles} />

      {/* ── LEFT PANEL ── */}
      <aside className={`${isChatOpen ? 'hidden md:flex' : 'flex'} flex-col w-full md:w-[300px] lg:w-[320px] flex-shrink-0 border-r`}
        style={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0' }}>

        {/* Header */}
        <div className="px-4 pt-5 pb-4 border-b" style={{ borderColor: '#f1f5f9' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <button onClick={() => navigate('/dashboard')}
                className="flex h-9 w-9 items-center justify-center rounded-xl border transition hover:bg-slate-50"
                style={{ borderColor: '#e2e8f0', color: '#475569' }}>
                <ArrowLeft className="h-4 w-4" />
              </button>
              <div>
                <h1 className="text-base font-black text-slate-900 tracking-tight">Messages</h1>
                <p className="text-xs text-slate-400 font-medium">{chats.length} conversation{chats.length !== 1 ? 's' : ''}</p>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl py-2.5 pl-9 pr-3 text-sm outline-none transition"
              style={{ backgroundColor: '#f1f5f9', border: '1px solid #e2e8f0', color: '#1e293b' }}
            />
          </div>
        </div>

        {/* Chat list */}
        <div className="flex-1 overflow-y-auto py-2">
          {filteredChats.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full px-6 text-center py-16">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mb-3">
                <MessageSquare className="h-5 w-5 text-slate-400" />
              </div>
              <p className="text-sm font-semibold text-slate-700">No conversations yet</p>
              <p className="mt-1 text-xs text-slate-400 leading-relaxed">Chats will appear here when investors connect.</p>
            </div>
          ) : (
            filteredChats.map((chat) => {
              const unread = getUnreadCount(chat);
              const isActive = activeChat?._id === chat._id;
              const projectName = chat.project?.name ?? 'Chat';
              const otherPartyName = user?.role === 'investor' ? chat.entrepreneur?.name : chat.investor?.name;

              return (
                <button
                  key={chat._id}
                  onClick={() => navigate(`/messages/${chat._id}`)}
                  className="w-full px-3 py-2.5 text-left transition-all"
                >
                  <div className={`flex items-start gap-3 p-3 rounded-2xl transition-all ${isActive ? 'bg-blue-50 border border-blue-100' : 'hover:bg-slate-50'}`}>
                    {/* Avatar */}
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl font-black text-white text-sm"
                      style={{ background: isActive ? 'linear-gradient(135deg, #2563eb, #0ea5e9)' : 'linear-gradient(135deg, #334155, #475569)' }}>
                      {getInitials(projectName)}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-1 mb-0.5">
                        <p className={`truncate text-sm font-bold ${isActive ? 'text-blue-700' : 'text-slate-900'}`}>{projectName}</p>
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          {chat.lastMessage?.date && (
                            <span className="text-[10px] text-slate-400">{formatChatDate(chat.lastMessage.date)}</span>
                          )}
                          {unread > 0 && (
                            <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-blue-600 px-1.5 text-[9px] font-black text-white">
                              {unread}
                            </span>
                          )}
                        </div>
                      </div>
                      {otherPartyName && (
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-blue-500 mb-0.5">
                          {user?.role === 'investor' ? `with ${otherPartyName}` : `from ${otherPartyName}`}
                        </p>
                      )}
                      <p className="truncate text-xs text-slate-400">
                        {chat.lastMessage?.text || 'No messages yet'}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </aside>

      {/* ── CENTER: CHAT AREA ── */}
      <main className={`${!isChatOpen ? 'hidden md:flex' : 'flex'} flex-1 flex-col min-w-0`}>
        {activeChat ? (
          <div className="flex h-full flex-col">

            {/* Chat Header */}
            <div className="flex items-center justify-between gap-4 px-5 py-4 border-b bg-white" style={{ borderColor: '#e2e8f0' }}>
              <div className="flex items-center gap-3 min-w-0">
                <button onClick={() => navigate('/messages')}
                  className="md:hidden flex h-9 w-9 items-center justify-center rounded-xl border transition hover:bg-slate-50"
                  style={{ borderColor: '#e2e8f0' }}>
                  <ArrowLeft className="h-4 w-4 text-slate-600" />
                </button>

                <div className="flex h-10 w-10 items-center justify-center rounded-2xl font-black text-white text-sm flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, #1e3a8a, #2563eb)' }}>
                  {getInitials(activeChat.project?.name ?? 'C')}
                </div>

                <div className="min-w-0">
                  <h2 className="truncate text-sm font-black text-slate-900">{activeChat.project?.name ?? 'Chat'}</h2>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Live
                    </span>
                    <span className="text-slate-300">·</span>
                    <span className="flex items-center gap-1 text-[10px] font-semibold text-blue-600">
                      <ShieldCheck className="h-3 w-3" /> Secure
                    </span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-1.5">
                {[
                  { icon: Phone, action: () => handleStartCall('audio'), tip: 'Audio call' },
                  { icon: Video, action: () => handleStartCall('video'), tip: 'Video call' },
                  { icon: Paperclip, action: () => fileInputRef.current?.click(), tip: 'Attach' },
                ].map(({ icon: Icon, action, tip }) => (
                  <button key={tip} onClick={action} title={tip}
                    className="flex h-9 w-9 items-center justify-center rounded-xl border transition hover:bg-slate-50 hover:text-blue-600"
                    style={{ borderColor: '#e2e8f0', color: '#64748b' }}>
                    <Icon className="h-4 w-4" />
                  </button>
                ))}
              </div>
            </div>

            {/* Messages area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-5 space-y-4"
              style={{ background: 'linear-gradient(to bottom, #f0f4ff 0%, #eef0f5 100%)' }}>
              {messages.length === 0 ? (
                <div className="flex h-full items-center justify-center">
                  <div className="text-center">
                    <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm border border-slate-100">
                      <MessageSquare className="h-6 w-6 text-slate-400" />
                    </div>
                    <p className="text-sm font-semibold text-slate-700">No messages yet</p>
                    <p className="mt-1 text-xs text-slate-400">Start the conversation below.</p>
                  </div>
                </div>
              ) : (
                messages.map((m) => {
                  const senderId = typeof m.sender === 'object' && m.sender !== null && '_id' in m.sender
                    ? (m.sender as { _id: string })._id : String(m.sender);
                  const isOwn = senderId === user?.id;
                  const ts = m.timestamp || m.createdAt;

                  return (
                    <div key={m._id} className={`group flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[75%] md:max-w-[60%] ${isOwn ? '' : 'flex gap-2.5'}`}>
                        {/* Other user avatar */}
                        {!isOwn && (
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl font-bold text-white text-xs self-end mb-5"
                            style={{ background: 'linear-gradient(135deg, #334155, #475569)' }}>
                            {getInitials(activeChat.project?.name ?? 'C')}
                          </div>
                        )}

                        <div>
                          {/* Bubble */}
                          <div className={`rounded-2xl px-4 py-3 shadow-sm ${
                            isOwn
                              ? 'text-white rounded-br-md'
                              : 'text-slate-800 rounded-bl-md'
                          }`}
                            style={isOwn
                              ? { background: 'linear-gradient(135deg, #1d4ed8, #2563eb)', border: 'none' }
                              : { backgroundColor: '#ffffff', border: '1px solid #e2e8f0' }}>
                            {renderMessageAttachments(m.attachments)}
                            {m.text && (
                              <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{m.text}</p>
                            )}
                          </div>

                          {/* Timestamp + status */}
                          <div className={`mt-1 flex items-center gap-1.5 px-1 ${isOwn ? 'justify-end' : 'justify-start'}`}>
                            <span className="text-[10px] text-slate-400">{formatMessageTime(ts)}</span>
                            {isOwn && m.status === 'sent' && (
                              <span className="flex items-center gap-0.5 text-[10px] font-medium text-blue-500">
                                <CheckCheck className="h-3 w-3" />
                              </span>
                            )}
                            {isOwn && m.status === 'sending' && <span className="text-[10px] text-slate-300">•••</span>}
                            {isOwn && m.status === 'failed' && <span className="text-[10px] text-red-400">Failed</span>}
                          </div>
                        </div>

                        {/* Delete menu */}
                        {isOwn && (
                          <div className="relative self-center ml-1">
                            <button
                              onClick={() => setOpenMessageMenu((prev) => prev === m._id ? null : m._id)}
                              className="opacity-0 group-hover:opacity-100 transition flex h-7 w-7 items-center justify-center rounded-lg hover:bg-slate-200"
                            >
                              <MoreVertical className="h-3.5 w-3.5 text-slate-500" />
                            </button>
                            {openMessageMenu === m._id && (
                              <div className="absolute right-0 top-9 z-20 w-40 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
                                <button
                                  onClick={() => handleDeleteMessage(m._id)}
                                  className="flex w-full items-center gap-2.5 px-4 py-3 text-left text-xs font-semibold text-red-500 transition hover:bg-red-50"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                  Delete message
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Attachment dock */}
            {selectedFiles.length > 0 && (
              <div className="border-t px-4 py-3 bg-white" style={{ borderColor: '#e2e8f0' }}>
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-xs font-bold text-slate-600 uppercase tracking-widest">Attachments</p>
                  <button onClick={() => { selectedFiles.forEach((item) => { if (item.previewUrl) URL.revokeObjectURL(item.previewUrl); }); setSelectedFiles([]); }}
                    className="text-xs font-semibold text-red-400 hover:text-red-600 transition">
                    Clear all
                  </button>
                </div>
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {selectedFiles.map((attachment) => renderAttachmentPreview(attachment))}
                </div>
              </div>
            )}

            {/* Input bar */}
            <div className="border-t bg-white px-4 py-3" style={{ borderColor: '#e2e8f0' }}>
              <div className="flex items-end gap-2">
                <button onClick={() => fileInputRef.current?.click()}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200"
                  style={{ borderColor: '#e2e8f0', color: '#64748b' }}>
                  <Paperclip className="h-4 w-4" />
                </button>

                <div className="flex-1 rounded-2xl border px-4 py-2.5 transition focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100"
                  style={{ backgroundColor: '#f8fafc', borderColor: '#e2e8f0' }}>
                  <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); }
                    }}
                    rows={1}
                    placeholder="Type a message..."
                    className="w-full resize-none bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400 max-h-28"
                    style={{ minHeight: 22 }}
                  />
                  <div className="flex items-center gap-3 mt-2 text-[10px] text-slate-300">
                    <span className="flex items-center gap-1"><ImageIcon className="h-3 w-3" /> Images</span>
                    <span className="flex items-center gap-1"><Film className="h-3 w-3" /> Videos</span>
                    <span className="flex items-center gap-1"><FolderOpen className="h-3 w-3" /> Docs</span>
                  </div>
                </div>

                <button
                  onClick={handleSendMessage}
                  disabled={sending || (!inputText.trim() && selectedFiles.length === 0)}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white shadow-sm transition hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ background: 'linear-gradient(135deg, #1d4ed8, #2563eb)' }}>
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Empty state */
          <div className="hidden flex-1 items-center justify-center md:flex">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm border border-slate-100">
                <MessageSquare className="h-7 w-7 text-slate-400" />
              </div>
              <p className="text-base font-bold text-slate-700">Select a conversation</p>
              <p className="mt-1.5 text-sm text-slate-400">Choose a chat from the left to get started.</p>
            </div>
          </div>
        )}
      </main>

      {/* ── CALL MODAL ── */}
      {activeCall && activeChat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-3xl border border-slate-200 bg-white p-8 shadow-2xl text-center">
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-2xl font-black text-white text-2xl"
              style={{ background: 'linear-gradient(135deg, #1e3a8a, #2563eb)' }}>
              {getInitials(activeChat.project?.name ?? 'C')}
            </div>
            <h3 className="text-xl font-black text-slate-900">{activeChat.project?.name}</h3>
            <p className="mt-1.5 text-sm text-slate-500">{activeCall === 'audio' ? 'Audio' : 'Video'} call</p>

            <div className="mt-8 flex items-center justify-center gap-4">
              <button className="flex h-13 w-13 items-center justify-center rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
                style={{ width: 52, height: 52 }}>
                {activeCall === 'audio' ? <Phone className="h-5 w-5" /> : <Video className="h-5 w-5" />}
              </button>
              <button onClick={handleEndCall}
                className="flex items-center justify-center rounded-full bg-red-500 text-white shadow-lg hover:bg-red-600 transition"
                style={{ width: 60, height: 60 }}>
                <Phone className="h-6 w-6 rotate-[135deg]" />
              </button>
            </div>

            <p className="mt-6 text-xs text-slate-400">Connect WebRTC or a call SDK (Agora, Daily) for live calls.</p>
          </div>
        </div>
      )}
    </div>
  );
}