import React from 'react';
import { useWedding } from '@/contexts/WeddingContext';
import { useWeddingAuth } from '@/contexts/WeddingAuthContext';
import { EditableText } from './EditableText';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, Clock, Bell, Music, Utensils, Loader2, Heart, Calendar, MapPin, Sparkles, Star } from 'lucide-react';

export const ScheduleSection: React.FC = () => {
  const { weddingData: content, updateWeddingData: updateContent, globalIsLoading: isLoading } = useWedding();
  const { isLoggedIn: isAuthenticated } = useWeddingAuth();

  // Add a new event to the schedule
  const handleAddEvent = () => {
    const newEvent = {
      id: Date.now().toString(),
      time: '12:00 PM',
      event: 'New Event',
      description: '',
    };
    updateContent({ schedule: [...content.schedule, newEvent] });
  };

  // Delete an event by index
  const handleDeleteEvent = (index: number) => {
    const updated = [...content.schedule];
    updated.splice(index, 1);
    updateContent({ schedule: updated });
  };

  // Get icon for event name
  const getEventIcon = (eventName: string) => {
    const lowerEvent = eventName.toLowerCase();
    if (lowerEvent.includes('ceremony')) return <Bell className="w-5 h-5" />;
    if (lowerEvent.includes('dinner') || lowerEvent.includes('meal')) return <Utensils className="w-5 h-5" />;
    if (lowerEvent.includes('reception') || lowerEvent.includes('party') || lowerEvent.includes('dance')) return <Music className="w-5 h-5" />;
    if (lowerEvent.includes('cocktail')) return <Utensils className="w-5 h-5" />;
    return <Clock className="w-5 h-5" />;
  };

  if (isLoading) {
    return (
      <section className="flex items-center justify-center min-h-[300px]">
        <Loader2 className="w-8 h-8 animate-spin text-rose-600" />
        <span className="ml-3 text-rose-700 serif-font text-lg">Loading schedule...</span>
      </section>
    );
  }

  return (
    <section id="schedule" className="section-padding bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 relative overflow-hidden">
      {/* Floating decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-rose-200 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-purple-200 rounded-full blur-3xl opacity-15"></div>
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-pink-200 rounded-full blur-3xl opacity-25"></div>
        <div className="absolute bottom-1/3 left-1/4 w-56 h-56 bg-rose-300 rounded-full blur-3xl opacity-20"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-20">
          <h2 className="serif-font text-4xl md:text-5xl lg:text-6xl font-bold text-rose-500 mb-6">
            Schedule of Events
          </h2>
          <div className="decorative-border mx-auto mb-8"></div>
          <EditableText
            value={content.weddingDetails.event1.date || ''}
            onSave={(value) => updateContent({
              weddingDetails: {
                ...content.weddingDetails,
                event1: {
                  ...content.weddingDetails.event1,
                  date: value,
                },
              },
            })}
          >
            <div className="inline-flex items-center bg-white/80 backdrop-blur-sm rounded-full px-8 py-4 shadow-lg border border-rose-100">
              <Calendar className="w-6 h-6 mr-3 text-rose-500" />
              <p className="script-font text-xl md:text-2xl text-gray-700 font-medium">
                {content.weddingDetails.event1.date || ''}
              </p>
              <Heart className="w-6 h-6 ml-3 text-rose-500" />
            </div>
          </EditableText>
        </div>

        {/* Schedule Timeline */}
        <div className="max-w-5xl mx-auto">
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-rose-300 via-pink-300 to-purple-300 rounded-full shadow-sm"></div>
            
            {/* Events */}
            <div className="space-y-12">
              {content.schedule.map((event, index) => (
                <div key={event.id} className={`flex items-center ${index % 2 === 0 ? 'justify-start' : 'justify-end'} group`}>
                  <div className={`w-full max-w-lg ${index % 2 === 0 ? 'pr-12' : 'pl-12'}`}>
                    <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-rose-100/50 hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] hover:border-rose-200 relative">
                      
                      {/* Timeline Dot */}
                      <div className={`absolute top-8 transform -translate-y-1/2 w-8 h-8 bg-rose-500 rounded-full border-4 border-white shadow-lg ${index % 2 === 0 ? '-right-16' : '-left-16'}`}>
                        <div className="absolute inset-0 bg-rose-500 rounded-full animate-pulse opacity-50"></div>
                        <div className="absolute inset-1 bg-white rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-rose-500 rounded-full"></div>
                        </div>
                      </div>

                      {/* Event Number Badge */}
                      <div className="absolute -top-4 left-6 w-8 h-8 bg-rose-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                        {index + 1}
                      </div>
                      
                      {/* Event Content */}
                      <div className="space-y-6">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-rose-500 rounded-full flex items-center justify-center text-white shadow-md">
                            {getEventIcon(event.event)}
                          </div>
                          <EditableText
                            value={event.time}
                            onSave={(value) => {
                              const updated = [...content.schedule];
                              updated[index].time = value;
                              updateContent({ schedule: updated });
                            }}
                          >
                            <div className="serif-font text-lg font-semibold text-rose-600 bg-rose-50 px-4 py-2 rounded-full shadow-sm">
                              {event.time}
                            </div>
                          </EditableText>
                        </div>
                        
                        <EditableText
                          value={event.event}
                          onSave={(value) => {
                            const updated = [...content.schedule];
                            updated[index].event = value;
                            updateContent({ schedule: updated });
                          }}
                        >
                          <h3 className="script-font text-2xl md:text-3xl font-semibold text-gray-800 leading-tight">
                            {event.event}
                          </h3>
                        </EditableText>
                        
                        {event.description && (
                          <EditableText
                            value={event.description}
                            onSave={(value) => {
                              const updated = [...content.schedule];
                              updated[index].description = value;
                              updateContent({ schedule: updated });
                            }}
                          >
                            <p className="text-gray-600 text-base leading-relaxed">
                              {event.description}
                            </p>
                          </EditableText>
                        )}
                      </div>
                      
                      {/* Delete Button */}
                      {isAuthenticated && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteEvent(index)}
                          className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-red-400 hover:text-red-600 hover:bg-red-50 w-10 h-10 p-0 rounded-full"
                        >
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      )}

                      {/* Decorative corner elements */}
                      <div className="absolute top-4 right-4 w-6 h-6 bg-rose-100 rounded-full opacity-40"></div>
                      <div className="absolute bottom-4 left-4 w-4 h-4 bg-pink-100 rounded-full opacity-30"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Add Event Button */}
          {isAuthenticated && (
            <div className="text-center mt-16">
              <Button
                onClick={handleAddEvent}
                className="bg-rose-500 hover:bg-rose-600 text-white px-10 py-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 text-lg font-medium"
              >
                <Plus className="h-6 w-6 mr-3" />
                Add New Event
              </Button>
            </div>
          )}
        </div>

        {/* Bottom Decorative Elements */}
        <div className="flex justify-center items-center mt-20 space-x-6">
          <div className="w-2 h-2 bg-rose-300 rounded-full opacity-60"></div>
          <Star className="w-6 h-6 text-rose-300 opacity-60" />
          <div className="w-3 h-3 bg-rose-400 rounded-full opacity-70"></div>
          <Sparkles className="w-8 h-8 text-rose-400 opacity-80" />
          <div className="w-3 h-3 bg-rose-400 rounded-full opacity-70"></div>
          <Star className="w-6 h-6 text-rose-300 opacity-60" />
          <div className="w-2 h-2 bg-rose-300 rounded-full opacity-60"></div>
        </div>
      </div>
    </section>
  );
};
