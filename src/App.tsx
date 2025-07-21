import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WeddingProvider } from "@/contexts/WeddingProvider";
import Login from "./pages/Login";
import AllWishes from "./pages/AllWishes";
import NotFound from "./pages/NotFound";
import GalleryPage from "./pages/AllImages";
import UserWeddingPage from "@/pages/[user_id]/page"; // adjust import as needed

const queryClient = new QueryClient();

const App = () => (
    <QueryClientProvider client={queryClient}>
        <TooltipProvider>
            <WeddingProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<Login />} />
                        <Route path="/wedding/:user_id" element={<UserWeddingPage />} />
                        <Route path="/wedding/slug/:slug" element={<UserWeddingPage />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/wishes" element={<AllWishes />} />
                        <Route path="/gallery" element={<GalleryPage />} />
                        
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </BrowserRouter>
            </WeddingProvider>
        </TooltipProvider>
    </QueryClientProvider>
);

export default App;
