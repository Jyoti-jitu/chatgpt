'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useChatStore } from '@/store/useChatStore';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, User, Loader2, Command } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import axios from 'axios';

export default function ChatInterface({ chatId }) {
  const { data: session } = useSession();
  const { setCurrentChatId, updateChatTitle } = useChatStore();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const scrollRef = useRef(null);

  useEffect(() => {
    setCurrentChatId(chatId);
    const fetchChat = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(`/api/chat/${chatId}`);
        setMessages(res.data.messages);
      } catch (error) {
        console.error('Failed to fetch chat', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchChat();
  }, [chatId, setCurrentChatId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isSending]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isSending) return;

    const userMessage = { _id: Date.now().toString(), sender: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsSending(true);

    try {
      const res = await axios.post(`/api/chat/${chatId}/message`, {
        content: userMessage.content,
      });

      setMessages((prev) => {
        // Replace optimistic user message with actual and add AI response
        const newMessages = prev.filter(m => m._id !== userMessage._id);
        return [...newMessages, res.data.userMessage, res.data.aiMessage];
      });

      if (res.data.chatTitle) {
        updateChatTitle(chatId, res.data.chatTitle);
      }
    } catch (error) {
      console.error('Failed to send message', error);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(e);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] w-full relative">
      <div className="flex-1 overflow-y-auto px-4 md:px-8 pt-6 pb-4">
        <div className="max-w-4xl mx-auto">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-6">
              <div className="p-5 bg-primary/10 rounded-3xl shadow-inner ring-1 ring-primary/20">
                <Command className="h-10 w-10 text-primary" />
              </div>
              <h2 className="text-3xl font-semibold tracking-tight text-foreground/90">How can I help you today?</h2>
              <p className="text-muted-foreground max-w-md text-lg">
                Send a message to start a conversation with NovaMind.
              </p>
            </div>
          ) : (
            <div className="space-y-8 pb-8 pt-4">
              {messages.map((message) => (
                <div
                  key={message._id}
                  className={`flex gap-4 group ${message.sender === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                >
                  {message.sender === 'ai' && (
                    <Avatar className="h-9 w-9 mt-1 border border-white/5 shadow-sm shrink-0">
                      <AvatarFallback className="bg-primary/10"><Command className="h-5 w-5 text-primary" /></AvatarFallback>
                    </Avatar>
                  )}

                  <div
                    className={`flex-1 ${
                      message.sender === 'user'
                        ? 'max-w-[85%] sm:max-w-[75%] bg-primary text-primary-foreground rounded-3xl rounded-tr-sm px-6 py-4 shadow-sm shadow-primary/20'
                        : 'w-full py-1 prose-p:leading-relaxed prose-pre:bg-muted/50 prose-pre:border prose-pre:border-border'
                    }`}
                  >
                    {message.sender === 'user' ? (
                      <div className="whitespace-pre-wrap text-base">{message.content}</div>
                    ) : (
                      <div className="prose prose-base dark:prose-invert max-w-none break-words w-full">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {message.content}
                        </ReactMarkdown>
                      </div>
                    )}
                  </div>

                  {message.sender === 'user' && (
                    <Avatar className="h-9 w-9 mt-1 border border-white/10 shadow-sm shrink-0">
                      <AvatarImage src={session?.user?.avatar || ''} />
                      <AvatarFallback className="bg-muted text-muted-foreground"><User className="h-5 w-5" /></AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              {isSending && (
                <div className="flex gap-4 justify-start animate-pulse">
                  <Avatar className="h-9 w-9 mt-1 border border-white/5 shadow-sm shrink-0">
                    <AvatarFallback className="bg-primary/10"><Command className="h-5 w-5 text-primary" /></AvatarFallback>
                  </Avatar>
                  <div className="bg-background/80 backdrop-blur-sm border border-white/5 rounded-3xl rounded-tl-sm px-6 py-4 flex items-center justify-center">
                    <div className="flex space-x-1.5">
                      <div className="w-2 h-2 rounded-full bg-primary/50 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 rounded-full bg-primary/50 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 rounded-full bg-primary/50 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={scrollRef} className="h-4" />
            </div>
          )}
        </div>
      </div>

      <div className="shrink-0 p-4 pb-6 bg-gradient-to-t from-background to-transparent z-10 w-full">
        <div className="max-w-4xl mx-auto w-full px-2 md:px-0">
          <form
            onSubmit={handleSend}
            className="relative flex items-center p-2 rounded-3xl border border-white/10 bg-background/90 backdrop-blur-2xl shadow-xl focus-within:ring-2 focus-within:ring-primary/50 transition-shadow duration-300 w-full"
          >
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Message NovaMind..."
              className="flex-1 bg-transparent border-0 resize-none max-h-32 min-h-[52px] px-4 py-3.5 focus:outline-none focus:ring-0 text-base leading-relaxed w-full"
              rows={1}
              disabled={isSending}
            />
            <Button
              type="submit"
              size="icon"
              disabled={!input.trim() || isSending}
              className={`rounded-full h-11 w-11 shrink-0 ml-2 shadow-sm transition-all duration-300 ${input.trim() ? 'bg-primary hover:bg-primary/90 text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
            >
              <Send className="h-5 w-5" />
              <span className="sr-only">Send</span>
            </Button>
          </form>
          <div className="text-center mt-3">
            <p className="text-[11px] text-muted-foreground/80 font-medium">
              Mistakes can happen, so please verify important information.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
