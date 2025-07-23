import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { LoginModal } from './LoginModal';
import { useWeddingAuth } from '@/contexts/WeddingAuthContext';
import { useWedding } from '@/contexts/WeddingContext';
import { Heart, Menu, X, LogIn, LogOut, Camera, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Header: React.FC = () => {
  const { isLoggedIn: isAuthenticated, logout } = useWeddingAuth();
  const { weddingData: content } = useWedding();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Get first letters of couple's names
  const getInitials = () => {
    const brideInitial = content?.couple?.brideName?.charAt(0)?.toUpperCase() || 'B';
    const groomInitial = content?.couple?.groomName?.charAt(0)?.toUpperCase() || 'G';
    return `${brideInitial} & ${groomInitial}`;
  };

  const navItems = [
    { label: 'Our Story', href: '#story' },
    { label: 'Schedule', href: '#schedule' },
    { label: 'Reception', href: '#reception' },
    { label: 'Wishes', href: '#wishes' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <>
      <header className="glass-card border-b border-white/20">
        <div className="container-width py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-rose-500 rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-white animate-heartbeat" />
              </div>
              <div className="script-font text-2xl md:text-3xl text-gray-800">
                {getInitials()}
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navItems.map((item) => (
                item.href.startsWith('/') ? (
                  <Link
                    key={item.label}
                    to={item.href}
                    className="sans-font text-gray-700 hover:text-rose-500 transition-colors duration-200 font-medium"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <a
                    key={item.label}
                    href={item.href}
                    className="sans-font text-gray-700 hover:text-rose-500 transition-colors duration-200 font-medium"
                  >
                    {item.label}
                  </a>
                )
              ))}
            </nav>

            {/* Auth Buttons */}
            <div className="hidden lg:flex items-center space-x-4">
              {isAuthenticated && (
                <Link
                  to="/wishes"
                  className="text-gray-700 hover:text-rose-500 transition-colors duration-200 font-medium"
                >
                  <Button variant="ghost" size="sm" className="text-gray-700 hover:text-rose-500">
                    <Settings className="w-4 h-4 mr-2" />
                    Manage Wishes
                  </Button>
                </Link>
              )}
              {isAuthenticated && (
                <Button 
                  onClick={logout} 
                  variant="ghost" 
                  size="sm"
                  className="text-gray-700 hover:text-red-500 hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden text-gray-700 hover:text-rose-500"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </Button>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="lg:hidden mt-4 pb-4 border-t border-white/20 pt-4">
              <nav className="flex flex-col space-y-3">
                {navItems.map((item) => (
                  item.href.startsWith('/') ? (
                    <Link
                      key={item.label}
                      to={item.href}
                      className="sans-font text-gray-700 hover:text-rose-500 transition-colors duration-200 font-medium py-2"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <a
                      key={item.label}
                      href={item.href}
                      className="sans-font text-gray-700 hover:text-rose-500 transition-colors duration-200 font-medium py-2"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.label}
                    </a>
                  )
                ))}
                
                <div className="flex flex-col space-y-2 pt-4 border-t border-white/20">
                  {isAuthenticated && (
                    <Link
                      to="/wishes"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-gray-700 hover:text-rose-500 transition-colors duration-200 font-medium"
                    >
                      <Button variant="ghost" size="sm" className="text-gray-700 hover:text-rose-500 w-full justify-start">
                        <Settings className="w-4 h-4 mr-2" />
                        Manage Wishes
                      </Button>
                    </Link>
                  )}
                  {isAuthenticated && (
                    <Button 
                      onClick={() => {
                        logout();
                        setIsMobileMenuOpen(false);
                      }} 
                      variant="ghost" 
                      size="sm"
                      className="text-gray-700 hover:text-red-500 hover:bg-red-50 w-full justify-start"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </Button>
                  )}
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </>
  );
};
