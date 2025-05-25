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
import { House, Planet } from './VedicChart';

interface HouseDetailsTableProps {
  houses: House[];
  planets: Planet[];
}

const ZODIAC_SIGNS = [
  "Aries", "Taurus", "Gemini", "Cancer",
  "Leo", "Virgo", "Libra", "Scorpio",
  "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];

const HouseDetailsTable: React.FC<HouseDetailsTableProps> = ({ houses, planets }) => {
  const formatDegree = (longitude: number): string => {
    const totalDegrees = longitude % 360;
    const degrees = Math.floor(totalDegrees);
    const minutes = Math.floor((totalDegrees - degrees) * 60);
    return `${degrees}°${minutes}'`;
  };

  const getZodiacSign = (signIndex: number): string => {
    return ZODIAC_SIGNS[signIndex] || 'Unknown';
  };

  const getPlanetSymbols = (planetIds: string[]): JSX.Element[] => {
    return planetIds.map(planetId => {
      const planet = planets.find(p => p.id === planetId);
      if (!planet) return null;
      return (
        <span
          key={planet.id}
          title={planet.name}
          style={{ color: planet.color }}
          className="mr-1 text-2xl"
        >
          {planet.symbol}
        </span>
      );
    }).filter(Boolean) as JSX.Element[];
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Chi tiết các cung (nhà)</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nhà</TableHead>
              <TableHead>Cung</TableHead>
              <TableHead>Các hành tinh</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {houses.map((house) => (
              <TableRow key={house.number}>
                <TableCell className="font-medium">
                  {house.number}
                </TableCell>
                <TableCell>{getZodiacSign(house.sign)}</TableCell>
                <TableCell className="space-x-1">
                  {getPlanetSymbols(house.planets)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default HouseDetailsTable; 