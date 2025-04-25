
import React, { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import { useLanguage } from '../context/LanguageContext';
import { supabase } from '../integrations/supabase/client';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";

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
          .order('created_at', { ascending: false }) as any;

        if (error) {
          console.error('Error fetching calculations:', error);
        } else {
          setCalculations(data as NumerologyCalculation[] || []);
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
                <Table>
                  <TableHeader className="bg-amber-100">
                    <TableRow>
                      <TableHead className="text-amber-900 font-semibold">Name</TableHead>
                      <TableHead className="text-amber-900 font-semibold">Birth Date</TableHead>
                      <TableHead className="text-amber-900 font-semibold">Birth Number</TableHead>
                      <TableHead className="text-amber-900 font-semibold">Name Number</TableHead>
                      <TableHead className="text-amber-900 font-semibold">Life Number</TableHead>
                      <TableHead className="text-amber-900 font-semibold">Created At</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="divide-y divide-gray-200 bg-white">
                    {calculations.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="py-4 px-4 text-center text-gray-500">
                          No calculations found
                        </TableCell>
                      </TableRow>
                    ) : (
                      calculations.map((calc) => (
                        <TableRow key={calc.id} className="hover:bg-gray-50">
                          <TableCell>{calc.name}</TableCell>
                          <TableCell>
                            {calc.birth_day}/{calc.birth_month}/{calc.birth_year}
                          </TableCell>
                          <TableCell>{calc.birth_number}</TableCell>
                          <TableCell>{calc.name_number}</TableCell>
                          <TableCell>{calc.life_number}</TableCell>
                          <TableCell>
                            {new Date(calc.created_at).toLocaleString()}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
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
