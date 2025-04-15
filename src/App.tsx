import React, { Component, ErrorInfo, ReactNode } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster"; // Keep custom Toaster
// Remove Sonner to avoid conflicts
// import { Toaster as Sonner } from "@/components/ui/sonner";
import { ToastViewport } from './components/ui/toast'; // Use ToastViewport
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { LanguageProvider } from "./context/LanguageContext";
import { BlogProvider } from "./context/BlogContext";
import { SubscriberProvider } from "./context/SubscriberContext";
import { Helmet, HelmetProvider } from 'react-helmet-async';
import Index from "./pages/Index";
import NumerologyPage from "./pages/NumerologyPage";
import NumerologyAdminPage from "./pages/NumerologyAdminPage";
import BirthChartForm from "./components/BirthChartForm";
import BlogPage from "./pages/BlogPage";
import BlogPostPage from "./pages/BlogPostPage";
import BlogLoginPage from "./pages/BlogLoginPage";
import SubscribersAdminPage from "./pages/SubscribersAdminPage";
import NotFound from "./pages/NotFound";
import ChatBot from "./components/ChatBot";
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

const queryClient = new QueryClient();

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  errorMessage: string;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false,
    errorMessage: '',
  };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, errorMessage: error.message };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught in ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="container mx-auto p-4 max-w-2xl">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Lỗi</AlertTitle>
            <AlertDescription>
              Đã xảy ra lỗi: {this.state.errorMessage}. Vui lòng thử lại hoặc liên hệ hỗ trợ.
            </AlertDescription>
          </Alert>
        </div>
      );
    }

    return this.props.children;
  }
}

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
                </Helmet>
                <BrowserRouter>
                  <ErrorBoundary>
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/numerology" element={<NumerologyPage />} />
                      <Route path="/numerology/admin" element={<NumerologyAdminPage />} />
                      <Route path="/vedic-chart" element={<BirthChartForm />} />
                      <Route path="/blog" element={<BlogPage />} />
                      <Route path="/blog/:slug" element={<BlogPostPage />} />
                      <Route path="/blog/admin" element={<BlogLoginPage />} />
                      <Route path="/subscribers" element={<SubscribersAdminPage />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                    <ToastViewport>
                      <Toaster />
                    </ToastViewport>
                    <ChatBot />
                  </ErrorBoundary>
                </BrowserRouter>
              </TooltipProvider>
            </SubscriberProvider>
          </BlogProvider>
        </LanguageProvider>
      </HelmetProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

export default App;