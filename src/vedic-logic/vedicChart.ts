// VEDIC CHART UNIFIED STRUCTURE
// File: vedicChart.ts

// Common Interfaces for both North and South Indian Charts
export interface PlanetData {
    name: string;
    fullDegree: number;
    normDegree: number;
    speed: number;
    isRetro: string; // 'true' or 'false'
    sign: string;
    signLord: string;
    nakshatra: string;
    nakshatraLord: string; // This might be the Vimsottari Lord
    nakshatraNumber?: number; // Added based on description
    nakshatraPada?: number;   // Added based on description
    // nakshatraVimsottariLord?: string; // Potentially same as nakshatraLord, clarify if needed
    house: number;
    isCombust?: string; // Added optional field
    symbol: string;
}

interface PlanetPosition {
    planet: string;
    degree: number;
    minutes: number;
    seconds: number;
    nakshatra: string;
    pada: number;
    isCombust?: boolean;
    isRetrograde?: boolean;
    dignity?: string;
    speed?: number;
}

interface House {
    number: number;
    sign: string;
    degree: number;
    minutes: number;
    seconds: number;
    planets: PlanetPosition[];
    signLord: string;
    aspectingPlanets: string[];
}

// Chart Type Specific Interfaces
interface NorthIndianHouse extends House {
    layout: {
        position: 'top' | 'right' | 'bottom' | 'left' | 'center';
        rotation: number;
    };
}

interface SouthIndianHouse extends House {
    layout: {
        gridPosition: {
            row: number;
            column: number;
        };
        innerBorders: boolean;
    };
}

// Unified Chart Data Structure
export interface VedicChartData {
    chartStyle: 'North' | 'South';
    ascendant: {
        sign: string;
        degree: number;
        minutes: number;
        seconds: number;
        nakshatra: string;
        pada: number;
    };
    houses: (NorthIndianHouse | SouthIndianHouse)[];
    planets: PlanetData[];
    aspects: {
        planet: string;
        aspectsTo: {
            house: number;
            sign: string;
            strength: number;
        }[];
    }[];
}

// Chart Layout Configurations
const chartConfig = {
    northIndian: {
        layout: {
            type: "Square",
            dimensions: {
                width: 600,
                height: 600,
                padding: 40,
                houseSize: {
                    width: 120,
                    height: 120
                }
            },
            houseArrangement: [
                [1, 12, 11],
                [2, 0, 10],  // 0 represents center
                [3, 4, 9]
            ]
        },
        styling: {
            borderStyle: "bold",
            cornerStyle: "pointed",
            planetAlignment: "diagonal"
        }
    },
    southIndian: {
        layout: {
            type: "Grid",
            dimensions: {
                width: 600,
                height: 600,
                padding: 40,
                cellSize: {
                    width: 150,
                    height: 150
                }
            },
            houseArrangement: [
                [4, 3, 2, 1],
                [5, 0, 0, 12],  // 0 represents merged cells
                [6, 0, 0, 11],
                [7, 8, 9, 10]
            ]
        },
        styling: {
            borderStyle: "single",
            cornerStyle: "square",
            planetAlignment: "vertical"
        }
    },
    common: {
        colors: {
            background: "#FFFFFF",
            border: "#000000",
            text: "#000000",
            aspects: {
                beneficial: "#00FF00",
                malefic: "#FF0000",
                neutral: "#0000FF"
            },
            planets: {
                Sun: "#FF4500",
                Moon: "#SILVER",
                Mars: "#FF0000",
                Mercury: "#00FF00",
                Jupiter: "#FFD700",
                Venus: "#WHITE",
                Saturn: "#000080",
                Rahu: "#4B0082",
                Ketu: "#800000"
            }
        },
        fonts: {
            primary: "Arial",
            sanskrit: "Sanskrit Text",
            symbols: "Astronomical",
            sizes: {
                planetSymbols: 14,
                degrees: 12,
                signs: 16,
                houses: 14
            }
        }
    }
};

// Zodiac Signs Configuration
const zodiacSigns = {
    signs: [
        {
            name: "Aries",
            sanskrit: "Mesha",
            element: "Fire",
            quality: "Cardinal",
            ruler: "Mars",
            symbol: "♈",
            startDegree: 0,
            endDegree: 30
        },
        // ... (remaining signs)
    ]
};

// Planet Configuration
const planetConfig = {
    planets: [
        {
            name: "Sun",
            sanskrit: "Surya",
            symbol: "☉",
            signRuler: "Leo",
            exaltation: "Aries",
            debilitation: "Libra",
            aspects: [7],
            element: "Fire"
        },
        // ... (remaining planets)
    ]
};

// Chart Drawing Functions Interface
interface ChartDrawing {
    drawNorthIndianChart: (data: VedicChartData) => void;
    drawSouthIndianChart: (data: VedicChartData) => void;
    drawPlanet: (planet: PlanetPosition, style: 'North' | 'South') => void;
    drawAspects: (aspects: any[], style: 'North' | 'South') => void;
    calculateHousePosition: (houseNumber: number, style: 'North' | 'South') => {
        x: number;
        y: number;
        rotation: number;
    };
}

// Chart Calculation Functions
export const calculateAscendant = (datetime: Date, latitude: number, longitude: number) => {
    // TODO: Implement ascendant calculation logic here
    return 0; // Placeholder value
};

export const calculatePlanetPosition = (planet: string, datetime: Date) => {
    // TODO: Implement planet position calculation logic here
    return { // Placeholder
        planet: planet,
        degree: 0,
        minutes: 0,
        seconds: 0,
        nakshatra: "",
        pada: 0
    };
};

export const calculateHouses = (ascendantDegree: number, chartStyle: 'North' | 'South') => {
    // TODO: Implement house calculation logic here
    return []; // Placeholder value
};

// Chart Calculation Functions
interface ChartCalculations {
    calculateAscendant: (datetime: Date, latitude: number, longitude: number) => number;
    calculatePlanetPosition: (planet: string, datetime: Date) => PlanetPosition;
    calculateHouses: (ascendantDegree: number, chartStyle: 'North' | 'South') => House[];
    calculateAspects: (houses: House[]) => any[];
}

// Example Chart Data
const exampleChart: VedicChartData = {
    chartStyle: 'North',
    ascendant: {
        sign: "Aries",
        degree: 15,
        minutes: 30,
        seconds: 0,
        nakshatra: "Bharani",
        pada: 2
    },
    houses: [
        {
            number: 1,
            sign: "Aries",
            degree: 15,
            minutes: 30,
            seconds: 0,
            planets: [],
            signLord: "Mars",
            aspectingPlanets: ["Saturn"],
            layout: {
                position: 'top',
                rotation: 0
            }
        },
        // ... (remaining houses)
    ],
    planets: [],
    aspects: [
        {
            planet: "Mars",
            aspectsTo: [
                {
                    house: 4,
                    sign: "Cancer",
                    strength: 0.5
                }
            ]
        }
    ]
};


// Export types and configurations
export type {
    PlanetPosition,
    House,
    NorthIndianHouse,
    SouthIndianHouse,
    ChartDrawing,
    ChartCalculations
};

export {
    chartConfig,
    zodiacSigns,
    planetConfig,
    exampleChart
};
