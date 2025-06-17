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

interface AntarDasha {
  planet: string;
  startDate: string;
  endDate: string;
  duration: number;
}

interface AntarDashaTableProps {
  antarDashas: AntarDasha[];
  currentPlanet: string;
}

const PLANET_NAMES_VI = {
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

const AntarDashaTable: React.FC<AntarDashaTableProps> = ({ antarDashas, currentPlanet }) => {
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
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Tiểu Chu Kỳ (Antardasha) - {getViPlanetName(currentPlanet)}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Hành Tinh</TableHead>
              <TableHead>Ngày Bắt Đầu</TableHead>
              <TableHead>Ngày Kết Thúc</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {antarDashas.map((dasha, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">
                  {getViPlanetName(dasha.planet)}
                </TableCell>
                <TableCell>{formatDate(dasha.startDate)}</TableCell>
                <TableCell>{formatDate(dasha.endDate)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default AntarDashaTable; 