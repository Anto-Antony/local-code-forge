import React from 'react';
import { Header, HEADER_HEIGHT } from '@/templateModel/model_2/Header';
import { HeroSection } from '@/templateModel/model_2/HeroSection';
import { LoveStorySection } from '@/templateModel/model_2/LoveStorySection';
import { ScheduleSection } from '@/templateModel/model_2/ScheduleSection';
import { AboutSection } from '@/templateModel/model_2/AboutSection';
import { GallerySection } from '@/templateModel/model_2/GallerySection';
import { WishesSection } from '@/templateModel/model_2/WishesSection';
import { ContactSection } from '@/templateModel/model_2/ContactSection';
import { Footer } from '@/templateModel/model_2/Footer';
import { useWedding } from '@/contexts/WeddingContext';
import { Loader2 } from 'lucide-react';
import { OurJewelPartner } from '@/templateModel/model_2//OurJewelPartner';


const Index = () => {
  const { globalIsLoading: isLoading } = useWedding();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-rose-50 via-rose-25 to-white">
        <Loader2 className="w-10 h-10 animate-spin text-rose-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 via-rose-25 to-white" style={{ paddingTop: HEADER_HEIGHT }}>
      <Header />
      <main>
        <HeroSection />
        <LoveStorySection />
        <ScheduleSection />
        <AboutSection />
        <GallerySection />
        <WishesSection />
        <OurJewelPartner />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
