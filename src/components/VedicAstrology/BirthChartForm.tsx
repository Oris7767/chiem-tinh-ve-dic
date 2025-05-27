import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { Calendar, Clock, Mail, User } from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { LocationSelector } from './LocationSelector';
import { useToast } from "@/components/ui/use-toast";

// Define the schema for the form data
const formSchema = z.object({
  name: z.string().min(1, 'Vui lòng nhập tên của bạn'),
  email: z.string()
    .email('Vui lòng nhập email hợp lệ')
    .or(z.literal(''))
    .transform(e => e || ''), // Convert empty string to empty string (for consistency)
  birthDate: z.string().min(1, 'Vui lòng chọn ngày sinh'),
  birthTime: z.string().min(1, 'Vui lòng nhập giờ sinh'),
  location: z.string().min(1, 'Vui lòng nhập địa điểm sinh'),
  latitude: z.number(),
  longitude: z.number(), 
  timezone: z.string(),
});

export type BirthDataFormValues = z.infer<typeof formSchema>;

interface BirthChartFormProps {
  onSubmit: (data: BirthDataFormValues) => void;
  isLoading: boolean;
}

const BirthChartForm = ({ onSubmit, isLoading }: BirthChartFormProps) => {
  const [savedCharts, setSavedCharts] = useState<any[]>([]);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [hasSelectedLocation, setHasSelectedLocation] = useState(false);
  const { toast } = useToast();

  const form = useForm<BirthDataFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      birthDate: '',
      birthTime: '',
      location: '',
      latitude: 0,
      longitude: 0,
      timezone: 'UTC', // Default to UTC until location is selected
    },
  });

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsUserLoggedIn(!!user);
      
      if (user) {
        // Fetch user's saved charts
        const { data: charts, error } = await supabase
          .from('birth_charts')
          .select('*')
          .eq('user_id', user.id);
          
        if (charts && !error) {
          setSavedCharts(charts);
          
          // If there's at least one chart, pre-fill the form with the latest one
          if (charts.length > 0) {
            const latestChart = charts[0];
            // Extract birth data from the saved chart
            if (latestChart && latestChart.planets) {
              try {
                const userData = user.user_metadata;
                form.setValue('name', userData?.name || '');
                form.setValue('email', user.email || '');
                // Other fields would be populated if stored in the birth_charts table
              } catch (err) {
                console.error('Error parsing saved chart data', err);
              }
            }
          }
        }
      }
    };
    
    checkAuth();
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsUserLoggedIn(!!session?.user);
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, [form]);

  const handleLocationSelected = (locationData: {
    formatted: string;
    city: string;
    country: string;
    latitude: number;
    longitude: number;
    timezone: string;
  }) => {
    form.setValue('location', locationData.formatted);
    form.setValue('latitude', locationData.latitude);
    form.setValue('longitude', locationData.longitude);
    form.setValue('timezone', locationData.timezone);
    
    // Mark location as selected even if just a country is chosen
    setHasSelectedLocation(true);
    
    // Clear any location field errors since we now have a selection
    form.clearErrors('location');
  };

  const handleFormSubmit = async (values: BirthDataFormValues) => {
    // Check if we have valid coordinates
    if (!values.latitude || !values.longitude || values.latitude === 0 || values.longitude === 0) {
      form.setError('location', { 
        type: 'manual', 
        message: 'Vui lòng chọn một địa điểm cụ thể từ danh sách gợi ý' 
      });
      return;
    }
    
    try {
      // Get current user if logged in
      const { data: { user } } = await supabase.auth.getUser();
      
      // Silently save form input data to Supabase
      const saveToSupabase = async () => {
        try {
          await supabase
            .from('birth_chart_inputs')
            .insert({
              user_id: user?.id || null,
              name: values.name,
              email: user ? user.email : values.email,
              birth_date: values.birthDate,
              birth_time: values.birthTime,
              location: values.location,
              latitude: values.latitude,
              longitude: values.longitude,
              timezone: values.timezone
            });
        } catch (error) {
          // Silently log error without notifying user
          console.error('Error in saving form data:', error);
        }
      };

      // Start saving process in background without waiting
      saveToSupabase();

      // Proceed with chart calculation (main flow)
      const submissionData = {
        ...values,
        email: user ? user.email : values.email || ''
      };
      
      // Call the parent component's onSubmit handler for API processing
      onSubmit(submissionData);

    } catch (error) {
      console.error('Error in form submission:', error);
      toast({
        title: "Lỗi xử lý",
        description: "Đã xảy ra lỗi trong quá trình xử lý. Vui lòng thử lại sau.",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Họ và tên</FormLabel>
                <FormControl>
                  <div className="relative">
                    <User className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Nguyễn Văn A" className="pl-8" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Mail className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="email@example.com" className="pl-8" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="birthDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ngày sinh</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Calendar className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input type="date" className="pl-8" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="birthTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Giờ sinh</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Clock className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input type="time" className="pl-8" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nơi sinh</FormLabel>
              <FormControl>
                <LocationSelector onLocationSelected={handleLocationSelected} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Hidden fields for latitude, longitude, and timezone */}
        <input type="hidden" {...form.register('latitude', { valueAsNumber: true })} />
        <input type="hidden" {...form.register('longitude', { valueAsNumber: true })} />
        <input type="hidden" {...form.register('timezone')} />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Đang tính toán..." : "Tính toán bản đồ sao"}
        </Button>
      </form>
    </Form>
  );
};

export default BirthChartForm;
