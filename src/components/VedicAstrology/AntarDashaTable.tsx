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

interface AntarDasha {
  planet: string;
  startDate: string;
  endDate: string;
  duration: number;
  pratyantars?: PratyantarItem[];
  currentPratyantar?: PratyantarItem;
}

interface PratyantarItem {
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
  sookshmas?: SookshmaItem[];
  currentSookshma?: SookshmaItem;
}

interface SookshmaItem {
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
  const [expandedIndex, setExpandedIndex] = useState<string | null>(null);
  const [expandedPratyantar, setExpandedPratyantar] = useState<string | null>(null);

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
    setExpandedIndex(expandedIndex === key ? null : key);
  };

  const togglePratyantar = (key: string) => {
    setExpandedPratyantar(expandedPratyantar === key ? null : key);
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
              <TableHead style={{ width: '30px' }}></TableHead>
              <TableHead>Hành Tinh</TableHead>
              <TableHead>Ngày Bắt Đầu</TableHead>
              <TableHead>Ngày Kết Thúc</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {antarDashas.map((dasha, index) => {
              const rowKey = `antar-${index}`;
              const isExpanded = expandedIndex === rowKey;
              const hasPratyantars = dasha.pratyantars && dasha.pratyantars.length > 0;

              return (
                <React.Fragment key={index}>
                  <TableRow 
                    className={`cursor-pointer hover:bg-muted/50 ${hasPratyantars ? 'font-medium' : ''}`}
                    onClick={() => hasPratyantars ? toggleExpand(rowKey) : undefined}
                  >
                    <TableCell className="py-2">
                      {hasPratyantars && (
                        isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />
                      )}
                    </TableCell>
                    <TableCell className="py-2">
                      {getViPlanetName(dasha.planet)}
                    </TableCell>
                    <TableCell className="py-2">{formatDate(dasha.startDate)}</TableCell>
                    <TableCell className="py-2">{formatDate(dasha.endDate)}</TableCell>
                  </TableRow>
                  {/* Pratyantar rows */}
                  {isExpanded && hasPratyantars && dasha.pratyantars?.map((pratyantar, pIndex) => {
                    const pratyKey = `praty-${index}-${pIndex}`;
                    const isPratyExpanded = expandedPratyantar === pratyKey;
                    const hasSookshmas = pratyantar.sookshmas && pratyantar.sookshmas.length > 0;

                    return (
                      <React.Fragment key={pratyKey}>
                        <TableRow 
                          className={`bg-amber-50 dark:bg-amber-950/20 cursor-pointer hover:bg-amber-100 dark:hover:bg-amber-900/30 ${hasSookshmas ? 'font-medium' : ''}`}
                          onClick={() => hasSookshmas ? togglePratyantar(pratyKey) : undefined}
                        >
                          <TableCell className="py-1 pl-8">
                            {hasSookshmas && (
                              isPratyExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />
                            )}
                          </TableCell>
                          <TableCell className="py-1 pl-4 text-sm">
                            {getViPlanetName(pratyantar.planet)}
                          </TableCell>
                          <TableCell className="py-1 text-sm">{formatDate(pratyantar.startDate)}</TableCell>
                          <TableCell className="py-1 text-sm">{formatDate(pratyantar.endDate)}</TableCell>
                        </TableRow>
                        {/* Sookshma rows */}
                        {isPratyExpanded && hasSookshmas && pratyantar.sookshmas?.map((sookshma, sIndex) => (
                          <React.Fragment key={`sookshma-${pratyKey}-${sIndex}`}>
                            <TableRow className="bg-orange-50 dark:bg-orange-950/20">
                              <TableCell className="py-1 pl-8"></TableCell>
                              <TableCell className="py-1 pl-8 text-xs font-medium text-orange-700">
                                {getViPlanetName(sookshma.planet)}
                              </TableCell>
                              <TableCell className="py-1 text-xs">{formatDate(sookshma.startDate)}</TableCell>
                              <TableCell className="py-1 text-xs">{formatDate(sookshma.endDate)}</TableCell>
                            </TableRow>
                          </React.Fragment>
                        ))}
                        {/* Hiển thị currentSookshma nếu có */}
                        {pratyantar.currentSookshma && (
                          <TableRow className="bg-red-50 dark:bg-red-950/20 border-t border-orange-200">
                            <TableCell className="py-1 pl-8 text-center" colSpan={4}>
                              <div className="text-xs">
                                <span className="font-medium text-red-600">Sookshma hiện tại: </span>
                                <span className="text-red-700">
                                  {getViPlanetName(pratyantar.currentSookshma.planet)}
                                </span>
                                <span className="text-gray-500 ml-2">
                                  ({formatDate(pratyantar.currentSookshma.startDate)} - {formatDate(pratyantar.currentSookshma.endDate)})
                                </span>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
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