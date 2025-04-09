import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Index from './pages/Index';
import NumerologyPage from './pages/NumerologyPage';
import BirthChartPage from './pages/BirthChartPage';
import VedicAstrologyChart from './pages/VedicAstrologyChart';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';
import BlogLoginPage from './pages/BlogLoginPage';
import SubscribersAdminPage from './pages/SubscribersAdminPage';
import NotFound from './pages/NotFound';
import LanguageProvider from './context/LanguageContext';
import { HelmetProvider } from 'react-helmet-async';
import NumerologyAdminPage from './pages/NumerologyAdminPage';
import { Toaster } from '@/components/ui/toaster';

function App() {
  return (
    <Router>
      <LanguageProvider>
        <HelmetProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/numerology" element={<NumerologyPage />} />
            <Route path="/birth-chart" element={<BirthChartPage />} />
            <Route path="/vedic-astrology" element={<VedicAstrologyChart />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<BlogPostPage />} />
            <Route path="/login" element={<BlogLoginPage />} />
            <Route path="/subscribers-admin" element={<SubscribersAdminPage />} />
            <Route path="/numerology-admin" element={<NumerologyAdminPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </HelmetProvider>
      </LanguageProvider>
    </Router>
  );
}

export default App;
