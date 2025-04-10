
import React, { useState, useCallback } from "react";
import { useLanguage } from "../context/LanguageContext";
import { DateTime } from 'luxon';
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import BirthChartForm from "../components/BirthChartForm";
import BirthChartDisplay from "../components/BirthChartDisplay";
import { toast } from "@/hooks/use-toast";

export interface BirthChartData {
  date: Date;
  time: string;
  timezone: string;
  location: string;
}


const BirthChartPage = () => {
  const { t } = useLanguage();
  const [vedicChart, setVedicChart] = useState<any | null>(null); // Update type to 'any' to match API response structure
  const [chartData, setChartData] = useState<BirthChartData | null>(null);
  
  const handleCalculate = useCallback((data: any) => {
    try {

        setVedicChart(data);
        
      setChartData({
        date: data.date,
        time: data.time,
        timezone: data.timezone,
        location: data.location,
      });
        
      const dateTime = DateTime.fromJSDate(data.date)
        .set({ hour: data.hours, minute: data.minutes })
        .setZone(data.timezone);

      if (!dateTime.isValid) {
        throw new Error(`Invalid date/time: ${dateTime.invalidExplanation}`);
      }

      toast({
        title: t("birthChart.calculationSuccess") || "Chart calculated successfully",
        description: dateTime.toFormat("ff"),
      });
    } catch (error) {
      console.error("Error calculating chart:", error);
      toast({
        title: t("birthChart.calculationError") || "Error calculating chart",
        description:
          error instanceof Error
            ? error.message
            : "An unknown error occurred",
        variant: "destructive",
      });
    }
  }, [t]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-amber-50 to-amber-100">
      <NavBar />
      <main className="flex-grow pt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-amber-900 mb-2">
                {t("birthChart.title") || "Vedic Birth Chart"}
              </h1>
              <p className="text-lg text-amber-800 max-w-2xl mx-auto">
                {t("birthChart.subtitle") ||
                  "Calculate your Vedic astrology birth chart based on your birth details and discover the celestial influences on your life"}
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-xl p-6 mb-8">
              <BirthChartForm onCalculate={handleCalculate} />
            </div>

            {vedicChart && (
              <div className="bg-white rounded-lg shadow-xl p-6 mt-8" >
                <BirthChartDisplay vedicChart={vedicChart} />
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};
export default BirthChartPage;
