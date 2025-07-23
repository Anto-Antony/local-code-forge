import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useWeddingAuth } from '@/contexts/WeddingAuthContext';
import { Loader2, Heart, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { login, globalIsLoading } = useWeddingAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) {
      onClose();
      setEmail('');
      setPassword('');
      navigate('/');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md glass-card border-0 elegant-shadow">
        <DialogHeader className="text-center">
          <div className="w-16 h-16 bg-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <DialogTitle className="serif-font text-2xl text-gray-800">Admin Login</DialogTitle>
          <DialogDescription className="sans-font text-gray-600">
            Login to edit wedding content and manage the website
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="sans-font text-gray-700 font-medium">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="border-rose-200 focus:border-rose-400 rounded-xl h-12 px-4"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="sans-font text-gray-700 font-medium">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="border-rose-200 focus:border-rose-400 rounded-xl h-12 px-4"
            />
          </div>

          <div className="space-y-3">
            <Button 
              type="submit" 
              className="w-full bg-rose-500 hover:bg-rose-600 transition-colors h-12 text-lg font-medium rounded-xl text-white" 
              disabled={globalIsLoading}
            >
              {globalIsLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Signing In...
                </>
              ) : (
                <>
                  <Heart className="w-5 h-5 mr-2" />
                  Sign In
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
