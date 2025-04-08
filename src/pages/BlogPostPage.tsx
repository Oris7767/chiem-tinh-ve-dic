
import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useBlog } from '../context/BlogContext';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import { Button } from '@/components/ui/button';
import { CalendarIcon, ArrowLeft, Tag, User, Edit, Trash2, Loader2, MessageSquare, Share2, RefreshCw } from 'lucide-react';
import NewsletterSignup from '../components/NewsletterSignup';
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const BlogPostPage = () => {
  const { t } = useLanguage();
  const { slug } = useParams<{ slug: string }>();
  const { getPostBySlug, isLoggedIn, deletePost, isLoading } = useBlog();
  const navigate = useNavigate();
  
  const post = getPostBySlug(slug || '');
  
  useEffect(() => {
    if (!isLoading && !post) {
      navigate('/blog');
    }
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, [post, navigate, isLoading]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-amber-50 to-amber-100">
        <NavBar />
        <main className="flex-grow pt-16">
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
              <div className="mb-6">
                <Link to="/blog" className="inline-flex items-center text-amber-700 hover:text-amber-900 transition-colors">
                  <ArrowLeft size={16} className="mr-2" />
                  {t('blog.backToBlog') || 'Back to Blog'}
                </Link>
              </div>
              
              <div className="mb-8 rounded-lg overflow-hidden shadow-md">
                <Skeleton className="w-full h-64" />
              </div>
              
              <div className="bg-white rounded-lg shadow-xl p-8 mb-12">
                <Skeleton className="h-10 w-3/4 mb-4" />
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-amber-700 mb-6">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-5 w-24" />
                  <div className="flex flex-wrap gap-2">
                    <Skeleton className="h-5 w-16 rounded-full" />
                    <Skeleton className="h-5 w-16 rounded-full" />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (!post) return null;
  
  const handleDelete = async () => {
    await deletePost(post.id);
    navigate('/blog');
  };

  // Get author initials for avatar
  const getAuthorInitials = (name: string) => {
    return name.split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-amber-50 to-amber-100">
      <NavBar />
      <main className="flex-grow pt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <Link to="/blog" className="inline-flex items-center text-amber-700 hover:text-amber-900 transition-colors">
                <ArrowLeft size={16} className="mr-2" />
                {t('blog.backToBlog') || 'Back to Blog'}
              </Link>
            </div>
            
            <article className="bg-white rounded-lg shadow-xl overflow-hidden mb-12">
              {post.imageUrl && (
                <div className="w-full h-80 overflow-hidden">
                  <img 
                    src={post.imageUrl} 
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <div className="p-8">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2 leading-tight">
                  {post.title}
                </h1>
                
                <p className="text-xl text-gray-600 mb-6 italic">
                  "{post.excerpt}"
                </p>
                
                <div className="flex items-center mb-8">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback>{getAuthorInitials(post.author)}</AvatarFallback>
                  </Avatar>
                  <div className="ml-3">
                    <p className="font-semibold text-gray-900">{post.author}</p>
                    <p className="text-sm text-gray-600 flex items-center">
                      <CalendarIcon size={14} className="mr-1" />
                      {post.date}
                    </p>
                  </div>
                </div>
                
                {isLoggedIn && (
                  <div className="flex gap-2 mb-6">
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/blog/admin?edit=${post.id}`}>
                        <Edit size={16} className="mr-1" />
                        Edit
                      </Link>
                    </Button>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm">
                          <Trash2 size={16} className="mr-1" />
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the post.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                )}
                
                <div className="tags flex flex-wrap gap-2 mb-6">
                  {post.tags.map(tag => (
                    <span 
                      key={tag} 
                      className="inline-flex items-center bg-amber-100 px-3 py-1 rounded-full text-sm text-amber-800"
                    >
                      <Tag size={12} className="mr-2" />
                      {tag}
                    </span>
                  ))}
                </div>
                
                <Separator className="my-6" />
                
                <div 
                  className="prose prose-lg prose-amber max-w-none"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
                
                <div className="mt-10 flex justify-between items-center">
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="flex items-center">
                      <MessageSquare size={16} className="mr-2" /> Comments
                    </Button>
                    <Button variant="outline" size="sm" className="flex items-center">
                      <Share2 size={16} className="mr-2" /> Share
                    </Button>
                  </div>
                  <Button variant="ghost" size="sm" className="flex items-center">
                    <RefreshCw size={16} className="mr-2" /> Refresh
                  </Button>
                </div>
              </div>
            </article>
            
            <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
              <h2 className="text-2xl font-bold text-amber-900 mb-4">
                {t('blog.stayUpdated') || 'Stay Updated'}
              </h2>
              <NewsletterSignup />
            </div>
            
            <div className="text-center">
              <Button asChild>
                <Link to="/blog">
                  {t('blog.viewMorePosts') || 'View More Posts'}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BlogPostPage;
