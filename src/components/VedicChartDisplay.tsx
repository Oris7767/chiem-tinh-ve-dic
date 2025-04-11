import React from 'react';
import { VedicChartData, PlanetData } from '@/vedic-logic/vedicChart';

interface VedicChartDisplayProps {
    vedicChartData: VedicChartData | null;
}

const VedicChartDisplay: React.FC<VedicChartDisplayProps> = ({ vedicChartData }) => {
    if (!vedicChartData) {
        return <div>Loading chart...</div>;
    }

    const { chartStyle, houses, planets } = vedicChartData;

    const planetColors: Record<string, string> = {
        Ascendant: '#FF00FF',
        Sun: '#FFB900',
        Moon: '#DDDDDD',
        Mars: '#FF3300',
        Mercury: '#33CC33',
        Jupiter: '#FFCC00',
        Venus: '#FF66FF',
        Saturn: '#0066CC',
        Rahu: '#666666',
        Ketu: '#996633',
    };

    const renderNorthIndianChart = () => {
        return (
            <div className="grid grid-cols-3 h-full">
                {/* Row 1 */}
                <div className="border border-amber-300 p-2 text-xs relative flex flex-col">
                    <span className="text-gray-400 text-[10px] absolute top-1 left-1">1</span>
                    {planets.filter(p => p.house === 1).map((p, i) => (
                        <span key={i} className="font-bold text-center" style={{ color: planetColors[p.name] }}>
                            {p.symbol}
                        </span>
                    ))}
                </div>
                <div className="border border-amber-300 p-2 text-xs relative flex flex-col">
                    <span className="text-gray-400 text-[10px] absolute top-1 left-1">12</span>
                    {planets.filter(p => p.house === 12).map((p, i) => (
                        <span key={i} className="font-bold text-center" style={{ color: planetColors[p.name] }}>
                            {p.symbol}
                        </span>
                    ))}
                </div>
                <div className="border border-amber-300 p-2 text-xs relative flex flex-col">
                    <span className="text-gray-400 text-[10px] absolute top-1 left-1">11</span>
                    {planets.filter(p => p.house === 11).map((p, i) => (
                        <span key={i} className="font-bold text-center" style={{ color: planetColors[p.name] }}>
                            {p.symbol}
                        </span>
                    ))}
                </div>

                {/* Row 2 */}
                <div className="border border-amber-300 p-2 text-xs relative flex flex-col">
                    <span className="text-gray-400 text-[10px] absolute top-1 left-1">2</span>
                    {planets.filter(p => p.house === 2).map((p, i) => (
                        <span key={i} className="font-bold text-center" style={{ color: planetColors[p.name] }}>
                            {p.symbol}
                        </span>
                    ))}
                </div>
                <div className="border-0 flex items-center justify-center text-amber-900 font-semibold">
                    <div className="text-center">
                        <div className="text-sm font-bold mb-1">D1 Janma</div>
                        <div className="text-xs opacity-70">Birth Chart</div>
                    </div>
                </div>
                <div className="border border-amber-300 p-2 text-xs relative flex flex-col">
                    <span className="text-gray-400 text-[10px] absolute top-1 left-1">10</span>
                    {planets.filter(p => p.house === 10).map((p, i) => (
                        <span key={i} className="font-bold text-center" style={{ color: planetColors[p.name] }}>
                            {p.symbol}
                        </span>
                    ))}
                </div>

                {/* Row 3 */}
                <div className="border border-amber-300 p-2 text-xs relative flex flex-col">
                    <span className="text-gray-400 text-[10px] absolute top-1 left-1">3</span>
                    {planets.filter(p => p.house === 3).map((p, i) => (
                        <span key={i} className="font-bold text-center" style={{ color: planetColors[p.name] }}>
                            {p.symbol}
                        </span>
                    ))}
                </div>
                <div className="border border-amber-300 p-2 text-xs relative flex flex-col">
                    <span className="text-gray-400 text-[10px] absolute top-1 left-1">4</span>
                    {planets.filter(p => p.house === 4).map((p, i) => (
                        <span key={i} className="font-bold text-center" style={{ color: planetColors[p.name] }}>
                            {p.symbol}
                        </span>
                    ))}
                </div>
                <div className="border border-amber-300 p-2 text-xs relative flex flex-col">
                    <span className="text-gray-400 text-[10px] absolute top-1 left-1">9</span>
                    {planets.filter(p => p.house === 9).map((p, i) => (
                        <span key={i} className="font-bold text-center" style={{ color: planetColors[p.name] }}>
                            {p.symbol}
                        </span>
                    ))}
                </div>

                {/* Row 4 */}
                <div className="border border-amber-300 p-2 text-xs relative flex flex-col">
                    <span className="text-gray-400 text-[10px] absolute top-1 left-1">6</span>
                    {planets.filter(p => p.house === 6).map((p, i) => (
                        <span key={i} className="font-bold text-center" style={{ color: planetColors[p.name] }}>
                            {p.symbol}
                        </span>
                    ))}
                </div>
                <div className="border border-amber-300 p-2 text-xs relative flex flex-col">
                    <span className="text-gray-400 text-[10px] absolute top-1 left-1">5</span>
                    {planets.filter(p => p.house === 5).map((p, i) => (
                        <span key={i} className="font-bold text-center" style={{ color: planetColors[p.name] }}>
                            {p.symbol}
                        </span>
                    ))}
                </div>
                <div className="border border-amber-300 p-2 text-xs relative flex flex-col">
                    <span className="text-gray-400 text-[10px] absolute top-1 left-1">8</span>
                    {planets.filter(p => p.house === 8).map((p, i) => (
                        <span key={i} className="font-bold text-center" style={{ color: planetColors[p.name] }}>
                            {p.symbol}
                        </span>
                    ))}
                </div>

                {/* Row 5 */}
                <div className="border border-amber-300 p-2 text-xs relative flex flex-col">
                    <span className="text-gray-400 text-[10px] absolute top-1 left-1">7</span>
                    {planets.filter(p => p.house === 7).map((p, i) => (
                        <span key={i} className="font-bold text-center" style={{ color: planetColors[p.name] }}>
                            {p.symbol}
                        </span>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="aspect-square w-full border-2 border-amber-300 mb-6">
            {chartStyle === 'North' ? renderNorthIndianChart() : <div>South Indian Chart</div>}
        </div>
    );
};

export default VedicChartDisplay;
