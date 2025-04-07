
import React, { createContext, useContext } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

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
  addPost: (post: Omit<BlogPost, 'id' | 'date'>) => void;
  editPost: (id: string, post: Partial<Omit<BlogPost, 'id'>>) => void;
  deletePost: (id: string) => void;
  getPostBySlug: (slug: string) => BlogPost | undefined;
};

// Sample blog posts for demonstration
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
  const [posts, setPosts] = useLocalStorage<BlogPost[]>('blog-posts', samplePosts);
  const [blogToken, setBlogToken] = useLocalStorage<string | null>('blog-admin-token', null);

  const isLoggedIn = !!blogToken;

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

  const addPost = (post: Omit<BlogPost, 'id' | 'date'>) => {
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
    
    const newPost: BlogPost = {
      ...ensuredPost,
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0]
    };
    
    // Fix type issue: Create a new array instead of using functional update
    setPosts([newPost, ...posts]);
  };

  const editPost = (id: string, updates: Partial<Omit<BlogPost, 'id'>>) => {
    // Ensure tags is always an array if it exists in updates
    const ensuredUpdates = {
      ...updates,
      tags: updates.tags ? (Array.isArray(updates.tags) ? updates.tags : []) : undefined
    };
    
    // Fix type issue: Create a new array instead of using functional update
    const updatedPosts = posts.map(post => 
      post.id === id ? { ...post, ...ensuredUpdates } : post
    );
    
    setPosts(updatedPosts);
  };

  const deletePost = (id: string) => {
    // Fix type issue: Create a new array instead of using functional update
    const filteredPosts = posts.filter(post => post.id !== id);
    setPosts(filteredPosts);
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
        getPostBySlug
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
