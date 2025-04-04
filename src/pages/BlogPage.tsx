
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
import { CalendarIcon, Tag, User } from 'lucide-react';
import NewsletterSignup from '../components/NewsletterSignup';

const BlogPage = () => {
  const { t } = useLanguage();
  const { posts, isLoggedIn } = useBlog();
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
                />
              </div>
              
              {isLoggedIn && (
                <div className="flex justify-end">
                  <Button asChild>
                    <Link to="/blog/admin">
                      {t('blog.adminPanel') || 'Admin Panel'}
                    </Link>
                  </Button>
                </div>
              )}
            </div>

            <Tabs defaultValue="all" className="mb-8">
              <TabsList className="mb-4">
                <TabsTrigger 
                  value="all"
                  onClick={() => setSelectedTag(null)}
                >
                  {t('blog.allPosts') || 'All Posts'}
                </TabsTrigger>
                {allTags.map(tag => (
                  <TabsTrigger 
                    key={tag} 
                    value={tag}
                    onClick={() => setSelectedTag(tag)}
                  >
                    {tag.charAt(0).toUpperCase() + tag.slice(1)}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {filteredPosts.map(post => (
                <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  {post.imageUrl && (
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={post.imageUrl} 
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle>
                      <Link to={`/blog/${post.slug}`} className="hover:text-amber-700 transition-colors">
                        {post.title}
                      </Link>
                    </CardTitle>
                    <CardDescription>
                      <div className="flex items-center text-sm space-x-4 mt-2">
                        <span className="flex items-center">
                          <User size={14} className="mr-1" />
                          {post.author}
                        </span>
                        <span className="flex items-center">
                          <CalendarIcon size={14} className="mr-1" />
                          {post.date}
                        </span>
                      </div>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">{post.excerpt}</p>
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
                  </CardContent>
                  <CardFooter>
                    <Button asChild variant="outline" className="w-full">
                      <Link to={`/blog/${post.slug}`}>
                        {t('blog.readMore') || 'Read More'}
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

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
