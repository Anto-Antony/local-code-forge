import React, { useState, useEffect } from 'react';
import { Settings, LogOut, Calendar, MapPin, Clock, Flower, Leaf, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EditableText } from './EditableText';
import { EditableImage } from './EditableImage';
import { useWedding } from '@/contexts/WeddingContext';
import { useWeddingAuth } from '@/contexts/WeddingAuthContext';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const HeroSection: React.FC = () => {
  const { weddingData: content, updateWeddingData: updateContent } = useWedding();
  const { isLoggedIn: isAuthenticated, logout } = useWeddingAuth();
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

  const updateHeroField = (field: string, value: string) => {
    if (field === 'date' || field === 'venue') {
      updateContent({
        weddingDetails: {
          ...content.weddingDetails,
          event1: {
            ...content.weddingDetails.event1,
            [field]: value,
          },
        },
      });
    } else {
      updateContent({ couple: { ...content.couple, [field]: value } });
    }
  };

  useEffect(() => {
    const parseDate = (dateStr: string): Date | null => {
      if (!dateStr) return null;
      const parsed = Date.parse(dateStr);
      if (!isNaN(parsed)) return new Date(parsed);
      const fallback = new Date(dateStr);
      return isNaN(fallback.getTime()) ? null : fallback;
    };

    const weddingDate = parseDate(content.weddingDetails.event1.date);
    if (!weddingDate) return;

    const updateCountdown = () => {
      const now = new Date();
      const diff = weddingDate.getTime() - now.getTime();
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [content.weddingDetails.event1.date]);

  return (
    <section className="min-h-screen relative overflow-hidden bg-gradient-to-b from-rose-50 via-rose-25 to-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-rose-100/20"></div>
      
      {/* Floating Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-32 left-20 w-96 h-96 bg-rose-200/40 rounded-full blur-3xl opacity-60"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-rose-200/40 rounded-full blur-3xl opacity-50"></div>
      </div>

      {/* Admin Controls */}
      {isAuthenticated && (
        <div className="absolute top-6 right-6 z-20 flex gap-3">
          <Button
            size="sm"
            className="bg-white/80 backdrop-blur-sm hover:bg-white/90 text-gray-600 border-0 shadow-lg"
            onClick={logout}
            aria-label="Logout"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-8 pt-20">
        <div className="text-center max-w-4xl mx-auto">
          {/* Hero Image with Decorative Circle */}
          <div className="mb-6 relative">
            <div className="relative inline-block">
              <div className="absolute inset-0 rounded-full bg-rose-300/50 blur-xl scale-110"></div>
              {isAuthenticated ? (
                <EditableImage
                  path="couple.image"
                  alt="Wedding couple"
                  className="relative w-48 h-48 md:w-64 md:h-64 object-cover rounded-full mx-auto shadow-2xl ring-4 ring-white/80 ring-offset-4 ring-offset-rose-50"
                />
              ) : (
                <img
                  src={content.couple.image || '/placeholder.svg'}
                  alt="Wedding couple"
                  className="relative w-48 h-48 md:w-64 md:h-64 object-cover rounded-full mx-auto shadow-2xl ring-4 ring-white/80 ring-offset-4 ring-offset-rose-50"
                />
              )}
            </div>
            {/* Decorative text around image */}
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 -translate-y-2 text-xs text-rose-400 font-medium tracking-widest uppercase">
              Our Love
            </div>
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 translate-y-2 text-xs text-rose-400 font-medium tracking-widest uppercase">
              For Ever
            </div>
          </div>

          {/* Names */}
          <div className="mb-6">
            <EditableText
              value={content.couple.brideName}
              onSave={(value) => updateHeroField('brideName', value)}
              className="inline-block"
            >
              <h1 className="font-script text-4xl md:text-6xl lg:text-7xl text-rose-500 tracking-wide">
                {content.couple.brideName}
              </h1>
            </EditableText>
            
            <div className="flex items-center justify-center my-3">
              <div className="w-16 h-px bg-rose-300"></div>
              <div className="mx-4 text-rose-400">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
              </div>
              <div className="w-16 h-px bg-rose-300"></div>
            </div>
            
            <EditableText
              value={content.couple.groomName}
              onSave={(value) => updateHeroField('groomName', value)}
              className="inline-block"
            >
              <h1 className="font-script text-4xl md:text-6xl lg:text-7xl text-rose-500 tracking-wide">
                {content.couple.groomName}
              </h1>
            </EditableText>
          </div>

          {/* Wedding Date */}
          <div className="mb-6">
            <EditableText
              value={content.weddingDetails.event1.date}
              onSave={(value) => updateHeroField('date', value)}
              className="inline-block"
            >
              <p className="text-xl md:text-2xl font-serif text-gray-700 mb-1 tracking-wide">
                {content.weddingDetails.event1.date && new Date(content.weddingDetails.event1.date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </EditableText>
          </div>

          {/* Countdown */}
          {timeLeft && (
            <div className="mb-6">
              <h3 className="text-sm font-serif text-rose-500 mb-3 tracking-widest uppercase">
                Countdown to Forever
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-lg mx-auto">
                {[
                  { value: timeLeft.days, label: 'Days' },
                  { value: timeLeft.hours, label: 'Hours' },
                  { value: timeLeft.minutes, label: 'Minutes' },
                  { value: timeLeft.seconds, label: 'Seconds' }
                ].map((item, index) => (
                  <div key={index} className="bg-white/70 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-rose-100">
                    <div className="text-xl md:text-2xl font-bold text-rose-500 mb-1">
                      {item.value.toString().padStart(2, '0')}
                    </div>
                    <div className="text-xs text-gray-600 font-medium uppercase tracking-wider">
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Venue Location */}
          <div className="mb-8">
            <EditableText
              value={content.weddingDetails.event1.venue}
              onSave={(value) => updateHeroField('venue', value)}
              className="inline-block"
            >
              <p className="text-base md:text-lg text-gray-600 font-medium tracking-wide uppercase">
                {content.weddingDetails.event1.venue}
              </p>
            </EditableText>
          </div>

          {/* Call to Action */}
          <div className="mt-6">
            <Button className="bg-rose-500 hover:bg-rose-600 text-white px-8 py-3 rounded-full text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 tracking-wide">
              Explore Our Journey
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
