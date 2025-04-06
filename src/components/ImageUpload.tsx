
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, XCircle, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  className?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ value, onChange, className }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>(value || '');
  const { toast } = useToast();
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Error',
        description: 'Please select an image file',
        variant: 'destructive'
      });
      return;
    }
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'Error',
        description: 'Image size must be less than 5MB',
        variant: 'destructive'
      });
      return;
    }
    
    try {
      setIsUploading(true);
      
      // Create a URL for preview
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      
      // Generate a unique file path for the upload
      const fileName = file.name.replace(/\s+/g, '-').toLowerCase();
      const randomId = Math.random().toString(36).substring(2, 15);
      const filePath = `${randomId}-${fileName}`;
      
      // Upload to Supabase Storage if connected
      let uploadPath;
      try {
        // Try to upload to Supabase Storage
        const { data, error } = await supabase.storage
          .from('blog-images')
          .upload(filePath, file);
          
        if (error) throw error;
        
        // Get the public URL
        const { data: publicUrlData } = supabase.storage
          .from('blog-images')
          .getPublicUrl(data.path);
          
        uploadPath = publicUrlData.publicUrl;
      } catch (uploadError) {
        console.error('Supabase upload failed:', uploadError);
        // Fallback to Lovable's built-in upload
        uploadPath = `/lovable-uploads/${filePath}`;
      }
      
      // Set the image URL
      onChange(uploadPath);
      toast({
        title: 'Upload successful',
        description: 'Image has been uploaded',
      });
      
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: 'Upload failed',
        description: 'Failed to upload image. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleClearImage = () => {
    onChange('');
    setPreviewUrl('');
  };
  
  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">Featured Image</label>
        {previewUrl && (
          <Button 
            type="button" 
            variant="ghost" 
            size="sm" 
            onClick={handleClearImage}
            className="text-red-500 hover:text-red-700"
          >
            <XCircle className="h-4 w-4 mr-1" /> Remove
          </Button>
        )}
      </div>
      
      {previewUrl ? (
        <div className="relative border rounded-lg overflow-hidden bg-gray-50">
          <img 
            src={previewUrl} 
            alt="Preview" 
            className="w-full h-48 object-cover"
            onError={() => {
              // If the image fails to load, show a placeholder
              setPreviewUrl('/placeholder.svg');
            }}
          />
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center space-y-2 bg-gray-50">
          <ImageIcon className="h-10 w-10 text-gray-400" />
          <div className="text-center">
            <p className="text-sm text-gray-500">No image selected</p>
            <p className="text-xs text-gray-400">PNG, JPG, GIF up to 5MB</p>
          </div>
        </div>
      )}
      
      <div>
        <label htmlFor="image-upload" className="w-full">
          <Button 
            type="button" 
            variant="outline" 
            className="w-full" 
            disabled={isUploading}
          >
            <Upload className="h-4 w-4 mr-2" />
            {isUploading ? 'Uploading...' : 'Upload Image'}
          </Button>
        </label>
        <input 
          id="image-upload"
          type="file" 
          accept="image/*" 
          onChange={handleFileChange}
          className="sr-only"
          disabled={isUploading}
        />
      </div>
    </div>
  );
};

export default ImageUpload;
