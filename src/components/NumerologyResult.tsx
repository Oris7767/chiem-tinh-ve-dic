
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalculationResult } from './Calculator';
import { useLanguage } from '../context/LanguageContext';

interface NumerologyResultProps {
  calculationResult: CalculationResult;
}

export const NumerologyResult: React.FC<NumerologyResultProps> = ({ calculationResult }) => {
  const { t } = useLanguage();
  
  const renderCalculationDetails = (calculation: { calculation: string; finalNumber: number; meaning: string }) => {
    const steps = calculation.calculation.split('→').map(step => step.trim());
    
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-center">
          <div className="w-24 h-24 rounded-full bg-amber-100 flex items-center justify-center">
            <span className="text-5xl font-bold text-amber-800">{calculation.finalNumber}</span>
          </div>
        </div>
        
        <div className="bg-amber-50 p-4 rounded-md">
          <h4 className="font-medium text-amber-900 mb-2">{t('calculator.calculation')}:</h4>
          <div className="space-y-2">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center">
                {index > 0 && (
                  <div className="mr-2 text-amber-500">→</div>
                )}
                <div className="px-2 py-1 bg-amber-100 rounded text-sm">{step}</div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-4">
          <h4 className="font-medium text-amber-900 mb-2">{t('calculator.meaning')}:</h4>
          <p className="text-amber-800">{calculation.meaning}</p>
        </div>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center text-2xl text-amber-900">
          {t('calculator.results')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="birth">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="birth">{t('calculator.birthNumber')}</TabsTrigger>
            <TabsTrigger value="name">{t('calculator.nameNumber')}</TabsTrigger>
            <TabsTrigger value="life">{t('calculator.lifeNumber')}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="birth">
            {renderCalculationDetails(calculationResult.birthNumber)}
          </TabsContent>
          
          <TabsContent value="name">
            {renderCalculationDetails(calculationResult.nameNumber)}
          </TabsContent>
          
          <TabsContent value="life">
            {renderCalculationDetails(calculationResult.lifeNumber)}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
