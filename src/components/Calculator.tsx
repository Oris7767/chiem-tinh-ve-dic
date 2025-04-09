import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { NumerologyResult } from './NumerologyResult';
import { calculateNumerology } from '../utils/numerologyCalculator';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '../context/LanguageContext';
import { supabase } from '../integrations/supabase/client';
import { Loader2 } from 'lucide-react';

export type CalculationResult = {
  birthNumber: {
    calculation: string;
    finalNumber: number;
    meaning: string;
  };
  nameNumber: {
    calculation: string;
    finalNumber: number;
    meaning: string;
  };
  lifeNumber: {
    calculation: string;
    finalNumber: number;
    meaning: string;
  };
};

const Calculator = () => {
  const [name, setName] = useState('');
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [email, setEmail] = useState('');
  const [calculationResult, setCalculationResult] = useState<CalculationResult | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);
  
  const { toast } = useToast();
  const { t, language } = useLanguage();
  
  useEffect(() => {
    if (showResult) {
      setShowResult(false);
      setCalculationResult(null);
    }
  }, [name, day, month, year]);
  
  const isFormValid = () => name.trim() !== '' && 
    day !== '' && parseInt(day) > 0 && parseInt(day) <= 31 &&
    month !== '' && parseInt(month) > 0 && parseInt(month) <= 12 &&
    year !== '' && year.length === 4;

  const saveCalculation = async () => {
    if (name && calculationResult) {
      try {
        setIsSaving(true);
        
        const { error } = await supabase
          .from('numerology_calculations' as any)
          .insert({
            name: name,
            birth_day: parseInt(day),
            birth_month: parseInt(month),
            birth_year: parseInt(year),
            birth_number: calculationResult.birthNumber.finalNumber,
            name_number: calculationResult.nameNumber.finalNumber,
            life_number: calculationResult.lifeNumber.finalNumber,
            user_email: email || null
          } as any);
        
        if (error) {
          console.error('Error saving calculation:', error);
          toast({
            title: t('calculator.error'),
            description: t('calculator.saveError'),
            variant: 'destructive',
          });
        } else {
          toast({
            title: t('calculator.success'),
            description: t('calculator.saveSuccess'),
          });
        }
      } catch (err) {
        console.error('Error saving calculation:', err);
        toast({
          title: t('calculator.error'),
          description: t('calculator.saveError'),
          variant: 'destructive',
        });
      } finally {
        setIsSaving(false);
      }
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid()) {
      toast({
        title: t('calculator.invalid'),
        description: t('calculator.invalidInputs'),
        variant: 'destructive',
      });
      return;
    }
    
    setIsCalculating(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const result = calculateNumerology({
        fullName: name,
        birthDay: parseInt(day),
        birthMonth: parseInt(month),
        birthYear: parseInt(year),
        language
      });
      
      setCalculationResult(result);
      setIsCalculating(false);
      setShowResult(true);
      
      saveCalculation();
      
      if (resultRef.current) {
        setTimeout(() => {
          resultRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } catch (error) {
      console.error("Error during calculation:", error);
      setIsCalculating(false);
      toast({
        title: t('calculator.error'),
        description: t('calculator.calculateError'),
        variant: 'destructive'
      });
    }
  };

  return (
    <section id="calculator" className="py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-card rounded-xl p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-amber-900">
                  {t('calculator.name')}
                </label>
                <Input
                  type="text"
                  id="name"
                  placeholder={t('calculator.namePlaceholder')}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-amber-900">
                  {t('calculator.email')}
                </label>
                <Input
                  type="email"
                  id="email"
                  placeholder={t('calculator.emailPlaceholder')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-6">
              <div>
                <label htmlFor="day" className="block text-sm font-medium text-amber-900">
                  {t('calculator.day')}
                </label>
                <Input
                  type="number"
                  id="day"
                  placeholder="DD"
                  value={day}
                  onChange={(e) => setDay(e.target.value)}
                  className="mt-1"
                  min="1"
                  max="31"
                />
              </div>
              <div>
                <label htmlFor="month" className="block text-sm font-medium text-amber-900">
                  {t('calculator.month')}
                </label>
                <Input
                  type="number"
                  id="month"
                  placeholder="MM"
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  className="mt-1"
                  min="1"
                  max="12"
                />
              </div>
              <div>
                <label htmlFor="year" className="block text-sm font-medium text-amber-900">
                  {t('calculator.year')}
                </label>
                <Input
                  type="number"
                  id="year"
                  placeholder="YYYY"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="mt-1"
                  min="1900"
                  max="2099"
                />
              </div>
            </div>
            
            <Button type="submit" className="w-full" disabled={isCalculating}>
              {isCalculating ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('calculator.calculating')}
                </div>
              ) : (
                t('calculator.calculate')
              )}
            </Button>
          </form>
        </div>
        
        {showResult && calculationResult && (
          <div ref={resultRef} className="mt-12">
            <NumerologyResult calculationResult={calculationResult} />
          </div>
        )}
      </div>
    </section>
  );
};

export default Calculator;
