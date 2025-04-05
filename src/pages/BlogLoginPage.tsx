
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useBlog } from '../context/BlogContext';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from '@/hooks/use-toast';
import { ChevronLeft, Mail, Key, FileText, Users } from 'lucide-react';

// Admin Login Form Schema
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

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

type LoginFormValues = z.infer<typeof loginSchema>;
type PostFormValues = z.infer<typeof postSchema>;

const BlogLoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, login, logout, posts, addPost, editPost, getPostBySlug } = useBlog();
  const [activeTab, setActiveTab] = useState('login');
  
  // Extract post ID from URL if editing
  const queryParams = new URLSearchParams(location.search);
  const editPostId = queryParams.get('edit');
  const postToEdit = editPostId ? posts.find(p => p.id === editPostId) : null;
  
  // Set up forms
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  
  // Fix: Make sure tags is properly handled as a string in the form
  // but will be transformed to string[] through zod's transform
  const postForm = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: postToEdit?.title || '',
      excerpt: postToEdit?.excerpt || '',
      content: postToEdit?.content || '',
      slug: postToEdit?.slug || '',
      author: postToEdit?.author || 'Admin',
      imageUrl: postToEdit?.imageUrl || '',
      // Convert tags array back to comma-separated string for the form
      // tags is expected to be a string in the form, not a string[]
      tags: postToEdit?.tags ? postToEdit.tags.join(', ') : 'vedic, numerology',
    },
  });
  
  // Handle login form submission
  const onLoginSubmit = async (data: LoginFormValues) => {
    const success = await login(data.email, data.password);
    if (success) {
      toast({
        title: 'Login Successful',
        description: 'Welcome to the blog admin area!',
        variant: 'default',
      });
    } else {
      toast({
        title: 'Login Failed',
        description: 'Invalid email or password. Please try again.',
        variant: 'destructive',
      });
    }
  };
  
  // Handle post form submission
  const onPostSubmit = (data: PostFormValues) => {
    try {
      if (editPostId && postToEdit) {
        // For editing a post - all fields with proper types are now included
        editPost(editPostId, {
          title: data.title,
          excerpt: data.excerpt,
          content: data.content,
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
        addPost({
          title: data.title,
          excerpt: data.excerpt,
          content: data.content,
          slug: data.slug,
          author: data.author,
          imageUrl: data.imageUrl,
          tags: data.tags // This is already an array thanks to zod transform
        });
        toast({
          title: 'Post Created',
          description: 'Your new post has been successfully created.',
        });
        postForm.reset();
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    }
  };
  
  // Auto-generate slug from title
  const generateSlug = () => {
    const title = postForm.getValues('title');
    if (title) {
      const slug = title
        .toLowerCase()
        .replace(/[^\w\s]/gi, '')
        .replace(/\s+/g, '-');
      postForm.setValue('slug', slug);
    }
  };
  
  // Effect to update active tab and form based on login status
  useEffect(() => {
    if (isLoggedIn) {
      setActiveTab(editPostId ? 'edit-post' : 'create-post');
    } else {
      setActiveTab('login');
    }
  }, [isLoggedIn, editPostId]);
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-amber-50 to-amber-100">
      <NavBar />
      <main className="flex-grow pt-16 pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            {/* Back button */}
            <div className="mb-6">
              <Button variant="outline" onClick={() => navigate('/blog')} className="flex items-center">
                <ChevronLeft className="mr-2 h-4 w-4" /> Back to Blog
              </Button>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-amber-900">
                  Blog Administration
                </CardTitle>
                <CardDescription>
                  {isLoggedIn 
                    ? 'Manage your blog posts and content' 
                    : 'Login to manage your blog'}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                {!isLoggedIn ? (
                  <Form {...loginForm}>
                    <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                      <FormField
                        control={loginForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center">
                              <Mail className="mr-2 h-4 w-4" /> Email
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your email" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={loginForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center">
                              <Key className="mr-2 h-4 w-4" /> Password
                            </FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="Enter your password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button type="submit" className="w-full">
                        Login
                      </Button>
                    </form>
                  </Form>
                ) : (
                  <>
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-semibold">Welcome, Admin!</h2>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          className="flex items-center" 
                          onClick={() => navigate('/subscribers')}
                        >
                          <Users className="mr-2 h-4 w-4" />
                          Subscriber List
                        </Button>
                        <Button variant="secondary" onClick={logout}>
                          Logout
                        </Button>
                      </div>
                    </div>
                  
                    <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab}>
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="create-post">
                          <FileText className="mr-2 h-4 w-4" /> 
                          {editPostId ? 'Edit Post' : 'Create Post'}
                        </TabsTrigger>
                        <TabsTrigger 
                          value="manage-posts"
                          disabled={!!editPostId}
                        >
                          Manage Posts
                        </TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="create-post" className="pt-4">
                        <Form {...postForm}>
                          <form onSubmit={postForm.handleSubmit(onPostSubmit)} className="space-y-4">
                            <FormField
                              control={postForm.control}
                              name="title"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Post Title</FormLabel>
                                  <FormControl>
                                    <Input 
                                      placeholder="Enter post title" 
                                      {...field} 
                                      onBlur={() => {
                                        if (!editPostId && !postForm.getValues('slug')) {
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
                                control={postForm.control}
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
                                control={postForm.control}
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
                              control={postForm.control}
                              name="excerpt"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Excerpt</FormLabel>
                                  <FormControl>
                                    <Textarea 
                                      placeholder="Brief summary of the post" 
                                      className="h-20"
                                      {...field} 
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={postForm.control}
                              name="content"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Content</FormLabel>
                                  <FormControl>
                                    <Textarea 
                                      placeholder="Write your post content here (HTML supported)" 
                                      className="h-48"
                                      {...field} 
                                    />
                                  </FormControl>
                                  <FormDescription>
                                    HTML tags are supported for formatting
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={postForm.control}
                              name="imageUrl"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Featured Image URL</FormLabel>
                                  <FormControl>
                                    <Input placeholder="/path/to/image.jpg" {...field} />
                                  </FormControl>
                                  <FormDescription>
                                    Optional image URL for the post
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={postForm.control}
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
                            
                            <Button type="submit" className="w-full">
                              {editPostId ? 'Update Post' : 'Create Post'}
                            </Button>
                          </form>
                        </Form>
                      </TabsContent>
                      
                      <TabsContent value="manage-posts" className="pt-4">
                        <div className="space-y-4">
                          {posts.length === 0 ? (
                            <p className="text-center text-gray-500 py-8">No posts yet. Create your first post!</p>
                          ) : (
                            posts.map(post => (
                              <Card key={post.id} className="overflow-hidden">
                                <CardContent className="p-0">
                                  <div className="p-4">
                                    <h3 className="font-bold truncate">{post.title}</h3>
                                    <p className="text-sm text-gray-500 mt-1">
                                      {new Date(post.date).toLocaleDateString()} • {post.author}
                                    </p>
                                  </div>
                                  <div className="bg-gray-50 px-4 py-3 flex justify-end gap-2">
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      onClick={() => navigate(`/blog/${post.slug}`)}
                                    >
                                      View
                                    </Button>
                                    <Button 
                                      variant="default" 
                                      size="sm"
                                      onClick={() => navigate(`/blog/admin?edit=${post.id}`)}
                                    >
                                      Edit
                                    </Button>
                                  </div>
                                </CardContent>
                              </Card>
                            ))
                          )}
                        </div>
                      </TabsContent>
                    </Tabs>
                  </>
                )}
              </CardContent>
              
              <CardFooter className="flex justify-center border-t pt-4">
                <p className="text-sm text-gray-500">
                  Vedic Wisdom Admin Portal • v1.0
                </p>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BlogLoginPage;
