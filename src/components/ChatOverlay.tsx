import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Send, X, Shield, Headset } from 'lucide-react';
import { db, auth } from '../lib/firebase';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, where, limit, setDoc, doc, updateDoc } from 'firebase/firestore';
import { useAuth } from './AuthContext';

interface Message {
  id: string;
  text: string;
  senderId: string;
  senderName: string;
  createdAt: any;
  isAdmin: boolean;
}

interface ChatOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  context?: string; // e.g., "Inquiry about [Vendor Name]"
}

export default function ChatOverlay({ isOpen, onClose, context }: ChatOverlayProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen || !user) return;

    // We use a "support_chats" collection or similar. 
    // Each user has a unique chat thread with admin.
    const chatPath = `support_threads/${user.uid}/messages`;
    const q = query(collection(db, chatPath), orderBy('createdAt', 'asc'), limit(50));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Message)));
      setTimeout(() => scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight), 100);
    }, (error) => {
      console.error("Chat Error:", error);
    });

    return () => unsubscribe();
  }, [isOpen, user]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    setLoading(true);
    try {
      const chatPath = `support_threads/${user.uid}/messages`;
      const threadPath = `support_threads/${user.uid}`;
      
      // Ensure the thread document exists for admin listing
      await updateDoc(doc(db, "support_threads", user.uid), {
        lastMessage: newMessage,
        lastUpdated: serverTimestamp(),
        userName: user.displayName || user.email || 'User',
        userId: user.uid,
        email: user.email
      }).catch(async (err) => {
        // If it doesn't exist, set it
        await setDoc(doc(db, "support_threads", user.uid), {
          lastMessage: newMessage,
          lastUpdated: serverTimestamp(),
          userName: user.displayName || user.email || 'User',
          userId: user.uid,
          email: user.email
        });
      });

      await addDoc(collection(db, chatPath), {
        text: context ? `[${context}] ${newMessage}` : newMessage,
        senderId: user.uid,
        senderName: user.displayName || user.email || 'User',
        createdAt: serverTimestamp(),
        isAdmin: false
      });

      setNewMessage('');
    } catch (err) {
      console.error("Failed to send message:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="fixed inset-x-3 bottom-3 top-auto h-[min(620px,calc(100dvh-1.5rem))] sm:inset-auto sm:bottom-8 sm:right-8 sm:w-[400px] sm:h-[600px] bg-white rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl shadow-navy/20 flex flex-col overflow-hidden z-[100] border border-navy/5"
        >
          {/* Header */}
          <div className="bg-navy p-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-red flex items-center justify-center">
                <Headset className="text-white w-5 h-5" />
              </div>
              <div>
                <p className="text-white font-bold text-sm">Alliance Concierge</p>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <p className="text-white/50 text-[10px] uppercase tracking-widest">Admin Online</p>
                </div>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors shrink-0"
            >
              <X className="text-white w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-bg/30"
          >
            {messages.length === 0 && (
              <div className="text-center py-12">
                <Shield className="w-12 h-12 text-navy/10 mx-auto mb-4" />
                <p className="text-navy/40 text-sm font-medium">Your conversation is secure and encrypted.</p>
                <p className="text-[10px] text-navy/20 uppercase tracking-widest mt-2">How can we assist you today?</p>
              </div>
            )}
            
            {messages.map((msg) => (
              <div 
                key={msg.id}
                className={`flex ${msg.isAdmin ? 'justify-start' : 'justify-end'}`}
              >
                <div className={`max-w-[80%] p-4 rounded-2xl text-sm ${
                  msg.isAdmin 
                    ? 'bg-white text-navy shadow-sm' 
                    : 'bg-brand-red text-white'
                }`}>
                  <p>{msg.text}</p>
                  <p className={`text-[8px] mt-1 uppercase tracking-tighter ${
                    msg.isAdmin ? 'text-navy/40' : 'text-white/40'
                  }`}>
                    {msg.senderName}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="p-4 bg-white border-t border-navy/5">
            <div className="relative">
              <input 
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="w-full bg-slate-bg rounded-2xl py-4 pl-5 pr-14 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-red/20 transition-all"
              />
              <button 
                type="submit"
                disabled={loading || !newMessage.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-brand-red text-white rounded-xl flex items-center justify-center hover:bg-navy transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <p className="text-center text-[8px] text-navy/20 uppercase tracking-widest mt-3 font-bold">
              Typically responds within 2 hours
            </p>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
