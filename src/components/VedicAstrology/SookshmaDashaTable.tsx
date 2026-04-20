import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

interface SookshmaDasha {
  planet: string;
  startDate: string;
  endDate: string;
  elapsed?: {
    years: number;
    months: number;
    days: number;
  };
  remaining?: {
    years: number;
    months: number;
    days: number;
  };
}

interface SookshmaDashaTableProps {
  sookshmaDashas: SookshmaDasha[];
  currentPlanet: string;
}

const PLANET_NAMES_VI: Record<string, string> = {
  'Sun': 'Mặt Trời',
  'Moon': 'Mặt Trăng',
  'Mars': 'Sao Hỏa',
  'Mercury': 'Sao Thủy',
  'Jupiter': 'Sao Mộc',
  'Venus': 'Sao Kim',
  'Saturn': 'Sao Thổ',
  'Rahu': 'Sao Rahu',
  'Ketu': 'Sao Ketu'
};

const SookshmaDashaTable: React.FC<SookshmaDashaTableProps> = ({ 
  sookshmaDashas, 
  currentPlanet 
}) => {
  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), 'dd/MM/yyyy', { locale: vi });
    } catch (e) {
      return dateStr;
    }
  };

  const getViPlanetName = (planet: string) => {
    return PLANET_NAMES_VI[planet] || planet;
  };

  return (
    <Card className="mt-3 border-l-4 border-orange-500">
      <CardHeader className="py-2 px-3">
        <CardTitle className="text-sm">
          Vi Tiểu Chu Kỳ (Sookshma Dasha) - {getViPlanetName(currentPlanet)}
        </CardTitle>
      </CardHeader>
      <CardContent className="py-2 px-3">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="py-1">Hành Tinh</TableHead>
              <TableHead className="py-1">Ngày Bắt Đầu</TableHead>
              <TableHead className="py-1">Ngày Kết Thúc</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sookshmaDashas.map((dasha, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium py-1">
                  {getViPlanetName(dasha.planet)}
                </TableCell>
                <TableCell className="py-1">{formatDate(dasha.startDate)}</TableCell>
                <TableCell className="py-1">{formatDate(dasha.endDate)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default SookshmaDashaTable;
