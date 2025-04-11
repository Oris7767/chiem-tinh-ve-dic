import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import VedicChartDisplay from '@/components/VedicChartDisplay';
import DasaDisplay from '@/components/DasaDisplay';

// --- WARNING: API Key Management ---
// NEVER commit your API key directly into code in a real project.
// Use environment variables or a secure secrets management solution.
const API_KEY = 'qqgGvpWGpl3D30KKDm7Ej8mJiPDMg6il8a3K4pjj'; // Replace with process.env.REACT_APP_ASTRO_API_KEY in a real app
const API_URL = 'https://json.freeastrologyapi.com/planets'; // Assuming /planets or /planets/extended

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
    nakshatraNumber?: number; // Added based on description
    nakshatraPada?: number;   // Added based on description
    // nakshatraVimsottariLord?: string; // Potentially same as nakshatraLord, clarify if needed
    house: number;
    isCombust?: string; // Added optional field
}

// Updated state structure
interface ChartResults {
    chartStyle: 'North' | 'South';
    planets: PlanetData[];
    // Houses info might be derivable if Ascendant is included in planets
    // Dasa starting point can be found from Moon's Nakshatra Lord
    dasa?: any;    // Optional for now
}

const VedicAstrologyCalculatorPage: React.FC = () => {
    const [name, setName] = useState<string>('');
    const [dob, setDob] = useState<string>('');
    const [latitude, setLatitude] = useState<string>('');
    const [longitude, setLongitude] = useState<string>('');
    const [timezone, setTimezone] = useState<string>('5.5');
    const [chartStyle, setChartStyle] = useState<'North' | 'South'>('North');
    const [chartResults, setChartResults] = useState<ChartResults | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchBirthChart = async () => {
        setIsLoading(true);
        setError(null);
        setChartResults(null);

        // --- Input Validation ---
        if (!dob || !latitude || !longitude || !timezone) {
            setError('Please fill in Date/Time, Latitude, Longitude, and Timezone.');
            setIsLoading(false);
            return;
        }

        let parsedDate: Date;
        let latNum: number;
        let lonNum: number;
        let tzNum: number;

        try {
            parsedDate = new Date(dob);
            if (isNaN(parsedDate.getTime())) throw new Error('Invalid Date/Time format.');

            latNum = parseFloat(latitude);
            lonNum = parseFloat(longitude);
            tzNum = parseFloat(timezone);

            if (isNaN(latNum) || isNaN(lonNum) || isNaN(tzNum)) {
                throw new Error('Latitude, Longitude, and Timezone must be valid numbers.');
            }
            if (latNum < -90 || latNum > 90) throw new Error ('Latitude must be between -90 and 90.');
            if (lonNum < -180 || lonNum > 180) throw new Error ('Longitude must be between -180 and 180.');

        } catch (validationError: any) {
            setError(`Input Error: ${validationError.message}`);
            setIsLoading(false);
            return;
        }

        // --- Construct API Request Body ---
        const requestBody = {
            year: parsedDate.getFullYear(),
            month: parsedDate.getMonth() + 1,
            date: parsedDate.getDate(),
            hours: parsedDate.getHours(),
            minutes: parsedDate.getMinutes(),
            seconds: parsedDate.getSeconds(),
            latitude: latNum,
            longitude: lonNum,
            timezone: tzNum,
            settings: {
                observation_point: "topocentric",
                ayanamsha: "lahiri"
            }
        };

        console.log('Calling API with body:', requestBody);

        // --- Actual API Call ---
        try {
            // Consider adding '/extended' if that's the correct endpoint path
            const response = await fetch(API_URL, { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': API_KEY
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                let apiErrorMsg = `API Error: ${response.status} ${response.statusText}`;
                try {
                    const errorData = await response.json();
                    apiErrorMsg += ` - ${errorData.message || JSON.stringify(errorData)}`;
                } catch (e) { /* Ignore */ }
                throw new Error(apiErrorMsg);
            }

            const data = await response.json();

            if (!data || !data.output || !Array.isArray(data.output)) {
                console.error('Unexpected API response structure:', data);
                throw new Error('Received unexpected data format from API.');
            }

            // Assuming data.output is the array of PlanetData
            const planets: PlanetData[] = data.output;
            console.log('Received Planets:', planets);

            // Check if Ascendant data is included (often named 'Ascendant' or 'Lagnam')
            const ascendantData = planets.find(p => p.name.toLowerCase() === 'ascendant' || p.name.toLowerCase() === 'lagnam');
            if (!ascendantData) {
                 console.warn('Ascendant data not found in API response. House placements might be inaccurate.');
            }

            setChartResults({
                chartStyle: chartStyle,
                planets: planets,
                dasa: { // Prepare basic Dasa info from Moon
                   moonNakshatraLord: planets.find(p => p.name === 'Moon')?.nakshatraLord
                } 
            });

        } catch (err: any) {
            console.error('Error fetching birth chart:', err);
            setError(`Failed to fetch birth chart: ${err.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCalculate = (e: React.FormEvent) => {
        e.preventDefault();
        fetchBirthChart();
    };

    return (
        <div className="container mx-auto p-4 space-y-6">
            <h1 className="text-3xl font-bold text-center mb-6">Vedic Astrology Calculator</h1>

            {/* Input Form */}
            <form onSubmit={handleCalculate} className="max-w-lg mx-auto p-6 border rounded-lg shadow-md space-y-4">
                <h2 className="text-xl font-semibold mb-4">Enter Birth Details (Use Test Data)</h2>
                {/* Name field removed as it's not used by API */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        {/* TODO: Use i18n string for label 'Date' + 'Time' */}
                        <Label htmlFor="dob">Date and Time of Birth*</Label>
                        <Input
                            id="dob"
                            type="datetime-local"
                            value={dob}
                            onChange={(e) => setDob(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                         {/* TODO: Use i18n string for label 'Timezone' */}
                        <Label htmlFor="timezone">Timezone Offset* (e.g., 5.5)</Label>
                        <Input
                            id="timezone"
                            type="number"
                            step="0.5"
                            value={timezone}
                            onChange={(e) => setTimezone(e.target.value)}
                            placeholder="e.g., 5.5 for IST"
                            required
                        />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                         {/* TODO: Use i18n string for label 'Location' (Latitude) */}
                        <Label htmlFor="latitude">Latitude* (-90 to 90)</Label>
                        <Input
                            id="latitude"
                            type="number"
                            step="any"
                            value={latitude}
                            onChange={(e) => setLatitude(e.target.value)}
                            placeholder="e.g., 17.383"
                            required
                        />
                    </div>
                    <div>
                        {/* TODO: Use i18n string for label 'Location' (Longitude) */}
                        <Label htmlFor="longitude">Longitude* (-180 to 180)</Label>
                        <Input
                            id="longitude"
                            type="number"
                            step="any"
                            value={longitude}
                            onChange={(e) => setLongitude(e.target.value)}
                            placeholder="e.g., 78.466"
                            required
                        />
                    </div>
                </div>
                 <div>
                    <Label htmlFor="chartStyle">Chart Style</Label>
                    <Select onValueChange={(value: 'North' | 'South') => setChartStyle(value)} defaultValue={chartStyle}>
                        <SelectTrigger id="chartStyle">
                            <SelectValue placeholder="Select chart style" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="North">North Indian</SelectItem>
                            <SelectItem value="South">South Indian</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <Button type="submit" disabled={isLoading} className="w-full">
                    {isLoading ? 'Calculating...' : 'Calculate Chart'}
                </Button>
                {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
            </form>

            {/* Results Section */}
            {isLoading && <p className="text-center mt-4">Loading planetary data...</p>}
            {chartResults && !isLoading && (
                <div className="mt-8 space-y-6">
                    <h2 className="text-2xl font-semibold text-center">Calculation Results</h2>
                    <VedicChartDisplay
                        planets={chartResults.planets}
                        chartStyle={chartResults.chartStyle}
                     />
                    <DasaDisplay dasaData={chartResults.dasa} />
                    <p className="text-center text-sm text-gray-600">Note: Full Dasha sequence/dates require further calculation.</p>
                </div>
            )}
        </div>
    );
};

export default VedicAstrologyCalculatorPage;
