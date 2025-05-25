// @ts-nocheck
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

interface PlanetDetailsTableProps {
  planets: Planet[];
}

const ZODIAC_SIGNS = [
  "Aries", "Taurus", "Gemini", "Cancer",
  "Leo", "Virgo", "Libra", "Scorpio",
  "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];

const VEDIC_PLANET_NAMES: Record<string, string> = {
  "Sun": "Surya",
  "Moon": "Chandra",
  "Mars": "Mangala",
  "Mercury": "Budha",
  "Jupiter": "Guru",
  "Venus": "Shukra",
  "Saturn": "Shani",
  "Rahu": "Rahu",
  "Ketu": "Ketu"
};

const PlanetDetailsTable: React.FC<PlanetDetailsTableProps> = ({ planets }) => {
  const formatDegree = (longitude: number): string => {
    const totalDegrees = longitude % 30;
    const degrees = Math.floor(totalDegrees);
    const minutes = Math.floor((totalDegrees - degrees) * 60);
    return `${degrees}°${minutes.toString().padStart(2, '0')}'`;
  };

  const getZodiacSign = (signIndex: number): string => {
    return ZODIAC_SIGNS[signIndex] || 'Unknown';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Chi tiết các hành tinh (Graha)</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Hành tinh</TableHead>
              <TableHead>Tên Sanskrit</TableHead>
              <TableHead>Cung</TableHead>
              <TableHead>Vị trí</TableHead>
              <TableHead>Nhà</TableHead>
              <TableHead>Nakshatra</TableHead>
              <TableHead>Pada</TableHead>
              <TableHead>Chuyển động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {planets.map((planet) => (
              <TableRow key={planet.id}>
                <TableCell className="font-medium">
                  <span style={{ color: planet.color }}>
                    {planet.symbol} {planet.name}
                  </span>
                </TableCell>
                <TableCell className="font-medium">
                  {VEDIC_PLANET_NAMES[planet.name]}
                </TableCell>
                <TableCell>{getZodiacSign(planet.sign)}</TableCell>
                <TableCell>{formatDegree(planet.longitude)}</TableCell>
                <TableCell>{planet.house}</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span>{planet.nakshatra.name}</span>
                    <span className="text-xs text-muted-foreground">
                      Lord: {planet.nakshatra.lord}
                    </span>
                  </div>
                </TableCell>
                <TableCell>{planet.nakshatra.pada}</TableCell>
                <TableCell>
                  <span className={planet.retrograde ? "text-red-500" : "text-green-500"}>
                    {planet.retrograde ? "R" : "D"}
                    <span className="text-xs ml-1">
                      ({Math.abs(planet.longitudeSpeed).toFixed(2)}°/day)
                    </span>
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default PlanetDetailsTable;