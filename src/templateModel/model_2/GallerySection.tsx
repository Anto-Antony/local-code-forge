import React, { useState } from 'react';
import { Plus, X, ArrowRight, Camera, Images, Eye, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWeddingAuth } from '@/contexts/WeddingAuthContext';
import { useWedding } from '@/contexts/WeddingContext';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

export const GallerySection: React.FC = () => {
  const { isLoggedIn: isAuthenticated } = useWeddingAuth();
  const { weddingData: content } = useWedding();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Get the first 3 photos from the gallery
  const displayPhotos = Array.isArray(content.gallery) ? content.gallery.slice(0, 3) : [];

  return (
    <section id="gallery" className="section-padding bg-white relative overflow-hidden">
      {/* Geometric Background Pattern */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full opacity-5">
          <div className="absolute top-20 left-20 w-32 h-32 border-2 border-rose-400 rotate-45"></div>
          <div className="absolute top-40 right-32 w-24 h-24 bg-rose-300 rounded-full"></div>
          <div className="absolute bottom-32 left-40 w-20 h-20 border-2 border-pink-400 rotate-12"></div>
          <div className="absolute bottom-20 right-20 w-28 h-28 bg-purple-300 rounded-full"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 border-2 border-rose-300 rotate-45"></div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="text-center mb-16">
          <h2 className="serif-font text-4xl md:text-5xl lg:text-6xl font-bold text-rose-500 mb-6">
            Gallery
          </h2>
          <div className="decorative-border mx-auto mb-8"></div>
          <p className="sans-font text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Capturing the beautiful moments of our journey together
          </p>
        </div>

        {/* Modern Gallery Grid */}
        <div className="max-w-6xl mx-auto">
          {displayPhotos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayPhotos.map((photo, index) => (
                <div
                  key={photo.id}
                  className="group relative animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div className="relative overflow-hidden rounded-3xl bg-white shadow-xl border border-rose-100/50 hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] hover:border-rose-200">
                    {/* Image Container */}
                    <div className="relative aspect-square overflow-hidden">
                      <img
                        src={photo.url}
                        alt={photo.caption || `Gallery image ${index + 1}`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      {/* Hover Controls */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <Button
                          variant="ghost"
                          size="lg"
                          className="w-16 h-16 rounded-full bg-white/90 hover:bg-white text-rose-500 hover:text-rose-600 shadow-lg"
                          onClick={() => setSelectedImage(photo.url)}
                        >
                          <Eye className="w-8 h-8" />
                        </Button>
                      </div>
                    </div>

                    {/* Decorative corner elements */}
                    <div className="absolute top-4 right-4 w-6 h-6 bg-rose-100 rounded-full opacity-60"></div>
                    <div className="absolute bottom-4 left-4 w-4 h-4 bg-pink-100 rounded-full opacity-40"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-12 shadow-xl border border-rose-100/50 max-w-md mx-auto">
                <div className="relative w-24 h-24 mx-auto mb-8">
                  <div className="w-24 h-24 bg-rose-500 rounded-full flex items-center justify-center shadow-2xl">
                    <Images className="w-12 h-12 text-white" />
                  </div>
                  <div className="absolute inset-0 bg-rose-500 rounded-full animate-pulse opacity-20"></div>
                </div>
                <h3 className="serif-font text-2xl font-semibold text-gray-800 mb-4">
                  Gallery Coming Soon
                </h3>
                <p className="sans-font text-gray-600 leading-relaxed">
                  We're preparing beautiful memories to share with you. Check back soon!
                </p>
              </div>
            </div>
          )}
        </div>

        {/* View Full Gallery Button */}
        {displayPhotos.length > 0 && (
          <div className="text-center mt-16">
            <Link to="/gallery">
              <Button className="bg-rose-500 hover:bg-rose-600 text-white px-12 py-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 text-lg font-medium group">
                <Images className="w-6 h-6 mr-3" />
                View Full Gallery
                <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        )}

        {/* Bottom Message */}
        <div className="mt-20 text-center">
          <div className="inline-flex items-center space-x-4 bg-white/80 backdrop-blur-sm rounded-full px-8 py-4 shadow-lg border border-rose-100">
            <Heart className="w-6 h-6 text-rose-500" />
            <p className="script-font text-xl text-gray-700">Every picture tells our story</p>
            <Heart className="w-6 h-6 text-rose-500" />
          </div>
        </div>

        {/* Enhanced Lightbox Modal */}
        {selectedImage && (
          <div
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm"
            onClick={() => setSelectedImage(null)}
          >
            <div className="relative max-w-4xl max-h-full">
              <div className="relative bg-white rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src={selectedImage}
                  alt="Gallery image"
                  className="max-w-full max-h-[80vh] object-contain"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-gray-600 hover:text-gray-800 shadow-lg"
                  onClick={() => setSelectedImage(null)}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
