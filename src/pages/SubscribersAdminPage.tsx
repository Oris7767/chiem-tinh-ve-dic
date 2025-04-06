
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useBlog } from '../context/BlogContext';
import { useSubscribers } from '../context/SubscriberContext';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Search, Trash2, LogOut } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Import type from Supabase generated types
import type { Database } from '@/integrations/supabase/types';
type SubscriberRow = Database['public']['Tables']['subscribers']['Row'];

type Subscriber = {
  id: string;
  name: string;
  email: string;
  date: string;
};

const SubscribersAdminPage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useBlog();
  const { getSubscribersCSV } = useSubscribers();
  const [searchTerm, setSearchTerm] = useState('');
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [filteredSubscribers, setFilteredSubscribers] = useState<Subscriber[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Redirect if not logged in
    if (!isLoggedIn) {
      navigate('/blog/admin');
    }
  }, [isLoggedIn, navigate]);

  // Fetch subscribers from Supabase
  useEffect(() => {
    const fetchSubscribers = async () => {
      if (!isLoggedIn) return;
      
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('subscribers')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error('Error fetching subscribers:', error);
          toast({
            title: 'Error',
            description: 'Failed to fetch subscribers',
            variant: 'destructive'
          });
          return;
        }
        
        // Map Supabase data to our Subscriber type
        const formattedSubscribers = data.map((sub: SubscriberRow) => ({
          id: sub.id,
          name: sub.name,
          email: sub.email,
          date: sub.created_at
        }));
        
        setSubscribers(formattedSubscribers);
        setFilteredSubscribers(formattedSubscribers);
      } catch (err) {
        console.error('Failed to fetch subscribers:', err);
        toast({
          title: 'Error',
          description: 'An unexpected error occurred',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSubscribers();
  }, [isLoggedIn, toast]);

  // Filter subscribers when search term changes
  useEffect(() => {
    const results = subscribers.filter(sub => 
      sub.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      sub.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredSubscribers(results);
  }, [searchTerm, subscribers]);

  const handleDownload = () => {
    const csv = getSubscribersCSV();
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    
    // Create download link and click it
    const a = document.createElement('a');
    a.href = url;
    a.download = `newsletter-subscribers-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const removeSubscriber = async (id: string) => {
    try {
      // Delete from Supabase
      const { error } = await supabase
        .from('subscribers')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting subscriber:', error);
        toast({
          title: 'Error',
          description: 'Failed to delete subscriber',
          variant: 'destructive'
        });
        return;
      }
      
      // Update local state
      const updatedSubscribers = subscribers.filter(sub => sub.id !== id);
      setSubscribers(updatedSubscribers);
      toast({
        title: 'Success',
        description: 'Subscriber has been removed',
      });
    } catch (err) {
      console.error('Failed to delete subscriber:', err);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive'
      });
    }
  };

  if (!isLoggedIn) return null;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-amber-50 to-amber-100">
      <NavBar />
      <main className="flex-grow pt-16 pb-12">
        <div className="container mx-auto px-4">
          <Card className="shadow-lg">
            <CardHeader className="border-b">
              <div className="flex justify-between items-center">
                <CardTitle className="text-2xl font-bold text-amber-900">
                  {t('subscribers.adminTitle') || 'Newsletter Subscribers'}
                </CardTitle>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    onClick={logout} 
                    className="flex items-center gap-2"
                  >
                    <LogOut size={16} />
                    {t('blog.logout') || 'Logout'}
                  </Button>
                  <Button onClick={() => navigate('/blog/admin')}>
                    {t('subscribers.backToBlogAdmin') || 'Blog Admin'}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
                <div className="relative w-full md:w-auto flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <Input
                    type="search"
                    placeholder={t('subscribers.searchPlaceholder') || 'Search subscribers...'}
                    className="pl-10 w-full"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button 
                  onClick={handleDownload}
                  className="flex items-center gap-2 w-full md:w-auto"
                >
                  <Download size={18} />
                  {t('subscribers.downloadCSV') || 'Download CSV'}
                </Button>
              </div>

              {loading ? (
                <div className="text-center py-8">Loading subscribers...</div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t('subscribers.nameColumn') || 'Name'}</TableHead>
                        <TableHead>{t('subscribers.emailColumn') || 'Email'}</TableHead>
                        <TableHead>{t('subscribers.dateColumn') || 'Subscribe Date'}</TableHead>
                        <TableHead className="text-right">{t('subscribers.actions') || 'Actions'}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredSubscribers.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-4 text-gray-500">
                            {searchTerm 
                              ? (t('subscribers.noResults') || 'No subscribers found matching your search')
                              : (t('subscribers.noSubscribers') || 'No subscribers yet')}
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredSubscribers.map(subscriber => (
                          <TableRow key={subscriber.id}>
                            <TableCell>{subscriber.name}</TableCell>
                            <TableCell>{subscriber.email}</TableCell>
                            <TableCell>
                              {new Date(subscriber.date).toLocaleDateString()}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                onClick={() => removeSubscriber(subscriber.id)}
                              >
                                <Trash2 size={16} />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
              
              <div className="mt-4 text-sm text-gray-500 text-right">
                {t('subscribers.totalCount') || 'Total Subscribers'}: {filteredSubscribers.length}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SubscribersAdminPage;
