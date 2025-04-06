
import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./context/LanguageContext";
import { BlogProvider } from "./context/BlogContext";
import { SubscriberProvider } from "./context/SubscriberContext";
import { Helmet, HelmetProvider } from 'react-helmet-async';
import Index from "./pages/Index";
import NumerologyPage from "./pages/NumerologyPage";
import BirthChartPage from "./pages/BirthChartPage";
import BlogPage from "./pages/BlogPage";
import BlogPostPage from "./pages/BlogPostPage";
import BlogLoginPage from "./pages/BlogLoginPage";
import SubscribersAdminPage from "./pages/SubscribersAdminPage";
import NotFound from "./pages/NotFound";
import ChatBot from "./components/ChatBot";
import { initSupabaseResources } from "./utils/initSupabase";

const queryClient = new QueryClient();

const App = () => {
  // Initialize Supabase resources when app starts
  useEffect(() => {
    initSupabaseResources();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <LanguageProvider>
          <BlogProvider>
            <SubscriberProvider>
              <TooltipProvider>
                <Helmet>
                  <script
                    async
                    src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
                    crossOrigin="anonymous"
                  />
                </Helmet>
                <Toaster />
                <Sonner />
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/numerology" element={<NumerologyPage />} />
                  <Route path="/birth-chart" element={<BirthChartPage />} />
                  <Route path="/blog" element={<BlogPage />} />
                  <Route path="/blog/:slug" element={<BlogPostPage />} />
                  <Route path="/blog/admin" element={<BlogLoginPage />} />
                  <Route path="/subscribers" element={<SubscribersAdminPage />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
                <ChatBot />
              </TooltipProvider>
            </SubscriberProvider>
          </BlogProvider>
        </LanguageProvider>
      </HelmetProvider>
    </QueryClientProvider>
  );
};

export default App;
