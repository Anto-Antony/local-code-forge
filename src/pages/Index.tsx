import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import AdditionalInfoSection from "@/components/AdditionalInfoSection";
import Background from "@/components/Background";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import GallerySection from "@/components/GallerySection";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import JewellerSection from "@/components/JewellerSection";
import Loading from "@/components/Loading";
import ScheduleSection from "@/components/ScheduleSection";
import StorySection from "@/components/StorySection";
import WeddingDetailsSection from "@/components/WeddingDetailsSection";
import WishesSection from "@/components/WishesSection";
import { useWedding } from "@/contexts/WeddingContext";
import scrollToElement from "@/utils/scrollToElement";

const Index = () => {
    const { globalIsLoading, userWebEntry } = useWedding();
    const location = useLocation();

    useEffect(() => {
        const elementId = location.state?.scrollTo;
        if (elementId) {
            scrollToElement(elementId);
            window.history.replaceState({}, document.title);
        }
    }, [location.state]);

    if (globalIsLoading || !userWebEntry) {
        return <Loading />;
    }

    return (
        <Background>
            <div className="relative z-10">
                <Header />
                <main>
                    <HeroSection data={userWebEntry.web_data?.hero} />
                    <StorySection data={userWebEntry.web_data?.story} />
                    <WeddingDetailsSection />
                    <ScheduleSection />
                    <GallerySection />
                    <WishesSection />
                    <AdditionalInfoSection />
                    <ContactSection />
                    <JewellerSection />
                    <Footer />
                </main>
            </div>
        </Background>
    );
};

export default Index;
