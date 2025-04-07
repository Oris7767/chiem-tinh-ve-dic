
import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useBlog } from '../context/BlogContext';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import { Button } from '@/components/ui/button';
import { CalendarIcon, ArrowLeft, Tag, User, Edit, Trash2, Loader2 } from 'lucide-react';
import NewsletterSignup from '../components/NewsletterSignup';
import { Skeleton } from "@/components/ui/skeleton";
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
            
            {post.imageUrl && (
              <div className="mb-8 rounded-lg overflow-hidden shadow-md">
                <img 
                  src={post.imageUrl} 
                  alt={post.title}
                  className="w-full h-64 object-cover"
                />
              </div>
            )}
            
            <div className="bg-white rounded-lg shadow-xl p-8 mb-12">
              <h1 className="text-3xl md:text-4xl font-bold text-amber-900 mb-4">
                {post.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-amber-700 mb-6">
                <span className="flex items-center">
                  <User size={16} className="mr-1" />
                  {post.author}
                </span>
                <span className="flex items-center">
                  <CalendarIcon size={16} className="mr-1" />
                  {post.date}
                </span>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map(tag => (
                    <span 
                      key={tag} 
                      className="inline-flex items-center bg-amber-100 px-2 py-1 rounded-full text-xs text-amber-800"
                    >
                      <Tag size={10} className="mr-1" />
                      {tag}
                    </span>
                  ))}
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
              
              <div 
                className="prose prose-amber max-w-none"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </div>
            
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
