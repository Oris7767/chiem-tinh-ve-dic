import React, { useState } from 'react';
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
import { ChevronRight, ChevronDown } from 'lucide-react';

interface SubDasha {
  planet: string;
  startDate: string;
  endDate: string;
  duration: number;
  level?: number;
}

interface PratyantarItem {
  planet: string;
  startDate: string;
  endDate: string;
  duration: number;
  level?: number;
  subDashas?: SubDasha[];
}

interface AntarDasha {
  planet: string;
  startDate: string;
  endDate: string;
  duration: number;
  level?: number;
  pratyantars?: PratyantarItem[];
}

interface AntarDashaTableProps {
  antarDashas: AntarDasha[];
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

const AntarDashaTable: React.FC<AntarDashaTableProps> = ({ antarDashas, currentPlanet }) => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

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

  const toggleExpand = (key: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  };

  const isExpanded = (key: string) => expandedItems.has(key);

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Tiểu Chu Kỳ (Antardasha) - {getViPlanetName(currentPlanet)}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead style={{ width: '30px' }}></TableHead>
              <TableHead>Hành Tinh</TableHead>
              <TableHead>Ngày Bắt Đầu</TableHead>
              <TableHead>Ngày Kết Thúc</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {antarDashas.map((dasha, index) => {
              const rowKey = `antar-${index}`;
              const expanded = isExpanded(rowKey);
              const hasPratyantars = dasha.pratyantars && dasha.pratyantars.length > 0;

              return (
                <React.Fragment key={index}>
                  <TableRow 
                    className={`cursor-pointer hover:bg-muted/50 ${hasPratyantars ? '' : 'opacity-75'}`}
                    onClick={() => hasPratyantars ? toggleExpand(rowKey) : undefined}
                  >
                    <TableCell className="py-2">
                      {hasPratyantars && (expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />)}
                    </TableCell>
                    <TableCell className="py-2">
                      {getViPlanetName(dasha.planet)}
                    </TableCell>
                    <TableCell className="py-2">{formatDate(dasha.startDate)}</TableCell>
                    <TableCell className="py-2">{formatDate(dasha.endDate)}</TableCell>
                  </TableRow>
                  {/* Pratyantars */}
                  {expanded && dasha.pratyantars && dasha.pratyantars.map((pratyantar, pIndex) => {
                    const pratyKey = `praty-${index}-${pIndex}`;
                    const pratyExpanded = isExpanded(pratyKey);
                    const hasSubDashas = pratyantar.subDashas && pratyantar.subDashas.length > 0;

                    return (
                      <React.Fragment key={pratyKey}>
                        <TableRow 
                          className={`cursor-pointer bg-amber-50 dark:bg-amber-950/20 hover:bg-amber-100 dark:hover:bg-amber-900/30 ${hasSubDashas ? '' : 'opacity-75'}`}
                          onClick={() => hasSubDashas ? toggleExpand(pratyKey) : undefined}
                        >
                          <TableCell className="py-1 pl-8">
                            {hasSubDashas && (pratyExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />)}
                          </TableCell>
                          <TableCell className="py-1 pl-4 text-sm font-medium text-amber-700">
                            {getViPlanetName(pratyantar.planet)}
                          </TableCell>
                          <TableCell className="py-1 text-sm">{formatDate(pratyantar.startDate)}</TableCell>
                          <TableCell className="py-1 text-sm">{formatDate(pratyantar.endDate)}</TableCell>
                        </TableRow>
                        {/* SubDashas (Sookshma) */}
                        {pratyExpanded && pratyantar.subDashas && pratyantar.subDashas.map((subDasha, sIndex) => (
                          <TableRow 
                            key={`sub-${pratyKey}-${sIndex}`}
                            className="bg-orange-50 dark:bg-orange-950/20"
                          >
                            <TableCell className="py-1 pl-16"></TableCell>
                            <TableCell className="py-1 pl-8 text-xs text-orange-700">
                              {getViPlanetName(subDasha.planet)}
                            </TableCell>
                            <TableCell className="py-1 text-xs">{formatDate(subDasha.startDate)}</TableCell>
                            <TableCell className="py-1 text-xs">{formatDate(subDasha.endDate)}</TableCell>
                          </TableRow>
                        ))}
                      </React.Fragment>
                    );
                  })}
                </React.Fragment>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default AntarDashaTable; 