
import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useSubscribers } from '../context/SubscriberContext';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Mail } from 'lucide-react';

type FormData = {
  name: string;
  email: string;
};

const NewsletterSignup = () => {
  const { t } = useLanguage();
  const { addSubscriber } = useSubscribers();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>();
  const { toast } = useToast(); // Use the hook
  
  const onSubmit = (data: FormData) => {
    setIsSubmitting(true);
    
    // Add the subscriber to our context
    addSubscriber(data.name, data.email);
    
    // Show success message
    setTimeout(() => {
      toast({
        title: t('newsletter.successTitle') || 'Subscription Successful!',
        description: t('newsletter.successMessage') || `Thank you ${data.name}! You're now subscribed to our newsletter.`,
      });
      
      setIsSubmitting(false);
      reset();
    }, 1000);
  };
  
  return (
    <div className="flex flex-col md:flex-row items-center gap-6">
      <div className="w-full md:w-1/2">
        <h3 className="text-xl font-bold text-amber-900 mb-2">
          {t('newsletter.title') || 'Subscribe to Our Newsletter'}
        </h3>
        <p className="text-amber-700 mb-2">
          {t('newsletter.description') || 'Stay updated with our latest articles, insights, and special offers.'}
        </p>
        <div className="hidden md:block">
          <div className="flex items-center text-amber-600 mt-4">
            <Mail className="mr-2" />
            <span>{t('newsletter.privacyNote') || 'We respect your privacy and will never share your information.'}</span>
          </div>
        </div>
      </div>
      
      <div className="w-full md:w-1/2">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t('newsletter.nameLabel') || 'Your Name'}</Label>
            <Input
              id="name"
              placeholder={t('newsletter.namePlaceholder') || 'Enter your name'}
              {...register('name', { required: 'Name is required' })}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">{t('newsletter.emailLabel') || 'Your Email'}</Label>
            <Input
              id="email"
              type="email"
              placeholder={t('newsletter.emailPlaceholder') || 'Enter your email'}
              {...register('email', { 
                required: 'Email is required',
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: 'Please enter a valid email'
                }
              })}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>
          
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting
              ? (t('newsletter.submitting') || 'Subscribing...')
              : (t('newsletter.submit') || 'Subscribe Now')}
          </Button>
          
          <div className="block md:hidden text-center">
            <div className="flex items-center justify-center text-amber-600 text-sm mt-4">
              <Mail className="mr-2 h-4 w-4" />
              <span>{t('newsletter.privacyNote') || 'We respect your privacy and will never share your information.'}</span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewsletterSignup;
