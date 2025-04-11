import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// --- Updated Planet Data Interface ---
interface PlanetData {
    name: string;
    fullDegree: number;
    normDegree: number;
    speed: number;
    isRetro: string; // 'true' or 'false'
    sign: string;
    signLord: string;
    nakshatra: string;
    nakshatraLord: string; // This might be the Vimsottari Lord
    nakshatraNumber?: number;
    nakshatraPada?: number;
    house: number;
    isCombust?: string; // 'true' or 'false'
}

// Updated props for the component
interface VedicChartDisplayProps {
    planets: PlanetData[];
    chartStyle: 'North' | 'South';
}

// Helper to format degrees (e.g., 275.5 -> 5° 30' Sco)
const formatDegree = (fullDegree: number): string => {
    const signs = ["Ar", "Ta", "Ge", "Cn", "Le", "Vi", "Li", "Sc", "Sg", "Cp", "Aq", "Pi"];
    const signIndex = Math.floor(fullDegree / 30) % 12;
    const degreeInSign = fullDegree % 30;
    const degrees = Math.floor(degreeInSign);
    const minutes = Math.floor((degreeInSign - degrees) * 60);
    // const seconds = Math.round(((degreeInSign - degrees) * 60 - minutes) * 60);
    // return `${degrees}° ${String(minutes).padStart(2, '0')}' ${String(seconds).padStart(2, '0')}" ${signs[signIndex]}`;
    return `${degrees}° ${String(minutes).padStart(2, '0')}' ${signs[signIndex]}`;
};

const VedicChartDisplay: React.FC<VedicChartDisplayProps> = ({ planets, chartStyle }) => {
    console.log('Rendering Chart Display with planets:', planets);

    // Extract Ascendant data if available
    const ascendant = planets.find(p => p.name.toLowerCase() === 'ascendant' || p.name.toLowerCase() === 'lagnam');

    const renderNorthIndianChart = () => {
        // TODO: Implement North Indian chart rendering logic using planets & ascendant
        return (
            <div className="border-2 border-gray-700 p-4 w-[300px] h-[300px] mx-auto bg-amber-100 relative mb-4">
                <p className="text-center font-bold">North Indian Chart</p>
                {ascendant && <p className="text-center text-sm">Asc: {formatDegree(ascendant.fullDegree)}</p>}
                <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                    <p className="text-gray-500 text-sm">(Chart rendering not implemented)</p>
                </div>
            </div>
        );
    };

    const renderSouthIndianChart = () => {
        // TODO: Implement South Indian chart rendering logic using planets & ascendant
        return (
            <div className="border-2 border-gray-700 p-4 w-[300px] h-[300px] mx-auto bg-cyan-100 grid grid-cols-4 grid-rows-4 gap-0 mb-4">
                <p className="text-center font-bold col-span-4">South Indian Chart</p>
                 {ascendant && <p className="text-center text-sm col-span-4">Asc: {formatDegree(ascendant.fullDegree)}</p>}
                <div className="col-span-4 row-span-3 flex items-center justify-center">
                    <p className="text-gray-500 text-sm">(Chart rendering not implemented)</p>
                </div>
            </div>
        );
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Chart ({chartStyle}) & Planetary Positions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {chartStyle === 'North' ? renderNorthIndianChart() : renderSouthIndianChart()}

                <h4 className="font-semibold text-lg">Graha Details</h4>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Graha</TableHead>
                                <TableHead>Longitude</TableHead>
                                <TableHead>Nakshatra (Pada)</TableHead>
                                <TableHead>Naksh Lord</TableHead> {/* Vimsottari Lord */} 
                                <TableHead>House</TableHead>
                                <TableHead>Sign</TableHead>
                                <TableHead>Sign Lord</TableHead>
                                <TableHead>Retro?</TableHead>
                                <TableHead>Combust?</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {planets && planets.length > 0 ? (
                                planets.map((planet) => (
                                    <TableRow key={planet.name}>
                                        <TableCell className="font-medium">{planet.name}</TableCell>
                                        <TableCell>{formatDegree(planet.fullDegree)}</TableCell>
                                        <TableCell>{planet.nakshatra} ({planet.nakshatraPada ?? '?'})</TableCell>
                                        <TableCell>{planet.nakshatraLord}</TableCell>
                                        <TableCell>{planet.house}</TableCell>
                                        <TableCell>{planet.sign}</TableCell>
                                        <TableCell>{planet.signLord}</TableCell>
                                        <TableCell>{planet.isRetro === 'true' ? 'R' : ''}</TableCell>
                                        <TableCell>{planet.isCombust === 'true' ? 'C' : ''}</TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={9} className="text-center">No planetary data available.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                 {/* Bhava Details still needs separate data/calculation */}
                 <div className="mt-4 p-4 border rounded bg-gray-100">
                    <h4 className="font-semibold">Bhava Details (Placeholder)</h4>
                    <p className="text-sm text-gray-600">Requires house cusp data (e.g., Ascendant degree + house system calculation).</p>
                 </div>

            </CardContent>
        </Card>
    );
};

export default VedicChartDisplay;
