
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useBlog } from '../context/BlogContext';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import LoginForm from '../components/blog/LoginForm';
import PostForm from '../components/blog/PostForm';
import PostsList from '../components/blog/PostsList';
import AdminHeader from '../components/blog/AdminHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChevronLeft, FileText } from 'lucide-react';

const BlogLoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, posts, getPostBySlug } = useBlog();
  const [activeTab, setActiveTab] = useState('login');
  
  // Extract post ID from URL if editing
  const queryParams = new URLSearchParams(location.search);
  const editPostId = queryParams.get('edit');
  const postToEdit = editPostId ? posts.find(p => p.id === editPostId) : null;
  
  // Effect to update active tab based on login status
  useEffect(() => {
    if (isLoggedIn) {
      setActiveTab(editPostId ? 'create-post' : 'create-post');
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
                  <LoginForm />
                ) : (
                  <>
                    <AdminHeader />
                  
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
                        <PostForm editPostId={editPostId} postToEdit={postToEdit} />
                      </TabsContent>
                      
                      <TabsContent value="manage-posts" className="pt-4">
                        <PostsList />
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
