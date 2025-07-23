import React from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, Star, Heart, Diamond, ArrowRight, Award } from 'lucide-react';

export const OurJewelPartner: React.FC = () => {
  return (
    <section className="section-padding bg-white relative overflow-hidden">
      {/* Geometric Background Pattern */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full opacity-5">
          <div className="absolute top-20 left-20 w-32 h-32 border-2 border-rose-400 rotate-45"></div>
          <div className="absolute top-40 right-32 w-24 h-24 bg-rose-300 rounded-full"></div>
          <div className="absolute bottom-32 left-40 w-20 h-20 border-2 border-rose-400 rotate-12"></div>
          <div className="absolute bottom-20 right-20 w-28 h-28 bg-rose-300 rounded-full"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 border-2 border-rose-300 rotate-45"></div>
          <div className="absolute top-1/3 right-1/3 w-12 h-12 bg-rose-300 rounded-full"></div>
          <div className="absolute bottom-1/4 left-1/3 w-8 h-8 border-2 border-rose-200 rotate-45"></div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="text-center mb-16">
          <h2 className="serif-font text-4xl md:text-5xl lg:text-6xl font-bold text-rose-500 mb-6">
            Our Trusted Jeweller
          </h2>
          <div className="decorative-border mx-auto mb-8"></div>
          <p className="sans-font text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover exquisite wedding rings and jewellery collections from our trusted partner,
            crafted with love and precision for your special day.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-xl border border-rose-100/50 relative overflow-hidden">
            {/* Decorative corner elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-100 rounded-full -translate-y-16 translate-x-16 opacity-60"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-rose-100 rounded-full translate-y-12 -translate-x-12 opacity-40"></div>
            
            <div className="relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Image Section */}
                <div className="order-2 lg:order-1">
                  <div className="relative group">
                    <img
                      src="/jeweller.jpg"
                      alt="Joy in Every Jewel - Edimannickal Gold and Diamonds"
                      className="w-full h-auto rounded-2xl shadow-2xl object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    {/* Decorative frame */}
                    <div className="absolute -top-4 -left-4 w-16 h-16 border-2 border-rose-300 rounded-full opacity-60"></div>
                    <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-rose-300 rounded-full opacity-40"></div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="order-1 lg:order-2 text-center lg:text-left">
                  <div className="mb-8">
                    <div className="inline-flex items-center bg-rose-100 rounded-full px-4 py-2 mb-4">
                      <Award className="w-5 h-5 text-rose-600 mr-2" />
                      <span className="text-rose-700 font-medium sans-font">Premium Partner</span>
                    </div>
                    
                    <h3 className="serif-font text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                      Edimannickal Gold and Diamonds
                    </h3>
                    
                    <p className="sans-font text-lg text-gray-600 leading-relaxed mb-8">
                      Creating timeless pieces that symbolize eternal love. From classic wedding bands 
                      to custom engagement rings, every piece is crafted with exceptional attention to detail.
                    </p>
                  </div>

                  {/* Features */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-rose-500 rounded-full flex items-center justify-center">
                        <Diamond className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-gray-700 sans-font">Premium Quality</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-rose-500 rounded-full flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-gray-700 sans-font">Custom Designs</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-rose-500 rounded-full flex items-center justify-center">
                        <Heart className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-gray-700 sans-font">Lifetime Warranty</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-rose-500 rounded-full flex items-center justify-center">
                        <Star className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-gray-700 sans-font">Expert Craftsmanship</span>
                    </div>
                  </div>

                  {/* Call to Action */}
                  <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                    <Button
                      asChild
                      className="bg-rose-500 hover:bg-rose-600 text-white px-8 py-3 rounded-full text-lg shadow-lg font-medium transition-all duration-300 hover:shadow-xl"
                    >
                      <a href="https://www.examplejewelpartner.com" target="_blank" rel="noopener noreferrer">
                        <Diamond className="w-5 h-5 mr-2" />
                        Visit Store
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </a>
                    </Button>
                    
                    <Button
                      variant="outline"
                      className="border-rose-300 text-rose-700 hover:bg-rose-50 px-8 py-3 rounded-full text-lg font-medium"
                    >
                      <Heart className="w-5 h-5 mr-2" />
                      View Collection
                    </Button>
                  </div>
                </div>
              </div>

              {/* Decorative dots */}
              <div className="absolute bottom-4 right-4 flex space-x-2">
                <div className="w-2 h-2 bg-rose-500 rounded-full opacity-60"></div>
                <div className="w-2 h-2 bg-rose-500 rounded-full opacity-50"></div>
                <div className="w-2 h-2 bg-rose-500 rounded-full opacity-40"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}; 