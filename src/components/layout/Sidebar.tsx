import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import {
  LayoutDashboard,
  Palette,
  Globe,
  Github,
  Settings,
  LogOut,
  Menu,
  ChevronLeft
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const sidebarItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: Palette, label: 'Themes', href: '/themes' },
  { icon: Globe, label: 'Sites', href: '/sites' },
  { icon: Settings, label: 'Domains', href: '/domains' },
];

export const Sidebar = ({ collapsed, setCollapsed }: { collapsed: boolean, setCollapsed: (v: boolean) => void }) => {
  const router = useRouter();
  const { logOutAlert } = useAuth();

  return (
    <div className={cn(
      "flex flex-col h-screen bg-card border-r border-border transition-all duration-300",
      collapsed ? "w-20" : "w-64"
    )}>
      <div className="p-6 flex items-center justify-between">
        {
          !collapsed && 
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-primary"></div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              FrontBacked
            </span>
          </Link>
        }
        <Button variant="ghost" size="icon" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? <Menu className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </Button>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {sidebarItems.map((item) => {
          const isActive = router.pathname.startsWith(item.href);
          return (
            <Link key={item.href} href={item.href}>
              <div className={cn(
                "flex items-center p-3 rounded-lg transition-colors",
                isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-surface hover:text-foreground",
                collapsed && "justify-center"
              )}>
                <item.icon className="h-5 w-5" />
                {!collapsed && <span className="ml-3 font-medium">{item.label}</span>}
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <Button
          variant="ghost"
          className={cn("w-full text-muted-foreground hover:text-destructive hover:bg-destructive/10", collapsed && "px-0")}
          onClick={logOutAlert}
        >
          <LogOut className="h-5 w-5" />
          {!collapsed && <span className="ml-3">Logout</span>}
        </Button>
      </div>
    </div>
  );
};
