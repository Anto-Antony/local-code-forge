import { useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import AdditionalInfoSection from "@/components/AdditionalInfoSection";
import Background from "@/components/Background";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import GallerySection from "@/components/GallerySection";
import Header, { HEADER_HEIGHT } from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import JewellerSection from "@/components/JewellerSection";
import Loading from "@/components/Loading";
import ScheduleSection from "@/components/ScheduleSection";
import StorySection from "@/components/StorySection";
import WeddingDetailsSection from "@/components/WeddingDetailsSection";
import WishesSection from "@/components/WishesSection";
import { useWedding } from "@/contexts/WeddingContext";
import scrollToElement from "@/utils/scrollToElement";

const UserWeddingPage = () => {
    const { user_id } = useParams();
    const { globalIsLoading, loadWeddingData, editable } = useWedding();
    const location = useLocation();

    // Fetch the relevant wedding data when the route changes
    useEffect(() => {
        if (user_id) {
            loadWeddingData(user_id);
        }
    }, [user_id, loadWeddingData]);

    // Optionally scroll to section if specified in the link state
    useEffect(() => {
        const elementId = location.state?.scrollTo;
        if (elementId) {
            scrollToElement(elementId);
            window.history.replaceState({}, document.title);
        }
    }, [location.state]);

    if (globalIsLoading) {
        return <Loading />;
    }

    return (
        <Background>
            <div className="relative z-10" style={{ paddingTop: HEADER_HEIGHT }}>
                <Header />
                
                <main>
                    <HeroSection />
                    <StorySection />
                    <WeddingDetailsSection />
                    <ScheduleSection />
                    <GallerySection />
                    <JewellerSection />
                    <AdditionalInfoSection />
                    <WishesSection />
                    <ContactSection />
                    <Footer />
                </main>
            </div>
        </Background>
    );
};

export default UserWeddingPage;
