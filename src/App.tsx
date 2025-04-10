
import React from 'react';
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
import NumerologyAdminPage from "./pages/NumerologyAdminPage";
import BirthChartPage from "./pages/BirthChartPage";
import VedicAstrologyChart from "./pages/VedicAstrologyChart";
import BlogPage from "./pages/BlogPage";
import BlogPostPage from "./pages/BlogPostPage";
import BlogLoginPage from "./pages/BlogLoginPage";
import SubscribersAdminPage from "./pages/SubscribersAdminPage";
import NotFound from "./pages/NotFound";
import ChatBot from "./components/ChatBot";

const queryClient = new QueryClient();

const App = () => (
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <LanguageProvider>
          <BlogProvider>
            <SubscriberProvider>
              <TooltipProvider>
                <Helmet>
                  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
                  <meta name="theme-color" content="#B45309" />
                  <meta name="robots" content="index, follow" />
                  <meta property="og:image" content="/og-image.png" />
                  <meta property="og:image:width" content="1200" />
                  <meta property="og:image:height" content="630" />
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
                  <Route path="/numerology/admin" element={<NumerologyAdminPage />} />
                  <Route path="/birth-chart" element={<BirthChartPage />} />
                  <Route path="/vedic-chart" element={<VedicAstrologyChart />} />
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
  </React.StrictMode>
);

export default App;
