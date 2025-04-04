
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useBlog, BlogPost } from '../context/BlogContext';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useForm } from 'react-hook-form';

type LoginFormData = {
  email: string;
  password: string;
};

type PostFormData = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  imageUrl: string;
  tags: string;
};

const BlogLoginPage = () => {
  const { t } = useLanguage();
  const { isLoggedIn, login, logout, posts, addPost, editPost } = useBlog();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  
  const { register: registerLogin, handleSubmit: handleLoginSubmit, formState: { errors: loginErrors } } = useForm<LoginFormData>();
  const { register: registerPost, handleSubmit: handlePostSubmit, formState: { errors: postErrors }, reset: resetPostForm, setValue } = useForm<PostFormData>();
  
  // Check if we need to edit a post based on URL query params
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const editId = queryParams.get('edit');
    
    if (editId) {
      const postToEdit = posts.find(p => p.id === editId);
      if (postToEdit) {
        setEditingPostId(editId);
        setActiveTab('create');
        
        // Pre-fill the form with post data
        setValue('title', postToEdit.title);
        setValue('slug', postToEdit.slug);
        setValue('excerpt', postToEdit.excerpt);
        setValue('content', postToEdit.content);
        setValue('author', postToEdit.author);
        setValue('imageUrl', postToEdit.imageUrl || '');
        setValue('tags', postToEdit.tags.join(', '));
      }
    }
  }, [location.search, posts, setValue]);
  
  // Redirect if not logged in (except for login tab)
  useEffect(() => {
    if (!isLoggedIn && activeTab !== 'login') {
      setActiveTab('login');
    }
  }, [isLoggedIn, activeTab]);
  
  const onLoginSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    try {
      const success = await login(data.email, data.password);
      if (success) {
        toast({
          title: 'Login Successful',
          description: 'You are now logged in as an admin.',
        });
        setActiveTab('create');
      } else {
        toast({
          title: 'Login Failed',
          description: 'Invalid email or password.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Login Error',
        description: 'An error occurred during login.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const onPostSubmit = (data: PostFormData) => {
    const tagArray = data.tags.split(',').map(tag => tag.trim().toLowerCase());
    
    if (editingPostId) {
      editPost(editingPostId, {
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        content: data.content,
        author: data.author,
        imageUrl: data.imageUrl,
        tags: tagArray,
      });
      
      toast({
        title: 'Post Updated',
        description: 'Your post has been updated successfully.',
      });
      
      setEditingPostId(null);
    } else {
      addPost({
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        content: data.content,
        author: data.author,
        imageUrl: data.imageUrl,
        tags: tagArray,
      });
      
      toast({
        title: 'Post Created',
        description: 'Your post has been created successfully.',
      });
    }
    
    resetPostForm();
    navigate('/blog');
  };
  
  const handleLogout = () => {
    logout();
    toast({
      title: 'Logged Out',
      description: 'You have been logged out successfully.',
    });
    navigate('/blog');
  };
  
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s]/gi, '')
      .replace(/\s+/g, '-');
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-amber-50 to-amber-100">
      <NavBar />
      <main className="flex-grow pt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-amber-900 mb-2">
                {isLoggedIn ? (t('blog.adminPanel') || 'Blog Admin Panel') : (t('blog.loginTitle') || 'Admin Login')}
              </h1>
              <p className="text-lg text-amber-800 max-w-2xl mx-auto">
                {isLoggedIn 
                  ? (t('blog.adminDesc') || 'Manage your blog posts and content')
                  : (t('blog.loginDesc') || 'Please login to access the blog admin panel')}
              </p>
            </div>
            
            <Card className="shadow-xl">
              <CardContent className="pt-6">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="login" disabled={isLoggedIn}>Login</TabsTrigger>
                    <TabsTrigger value="create" disabled={!isLoggedIn}>
                      {editingPostId ? 'Edit Post' : 'Create Post'}
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="login">
                    <form onSubmit={handleLoginSubmit(onLoginSubmit)} className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="admin@example.com"
                          {...registerLogin('email', { required: 'Email is required' })}
                        />
                        {loginErrors.email && (
                          <p className="text-sm text-red-500">{loginErrors.email.message}</p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                          id="password"
                          type="password"
                          placeholder="********"
                          {...registerLogin('password', { required: 'Password is required' })}
                        />
                        {loginErrors.password && (
                          <p className="text-sm text-red-500">{loginErrors.password.message}</p>
                        )}
                      </div>
                      
                      <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? 'Logging in...' : 'Login'}
                      </Button>
                      
                      <p className="text-sm text-amber-700 text-center">
                        For demo purposes, use: admin@example.com / admin123
                      </p>
                    </form>
                  </TabsContent>
                  
                  <TabsContent value="create">
                    {isLoggedIn && (
                      <form onSubmit={handlePostSubmit(onPostSubmit)} className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="title">Title</Label>
                          <Input
                            id="title"
                            {...registerPost('title', { required: 'Title is required' })}
                            onChange={(e) => {
                              registerPost('title').onChange(e);
                              if (!editingPostId) {
                                setValue('slug', generateSlug(e.target.value));
                              }
                            }}
                          />
                          {postErrors.title && (
                            <p className="text-sm text-red-500">{postErrors.title.message}</p>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="slug">Slug</Label>
                          <Input
                            id="slug"
                            {...registerPost('slug', { required: 'Slug is required' })}
                          />
                          {postErrors.slug && (
                            <p className="text-sm text-red-500">{postErrors.slug.message}</p>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="excerpt">Excerpt</Label>
                          <Textarea
                            id="excerpt"
                            {...registerPost('excerpt', { required: 'Excerpt is required' })}
                          />
                          {postErrors.excerpt && (
                            <p className="text-sm text-red-500">{postErrors.excerpt.message}</p>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="content">Content (HTML)</Label>
                          <Textarea
                            id="content"
                            rows={10}
                            {...registerPost('content', { required: 'Content is required' })}
                          />
                          {postErrors.content && (
                            <p className="text-sm text-red-500">{postErrors.content.message}</p>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="author">Author</Label>
                          <Input
                            id="author"
                            {...registerPost('author', { required: 'Author is required' })}
                          />
                          {postErrors.author && (
                            <p className="text-sm text-red-500">{postErrors.author.message}</p>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="imageUrl">Image URL (optional)</Label>
                          <Input
                            id="imageUrl"
                            {...registerPost('imageUrl')}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="tags">Tags (comma separated)</Label>
                          <Input
                            id="tags"
                            {...registerPost('tags', { required: 'At least one tag is required' })}
                            placeholder="numerology, vedic, astrology"
                          />
                          {postErrors.tags && (
                            <p className="text-sm text-red-500">{postErrors.tags.message}</p>
                          )}
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button type="submit" className="flex-1">
                            {editingPostId ? 'Update Post' : 'Create Post'}
                          </Button>
                          <Button type="button" variant="outline" onClick={handleLogout}>
                            Logout
                          </Button>
                        </div>
                      </form>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BlogLoginPage;
