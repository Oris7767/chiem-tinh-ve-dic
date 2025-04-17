
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from '@/hooks/use-toast';
import { useBlog } from '@/context/BlogContext';
import ImageUpload from '@/components/ImageUpload';
import { Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Post Creation/Edit Form Schema
const postSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  excerpt: z.string().min(10, 'Excerpt must be at least 10 characters'),
  content: z.string().min(20, 'Content must be at least 20 characters'),
  slug: z.string().min(3, 'Slug must be at least 3 characters').regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'Slug must be lowercase with hyphens between words (e.g. my-post-title)',
  }),
  author: z.string().min(2, 'Author must be at least 2 characters'),
  imageUrl: z.string().optional(),
  // Convert string of comma-separated tags to array of strings
  tags: z.string().transform(val => val.split(',').map(tag => tag.trim().toLowerCase())),
});

type PostFormValues = z.infer<typeof postSchema>;

interface PostFormProps {
  editPostId?: string | null;
  postToEdit?: any;
}

const PostForm = ({ editPostId, postToEdit }: PostFormProps) => {
  const { addPost, editPost, isLoading } = useBlog();
  
  const form = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: postToEdit?.title || '',
      excerpt: postToEdit?.excerpt || '',
      content: postToEdit?.content || '',
      slug: postToEdit?.slug || '',
      author: postToEdit?.author || 'Admin',
      imageUrl: postToEdit?.imageUrl || '',
      // Convert tags array back to comma-separated string for the form
      tags: postToEdit?.tags ? postToEdit.tags.join(', ') : 'vedic, numerology',
    },
  } as any);
  
  const generateSlug = () => {
    const title = form.getValues('title');
    if (title) {
      const slug = title
        .toLowerCase()
        .replace(/[^\w\s]/gi, '')
        .replace(/\s+/g, '-');
      form.setValue('slug', slug);
    }
  };

  // Helper function to format content with proper paragraph breaks
  const formatContentForPreview = (content: string) => {
    if (!content) return '';
    
    // First, normalize line breaks
    let formatted = content.replace(/\r\n/g, '\n');
    
    // Replace double line breaks with paragraph tags
    formatted = '<p>' + formatted.replace(/\n\n/g, '</p><p>') + '</p>';
    
    // Replace single line breaks with <br/>
    formatted = formatted.replace(/\n/g, '<br/>');
    
    return formatted;
  };
  
  const onSubmit = async (data: PostFormValues) => {
    try {
      // Format content to preserve paragraph breaks
      const formattedContent = formatContentForPreview(data.content);
      
      if (editPostId && postToEdit) {
        // For editing a post - all fields with proper types are now included
        await editPost(editPostId, {
          title: data.title,
          excerpt: data.excerpt,
          content: formattedContent,
          slug: data.slug,
          author: data.author,
          imageUrl: data.imageUrl,
          tags: data.tags // This is already an array thanks to zod transform
        });
        toast({
          title: 'Post Updated',
          description: 'Your post has been successfully updated.',
        });
      } else {
        // For creating a new post - ensure all required fields are provided
        await addPost({
          title: data.title,
          excerpt: data.excerpt,
          content: formattedContent,
          slug: data.slug,
          author: data.author,
          imageUrl: data.imageUrl,
          tags: data.tags // This is already an array thanks to zod transform
        });
        toast({
          title: 'Post Created',
          description: 'Your new post has been successfully created.',
        });
        form.reset();
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    }
  };

  // Simple preview of how the content will look
  const contentPreview = form.watch('content');
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Post Title</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter post title" 
                      {...field} 
                      onBlur={() => {
                        if (!editPostId && !form.getValues('slug')) {
                          generateSlug();
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                      <Input placeholder="post-url-slug" {...field} />
                    </FormControl>
                    <FormDescription>
                      URL-friendly version of title
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="author"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Author</FormLabel>
                    <FormControl>
                      <Input placeholder="Author name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="excerpt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Excerpt (Subtitle)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Brief summary of the post shown as subtitle" 
                      className="h-20"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <Input placeholder="numerology, vedic, basics" {...field} />
                  </FormControl>
                  <FormDescription>
                    Comma-separated tags for the post
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <ImageUpload 
                      value={field.value || ''} 
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div>
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <Tabs defaultValue="edit" className="w-full">
                    <TabsList className="w-full mb-2">
                      <TabsTrigger value="edit" className="flex-1">Edit</TabsTrigger>
                      <TabsTrigger value="preview" className="flex-1">Preview</TabsTrigger>
                    </TabsList>
                    <TabsContent value="edit">
                      <FormControl>
                        <Textarea 
                          placeholder="Write your post content here (HTML supported)" 
                          className="h-[400px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Press Enter twice for paragraph breaks
                      </FormDescription>
                    </TabsContent>
                    <TabsContent value="preview" className="border p-4 rounded-md min-h-[400px] overflow-auto">
                      <div 
                        className="prose prose-amber max-w-none"
                        dangerouslySetInnerHTML={{ 
                          __html: formatContentForPreview(contentPreview)
                        }}
                      />
                    </TabsContent>
                  </Tabs>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {editPostId ? 'Updating...' : 'Creating...'}
            </>
          ) : (
            editPostId ? 'Update Post' : 'Create Post'
          )}
        </Button>
      </form>
    </Form>
  );
};

export default PostForm;
