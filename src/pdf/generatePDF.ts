/**
 * Main PDF Generation Function
 * Kết nối dữ liệu từ ứng dụng với VedicPdfReport
 */

import { pdf } from '@react-pdf/renderer';
import React from 'react';
import { VedicPdfReport } from './VedicPdfReport';
import { PdfReportData, PdfVedicChartData, PdfBirthData } from './types';
import { generatePDFChartImages } from './svgGenerators';

/**
 * Transform VedicChartData from app to PDF format
 */
export function transformChartDataForPDF(chartData: any): PdfVedicChartData {
  return {
    ascendant: chartData.ascendant,
    ascendantNakshatra: chartData.ascendantNakshatra,
    planets: chartData.planets.map((planet: any) => ({
      id: planet.id,
      name: planet.name,
      symbol: planet.symbol || '',
      longitude: parseFloat(String(planet.longitude)) || 0,
      latitude: parseFloat(String(planet.latitude)) || 0,
      longitudeSpeed: parseFloat(String(planet.longitudeSpeed)) || 0,
      sign: planet.sign,
      house: planet.house,
      retrograde: planet.retrograde || false,
      color: planet.color || '#000000',
      nakshatra: {
        name: planet.nakshatra?.name || '',
        lord: planet.nakshatra?.lord || '',
        startDegree: planet.nakshatra?.startDegree || 0,
        endDegree: planet.nakshatra?.endDegree || 0,
        pada: planet.nakshatra?.pada || 1,
      },
      aspectingPlanets: planet.aspectingPlanets || [],
      aspects: planet.aspects || [],
    })),
    houses: chartData.houses.map((house: any) => ({
      number: house.number,
      longitude: parseFloat(String(house.longitude)) || 0,
      sign: house.sign,
      planets: house.planets || [],
    })),
    moonNakshatra: chartData.moonNakshatra || '',
    lunarDay: chartData.lunarDay || 0,
    dashas: chartData.dashas ? {
      current: {
        planet: chartData.dashas.current.planet,
        startDate: chartData.dashas.current.startDate,
        endDate: chartData.dashas.current.endDate,
        elapsed: chartData.dashas.current.elapsed,
        remaining: chartData.dashas.current.remaining,
        antardashas: chartData.dashas.current.antardashas || [],
      },
      sequence: chartData.dashas.sequence || [],
    } : undefined,
  };
}

/**
 * Transform birth data for PDF
 */
export function transformBirthDataForPDF(birthData: any): PdfBirthData {
  return {
    name: birthData?.name,
    birthDate: birthData?.birthDate,
    birthTime: birthData?.birthTime,
    location: birthData?.location,
  };
}

/**
 * Main PDF Generation Function
 * 
 * @param chartData - Dữ liệu lá số từ ứng dụng
 * @param birthData - Dữ liệu sinh của user
 * @param options - Các tùy chọn bổ sung
 * @returns Promise<Blob> - PDF file as Blob
 */
export async function generatePDF(
  chartData: PdfVedicChartData,
  birthData?: PdfBirthData | null,
  options?: {
    vargas?: Array<{ id: string; planets: any[]; ascendantSign: number }>;
  }
): Promise<Blob> {
  console.log('Starting PDF generation...');

  // Prepare vargas data if available
  const vargas = options?.vargas || [];

  // Generate chart images from SVG
  console.log('Generating chart images...');
  const { mainChartImage, vargaChartImages } = await generatePDFChartImages(
    chartData.ascendant,
    chartData.planets,
    chartData.houses,
    vargas
  );

  // Prepare PDF data
  const pdfData: PdfReportData = {
    chartData,
    birthData: birthData || null,
    mainChartImage,
    vargaChartImages,
  };

  console.log('Rendering PDF...');

  // Generate PDF blob
  const blob = await pdf(React.createElement(VedicPdfReport, { data: pdfData })).toBlob();

  console.log('PDF generation complete');
  return blob;
}

/**
 * Generate and Download PDF
 * 
 * @param chartData - Dữ liệu lá số từ ứng dụng
 * @param birthData - Dữ liệu sinh của user
 * @param fileName - Tên file (không cần đuôi)
 */
export async function downloadPDF(
  chartData: PdfVedicChartData,
  birthData?: PdfBirthData | null,
  fileName?: string
): Promise<void> {
  const blob = await generatePDF(chartData, birthData);

  // Create download link
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName || `vedic-chart-${birthData?.name || 'unknown'}.pdf`;
  
  // Trigger download
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Cleanup
  URL.revokeObjectURL(url);
}

/**
 * Quick PDF generation from raw app data
 * Tự động transform dữ liệu từ format của app sang format PDF
 */
export async function generatePDFFromAppData(
  rawChartData: any,
  rawBirthData?: any,
  options?: {
    vargas?: Array<{ id: string; planets: any[]; ascendantSign: number }>;
    fileName?: string;
  }
): Promise<void> {
  // Transform data
  const chartData = transformChartDataForPDF(rawChartData);
  const birthData = transformBirthDataForPDF(rawBirthData);

  // Download
  await downloadPDF(
    chartData,
    birthData,
    options?.fileName || `vedic-chart-${birthData.name || 'unknown'}.pdf`
  );
}
