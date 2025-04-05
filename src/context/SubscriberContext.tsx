
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

export type Subscriber = {
  id: string;
  name: string;
  email: string;
  date: string;
};

type SubscriberContextType = {
  subscribers: Subscriber[];
  addSubscriber: (name: string, email: string) => void;
  removeSubscriber: (id: string) => void;
  getSubscribersCSV: () => string;
};

const SubscriberContext = createContext<SubscriberContextType | undefined>(undefined);

export const SubscriberProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [subscribers, setSubscribers] = useLocalStorage<Subscriber[]>('newsletter-subscribers', []);

  const addSubscriber = (name: string, email: string) => {
    // Check if email already exists
    if (subscribers.some(sub => sub.email.toLowerCase() === email.toLowerCase())) {
      return;
    }
    
    const newSubscriber: Subscriber = {
      id: Date.now().toString(),
      name,
      email,
      date: new Date().toISOString()
    };
    
    setSubscribers([...subscribers, newSubscriber]);
  };

  const removeSubscriber = (id: string) => {
    setSubscribers(subscribers.filter(sub => sub.id !== id));
  };

  const getSubscribersCSV = () => {
    // Create CSV header
    let csv = "Name,Email,Date\n";
    
    // Add data rows
    subscribers.forEach(sub => {
      const date = new Date(sub.date).toLocaleDateString();
      // Escape commas in name and email if they exist
      const name = sub.name.includes(',') ? `"${sub.name}"` : sub.name;
      const email = sub.email.includes(',') ? `"${sub.email}"` : sub.email;
      
      csv += `${name},${email},${date}\n`;
    });
    
    return csv;
  };

  return (
    <SubscriberContext.Provider value={{ 
      subscribers, 
      addSubscriber, 
      removeSubscriber,
      getSubscribersCSV
    }}>
      {children}
    </SubscriberContext.Provider>
  );
};

export const useSubscribers = () => {
  const context = useContext(SubscriberContext);
  if (context === undefined) {
    throw new Error('useSubscribers must be used within a SubscriberProvider');
  }
  return context;
};
