
import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSubscribers } from '@/context/SubscriberContext';

const NewsletterSignup = () => {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const { addSubscriber, loading } = useSubscribers();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !name) {
      return;
    }
    
    const success = await addSubscriber(name, email);
    
    if (success) {
      // Reset form on success
      setEmail('');
      setName('');
    }
  };
  
  return (
    <div className="bg-amber-50 p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold text-amber-900 mb-3">
        {t('newsletter.title')}
      </h3>
      <p className="text-amber-800 mb-4">
        {t('newsletter.description')}
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            type="text"
            placeholder={t('newsletter.namePlaceholder') || 'Your Name'}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full"
            required
          />
        </div>
        <div>
          <Input
            type="email"
            placeholder={t('newsletter.emailPlaceholder') || 'Your Email'}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full"
            required
          />
        </div>
        <Button 
          type="submit"
          className="w-full bg-amber-600 hover:bg-amber-700"
          disabled={loading}
        >
          {loading ? t('newsletter.subscribing') || 'Subscribing...' : t('newsletter.subscribe') || 'Subscribe'}
        </Button>
      </form>
    </div>
  );
};

export default NewsletterSignup;
