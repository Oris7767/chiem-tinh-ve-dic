
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../integrations/supabase/client';
import Cookies from 'js-cookie';
import { useToast } from "@/hooks/use-toast";

export type BlogPost = {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  slug: string;
  author: string;
  date: string;
  imageUrl?: string;
  tags: string[];
};

type BlogContextType = {
  posts: BlogPost[];
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  addPost: (post: Omit<BlogPost, 'id' | 'date'>) => Promise<void>;
  editPost: (id: string, post: Partial<Omit<BlogPost, 'id'>>) => Promise<void>;
  deletePost: (id: string) => Promise<void>;
  getPostBySlug: (slug: string) => BlogPost | undefined;
  fetchPosts: () => Promise<void>;
};

// Sample blog posts for demonstration (will be used as fallback if database fetch fails)
const samplePosts: BlogPost[] = [
  {
    id: '1',
    title: 'Introduction to Vedic Numerology',
    content: `<p>Vedic Numerology is an ancient system that helps us understand the influence of numbers in our lives. Dating back thousands of years to the sacred Vedic texts of India, this numerological system provides insights into personality traits, life paths, and even future events.</p>
    <p>Unlike Western numerology, Vedic Numerology places special emphasis on the relationship between numbers and planets. Each number from 1 to 9 corresponds to a celestial body, carrying its unique energy and characteristics.</p>
    <p>In upcoming posts, we'll explore the meanings of each number and how you can use this ancient wisdom in your daily life.</p>`,
    excerpt: 'Discover the ancient wisdom of Vedic Numerology and how it can reveal insights about your life path.',
    slug: 'introduction-to-vedic-numerology',
    author: 'Admin',
    date: '2024-03-28',
    imageUrl: '/lovable-uploads/97fa6e16-3fd9-42cd-887d-d6d1d4d3ee6b.png',
    tags: ['numerology', 'basics', 'vedic']
  },
  {
    id: '2',
    title: 'Understanding Your Birth Number',
    content: `<p>Your Birth Number is one of the most important calculations in Vedic Numerology. It's derived from your birth date and reveals your inherent characteristics and tendencies.</p>
    <p>To calculate your Birth Number, simply reduce your birth date to a single digit. For example, if you were born on the 29th, add 2 + 9 = 11, then 1 + 1 = 2. Your Birth Number would be 2.</p>
    <p>Each Birth Number has its own significance:</p>
    <ul>
      <li><strong>Birth Number 1 (Sun):</strong> Natural leaders, independent, creative</li>
      <li><strong>Birth Number 2 (Moon):</strong> Sensitive, intuitive, diplomatic</li>
      <li><strong>Birth Number 3 (Jupiter):</strong> Optimistic, expressive, creative</li>
      <li><strong>Birth Number 4 (Rahu):</strong> Practical, methodical, stable</li>
      <li><strong>Birth Number 5 (Mercury):</strong> Adaptable, versatile, freedom-loving</li>
      <li><strong>Birth Number 6 (Venus):</strong> Nurturing, responsible, harmonious</li>
      <li><strong>Birth Number 7 (Ketu):</strong> Analytical, spiritual, introspective</li>
      <li><strong>Birth Number 8 (Saturn):</strong> Ambitious, organized, authoritative</li>
      <li><strong>Birth Number 9 (Mars):</strong> Courageous, transformative, humanitarian</li>
    </ul>
    <p>Try our calculator to find your Birth Number and discover what it reveals about you!</p>`,
    excerpt: 'Learn how to calculate your Birth Number and what it reveals about your fundamental traits.',
    slug: 'understanding-your-birth-number',
    author: 'Admin',
    date: '2024-04-01',
    imageUrl: '/lovable-uploads/f6d29b28-b81f-4c32-996a-48ed1446c80c.png',
    tags: ['numerology', 'birth number', 'calculation']
  }
];

const BlogContext = createContext<BlogContextType | undefined>(undefined);

export const BlogProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [blogToken, setBlogToken] = useState<string | null>(Cookies.get('blog-admin-token') || null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const isLoggedIn = !!blogToken;
  
  // Fetch posts from Supabase
  const fetchPosts = useCallback(async () => {
    setIsLoading(true);
    try {
      console.log('Fetching posts from Supabase...');
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('date', { ascending: false });
      
      if (error) {
        console.error('Error fetching posts:', error);
        // Use sample posts as fallback
        setPosts(samplePosts);
        toast({
          title: "Error fetching posts",
          description: "Using sample posts instead. Error: " + error.message,
          variant: "destructive",
        });
      } else if (data) {
        console.log('Successfully fetched posts:', data.length);
        // Transform Supabase data format to match our BlogPost type
        const formattedPosts: BlogPost[] = data.map(post => ({
          id: post.id,
          title: post.title,
          content: post.content,
          excerpt: post.excerpt,
          slug: post.slug,
          author: post.author,
          date: new Date(post.date).toISOString().split('T')[0],
          imageUrl: post.image_url || undefined,
          tags: post.tags || []
        }));
        setPosts(formattedPosts);
      } else {
        console.log('No posts returned, using sample posts');
        setPosts(samplePosts);
      }
    } catch (error) {
      console.error('Unexpected error fetching posts:', error);
      // Use sample posts as fallback
      setPosts(samplePosts);
      toast({
        title: "Error fetching posts",
        description: "Using sample posts instead. Unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);
  
  // Initial fetch on mount
  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Master account login
    if (email === 'votiveacademy@gmail.com' && password === 'Votive@6789') {
      const token = 'master-token-' + Date.now();
      Cookies.set('blog-admin-token', token);
      setBlogToken(token);
      return true;
    }
    return false;
  };

    const logout = () => {
    Cookies.remove('blog-admin-token');
    setBlogToken(null);
  };

  const addPost = async (post: Omit<BlogPost, 'id' | 'date'>) => {
    // Validate that post has all required fields with correct types
    if (!post.title || !post.content || !post.excerpt || !post.slug || !post.author) {
      console.error("Missing required fields in post data");
      return;
    }
    
    // Ensure tags is always an array
    const ensuredPost = {
      ...post,
      tags: Array.isArray(post.tags) ? post.tags : []
    };
    
    setIsLoading(true);
    
    try {
      console.log('Adding new post to Supabase:', ensuredPost);
      
      // Insert the post into Supabase
      const { data, error } = await supabase
        .from('blog_posts')
        .insert([
          {
            title: ensuredPost.title,
            content: ensuredPost.content,
            excerpt: ensuredPost.excerpt,
            slug: ensuredPost.slug,
            author: ensuredPost.author,
            image_url: ensuredPost.imageUrl, // Store the full URL from Supabase storage
            tags: ensuredPost.tags
          }
        ])
        .select();
      
      if (error) {
        console.error('Error adding post:', error);
        throw error;
      }
      
      // Add the new post to the state
      if (data && data[0]) {
        const newPost: BlogPost = {
          id: data[0].id,
          title: data[0].title,
          content: data[0].content,
          excerpt: data[0].excerpt,
          slug: data[0].slug,
          author: data[0].author,
          date: new Date(data[0].date).toISOString().split('T')[0],
          imageUrl: data[0].image_url || undefined,
          tags: data[0].tags || []
        };
        
        console.log('New post created in Supabase:', newPost);
        setPosts(prevPosts => [newPost, ...prevPosts]);
        
        toast({
          title: "Post created",
          description: "Your post has been successfully created",
        });
      }
    } catch (error: any) {
      console.error('Error adding post:', error);
      toast({
        title: "Error creating post",
        description: "There was a problem creating your post: " + (error?.message || "Unknown error"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const editPost = async (id: string, updates: Partial<Omit<BlogPost, 'id'>>) => {
    // Ensure tags is always an array if it exists in updates
    const ensuredUpdates = {
      ...updates,
      tags: updates.tags ? (Array.isArray(updates.tags) ? updates.tags : []) : undefined,
      image_url: updates.imageUrl // Map to the correct field name for Supabase
    };
    
    // Remove the imageUrl field as we're using image_url for Supabase
    if ('imageUrl' in ensuredUpdates) {
      delete ensuredUpdates.imageUrl;
    }
    
    setIsLoading(true);
    
    try {
      console.log('Updating post in Supabase:', id, ensuredUpdates);
      const { error } = await supabase
        .from('blog_posts')
        .update(ensuredUpdates)
        .eq('id', id);
      
      if (error) {
        console.error('Error updating post:', error);
        throw error;
      }
      
      // Update the post in the state
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post.id === id ? { 
            ...post, 
            ...updates,
            // Make sure we keep imageUrl in our state (from image_url in updates)
            imageUrl: updates.imageUrl !== undefined ? updates.imageUrl : post.imageUrl
          } : post
        )
      );
      
      console.log('Post updated in Supabase:', id);
      toast({
        title: "Post updated",
        description: "Your post has been successfully updated",
      });
    } catch (error: any) {
      console.error('Error updating post:', error);
      toast({
        title: "Error updating post",
        description: "There was a problem updating your post: " + (error?.message || "Unknown error"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deletePost = async (id: string) => {
    setIsLoading(true);
    
    try {
      console.log('Deleting post from Supabase:', id);
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting post:', error);
        throw error;
      }
      
      // Remove the post from the state
      setPosts(prevPosts => prevPosts.filter(post => post.id !== id));
      
      console.log('Post deleted from Supabase:', id);
      toast({
        title: "Post deleted",
        description: "Your post has been successfully deleted",
      });
    } catch (error: any) {
      console.error('Error deleting post:', error);
      toast({
        title: "Error deleting post",
        description: "There was a problem deleting your post: " + (error?.message || "Unknown error"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getPostBySlug = (slug: string) => {
    return posts.find(post => post.slug === slug);
  };

  return (
    <BlogContext.Provider 
      value={{ 
        posts, 
        isLoggedIn,
        isLoading,
        login, 
        logout, 
        addPost, 
        editPost, 
        deletePost,
        getPostBySlug,
        fetchPosts
      }}
    >
      {children}
    </BlogContext.Provider>
  );
};

export const useBlog = () => {
  const context = useContext(BlogContext);
  if (context === undefined) {
    throw new Error('useBlog must be used within a BlogProvider');
  }
  return context;
};
