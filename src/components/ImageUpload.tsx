
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, XCircle, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  className?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ value, onChange, className }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  
  // Set initial preview URL when value changes
  useEffect(() => {
    if (value) {
      setPreviewUrl(value);
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
      
      // Create FormData for the upload
      const formData = new FormData();
      formData.append('file', file);
      
      // Generate a unique filename
      const fileName = file.name.replace(/\s+/g, '-').toLowerCase();
      const randomId = Math.random().toString(36).substring(2, 15);
      const uploadPath = `/lovable-uploads/${randomId}-${fileName}`;
      
      // In a real app, you would make an actual upload request here
      // For now, we simulate a successful upload
      setTimeout(() => {
        onChange(uploadPath);
        setIsUploading(false);
        toast({
          title: "Image uploaded",
          description: "Your image has been successfully uploaded.",
        });
      }, 1000);
      
    } catch (error) {
      console.error('Error uploading image:', error);
      setIsUploading(false);
      toast({
        title: "Upload failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive"
      });
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
              setPreviewUrl('/placeholder.svg');
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
            disabled={isUploading}
            onClick={() => document.getElementById('image-upload')?.click()}
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
