
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  addPost: (post: Omit<BlogPost, 'id' | 'date'>) => Promise<void>;
  editPost: (id: string, post: Partial<Omit<BlogPost, 'id'>>) => Promise<void>;
  deletePost: (id: string) => Promise<void>;
  getPostBySlug: (slug: string) => BlogPost | undefined;
  loading: boolean;
};

// Sample blog posts for local development if Supabase fetch fails
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
  const [blogToken, setBlogToken] = useLocalStorage<string | null>('blog-admin-token', null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const isLoggedIn = !!blogToken;
  
  // Fetch posts from Supabase on initial load
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .order('date', { ascending: false });
        
        if (error) {
          console.error('Error fetching blog posts:', error);
          setPosts(samplePosts);
          toast({
            title: 'Error fetching posts',
            description: 'Using sample posts instead.',
            variant: 'destructive'
          });
        } else {
          // Map the database schema to our BlogPost type
          const formattedPosts = data.map(post => ({
            id: post.id,
            title: post.title,
            content: post.content,
            excerpt: post.excerpt,
            slug: post.slug,
            author: post.author,
            date: post.date,
            imageUrl: post.image_url || undefined,
            tags: post.tags || []
          }));
          
          setPosts(formattedPosts);
        }
      } catch (err) {
        console.error('Failed to fetch posts:', err);
        setPosts(samplePosts);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [toast]);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Master account login
    if (email === 'votiveacademy@gmail.com' && password === 'Votive@6789') {
      setBlogToken('master-token-' + Date.now());
      return true;
    }
    return false;
  };

  const logout = () => {
    setBlogToken(null);
  };

  const addPost = async (post: Omit<BlogPost, 'id' | 'date'>) => {
    try {
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
      
      // Insert into Supabase
      const { data, error } = await supabase.from('blog_posts').insert({
        title: ensuredPost.title,
        content: ensuredPost.content,
        excerpt: ensuredPost.excerpt,
        slug: ensuredPost.slug,
        author: ensuredPost.author,
        image_url: ensuredPost.imageUrl || null,
        tags: ensuredPost.tags
      }).select();
      
      if (error) {
        console.error('Error adding post to Supabase:', error);
        toast({
          title: 'Error',
          description: 'Failed to add post. Please try again.',
          variant: 'destructive'
        });
        return;
      }
      
      // Add the new post to local state
      const newPost: BlogPost = {
        id: data[0].id,
        title: data[0].title,
        content: data[0].content,
        excerpt: data[0].excerpt,
        slug: data[0].slug,
        author: data[0].author,
        date: data[0].date,
        imageUrl: data[0].image_url || undefined,
        tags: data[0].tags || []
      };
      
      setPosts([newPost, ...posts]);
      toast({
        title: 'Success',
        description: 'Post has been published.',
      });
    } catch (err) {
      console.error('Failed to add post:', err);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred.',
        variant: 'destructive'
      });
    }
  };

  const editPost = async (id: string, updates: Partial<Omit<BlogPost, 'id'>>) => {
    try {
      // Ensure tags is always an array if it exists in updates
      const ensuredUpdates = {
        ...updates,
        tags: updates.tags ? (Array.isArray(updates.tags) ? updates.tags : []) : undefined,
        image_url: updates.imageUrl
      };
      
      // Remove imageUrl from updates as we're using image_url in Supabase
      if (ensuredUpdates.imageUrl) {
        delete ensuredUpdates.imageUrl;
      }
      
      // Update in Supabase
      const { error } = await supabase
        .from('blog_posts')
        .update(ensuredUpdates)
        .eq('id', id);
      
      if (error) {
        console.error('Error updating post in Supabase:', error);
        toast({
          title: 'Error',
          description: 'Failed to update post. Please try again.',
          variant: 'destructive'
        });
        return;
      }
      
      // Update local state
      const updatedPosts = posts.map(post => 
        post.id === id ? { 
          ...post, 
          ...updates,
          imageUrl: updates.imageUrl || post.imageUrl 
        } : post
      );
      
      setPosts(updatedPosts);
      toast({
        title: 'Success',
        description: 'Post has been updated.',
      });
    } catch (err) {
      console.error('Failed to update post:', err);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred.',
        variant: 'destructive'
      });
    }
  };

  const deletePost = async (id: string) => {
    try {
      // Delete from Supabase
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting post from Supabase:', error);
        toast({
          title: 'Error',
          description: 'Failed to delete post. Please try again.',
          variant: 'destructive'
        });
        return;
      }
      
      // Update local state
      const filteredPosts = posts.filter(post => post.id !== id);
      setPosts(filteredPosts);
      toast({
        title: 'Success',
        description: 'Post has been deleted.',
      });
    } catch (err) {
      console.error('Failed to delete post:', err);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred.',
        variant: 'destructive'
      });
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
        login, 
        logout, 
        addPost, 
        editPost, 
        deletePost,
        getPostBySlug,
        loading
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
