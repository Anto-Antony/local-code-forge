import React, { useState } from 'react';
import { MapPin, Shirt, Car, Info, ArrowRight, CheckCircle, Building, Navigation, Palette, Users, Clock, Gift, Music, Camera, Heart, Star, Sparkles, Home, Coffee, Utensils } from 'lucide-react';
import { EditableText } from './EditableText';
import { useWedding } from '@/contexts/WeddingContext';
import { useWeddingAuth } from '@/contexts/WeddingAuthContext';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export const AboutSection: React.FC = () => {
  const { weddingData: content, updateWeddingData: updateContent } = useWedding();
  const { isLoggedIn: isAuthenticated } = useWeddingAuth();
  const [selectedSection, setSelectedSection] = useState<string | null>(null);

  // Available icons for each section
  const iconOptions = {
    venue: [
      { icon: MapPin, name: 'Map Pin' },
      { icon: Building, name: 'Building' },
      { icon: Navigation, name: 'Navigation' },
      { icon: Home, name: 'Home' },
      { icon: Coffee, name: 'Coffee' },
      { icon: Utensils, name: 'Restaurant' }
    ],
    dressCode: [
      { icon: Shirt, name: 'Shirt' },
      { icon: Palette, name: 'Palette' },
      { icon: Users, name: 'Users' },
      { icon: Star, name: 'Star' },
      { icon: Sparkles, name: 'Sparkles' },
      { icon: Heart, name: 'Heart' }
    ],
    parking: [
      { icon: Car, name: 'Car' },
      { icon: Navigation, name: 'Navigation' },
      { icon: MapPin, name: 'Map Pin' },
      { icon: Clock, name: 'Clock' },
      { icon: Info, name: 'Info' },
      { icon: Building, name: 'Building' }
    ]
  };

  // Get stored icon names or default icons (store in weddingDetails)
  const getStoredIcon = (sectionKey: string, defaultIcon: React.ComponentType<{ className?: string }>) => {
    const iconName = (content.weddingDetails as any)[`${sectionKey}Icon`];
    if (iconName) {
      const iconSet = iconOptions[sectionKey as keyof typeof iconOptions];
      const foundIcon = iconSet.find(opt => opt.name === iconName);
      return foundIcon ? foundIcon.icon : defaultIcon;
    }
    return defaultIcon;
  };

  const handleIconSelect = (sectionKey: string, iconName: string) => {
    updateContent({
      weddingDetails: {
        ...content.weddingDetails,
        [`${sectionKey}Icon`]: iconName,
      },
    });
    setSelectedSection(null);
  };

  const sections = [
    {
      key: 'venue',
      icon: getStoredIcon('venue', MapPin),
      title: content.weddingDetails.event1?.title || 'Reception Venue',
      content: content.weddingDetails.event1?.venue || ''
    },
    {
      key: 'dressCode',
      icon: getStoredIcon('dressCode', Shirt),
      title: content.weddingDetails.toKnow2?.title || 'Dress Code',
      content: content.weddingDetails.toKnow2?.description || ''
    },
    {
      key: 'parking',
      icon: getStoredIcon('parking', Car),
      title: content.weddingDetails.toKnow3?.title || 'Parking & Directions',
      content: content.weddingDetails.toKnow3?.description || ''
    }
  ];

  return (
    <section id="reception" className="section-padding bg-white relative overflow-hidden">
      {/* Geometric Background Pattern */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full opacity-5">
          <div className="absolute top-20 left-20 w-32 h-32 border-2 border-rose-400 rotate-45"></div>
          <div className="absolute top-40 right-32 w-24 h-24 bg-rose-300 rounded-full"></div>
          <div className="absolute bottom-32 left-40 w-20 h-20 border-2 border-pink-400 rotate-12"></div>
          <div className="absolute bottom-20 right-20 w-28 h-28 bg-purple-300 rounded-full"></div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="text-center mb-16">
          <h2 className="serif-font text-4xl md:text-5xl lg:text-6xl font-bold text-rose-500 mb-6">
            Reception Details
          </h2>
          <div className="decorative-border mx-auto mb-8"></div>
          <p className="sans-font text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Important information for our celebration
          </p>
        </div>

        {/* Modern Card Layout */}
        <div className="max-w-6xl mx-auto space-y-8">
          {sections.map((section, index) => (
            <div
              key={section.key}
              className={`flex flex-col lg:flex-row items-center gap-8 lg:gap-16 ${
                index % 2 === 1 ? 'lg:flex-row-reverse' : ''
              } animate-fade-in-up`}
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              {/* Icon Section */}
              <div className="flex-shrink-0">
                <div className="relative">
                  <div className="w-32 h-32 bg-rose-500 rounded-2xl flex items-center justify-center shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-300">
                    <section.icon className="w-16 h-16 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-pink-400 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  
                  {/* Icon Selection Button for Authenticated Users */}
                  {isAuthenticated && (
                    <Dialog open={selectedSection === section.key} onOpenChange={(open) => setSelectedSection(open ? section.key : null)}>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="absolute -bottom-2 -left-2 w-8 h-8 p-0 bg-white hover:bg-gray-50 border-2 border-gray-300 rounded-full"
                        >
                          <Palette className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>Choose Icon for {section.title}</DialogTitle>
                        </DialogHeader>
                        <div className="grid grid-cols-3 gap-4 py-4">
                          {iconOptions[section.key as keyof typeof iconOptions].map((option) => (
                            <Button
                              key={option.name}
                              variant="outline"
                              className="h-16 flex flex-col items-center justify-center space-y-2 hover:bg-rose-50 hover:border-rose-300"
                              onClick={() => handleIconSelect(section.key, option.name)}
                            >
                              <option.icon className="w-6 h-6" />
                              <span className="text-xs">{option.name}</span>
                            </Button>
                          ))}
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              </div>

              {/* Content Section */}
              <div className="flex-1 text-center lg:text-left">
                <EditableText
                  value={section.title}
                  onSave={(value) => {
                    if (section.key === 'venue') {
                      updateContent({
                        weddingDetails: {
                          ...content.weddingDetails,
                          event1: {
                            ...content.weddingDetails.event1,
                            title: value,
                          },
                        },
                      });
                    } else if (section.key === 'dressCode') {
                      updateContent({
                        weddingDetails: {
                          ...content.weddingDetails,
                          toKnow2: {
                            ...content.weddingDetails.toKnow2,
                            title: value,
                          },
                        },
                      });
                    } else if (section.key === 'parking') {
                      updateContent({
                        weddingDetails: {
                          ...content.weddingDetails,
                          toKnow3: {
                            ...content.weddingDetails.toKnow3,
                            title: value,
                          },
                        },
                      });
                    }
                  }}
                  className="block"
                  editClassName="serif-font text-3xl text-gray-800"
                >
                  <h3 className="serif-font text-3xl md:text-4xl font-bold text-gray-800 mb-6 flex items-center justify-center lg:justify-start">
                    {section.title}
                    <ArrowRight className="w-6 h-6 ml-3 text-rose-500" />
                  </h3>
                </EditableText>

                <EditableText
                  value={section.content}
                  onSave={(value) => {
                    if (section.key === 'venue') {
                      updateContent({
                        weddingDetails: {
                          ...content.weddingDetails,
                          event1: {
                            ...content.weddingDetails.event1,
                            venue: value,
                          },
                        },
                      });
                    } else if (section.key === 'dressCode') {
                      updateContent({
                        weddingDetails: {
                          ...content.weddingDetails,
                          toKnow2: {
                            ...content.weddingDetails.toKnow2,
                            description: value,
                          },
                        },
                      });
                    } else if (section.key === 'parking') {
                      updateContent({
                        weddingDetails: {
                          ...content.weddingDetails,
                          toKnow3: {
                            ...content.weddingDetails.toKnow3,
                            description: value,
                          },
                        },
                      });
                    }
                  }}
                  multiline
                  className="block"
                  editClassName="sans-font text-lg"
                >
                  <div className="bg-gray-50 rounded-xl p-8 border-l-4 border-rose-500 shadow-sm">
                    <p className="sans-font text-gray-700 leading-relaxed text-lg">
                      {section.content}
                    </p>
                  </div>
                </EditableText>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action Section */}
        <div className="mt-24 text-center">
          <div className="bg-rose-500 text-white rounded-3xl p-12 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-rose-500 to-pink-500 opacity-90"></div>
            <div className="relative z-10">
              <Info className="w-12 h-12 mx-auto mb-6 opacity-80" />
              <h3 className="serif-font text-2xl md:text-3xl font-bold mb-4">
                Questions?
              </h3>
              <p className="sans-font text-lg opacity-90 max-w-2xl mx-auto">
                If you have any questions about the venue, dress code, or directions, please don't hesitate to reach out to us.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
