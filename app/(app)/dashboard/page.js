import { Sparkles, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Dashboard() {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center overflow-y-auto">
      <div className="max-w-md space-y-6">
        <div className="flex justify-center mb-8">
          <div className="p-4 bg-primary/10 rounded-2xl">
            <Sparkles className="h-12 w-12 text-primary" />
          </div>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome to Antigravity AI</h1>
        <p className="text-muted-foreground text-lg">
          Start a new conversation or select an existing chat from the sidebar to continue exactly where you left off.
        </p>
        
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
