'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { useChatStore } from '@/store/useChatStore';
import { Button } from '@/components/ui/button';
import { Plus, MessageSquare, Trash2, Command, Edit2, Check, X } from 'lucide-react';
import axios from 'axios';

export function Sidebar() {
  const { chats, setChats, addChat, removeChat, updateChatTitle } = useChatStore();
  const router = useRouter();
  const params = useParams();
  
  const [editingChatId, setEditingChatId] = useState(null);
  const [editTitle, setEditTitle] = useState('');

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await axios.get('/api/chat');
        setChats(res.data);
      } catch (error) {
        console.error('Failed to fetch chats', error);
      }
    };
    fetchChats();
  }, [setChats]);

  const createNewChat = async () => {
    try {
      const res = await axios.post('/api/chat', { title: 'New Chat' });
      addChat(res.data);
      router.push(`/chat/${res.data._id}`);
    } catch (error) {
      console.error('Failed to create chat', error);
    }
  };

  const deleteChat = async (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await axios.delete(`/api/chat/${id}`);
      removeChat(id);
      if (params.id === id) {
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Failed to delete chat', error);
    }
  };

  const startEditing = (e, chat) => {
    e.preventDefault();
    e.stopPropagation();
    setEditingChatId(chat._id);
    setEditTitle(chat.title);
  };

  const cancelEditing = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setEditingChatId(null);
    setEditTitle('');
  };

  const handleRename = async (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!editTitle.trim() || editTitle === chats.find(c => c._id === id)?.title) {
      setEditingChatId(null);
      return;
    }
    
    try {
      await axios.patch(`/api/chat/${id}`, { title: editTitle });
      updateChatTitle(id, editTitle);
    } catch (error) {
      console.error('Failed to rename chat', error);
    } finally {
      setEditingChatId(null);
    }
  };

  return (
    <div className="hidden md:flex w-[280px] border-r border-white/5 bg-background/40 backdrop-blur-xl flex-col h-full shrink-0 shadow-lg shadow-black/5">
      <Link href="/" className="p-4 flex items-center gap-3 border-b border-white/5 h-16 shrink-0 cursor-pointer group hover:bg-white/5 transition-colors">
        <div className="p-1.5 bg-primary/10 rounded-lg shadow-inner group-hover:bg-primary/20 transition-colors">
          <Command className="h-5 w-5 text-primary" />
        </div>
        <span className="font-bold text-lg tracking-tight text-foreground/90 group-hover:text-primary transition-colors">NovaMind</span>
      </Link>

      <div className="p-4 shrink-0">
        <Button onClick={createNewChat} className="w-full justify-start gap-2 h-11 rounded-xl shadow-md hover:shadow-lg transition-all" variant="default">
          <Plus className="h-4 w-4" />
          <span className="font-medium">New Chat</span>
        </Button>
      </div>
      
      <div className="px-4 pb-2 pt-1 shrink-0">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Your Conversations</h3>
      </div>

      <div className="flex-1 overflow-y-auto px-3">
        <div className="space-y-1 pb-4">
          {chats.map((chat) => {
            const isActive = params.id === chat._id;
            const isEditing = editingChatId === chat._id;

            return (
              <div 
                key={chat._id} 
                onClick={() => !isEditing && router.push(`/chat/${chat._id}`)}
                className={`flex items-center group justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all border border-transparent ${
                  isActive 
                    ? 'bg-primary/10 text-primary border-primary/20 shadow-sm' 
                    : 'hover:bg-white/5 text-muted-foreground hover:text-foreground cursor-pointer'
                }`}
              >
                <div className="flex items-center gap-2.5 overflow-hidden flex-1">
                  <MessageSquare className={`h-4 w-4 shrink-0 ${isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'}`} />
                  
                  {isEditing ? (
                    <input 
                      type="text"
                      autoFocus
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleRename(e, chat._id);
                        if (e.key === 'Escape') cancelEditing(e);
                      }}
                      className="bg-background border border-primary/50 outline-none text-foreground px-2 py-0.5 rounded-md w-full text-xs flex-1"
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    <span className="truncate">{chat.title}</span>
                  )}
                </div>
                
                <div className={`flex items-center gap-1 ${isActive || isEditing ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity ml-2 shrink-0`}>
                  {isEditing ? (
                    <>
                      <button 
                        onClick={(e) => handleRename(e, chat._id)} 
                        className="p-1 hover:bg-green-500/20 hover:text-green-500 text-muted-foreground rounded-md transition-colors"
                        aria-label="Save title"
                      >
                        <Check className="h-3.5 w-3.5" />
                      </button>
                      <button 
                        onClick={cancelEditing} 
                        className="p-1 hover:bg-destructive/10 hover:text-destructive text-muted-foreground rounded-md transition-colors"
                        aria-label="Cancel editing"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </>
                  ) : (
                    <>
                      <button 
                        onClick={(e) => startEditing(e, chat)} 
                        className="p-1 hover:bg-primary/20 hover:text-primary text-muted-foreground rounded-md transition-colors"
                        aria-label="Edit chat"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button 
                        onClick={(e) => deleteChat(e, chat._id)} 
                        className="p-1 hover:bg-destructive/10 hover:text-destructive text-muted-foreground rounded-md transition-colors"
                        aria-label="Delete chat"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
