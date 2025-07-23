import React from 'react';
import { EditableText } from './EditableText';
import { useWedding } from '@/contexts/WeddingContext';
import { useWeddingAuth } from '@/contexts/WeddingAuthContext';
import { EditableImage } from './EditableImage';
import { Heart, Sparkles, Star } from 'lucide-react';

export const LoveStorySection: React.FC = () => {
  const { weddingData: content, updateWeddingData: updateContent } = useWedding();
  const { isLoggedIn: isAuthenticated } = useWeddingAuth();

  const updateStoryField = (field: string, value: string) => {
    updateContent({ story: { ...content.story, [field]: value } });
  };

  return (
    <section id="story" className="min-h-screen py-20 bg-gradient-to-b from-rose-50 via-rose-25 to-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-rose-100/20"></div>
      
      {/* Floating decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-32 left-20 w-96 h-96 bg-rose-200/40 rounded-full blur-3xl opacity-60"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-rose-200/40 rounded-full blur-3xl opacity-50"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Text Content */}
          <div className="space-y-8">
            <div className="text-center lg:text-left">
              <EditableText
                value={content.story.title}
                onSave={(value) => updateStoryField('title', value)}
                className="inline-block"
              >
                <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-rose-500 mb-6">
                  {content.story.title}
                </h2>
              </EditableText>
              <div className="w-24 h-px bg-rose-300 mb-8 mx-auto lg:mx-0"></div>
            </div>

            <EditableText
              value={content.story.content}
              onSave={(value) => updateStoryField('content', value)}
              multiline
              className="block"
              editClassName="text-lg"
            >
              <div className="prose prose-lg max-w-none">
                <p className="text-lg leading-relaxed text-gray-700 mb-6">
                  {content.story.content}
                </p>
              </div>
            </EditableText>

            {/* Elegant decorative element */}
            <div className="flex items-center justify-center lg:justify-start gap-6 pt-6">
              <div className="w-16 h-px bg-gradient-to-r from-transparent via-rose-300 to-transparent"></div>
              <Heart className="w-6 h-6 text-rose-400 animate-pulse" />
              <div className="w-16 h-px bg-gradient-to-r from-transparent via-rose-300 to-transparent"></div>
            </div>
          </div>

          {/* Image */}
          <div className="relative group">
            <div className="relative overflow-hidden rounded-3xl shadow-2xl">
              {isAuthenticated ? (
                <EditableImage
                  path="story.image"
                  alt="Love Story"
                  className="w-full h-[500px] md:h-[600px] object-cover transition-transform duration-500 hover:scale-105"
                />
              ) : (
                <>
                  <img
                    src={content.story.image || '/placeholder.svg'}
                    alt="Love Story"
                    className="w-full h-[500px] md:h-[600px] object-cover transition-transform duration-500 hover:scale-105"
                  />
                  
                  {/* Elegant overlay - only for non-authenticated users */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                  
                  {/* Elegant corner decorations - only for non-authenticated users */}
                  <div className="absolute top-4 left-4 w-12 h-12 border-l-2 border-t-2 border-white/60 rounded-tl-lg"></div>
                  <div className="absolute top-4 right-4 w-12 h-12 border-r-2 border-t-2 border-white/60 rounded-tr-lg"></div>
                  <div className="absolute bottom-4 left-4 w-12 h-12 border-l-2 border-b-2 border-white/60 rounded-bl-lg"></div>
                  <div className="absolute bottom-4 right-4 w-12 h-12 border-r-2 border-b-2 border-white/60 rounded-br-lg"></div>
                  
                  {/* Floating hearts overlay - only for non-authenticated users */}
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-6 right-6 animate-pulse">
                      <Heart className="w-5 h-5 text-white/40" />
                    </div>
                    <div className="absolute bottom-6 left-6 animate-pulse" style={{ animationDelay: '1s' }}>
                      <Heart className="w-4 h-4 text-white/40" />
                    </div>
                  </div>
                </>
              )}
            </div>
            
            {/* Floating decorative frame */}
            <div className="absolute -top-4 -right-4 w-24 h-24 border-2 border-rose-200/50 rounded-full"></div>
            <div className="absolute -bottom-4 -left-4 w-32 h-32 border-2 border-purple-200/40 rounded-full"></div>
          </div>
        </div>
      </div>
    </section>
  );
};
