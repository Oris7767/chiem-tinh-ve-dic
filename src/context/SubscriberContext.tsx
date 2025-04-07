
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Import type from Supabase generated types
import type { Database } from '@/integrations/supabase/types';

export type Subscriber = {
  id: string;
  name: string;
  email: string;
  date: string;
};

type SubscriberContextType = {
  subscribers: Subscriber[];
  addSubscriber: (name: string, email: string) => Promise<boolean>;
  removeSubscriber: (id: string) => void;
  getSubscribersCSV: () => string;
  loading: boolean;
};

const SubscriberContext = createContext<SubscriberContextType | undefined>(undefined);

export const SubscriberProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [storedSubscribers, setStoredSubscribers] = useLocalStorage<Subscriber[]>('newsletter-subscribers', []);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Fetch subscribers from Supabase on initial load
  useEffect(() => {
    const fetchSubscribers = async () => {
      try {
        setLoading(true);
        console.log("Fetching subscribers from Supabase");
        
        const { data, error } = await supabase
          .from('subscribers')
          .select('*');
        
        if (error) {
          console.error('Error fetching subscribers:', error);
          // Fallback to local storage if Supabase fails
          setSubscribers(storedSubscribers);
          return;
        }
        
        if (data) {
          console.log("Retrieved subscribers:", data.length);
          // Map Supabase data to our Subscriber type
          const formattedSubscribers = data.map((sub) => ({
            id: sub.id,
            name: sub.name,
            email: sub.email,
            date: sub.created_at
          }));
          
          setSubscribers(formattedSubscribers);
        }
      } catch (err) {
        console.error('Failed to fetch subscribers:', err);
        // Fallback to local storage
        setSubscribers(storedSubscribers);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscribers();
  }, [storedSubscribers]);

  const addSubscriber = async (name: string, email: string): Promise<boolean> => {
    try {
      setLoading(true);
      
      console.log("Attempting to add subscriber:", { name, email });
      
      // Validate input
      if (!name || !email) {
        console.error("Missing required fields");
        toast({
          title: 'Validation Error',
          description: 'Name and email are required',
          variant: 'destructive'
        });
        return false;
      }
      
      // Check if email already exists
      if (subscribers.some(sub => sub.email === email)) {
        toast({
          title: 'Already subscribed',
          description: 'This email is already subscribed to our newsletter.',
          variant: 'default'
        });
        return false;
      }
      
      // Add to Supabase
      const { data, error } = await supabase
        .from('subscribers')
        .insert({
          name,
          email
        })
        .select();
      
      if (error) {
        console.error('Error adding subscriber to Supabase:', error);
        toast({
          title: 'Error',
          description: 'Failed to subscribe. Please try again.',
          variant: 'destructive'
        });
        return false;
      }
      
      if (data && data.length > 0) {
        console.log("Subscriber added successfully:", data[0]);
        
        // Add to local state with Supabase returned data
        const newSubscriber: Subscriber = {
          id: data[0].id,
          name: data[0].name,
          email: data[0].email,
          date: data[0].created_at
        };
        
        const updatedSubscribers = [...subscribers, newSubscriber];
        setSubscribers(updatedSubscribers);
        
        // Update local storage as backup
        setStoredSubscribers(updatedSubscribers);
        
        toast({
          title: 'Success',
          description: 'Thank you for subscribing to our newsletter!',
        });
        
        return true;
      }
      
      return false;
    } catch (err) {
      console.error('Failed to add subscriber:', err);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred.',
        variant: 'destructive'
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const removeSubscriber = async (id: string) => {
    try {
      // Delete from Supabase
      const { error } = await supabase
        .from('subscribers')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting subscriber from Supabase:', error);
        toast({
          title: 'Error',
          description: 'Failed to remove subscriber. Please try again.',
          variant: 'destructive'
        });
        return;
      }
      
      // Update local state
      const updatedSubscribers = subscribers.filter(sub => sub.id !== id);
      setSubscribers(updatedSubscribers);
      
      // Update local storage as backup
      setStoredSubscribers(updatedSubscribers);
      
      toast({
        title: 'Success',
        description: 'Subscriber successfully removed.',
      });
    } catch (err) {
      console.error('Failed to remove subscriber:', err);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred.',
        variant: 'destructive'
      });
    }
  };

  const getSubscribersCSV = (): string => {
    const headers = 'ID,Name,Email,Date\n';
    const rows = subscribers.map(sub => 
      `${sub.id},${sub.name.replace(/,/g, ';')},${sub.email},${sub.date}`
    ).join('\n');
    
    return headers + rows;
  };

  return (
    <SubscriberContext.Provider value={{
      subscribers,
      addSubscriber,
      removeSubscriber,
      getSubscribersCSV,
      loading
    }}>
      {children}
    </SubscriberContext.Provider>
  );
};

export const useSubscribers = () => {
  const context = useContext(SubscriberContext);
  if (!context) {
    throw new Error('useSubscribers must be used within a SubscriberProvider');
  }
  return context;
};
