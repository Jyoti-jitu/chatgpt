'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, MessageSquare, Plus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useChatStore } from '@/store/useChatStore';
import axios from 'axios';

export default function Dashboard() {
  const [isCreating, setIsCreating] = useState(false);
  const router = useRouter();
  const { addChat } = useChatStore();

  const handleStartConversation = async () => {
    try {
      setIsCreating(true);
      const res = await axios.post('/api/chat', { title: 'New Chat' });
      addChat(res.data);
      router.push(`/chat/${res.data._id}`);
    } catch (error) {
      console.error('Failed to create chat', error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center overflow-y-auto">
      <div className="max-w-md space-y-6">
        <div className="flex justify-center mb-8">
          <div className="p-4 bg-primary/10 rounded-2xl">
            <Sparkles className="h-12 w-12 text-primary" />
          </div>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome to NovaMind AI</h1>
        <p className="text-muted-foreground text-lg">
          Start a new conversation or select an existing chat from the sidebar to continue exactly where you left off.
        </p>

        <div className="flex justify-center mt-6">
          <Button 
            size="lg" 
            className="rounded-full px-8 h-12 shadow-lg hover:shadow-xl transition-all"
            onClick={handleStartConversation}
            disabled={isCreating}
          >
            {isCreating ? (
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            ) : (
              <Plus className="w-5 h-5 mr-2" />
            )}
            Start a Conversation
          </Button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 pt-8 border-t">
          <div className="flex flex-col items-center p-4 border rounded-xl bg-background/50 hover:bg-background transition-colors">
            <MessageSquare className="h-6 w-6 mb-2 text-muted-foreground" />
            <h3 className="font-medium">Brainstorm Ideas</h3>
            <p className="text-sm text-muted-foreground mt-1">Generate creative concepts and solutions</p>
          </div>
          <div className="flex flex-col items-center p-4 border rounded-xl bg-background/50 hover:bg-background transition-colors">
            <Sparkles className="h-6 w-6 mb-2 text-muted-foreground" />
            <h3 className="font-medium">Analyze Data</h3>
            <p className="text-sm text-muted-foreground mt-1">Extract insights from complex information</p>
          </div>
        </div>
      </div>
    </div>
  );
}
