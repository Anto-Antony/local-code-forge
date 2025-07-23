import React, { useState, useRef, useEffect } from 'react';
import { Heart, Send, Trash2, MessageCircle, User, Clock, Sparkles, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { useWedding } from '@/contexts/WeddingContext';
import { useWeddingAuth } from '@/contexts/WeddingAuthContext';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

const WISH_API_BASE = 'https://kzhbmjygrzjardgruunp.supabase.co/functions/v1';
const USER_ID = import.meta.env.VITE_USER_ID || 'public-user';

// Define Wish type
interface Wish {
  id: string;
  name: string;
  message: string;
  timestamp: number;
}

export const WishesSection: React.FC = () => {
  const { weddingData: content, addWish, setWeddingWishes, saveData } = useWedding();
  const { isLoggedIn: isAuthenticated } = useWeddingAuth();
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Delete wish function
  const handleDeleteWish = async (wishId: string) => {
    try {
      const res = await fetch(`${WISH_API_BASE}/delete-wish`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt6aGJtanlncnpqYXJkZ3J1dW5wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc3NTI5MDMsImV4cCI6MjA2MzMyODkwM30.3Z-xjElKc24Iz6tqSkwsAKpcuFmeAihOqigi3cWtI5g'
        },
        body: JSON.stringify({ user_id: USER_ID, wish_id: wishId })
      });
      
      if (!res.ok) throw new Error('Failed to delete wish');
      
      toast.success('Wish deleted successfully');
      await fetchWishes();
    } catch (error) {
      toast.error('Failed to delete wish');
    }
  };

  // Fetch wishes from edge function
  const fetchWishes = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${WISH_API_BASE}/get-wish`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt6aGJtanlncnpqYXJkZ3J1dW5wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc3NTI5MDMsImV4cCI6MjA2MzMyODkwM30.3Z-xjElKc24Iz6tqSkwsAKpcuFmeAihOqigi3cWtI5g'
        },
        body: JSON.stringify({ user_id: USER_ID })
      });
      const data = await res.json();
      setWishes(Array.isArray(data.wishes) ? data.wishes : []);
    } catch (error) {
      toast.error('Failed to load wishes.');
      setWishes([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWishes();
  }, []);

  // Automatic infinite vertical scroll effect for wishes
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    if (wishes.length < 3) return;

    const startScrolling = () => {
      // Get the height of the first wishes-list
      const wishesList = container.querySelector('.wishes-list') as HTMLElement;
      if (!wishesList) return;
      const listHeight = wishesList.scrollHeight;

      console.log('Starting scroll - List height:', listHeight); // Debug log

      const scrollStep = 1; // Increased step for better visibility
      const scrollDelay = 50; // Adjusted delay

      scrollIntervalRef.current = setInterval(() => {
        if (!container || isPaused) return;
        
        const currentScroll = container.scrollTop;
        
        // Reset scroll position when reaching the middle point (end of first list)
        if (currentScroll >= listHeight) {
          container.scrollTop = 0;
        } else {
          container.scrollTop = currentScroll + scrollStep;
        }
      }, scrollDelay);
    };

    // Clear any existing interval before starting a new one
    if (scrollIntervalRef.current) {
      clearInterval(scrollIntervalRef.current);
    }

    // Start scrolling immediately if not paused, or after a delay if just loaded
    if (isPaused) {
      console.log('Scroll is paused, not starting interval');
    } else {
      const timeoutId = setTimeout(startScrolling, wishes.length > 0 ? 100 : 1500);
      return () => clearTimeout(timeoutId);
    }

    return () => {
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current);
      }
    };
  }, [wishes, isPaused]);

  // Separate effect for mouse events to avoid recreating the scroll interval
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    // Add mouse event listeners to pause/resume scrolling
    const handleMouseEnter = () => {
      console.log('Mouse enter - pausing scroll');
      setIsPaused(true);
    };
    
    const handleMouseLeave = () => {
      console.log('Mouse leave - resuming scroll');
      setIsPaused(false);
    };

    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [wishes]); // Only depend on wishes, not isPaused

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;
    setIsSubmitting(true);
    try {
      const wish = {
        id: Date.now().toString(),
        name: name.trim(),
        message: message.trim(),
        timestamp: Date.now()
      };
      const res = await fetch(`${WISH_API_BASE}/add-wish`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt6aGJtanlncnpqYXJkZ3J1dW5wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc3NTI5MDMsImV4cCI6MjA2MzMyODkwM30.3Z-xjElKc24Iz6tqSkwsAKpcuFmeAihOqigi3cWtI5g'
        },
        body: JSON.stringify({ user_id: USER_ID, wish })
      });
      if (!res.ok) throw new Error('Failed to send wish');
      setName('');
      setMessage('');
      toast.success('Wish sent!');
      await fetchWishes();
    } catch (error) {
      toast.error('Failed to send wish. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <section id="wishes" className="section-padding bg-white relative overflow-hidden">
      {/* Geometric Background Pattern */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full opacity-5">
          <div className="absolute top-20 left-20 w-32 h-32 border-2 border-rose-400 rotate-45"></div>
          <div className="absolute top-40 right-32 w-24 h-24 bg-rose-300 rounded-full"></div>
          <div className="absolute bottom-32 left-40 w-20 h-20 border-2 border-pink-400 rotate-12"></div>
          <div className="absolute bottom-20 right-20 w-28 h-28 bg-purple-300 rounded-full"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 border-2 border-rose-300 rotate-45"></div>
          <div className="absolute top-1/3 right-1/3 w-12 h-12 bg-pink-300 rounded-full"></div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="text-center mb-16">
          <h2 className="serif-font text-4xl md:text-5xl lg:text-6xl font-bold text-rose-500 mb-6">
            Wedding Wishes
          </h2>
          <div className="decorative-border mx-auto mb-8"></div>
          <p className="sans-font text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Share your love and best wishes for our special day
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Wish Form */}
          <div className="space-y-8 animate-slide-in-left">
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 md:p-10 shadow-xl border border-rose-100/50 relative overflow-hidden">
              {/* Decorative corner elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-rose-100/30 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-pink-100/30 to-transparent rounded-full translate-y-12 -translate-x-12"></div>
              
              <div className="relative z-10">
                <div className="text-center mb-8">
                  <div className="relative w-20 h-20 mx-auto mb-6">
                    <div className="w-20 h-20 bg-rose-500 rounded-full flex items-center justify-center shadow-2xl">
                      <MessageCircle className="w-10 h-10 text-white" />
                    </div>
                    <div className="absolute inset-0 bg-rose-500 rounded-full animate-pulse opacity-20"></div>
                  </div>
                  <h3 className="serif-font text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                    Leave a Wish
                  </h3>
                  <p className="sans-font text-gray-600">
                    Your words mean the world to us
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      placeholder="Your beautiful name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="pl-12 border-rose-200 focus:border-rose-400 rounded-2xl h-14 text-lg placeholder:text-gray-400 bg-gray-50 hover:bg-white transition-colors"
                    />
                  </div>

                  <div className="relative">
                    <Textarea
                      placeholder="Share your heartfelt wishes for the happy couple..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                      rows={6}
                      className="border-rose-200 focus:border-rose-400 rounded-2xl p-4 text-lg placeholder:text-gray-400 resize-none bg-gray-50 hover:bg-white transition-colors"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting || !name.trim() || !message.trim()}
                    className="w-full bg-rose-500 hover:bg-rose-600 text-white h-14 text-lg font-medium rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                        Sending...
                      </div>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        Send Wishes
                      </>
                    )}
                  </Button>
                </form>
              </div>

              {/* Decorative dots */}
              <div className="absolute bottom-4 right-4 flex space-x-2">
                <div className="w-2 h-2 bg-rose-300 rounded-full opacity-60"></div>
                <div className="w-2 h-2 bg-pink-300 rounded-full opacity-50"></div>
                <div className="w-2 h-2 bg-purple-300 rounded-full opacity-40"></div>
              </div>
            </div>

            {/* Inspirational Message */}
            <div className="bg-rose-500 text-white rounded-3xl p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-rose-500 to-pink-500 opacity-90"></div>
              <div className="relative z-10 text-center">
                <Heart className="w-10 h-10 mx-auto mb-4 opacity-80" />
                <p className="script-font text-xl font-medium opacity-90">
                  "Your presence is truly the best gift we could ask for!"
                </p>
              </div>
            </div>
          </div>

          {/* Wishes Display */}
          <div className="space-y-6 animate-slide-in-right">
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-rose-100/50 relative overflow-hidden">
              <div className="text-center mb-8">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex-1"></div>
                  <div className="relative w-16 h-16 mx-auto">
                    <div className="w-16 h-16 bg-rose-500 rounded-full flex items-center justify-center shadow-lg">
                      <Sparkles className="w-8 h-8 text-white" />
                    </div>
                    <div className="absolute inset-0 bg-rose-500 rounded-full animate-pulse opacity-20"></div>
                  </div>
                  <div className="flex-1 flex justify-end">
                    {isAuthenticated && (
                      <Link to="/wishes">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-gray-600 hover:text-rose-500 transition-colors"
                        >
                          <Settings className="w-4 h-4 mr-2" />
                          Manage
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
                <h3 className="serif-font text-2xl font-bold text-gray-800 mb-2">
                  Wishes from Our Loved Ones
                </h3>
                <p className="sans-font text-gray-600 text-sm">
                  {wishes.length} {wishes.length === 1 ? 'wish' : 'wishes'} shared with love
                </p>
              </div>

              <div className="space-y-4 max-h-[500px] overflow-hidden pr-2 relative select-none" ref={scrollRef} style={{ touchAction: 'none' }}>
                {/* Scroll indicator */}
                {wishes.length >= 3 && (
                  <div className="absolute top-2 right-2 z-20 bg-white/80 backdrop-blur-sm rounded-full px-3 py-1 text-xs text-gray-500 shadow-sm pointer-events-none">
                    {isPaused ? '⏸️ Paused' : '▶️ Auto-scroll'}
                  </div>
                )}
                {isLoading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading wishes...</p>
                  </div>
                ) : wishes.length === 0 ? (
                  <div className="text-center py-12">
                    <Heart className="w-16 h-16 text-rose-300 mx-auto mb-6" />
                    <h4 className="serif-font text-xl font-semibold text-gray-800 mb-2">
                      No wishes yet
                    </h4>
                    <p className="text-gray-600">
                      Be the first to share your love!
                    </p>
                  </div>
                ) : (
                  // Render wishes list twice for seamless infinite scroll
                  <div className="pointer-events-none">
                    <div className="wishes-list space-y-4">
                      {wishes.map((wish, index) => (
                        <div
                          key={wish.id}
                          className="bg-gray-50 rounded-2xl p-6 border border-gray-100 relative select-none"
                        >
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-rose-500 rounded-full flex items-center justify-center shadow-md">
                                <Heart className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <p className="serif-font text-lg font-semibold text-gray-800">{wish.name}</p>
                                <div className="flex items-center text-xs text-gray-500">
                                  <Clock className="w-3 h-3 mr-1" />
                                  {formatDate(wish.timestamp)}
                                </div>
                              </div>
                            </div>
                            {isAuthenticated && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteWish(wish.id)}
                                className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-gray-400 hover:text-red-500 w-8 h-8 p-0 rounded-full pointer-events-auto"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                          <p className="sans-font text-gray-700 leading-relaxed italic">
                            "{wish.message}"
                          </p>
                          <div className="absolute bottom-2 right-2 w-4 h-4 bg-rose-100 rounded-full opacity-40"></div>
                        </div>
                      ))}
                    </div>
                    {/* Duplicate list for infinite scroll effect */}
                    <div className="wishes-list space-y-4">
                      {wishes.map((wish, index) => (
                        <div
                          key={wish.id + '-dup'}
                          className="bg-gray-50 rounded-2xl p-6 border border-gray-100 relative select-none"
                        >
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-rose-500 rounded-full flex items-center justify-center shadow-md">
                                <Heart className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <p className="serif-font text-lg font-semibold text-gray-800">{wish.name}</p>
                                <div className="flex items-center text-xs text-gray-500">
                                  <Clock className="w-3 h-3 mr-1" />
                                  {formatDate(wish.timestamp)}
                                </div>
                              </div>
                            </div>
                            {isAuthenticated && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteWish(wish.id)}
                                className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-gray-400 hover:text-red-500 w-8 h-8 p-0 rounded-full pointer-events-auto"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                          <p className="sans-font text-gray-700 leading-relaxed italic">
                            "{wish.message}"
                          </p>
                          <div className="absolute bottom-2 right-2 w-4 h-4 bg-rose-100 rounded-full opacity-40"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Message */}
        <div className="mt-20 text-center">
          <div className="inline-flex items-center space-x-4 bg-white/80 backdrop-blur-sm rounded-full px-8 py-4 shadow-lg border border-rose-100">
            <Heart className="w-6 h-6 text-rose-500" />
            <p className="script-font text-xl text-gray-700">Every wish fills our hearts with joy</p>
            <Heart className="w-6 h-6 text-rose-500" />
          </div>
        </div>
      </div>
    </section>
  );
};
