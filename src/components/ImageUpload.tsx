
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, XCircle, Image as ImageIcon, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  className?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ value, onChange, className }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  
  useEffect(() => {
    if (value) {
      // If the value is already a full URL (from Supabase)
      if (value.startsWith('http')) {
        setPreviewUrl(value);
      } else {
        // If it's just a path, we need to get the public URL from Supabase
        const fetchImageUrl = async () => {
          try {
            // Try to get the public URL from Supabase
            const { data } = supabase.storage
              .from('blog-images')
              .getPublicUrl(value.replace(/^\//, ''));
            
            if (data?.publicUrl) {
              setPreviewUrl(data.publicUrl);
            } else {
              // Fallback
              setPreviewUrl(value);
            }
          } catch (error) {
            console.error('Error getting public URL:', error);
            setPreviewUrl(value);
          }
        };
        
        fetchImageUrl();
      }
    } else {
      setPreviewUrl('');
    }
  }, [value]);
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file",
        variant: "destructive"
      });
      return;
    }
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Image size must be less than 5MB",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsUploading(true);
      
      // Create a URL for preview
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      
      // Generate a unique filename
      const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '-').toLowerCase()}`;
      
      // Upload to Supabase storage
      const { data, error } = await supabase.storage
        .from('blog-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });
      
      if (error) {
        throw error;
      }
      
      // Get the public URL
      const { data: urlData } = supabase.storage
        .from('blog-images')
        .getPublicUrl(fileName);
      
      if (urlData?.publicUrl) {
        // Update the form with the new image URL
        onChange(urlData.publicUrl);
        
        toast({
          title: "Image uploaded",
          description: "Your image has been successfully uploaded.",
        });
      } else {
        throw new Error('Failed to get public URL');
      }
    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast({
        title: "Upload failed",
        description: `Failed to upload image: ${error.message || 'Unknown error'}`,
        variant: "destructive"
      });
      // Clear preview on error
      if (!value) {
        setPreviewUrl('');
      }
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleClearImage = () => {
    onChange('');
    setPreviewUrl('');
    toast({
      title: "Image removed",
      description: "The image has been removed.",
    });
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
              console.error('Image failed to load:', previewUrl);
              toast({
                title: "Image load error",
                description: "Could not load the image preview.",
                variant: "destructive"
              });
            }}
          />
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center space-y-2 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer" onClick={() => document.getElementById('image-upload')?.click()}>
          <ImageIcon className="h-10 w-10 text-gray-400" />
          <div className="text-center">
            <p className="text-sm text-gray-500">Click to upload an image</p>
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
            disabled={isLoading}
            onClick={() => document.getElementById('image-upload')?.click()}
          >
            {isUploading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Upload Image
              </>
            )}
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
