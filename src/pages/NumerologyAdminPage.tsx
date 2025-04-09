import React, { useEffect, useState } from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import { useLanguage } from '../context/LanguageContext';
import { supabase } from '../integrations/supabase/client';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { NumerologyCalculation } from '../types/numerologyTypes';

const NumerologyAdminPage = () => {
  const [calculations, setCalculations] = useState<NumerologyCalculation[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  
  const { language } = useLanguage();
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setIsAuthenticated(!!session);
    if (session) {
      fetchCalculations();
    } else {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        toast({
          title: language === 'en' ? 'Authentication Error' : 'Lỗi Xác Thực',
          description: error.message,
          variant: 'destructive'
        });
      } else {
        setIsAuthenticated(true);
        fetchCalculations();
      }
    } catch (err) {
      console.error('Auth error:', err);
      toast({
        title: language === 'en' ? 'Error' : 'Lỗi',
        description: language === 'en' ? 'An unexpected error occurred' : 'Đã xảy ra lỗi không mong muốn',
        variant: 'destructive'
      });
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    setCalculations([]);
  };

  const fetchCalculations = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('numerology_calculations' as any)
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) {
        throw error;
      }
      
      if (data) {
        setCalculations(data as unknown as NumerologyCalculation[]);
      } else {
        setCalculations([]);
      }
    } catch (err) {
      console.error('Error fetching calculations:', err);
      toast({
        title: language === 'en' ? 'Error' : 'Lỗi',
        description: language === 'en' ? 'Failed to load data' : 'Không thể tải dữ liệu',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(language === 'en' ? 'en-US' : 'vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>{language === 'en' ? 'Admin - Numerology Calculations' : 'Quản Trị - Dữ Liệu Số Học'}</title>
      </Helmet>
      <NavBar />
      <main className="flex-grow pt-16">
        <div className="container mx-auto px-4 py-8">
          {!isAuthenticated ? (
            <div className="max-w-md mx-auto glass-card p-6 rounded-xl shadow-lg">
              <h1 className="text-2xl font-bold mb-6 text-center">
                {language === 'en' ? 'Admin Login' : 'Đăng Nhập Quản Trị'}
              </h1>
              <form onSubmit={handleSignIn} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium">
                    {language === 'en' ? 'Email' : 'Email'}
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="admin@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="password" className="block text-sm font-medium">
                    {language === 'en' ? 'Password' : 'Mật Khẩu'}
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={authLoading}
                >
                  {authLoading ? 
                    (language === 'en' ? 'Logging in...' : 'Đang đăng nhập...') : 
                    (language === 'en' ? 'Login' : 'Đăng Nhập')}
                </Button>
              </form>
            </div>
          ) : (
            <div className="max-w-6xl mx-auto">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">
                  {language === 'en' ? 'Numerology Calculations' : 'Dữ Liệu Số Học'}
                </h1>
                <div className="flex space-x-4">
                  <Button onClick={fetchCalculations} disabled={loading} variant="outline">
                    {language === 'en' ? 'Refresh Data' : 'Làm Mới Dữ Liệu'}
                  </Button>
                  <Button onClick={handleSignOut} variant="secondary">
                    {language === 'en' ? 'Sign Out' : 'Đăng Xuất'}
                  </Button>
                </div>
              </div>
              
              {loading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin w-8 h-8 border-4 border-current border-t-transparent text-primary rounded-full" role="status">
                    <span className="sr-only">{language === 'en' ? 'Loading...' : 'Đang tải...'}</span>
                  </div>
                  <p className="mt-4">{language === 'en' ? 'Loading data...' : 'Đang tải dữ liệu...'}</p>
                </div>
              ) : calculations.length > 0 ? (
                <div className="space-y-6">
                  {calculations.map((calc) => (
                    <Card key={calc.id} className="overflow-hidden">
                      <CardHeader className="bg-slate-50">
                        <CardTitle className="flex justify-between">
                          <span>{calc.name}</span>
                          <span className="text-sm text-gray-500">
                            {formatDate(calc.created_at)}
                          </span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-6">
                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <h3 className="font-medium mb-2">{language === 'en' ? 'Personal Information' : 'Thông Tin Cá Nhân'}</h3>
                            <ul className="space-y-1 text-sm">
                              <li><span className="font-medium">{language === 'en' ? 'Birth Date:' : 'Ngày Sinh:'}</span> {calc.birth_day}/{calc.birth_month}/{calc.birth_year}</li>
                              {calc.user_email && (
                                <li><span className="font-medium">{language === 'en' ? 'Email:' : 'Email:'}</span> {calc.user_email}</li>
                              )}
                              {calc.user_ip && (
                                <li><span className="font-medium">{language === 'en' ? 'IP:' : 'IP:'}</span> {calc.user_ip}</li>
                              )}
                            </ul>
                          </div>
                          <div>
                            <h3 className="font-medium mb-2">{language === 'en' ? 'Numerology Results' : 'Kết Quả Số Học'}</h3>
                            <div className="grid grid-cols-3 gap-4 text-center">
                              <div className="p-3 bg-blue-50 rounded-lg">
                                <div className="text-lg font-bold text-blue-700">{calc.birth_number}</div>
                                <div className="text-xs text-gray-600">{language === 'en' ? 'Birth Number' : 'Số Ngày Sinh'}</div>
                              </div>
                              <div className="p-3 bg-purple-50 rounded-lg">
                                <div className="text-lg font-bold text-purple-700">{calc.name_number}</div>
                                <div className="text-xs text-gray-600">{language === 'en' ? 'Name Number' : 'Số Tên'}</div>
                              </div>
                              <div className="p-3 bg-amber-50 rounded-lg">
                                <div className="text-lg font-bold text-amber-700">{calc.life_number}</div>
                                <div className="text-xs text-gray-600">{language === 'en' ? 'Life Number' : 'Số Đường Đời'}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 border rounded-lg bg-slate-50">
                  <p className="text-lg text-gray-600">
                    {language === 'en' ? 'No calculation data found.' : 'Không tìm thấy dữ liệu tính toán nào.'}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NumerologyAdminPage;
