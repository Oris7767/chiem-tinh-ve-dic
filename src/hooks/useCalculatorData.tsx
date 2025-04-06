
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

type CalculatorUser = {
  name: string;
  dateOfBirth: string;
};

export const useCalculatorData = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const saveCalculatorUser = async (userData: CalculatorUser) => {
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('calculator_users')
        .insert({
          name: userData.name,
          date_of_birth: userData.dateOfBirth
        });
      
      if (error) {
        console.error('Error saving calculator user:', error);
        toast({
          title: 'Error',
          description: 'Failed to save your data. Please try again.',
          variant: 'destructive'
        });
        return false;
      }
      
      return true;
    } catch (err) {
      console.error('Failed to save calculator user:', err);
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

  return {
    saveCalculatorUser,
    loading
  };
};
