'use client';

import { useSession, signOut } from 'next-auth/react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from '@/components/ui/dropdown-menu';
import { useTheme } from 'next-themes';
import { Command, LogOut, Settings, Sun, Moon } from 'lucide-react';
import Link from 'next/link';

export function Header() {
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();

  return (
    <header className="h-16 border-b border-white/5 bg-background/60 backdrop-blur-xl flex items-center justify-between px-6 shrink-0 sticky top-0 z-40">
      <Link href="/" className="flex items-center gap-3 cursor-pointer group">
        <div className="p-1.5 bg-primary/10 rounded-lg md:hidden group-hover:bg-primary/20 transition-colors">
          <Command className="h-5 w-5 text-primary" />
        </div>
        <span className="font-semibold text-lg md:hidden tracking-tight group-hover:text-primary transition-colors">NovaMind</span>
      </Link>
      
      <div className="ml-auto flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger className="outline-none ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-full">
            <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
              <Avatar className="h-9 w-9 border border-white/10 shadow-sm">
                <AvatarImage src={session?.user?.avatar || ''} alt={session?.user?.name || 'User'} />
                <AvatarFallback className="bg-primary/10 text-primary font-medium">
                  {session?.user?.name ? session.user.name[0].toUpperCase() : 'U'}
                </AvatarFallback>
              </Avatar>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 rounded-xl border-white/10 shadow-xl">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{session?.user?.name || 'My Account'}</p>
                  <p className="text-xs leading-none text-muted-foreground">{session?.user?.email || ''}</p>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="bg-white/5" />
            <DropdownMenuItem className="cursor-pointer rounded-lg hover:bg-white/5" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
              <Sun className="mr-2 h-4 w-4 hidden dark:block" />
              <Moon className="mr-2 h-4 w-4 block dark:hidden" />
              <span>Toggle Theme</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer rounded-lg hover:bg-white/5">
              <Settings className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer rounded-lg text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => signOut({ callbackUrl: '/login' })}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
