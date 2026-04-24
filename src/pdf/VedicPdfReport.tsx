/**
 * VedicPdfReport - Main PDF Document Component
 * Sử dụng @react-pdf/renderer
 */

import React from 'react';
import { Document, Page, StyleSheet } from '@react-pdf/renderer';
import { Page1 } from './components/Page1';
import { Page2 } from './components/Page2';
import { PdfReportData } from './types';
import { colors } from './styles';

// PDF Document Styles
const pdfStyles = StyleSheet.create({
  page: {
    backgroundColor: colors.cream,
    padding: 0,
  },
});

/**
 * VedicPdfReport Component
 * Component chính của document PDF
 */
export const VedicPdfReport: React.FC<{ data: PdfReportData }> = ({ data }) => {
  return (
    <Document
      title={`La So Chiem Tinh Ve Da - ${data.birthData?.name || 'Unknown'}`}
      author="Chiêm Tinh Vệ Đà"
      subject="Vedic Birth Chart"
      creator="Vedic Astrology App"
      producer="Vedic Astrology App"
    >
      {/* Page 1: Overview & Dasa System */}
      <Page
        size="A4"
        orientation="portrait"
        style={pdfStyles.page}
      >
        <Page1 data={data} />
      </Page>

      {/* Page 2: 16 D-Varga Charts */}
      <Page
        size="A4"
        orientation="portrait"
        style={pdfStyles.page}
      >
        <Page2 data={data} />
      </Page>
    </Document>
  );
};
