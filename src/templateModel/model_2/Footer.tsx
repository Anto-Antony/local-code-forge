
import React from 'react';
import { Heart, Sparkles, Star } from 'lucide-react';
import { useWedding } from '@/contexts/WeddingContext';

export const Footer: React.FC = () => {
  const { weddingData: content } = useWedding();

  // Get first letters of couple's names
  const getInitials = () => {
    const brideInitial = content?.couple?.brideName?.charAt(0)?.toUpperCase() || 'B';
    const groomInitial = content?.couple?.groomName?.charAt(0)?.toUpperCase() || 'G';
    return `${brideInitial} & ${groomInitial}`;
  };
  return (
    <footer className="relative bg-gray-900 text-white py-16 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-8 left-10 animate-sparkle">
          <Sparkles className="w-6 h-6 text-white/10" />
        </div>
        <div className="absolute top-12 right-16 animate-sparkle" style={{ animationDelay: '2s' }}>
          <Star className="w-5 h-5 text-white/10" />
        </div>
        <div className="absolute bottom-8 left-20 animate-sparkle" style={{ animationDelay: '4s' }}>
          <Heart className="w-6 h-6 text-white/10" />
        </div>
      </div>

      <div className="container-width relative z-10">
        <div className="text-center space-y-8">
          {/* Main Logo */}
          <div className="flex items-center justify-center gap-4">
            <div className="w-16 h-16 bg-rose-500 rounded-full flex items-center justify-center elegant-shadow">
              <Heart className="w-8 h-8 text-white animate-heartbeat" />
            </div>
            <div className="script-font text-4xl md:text-5xl text-white">
              {getInitials()}
            </div>
            <div className="w-16 h-16 bg-rose-500 rounded-full flex items-center justify-center elegant-shadow">
              <Heart className="w-8 h-8 text-white animate-heartbeat" style={{ animationDelay: '0.5s' }} />
            </div>
          </div>
          
          {/* Decorative line */}
          <div className="flex items-center justify-center gap-6">
            <div className="w-24 h-px bg-white/40"></div>
            <Sparkles className="w-6 h-6 text-white/60" />
            <div className="w-24 h-px bg-white/40"></div>
          </div>
          
          {/* Thank you message */}
          <div className="max-w-2xl mx-auto">
            <p className="serif-font text-xl md:text-2xl font-light text-white/90 mb-4">
              Thank you for being part of our love story
            </p>
            <p className="sans-font text-white/70 text-lg">
              Your presence and wishes mean the world to us 💕
            </p>
          </div>
          
          {/* Wedding Date */}
          <div className="glass-card rounded-2xl p-6 max-w-md mx-auto">
            <p className="serif-font text-lg text-white/90 mb-2">
              Save the Date
            </p>
            <p className="script-font text-2xl text-white">
              {content.weddingDetails?.event1?.date || 'Date TBA'}
            </p>
          </div>
          
          {/* Copyright */}
          <div className="border-t border-white/20 pt-8">
            <p className="sans-font text-sm text-white/60">
              © 2025 Matson Wedding Websites
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
