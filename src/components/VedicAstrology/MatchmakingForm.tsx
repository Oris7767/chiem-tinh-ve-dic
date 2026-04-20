import { useForm, useFormContext } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Calendar, Clock, User } from 'lucide-react';
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
import { LocationSelector } from './LocationSelector';

// Form schema for one person
const personFormSchema = z.object({
  name: z.string().min(1, 'Vui lòng nhập tên'),
  birthDate: z.string().min(1, 'Vui lòng chọn ngày sinh'),
  birthTime: z.string().min(1, 'Vui lòng nhập giờ sinh'),
  location: z.string().min(1, 'Vui lòng nhập địa điểm sinh'),
  latitude: z.number(),
  longitude: z.number(),
  timezone: z.string(),
});

export type PersonFormValues = z.infer<typeof personFormSchema>;

// Combined schema for both persons
export interface MatchmakingFormValues {
  male: PersonFormValues;
  female: PersonFormValues;
}

interface MatchmakingFormProps {
  onSubmit: (data: MatchmakingFormValues) => void;
  isLoading: boolean;
}

// Inner form component for each person
const PersonFormSection = ({ 
  type, 
  icon,
  control,
  onLocationSelected 
}: { 
  type: 'male' | 'female';
  icon: 'male' | 'female';
  control: any;
  onLocationSelected: (data: any) => void;
}) => {
  const label = type === 'male' ? 'Nam' : 'Nữ';
  const placeholderName = type === 'male' ? 'Nguyễn Văn A' : 'Trần Thị B';
  
  return (
    <div className="bg-gradient-to-br from-votive-surface to-white p-5 rounded-xl border border-votive-border shadow-sm">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-votive-border">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
          type === 'male' ? 'bg-blue-100' : 'bg-pink-100'
        }`}>
          {type === 'male' ? (
            <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          )}
        </div>
        <h3 className="text-lg font-serif font-semibold text-foreground">Bên {label}</h3>
      </div>

      <div className="space-y-4">
        <FormField
          control={control}
          name={`${type}.name`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Họ và tên</FormLabel>
              <FormControl>
                <div className="relative">
                  <User className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
                  <Input placeholder={placeholderName} className="pl-9" {...field} />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={control}
            name={`${type}.birthDate`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ngày sinh</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Calendar className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
                    <Input type="date" className="pl-9" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name={`${type}.birthTime`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Giờ sinh</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Clock className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
                    <Input type="time" className="pl-9" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={control}
          name={`${type}.location`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nơi sinh</FormLabel>
              <FormControl>
                <LocationSelector onLocationSelected={onLocationSelected} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

const MatchmakingForm = ({ onSubmit, isLoading }: MatchmakingFormProps) => {
  const defaultValues: MatchmakingFormValues = {
    male: {
      name: '',
      birthDate: '',
      birthTime: '',
      location: '',
      latitude: 0,
      longitude: 0,
      timezone: 'UTC',
    },
    female: {
      name: '',
      birthDate: '',
      birthTime: '',
      location: '',
      latitude: 0,
      longitude: 0,
      timezone: 'UTC',
    },
  };

  const form = useForm<MatchmakingFormValues>({
    resolver: zodResolver(
      z.object({
        male: personFormSchema,
        female: personFormSchema,
      })
    ),
    defaultValues,
  });

  const handleMaleLocationSelected = (locationData: {
    formatted: string;
    city: string;
    country: string;
    latitude: number;
    longitude: number;
    timezone: string;
  }) => {
    form.setValue('male.location', locationData.formatted);
    form.setValue('male.latitude', locationData.latitude);
    form.setValue('male.longitude', locationData.longitude);
    form.setValue('male.timezone', locationData.timezone);
    form.clearErrors('male.location');
  };

  const handleFemaleLocationSelected = (locationData: {
    formatted: string;
    city: string;
    country: string;
    latitude: number;
    longitude: number;
    timezone: string;
  }) => {
    form.setValue('female.location', locationData.formatted);
    form.setValue('female.latitude', locationData.latitude);
    form.setValue('female.longitude', locationData.longitude);
    form.setValue('female.timezone', locationData.timezone);
    form.clearErrors('female.location');
  };

  const handleFormSubmit = (values: MatchmakingFormValues) => {
    // Validate coordinates for both
    const maleHasValidCoords = values.male.latitude !== 0 && values.male.longitude !== 0;
    const femaleHasValidCoords = values.female.latitude !== 0 && values.female.longitude !== 0;

    if (!maleHasValidCoords) {
      form.setError('male.location', {
        type: 'manual',
        message: 'Vui lòng chọn địa điểm sinh từ danh sách gợi ý',
      });
      return;
    }

    if (!femaleHasValidCoords) {
      form.setError('female.location', {
        type: 'manual',
        message: 'Vui lòng chọn địa điểm sinh từ danh sách gợi ý',
      });
      return;
    }

    onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Male Section */}
        <PersonFormSection
          type="male"
          icon="male"
          control={form.control}
          onLocationSelected={handleMaleLocationSelected}
        />

        {/* Female Section */}
        <PersonFormSection
          type="female"
          icon="female"
          control={form.control}
          onLocationSelected={handleFemaleLocationSelected}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Đang tính toán...
            </>
          ) : (
            <>
              <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              Xem Tương Hợp
            </>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default MatchmakingForm;
