
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useBlog } from '../context/BlogContext';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarIcon, Tag, User, LogIn, Loader2 } from 'lucide-react';
import NewsletterSignup from '../components/NewsletterSignup';
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const BlogPage = () => {
  const { t } = useLanguage();
  const { posts, isLoggedIn, isLoading } = useBlog();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Extract all unique tags from posts
  const allTags = Array.from(new Set(posts.flatMap(post => post.tags)));

  // Filter posts based on search term and selected tag
  const filteredPosts = posts.filter(post => {
    const matchesSearch = searchTerm === '' || 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTag = selectedTag === null || post.tags.includes(selectedTag);
    
    return matchesSearch && matchesTag;
  });

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
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-amber-900 mb-2">
                {t('blog.title') || 'Vedic Wisdom Blog'}
              </h1>
              <p className="text-lg text-amber-800 max-w-2xl mx-auto">
                {t('blog.subtitle') || 'Explore the ancient wisdom of Vedic numerology and astrology through our articles and insights'}
              </p>
            </div>

            <div className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="w-full md:w-1/2">
                <Input
                  type="search"
                  placeholder={t('blog.searchPlaceholder') || 'Search articles...'}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                  disabled={isLoading}
                />
              </div>
              
              <div className="flex space-x-4">
                {isLoggedIn ? (
                  <Button asChild variant="default">
                    <Link to="/blog/admin">
                      {t('blog.adminPanel') || 'Admin Panel'}
                    </Link>
                  </Button>
                ) : (
                  <Button asChild variant="outline">
                    <Link to="/blog/admin" className="flex items-center space-x-2">
                      <LogIn size={16} />
                      <span>{t('blog.adminLogin') || 'Admin Login'}</span>
                    </Link>
                  </Button>
                )}
              </div>
            </div>

            <Tabs defaultValue="all" className="mb-8">
              <TabsList className="mb-4">
                <TabsTrigger 
                  value="all"
                  onClick={() => setSelectedTag(null)}
                  disabled={isLoading}
                >
                  {t('blog.allPosts') || 'All Posts'}
                </TabsTrigger>
                {allTags.map(tag => (
                  <TabsTrigger 
                    key={tag} 
                    value={tag}
                    onClick={() => setSelectedTag(tag)}
                    disabled={isLoading}
                  >
                    {tag.charAt(0).toUpperCase() + tag.slice(1)}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Card key={i} className="overflow-hidden">
                    <div className="h-48">
                      <Skeleton className="h-full w-full" />
                    </div>
                    <CardHeader>
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-1/2 mt-2" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-20 w-full" />
                      <div className="flex flex-wrap gap-2 mt-4">
                        <Skeleton className="h-5 w-16 rounded-full" />
                        <Skeleton className="h-5 w-16 rounded-full" />
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Skeleton className="h-10 w-full" />
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {filteredPosts.length === 0 ? (
                  <div className="col-span-full text-center py-10">
                    <p className="text-gray-500">No posts found matching your criteria</p>
                  </div>
                ) : (
                  filteredPosts.map(post => (
                    <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow border border-gray-200">
                      {post.imageUrl && (
                        <div className="h-48 overflow-hidden">
                          <img 
                            src={post.imageUrl} 
                            alt={post.title}
                            className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                          />
                        </div>
                      )}
                      <CardHeader className="pb-2">
                        <CardTitle className="text-xl font-bold text-gray-900">
                          <Link to={`/blog/${post.slug}`} className="hover:text-amber-700 transition-colors">
                            {post.title}
                          </Link>
                        </CardTitle>
                        <CardDescription className="text-gray-500 italic">
                          "{post.excerpt && post.excerpt.length > 70 
                            ? `${post.excerpt.substring(0, 70)}...` 
                            : post.excerpt}"
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="flex items-center mt-2 mb-4">
                          <Avatar className="h-8 w-8 mr-2">
                            <AvatarFallback>{getAuthorInitials(post.author)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{post.author}</p>
                            <p className="text-xs text-gray-500 flex items-center">
                              <CalendarIcon size={12} className="mr-1" />
                              {post.date}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          {post.tags.slice(0, 3).map(tag => (
                            <span 
                              key={tag} 
                              className="inline-flex items-center bg-amber-100 px-2 py-1 rounded-full text-xs text-amber-800"
                            >
                              <Tag size={10} className="mr-1" />
                              {tag}
                            </span>
                          ))}
                          {post.tags.length > 3 && (
                            <span className="inline-flex items-center bg-gray-100 px-2 py-1 rounded-full text-xs text-gray-800">
                              +{post.tags.length - 3}
                            </span>
                          )}
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button asChild variant="outline" className="w-full">
                          <Link to={`/blog/${post.slug}`}>
                            {t('blog.readMore') || 'Read More'}
                          </Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))
                )}
              </div>
            )}

            <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
              <NewsletterSignup />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BlogPage;
