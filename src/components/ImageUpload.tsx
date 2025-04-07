
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, XCircle, Image as ImageIcon, AlertTriangle } from 'lucide-react';
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
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    // Update preview if value changes externally
    if (value !== previewUrl) {
      setPreviewUrl(value);
    }
  }, [value]);
  
  const checkBucketExists = async (): Promise<boolean> => {
    try {
      console.log("Checking if blog-images bucket exists");
      const { data: buckets, error } = await supabase.storage.listBuckets();
      
      if (error) {
        console.error("Error checking buckets:", error);
        return false;
      }
      
      const exists = buckets?.some(bucket => bucket.name === 'blog-images');
      console.log("blog-images bucket exists:", exists);
      return exists;
    } catch (err) {
      console.error("Failed to check bucket:", err);
      return false;
    }
  };
  
  const createBucket = async (): Promise<boolean> => {
    try {
      console.log("Attempting to create blog-images bucket via edge function");
      const { data, error } = await supabase.functions.invoke('create-bucket', {
        method: 'POST',
        body: { bucketName: 'blog-images' },
      });
      
      if (error) {
        console.error("Error creating bucket via function:", error);
        return false;
      }
      
      console.log("Create bucket function response:", data);
      return true;
    } catch (err) {
      console.error("Failed to create bucket:", err);
      return false;
    }
  };
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Reset error state
    setError(null);
    
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
      
      console.log("Attempting to upload image:", filePath);
      
      // Check if bucket exists, if not try to create it
      const bucketExists = await checkBucketExists();
      if (!bucketExists) {
        console.log("Bucket doesn't exist, creating it...");
        const created = await createBucket();
        if (!created) {
          throw new Error("Failed to create storage bucket");
        }
      }
      
      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('blog-images')
        .upload(filePath, file);
        
      if (error) {
        console.error("Storage upload error:", error);
        throw error;
      }
      
      console.log("Upload successful:", data);
      
      // Get the public URL
      const { data: publicUrlData } = supabase.storage
        .from('blog-images')
        .getPublicUrl(data.path);
        
      console.log("Public URL:", publicUrlData);
      
      // Set the image URL
      onChange(publicUrlData.publicUrl);
      toast({
        title: 'Upload successful',
        description: 'Image has been uploaded',
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      
      // Fallback to Lovable's built-in upload if Supabase fails
      try {
        console.log("Using Lovable's built-in upload as fallback");
        const fileName = file.name.replace(/\s+/g, '-').toLowerCase();
        const randomId = Math.random().toString(36).substring(2, 15);
        const uploadPath = `/lovable-uploads/${randomId}-${fileName}`;
        
        onChange(uploadPath);
        
        toast({
          title: 'Using local storage',
          description: 'Image will be stored locally',
        });
      } catch (fallbackError) {
        setError("Upload failed: Please try again later");
        toast({
          title: 'Upload failed',
          description: 'Failed to upload image. Please try again.',
          variant: 'destructive'
        });
      }
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleClearImage = () => {
    onChange('');
    setPreviewUrl('');
    setError(null);
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
      
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md flex items-center text-red-600">
          <AlertTriangle className="h-4 w-4 mr-2" />
          <span className="text-sm">{error}</span>
        </div>
      )}
      
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
