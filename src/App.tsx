
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./context/LanguageContext";
import { BlogProvider } from "./context/BlogContext";
import Index from "./pages/Index";
import NumerologyPage from "./pages/NumerologyPage";
import BirthChartPage from "./pages/BirthChartPage";
import BlogPage from "./pages/BlogPage";
import BlogPostPage from "./pages/BlogPostPage";
import BlogLoginPage from "./pages/BlogLoginPage";
import NotFound from "./pages/NotFound";
import ChatBot from "./components/ChatBot";
import BlogPopup from "./components/BlogPopup";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <BlogProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/numerology" element={<NumerologyPage />} />
            <Route path="/birth-chart" element={<BirthChartPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<BlogPostPage />} />
            <Route path="/blog/admin" element={<BlogLoginPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <ChatBot />
          <BlogPopup />
        </TooltipProvider>
      </BlogProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
