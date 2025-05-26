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

interface House {
  number: number;
  sign: string;
  degree: number;
  planets: string[];
}

interface HouseDetailsTableProps {
  houses: House[];
}

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

const PLANET_SYMBOLS: { [key: string]: string } = {
  SUN: "☉",
  MOON: "☽",
  MARS: "♂",
  MERCURY: "☿",
  JUPITER: "♃",
  VENUS: "♀",
  SATURN: "♄",
  RAHU: "☊",
  KETU: "☋"
};

const PLANET_COLORS: { [key: string]: string } = {
  SUN: "#FFA500",
  MOON: "#C0C0C0",
  MARS: "#FF0000",
  MERCURY: "#00FF00",
  JUPITER: "#FFD700",
  VENUS: "#FF69B4",
  SATURN: "#4B0082",
  RAHU: "#000080",
  KETU: "#800000"
};

const HouseDetailsTable: React.FC<HouseDetailsTableProps> = ({ houses }) => {
  const formatDegree = (degree: number): string => {
    const degrees = Math.floor(degree);
    const minutes = Math.floor((degree - degrees) * 60);
    return `${degrees}°${minutes}'`;
  };

  const getPlanetSymbols = (planetNames: string[]): JSX.Element[] => {
    return planetNames.map(planetName => (
      <span
        key={planetName}
        title={planetName}
        style={{ color: PLANET_COLORS[planetName] }}
        className="mr-1 text-2xl"
      >
        {PLANET_SYMBOLS[planetName]}
      </span>
    ));
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
              <TableHead>Độ</TableHead>
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
                  <TableCell>{house.sign}</TableCell>
                  <TableCell>{formatDegree(house.degree)}</TableCell>
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