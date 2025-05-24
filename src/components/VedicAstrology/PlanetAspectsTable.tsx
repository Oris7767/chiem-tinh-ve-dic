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
import { Planet } from './VedicChart';

interface PlanetAspectsTableProps {
  planets: Planet[];
}

const ASPECT_SYMBOLS = {
  'Conjunction': '☌',
  'Opposition': '☍',
  'Trine': '△',
  'Square': '□',
  'Sextile': '⚹'
};

const PlanetAspectsTable: React.FC<PlanetAspectsTableProps> = ({ planets }) => {
  // Lọc ra các hành tinh có góc chiếu
  const planetsWithAspects = planets.filter(p => p.aspects && p.aspects.length > 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Góc chiếu giữa các hành tinh</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Hành tinh</TableHead>
              <TableHead>Góc chiếu với</TableHead>
              <TableHead>Loại góc chiếu</TableHead>
              <TableHead>Độ lệch (Orb)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {planetsWithAspects.map((planet) => (
              planet.aspects.map((aspect, idx) => (
                <TableRow key={`${planet.id}-${aspect.planet}-${idx}`}>
                  <TableCell className="font-medium">
                    <span title={planet.name}>{planet.symbol}</span>
                  </TableCell>
                  <TableCell>
                    <span title={
                      planets.find(p => p.id === aspect.planet.toLowerCase())?.name || aspect.planet
                    }>
                      {planets.find(p => p.id === aspect.planet.toLowerCase())?.symbol || aspect.planet}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span title={aspect.type}>
                      {ASPECT_SYMBOLS[aspect.type as keyof typeof ASPECT_SYMBOLS] || aspect.type}
                    </span>
                  </TableCell>
                  <TableCell>{aspect.orb.toFixed(2)}°</TableCell>
                </TableRow>
              ))
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default PlanetAspectsTable; 