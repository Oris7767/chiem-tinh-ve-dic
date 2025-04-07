
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
      
      console.log("Attempting to save calculator user:", userData);
      
      // Validate input data
      if (!userData.name || !userData.dateOfBirth) {
        toast({
          title: 'Validation Error',
          description: 'Name and date of birth are required',
          variant: 'destructive'
        });
        return false;
      }
      
      // Check connection to Supabase
      const { error: pingError } = await supabase.from('calculator_users').select('count');
      if (pingError) {
        console.error('Supabase connection error:', pingError);
        toast({
          title: 'Connection Error',
          description: 'Could not connect to database. Please try again later.',
          variant: 'destructive'
        });
        return false;
      }
      
      // Save data to Supabase
      const { data, error } = await supabase
        .from('calculator_users')
        .insert({
          name: userData.name,
          date_of_birth: userData.dateOfBirth
        })
        .select();
      
      if (error) {
        console.error('Error saving calculator user:', error);
        toast({
          title: 'Error',
          description: 'Failed to save your data. Please try again.',
          variant: 'destructive'
        });
        return false;
      }
      
      console.log("Calculator user saved successfully:", data);
      
      toast({
        title: 'Success',
        description: 'Your information has been saved successfully.',
      });
      
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
