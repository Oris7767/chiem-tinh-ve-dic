
import React, { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import { useLanguage } from '../context/LanguageContext';
import { supabase } from '../integrations/supabase/client';

interface NumerologyCalculation {
  id: string;
  name: string;
  birth_day: number;
  birth_month: number;
  birth_year: number;
  birth_number: number;
  name_number: number;
  life_number: number;
  created_at: string;
  user_email?: string | null;
}

const NumerologyAdminPage = () => {
  const { t } = useLanguage();
  const [calculations, setCalculations] = useState<NumerologyCalculation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCalculations = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('numerology_calculations')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching calculations:', error);
        } else {
          setCalculations(data || []);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCalculations();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-grow pt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-amber-900 mb-4">
                Numerology Calculations Admin
              </h1>
              <p className="text-lg text-amber-800">
                View all saved numerology calculations
              </p>
            </div>
            
            {loading ? (
              <div className="flex justify-center p-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-900"></div>
              </div>
            ) : (
              <div className="overflow-x-auto shadow-md rounded-lg">
                <table className="min-w-full bg-white">
                  <thead className="bg-amber-100">
                    <tr>
                      <th className="py-3 px-4 text-left text-amber-900 font-semibold">Name</th>
                      <th className="py-3 px-4 text-left text-amber-900 font-semibold">Birth Date</th>
                      <th className="py-3 px-4 text-left text-amber-900 font-semibold">Birth Number</th>
                      <th className="py-3 px-4 text-left text-amber-900 font-semibold">Name Number</th>
                      <th className="py-3 px-4 text-left text-amber-900 font-semibold">Life Number</th>
                      <th className="py-3 px-4 text-left text-amber-900 font-semibold">Created At</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {calculations.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-4 px-4 text-center text-gray-500">
                          No calculations found
                        </td>
                      </tr>
                    ) : (
                      calculations.map((calc) => (
                        <tr key={calc.id} className="hover:bg-gray-50">
                          <td className="py-3 px-4">{calc.name}</td>
                          <td className="py-3 px-4">
                            {calc.birth_day}/{calc.birth_month}/{calc.birth_year}
                          </td>
                          <td className="py-3 px-4">{calc.birth_number}</td>
                          <td className="py-3 px-4">{calc.name_number}</td>
                          <td className="py-3 px-4">{calc.life_number}</td>
                          <td className="py-3 px-4">
                            {new Date(calc.created_at).toLocaleString()}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NumerologyAdminPage;
