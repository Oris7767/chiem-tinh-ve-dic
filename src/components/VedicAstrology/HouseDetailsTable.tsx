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
import { House, Planet, ZodiacSign } from './VedicChart';

interface HouseDetailsTableProps {
  houses: House[];
  planets: Planet[];
}

const ZODIAC_SIGNS = [
  "Aries", "Taurus", "Gemini", "Cancer",
  "Leo", "Virgo", "Libra", "Scorpio",
  "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];

const HOUSE_NAMES = {
  1: { sanskrit: "Lagna / Tanu Bhava", meaning: "Thân thể / Bản thân" },
  2: { sanskrit: "Dhana Bhava", meaning: "Tài sản / Tài chính" },
  3: { sanskrit: "Sahaja Bhava", meaning: "Nỗ lực / Anh em" },
  4: { sanskrit: "Sukha Bhava", meaning: "Hạnh phúc / Gia đình" },
  5: { sanskrit: "Putra Bhava", meaning: "Con cái / Trí tuệ / Tình yêu" },
  6: { sanskrit: "Shatru Bhava", meaning: "Kẻ thù / Bệnh tật / Nợ nần" },
  7: { sanskrit: "Yuvati Bhava", meaning: "Hôn nhân / Quan hệ" },
  8: { sanskrit: "Randhra Bhava", meaning: "Sinh tử / Biến đổi / Bí ẩn" },
  9: { sanskrit: "Dharma Bhava", meaning: "May mắn / Tâm linh / Cha" },
  10: { sanskrit: "Karma Bhava", meaning: "Sự nghiệp / Địa vị xã hội" },
  11: { sanskrit: "Labha Bhava", meaning: "Thu nhập / Ước mơ / Bạn bè" },
  12: { sanskrit: "Vyaya Bhava", meaning: "Tổn thất / Giải thoát / Tiềm thức" }
};

const HouseDetailsTable: React.FC<HouseDetailsTableProps> = ({ houses, planets }) => {
  const formatDegree = (longitude: number): string => {
    const totalDegrees = longitude % 360;
    const degrees = Math.floor(totalDegrees);
    const minutes = Math.floor((totalDegrees - degrees) * 60);
    return `${degrees}°${minutes}'`;
  };

  const getZodiacSign = (sign: string): string => {
    // Trả về trực tiếp tên cung từ API
    return sign || 'Unknown';
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
        <CardTitle>Chi tiết các nhà (Bhava)</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nhà</TableHead>
              <TableHead>Tên Sanskrit</TableHead>
              <TableHead>Ý Nghĩa</TableHead>
              <TableHead>Cung</TableHead>
              <TableHead>Các hành tinh</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {houses.map((house) => {
              const houseInfo = HOUSE_NAMES[house.number];
              return (
                <TableRow key={house.number}>
                  <TableCell className="font-medium">
                    {house.number}
                  </TableCell>
                  <TableCell>{houseInfo.sanskrit}</TableCell>
                  <TableCell>{houseInfo.meaning}</TableCell>
                  <TableCell>{getZodiacSign(house.sign)}</TableCell>
                  <TableCell className="space-x-1">
                    {getPlanetSymbols(house.planets)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default HouseDetailsTable;
