
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { X } from 'lucide-react';

const BlogPopup = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [popupDismissed, setPopupDismissed] = useLocalStorage<boolean>('blog-popup-dismissed', false);
  const [popupLastShown, setPopupLastShown] = useLocalStorage<number>('blog-popup-last-shown', 0);
  
  useEffect(() => {
    // Show popup after 10 seconds if it hasn't been dismissed
    // and if it hasn't been shown in the last 24 hours
    const now = Date.now();
    const oneDayMs = 24 * 60 * 60 * 1000;
    
    if (!popupDismissed && (now - popupLastShown > oneDayMs)) {
      const timer = setTimeout(() => {
        setOpen(true);
        setPopupLastShown(now);
      }, 10000);
      
      return () => clearTimeout(timer);
    }
  }, [popupDismissed, popupLastShown, setPopupLastShown]);
  
  const handleDismiss = () => {
    setOpen(false);
    setPopupDismissed(true);
  };
  
  const handleVisitBlog = () => {
    setOpen(false);
    navigate('/blog');
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-amber-900">
            {t('blogPopup.title') || 'Discover Our New Blog!'}
          </DialogTitle>
          <DialogDescription>
            {t('blogPopup.description') || 'We\'ve just launched our Vedic Wisdom Blog with insights about numerology and astrology.'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex justify-center py-4">
          <img 
            src="/lovable-uploads/97fa6e16-3fd9-42cd-887d-d6d1d4d3ee6b.png" 
            alt="Blog" 
            className="h-24"
          />
        </div>
        
        <div className="text-center text-amber-700">
          {t('blogPopup.content') || 'Read our latest articles about Vedic numerology, birth charts, and more. Stay updated with weekly posts!'}
        </div>
        
        <DialogFooter className="sm:justify-center gap-2 mt-4">
          <Button variant="outline" onClick={handleDismiss}>
            {t('blogPopup.notNow') || 'Not Now'}
          </Button>
          <Button onClick={handleVisitBlog}>
            {t('blogPopup.visitBlog') || 'Visit Our Blog'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BlogPopup;
