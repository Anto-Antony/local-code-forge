import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WeddingProvider } from "@/contexts/WeddingProvider";
import { WeddingAuthProvider } from "@/contexts/WeddingAuthContext";
import Login from "./pages/Login";
import AllWishes from "./pages/AllWishes";
import NotFound from "./pages/NotFound";
import GalleryPage from "./pages/AllImages";
import DynamicUserWeddingPage from "@/pages/template/DynamicUserWeddingPage.tsx";

const queryClient = new QueryClient();

const App = () => (
    <QueryClientProvider client={queryClient}>
        <TooltipProvider>
            <WeddingAuthProvider>
                <WeddingProvider>
                    <Toaster />
                    <Sonner />
                    <BrowserRouter>
                        <Routes>
                            <Route path="/" element={<Login />} />
                            <Route path="/wedding/:user_id" element={<DynamicUserWeddingPage />} />
                            <Route path="/wedding/slug/:slug" element={<DynamicUserWeddingPage />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/wishes" element={<AllWishes />} />
                            <Route path="/gallery" element={<GalleryPage />} />
                            
                            <Route path="*" element={<NotFound />} />
                        </Routes>
                    </BrowserRouter>
                </WeddingProvider>
            </WeddingAuthProvider>
        </TooltipProvider>
    </QueryClientProvider>
);

export default App;
