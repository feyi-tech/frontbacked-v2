import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import Swal from 'sweetalert2';

interface NavItem {
  name: string;
  href: string;
}

const navItemsNoAuth: NavItem[] = [
  { name: 'Themes', href: '/themes' },
  { name: 'For Developers', href: '/theme-documentation' },
  { name: 'About', href: '#' },
  { name: 'Sign In', href: '/login' },
];

const navItemsAuth: NavItem[] = [
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'Themes', href: '/themes' },
  { name: 'For Developers', href: '/theme-documentation' },
  { name: 'About', href: '#' },
]; 

const Navigation = () => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);

  const [navItems, setNavItems] = useState<NavItem[]>([]);
  const { user, logOutAlert } = useAuth();

  useEffect(() => {
    if(user) {
      setNavItems(navItemsAuth);
    } else {
      setNavItems(navItemsNoAuth);
    }
  }, [user]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-primary"></div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              frontbacked
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-foreground hover:text-primary transition-colors duration-200 font-medium"
              >
                {item.name}
              </Link>
            ))}
            {
              user? 
              <Button variant="default" size="sm" onClick={logOutAlert}>
                Sign Out
              </Button>
              :
              <Button variant="default" size="sm" asChild>
                <Link href="/register">Get Started</Link>
              </Button>
            }
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMenu}
              className="p-2"
            >
              {isOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-foreground hover:text-primary transition-colors duration-200 font-medium px-2 py-1"
                  onClick={toggleMenu}
                >
                  {item.name}
                </Link>
              ))}
              {
                user? 
                <Button variant="default" size="sm" className="self-start" onClick={logOutAlert}>
                  Sign Out
                </Button>
                :
                <Button variant="default" size="sm" asChild className="self-start">
                  <Link href="/register">Get Started</Link>
                </Button>
              }
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
