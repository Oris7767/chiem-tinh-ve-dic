
import { toast } from '@/hooks/use-toast';

export const handleSupabaseError = (error: any, context: string) => {
  console.error(`Supabase error in ${context}:`, error);
  
  // Log the error for tracking
  const errorDetails = {
    message: error?.message || 'Unknown error',
    code: error?.code,
    context,
    timestamp: new Date().toISOString(),
  };
  console.error('Detailed error:', errorDetails);
  
  // Display user-friendly error
  toast({
    title: "An error occurred",
    description: "Please try again later. If the problem persists, contact support.",
    variant: "destructive",
  });
  
  // Return a default response to prevent app crashes
  return { 
    error: true, 
    data: null
  };
};
