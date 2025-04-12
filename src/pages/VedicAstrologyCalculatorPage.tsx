import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cities, City } from '@/utils/cityData';
import VedicChartDisplay from '@/components/VedicChartDisplay';
import DasaDisplay from '@/components/DasaDisplay';
import { calculateAscendant, calculatePlanetPosition, calculateHouses, VedicChartData, PlanetData } from '@/vedic-logic/vedicChart';

// --- WARNING: API Key Management ---
// NEVER commit your API key directly into code in a real project.
// Use environment variables or a secure secrets management solution.
const API_KEY = 'qqgGvpWGpl3D30KKDm7Ej8mJiPDMg6il8a3K4pjj'; // Replace with process.env.REACT_APP_ASTRO_API_KEY in a real app
const API_URL = 'https://json.freeastrologyapi.com/planets'; // Assuming /planets or /planets/extended


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
    const [selectedCity, setSelectedCity] = useState<City | null>(null);
    const [timezone, setTimezone] = useState<string>('5.5');
    const [chartStyle, setChartStyle] = useState<'North' | 'South'>('North');
    const [chartResults, setChartResults] = useState<ChartResults | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [chartData, setChartData] = useState<any>(null);

    const fetchBirthChart = async (): Promise<void> => {
        setIsLoading(true);
        setError(null);
        setChartResults(null);
        setVedicChartData(null);

        // --- Input Validation ---
        if (!dob || !selectedCity || !timezone) {
            setError('Please fill in Date/Time, City, and Timezone.');
            setIsLoading(false);
            return;
        }

        let parsedDate: Date;
        let tzNum: number;

        try {
            parsedDate = new Date(dob);
            if (isNaN(parsedDate.getTime())) throw new Error('Invalid Date/Time format.');

            tzNum = parseFloat(timezone);

            if (isNaN(tzNum)) {
                throw new Error('Timezone must be a valid number.');
            }

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
            latitude: selectedCity.latitude, 
            longitude: selectedCity.longitude,
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

             // Extract and transform planet data from the second element of data.output
            const planetsData = data.output[1];
            const planets: PlanetData[] = Object.entries(planetsData).map(([name, data]: [string, any]) => ({
                name,
                fullDegree: data.fullDegree,
                normDegree: data.normDegree,
                speed: data.speed,
                isRetro: data.isRetro,
                sign: data.sign,
                signLord: data.signLord,
                nakshatra: data.nakshatra,
                nakshatraLord: data.nakshatraLord,
                house: data.house,
                isCombust: data.isCombust,
                symbol: '' // TODO: Add actual symbols
            }));
            console.log('Received Planets:', planets);

            // Calculate Ascendant
            const ascendantDegree = calculateAscendant(parsedDate, selectedCity.latitude, selectedCity.longitude);

            // Calculate Houses
            const houses = calculateHouses(ascendantDegree, chartStyle);

            // TODO: calculate sign, degree, minutes, seconds, nakshatra, and pada for ascendant
            const ascendant = {
                sign: "",
                degree: 0,
                minutes: 0,
                seconds: 0,
                nakshatra: "",
                pada: 0
            };

            // Construct VedicChartData
            setVedicChartData({
                chartStyle: chartStyle,
                ascendant: ascendant,
                houses: houses,
                planets: planets,
                aspects: []
            });

            // Check if Ascendant data is included (often named 'Ascendant' or 'Lagnam')
            console.log("Planets data before ascendant check:", planets);
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
            // Transform planet data into house-wise format
            const houseMap: { [key: number]: string[] } = {};
            planets.forEach((planet) => {
            const houseNum = parseInt(planet.house);
            if (!houseMap[houseNum]) {
                houseMap[houseNum] = [];
                }
            houseMap[houseNum].push(planet.name);
            });

            // Combine house numbers and planet lists
            const chartForDisplay = {
               houses: Array.from({ length: 12 }, (_, i) => ({
               house: i + 1,
               planets: houseMap[i + 1] || [],
           })),
        };

       // Store in chartData state (add this state if not declared)
       setChartData(chartForDisplay);



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
                <div>
                    <Label htmlFor="city">City</Label>
                    <Select onValueChange={(value) => {
                        const city = cities.find(c => c.name === value);
                        setSelectedCity(city || null);
                    }}>
                        <SelectTrigger id="city">
                            <SelectValue placeholder="Select a city" />
                        </SelectTrigger>
                        <SelectContent>
                            {cities.map((city) => (
                                <SelectItem key={city.name} value={city.name}>
                                    {city.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {selectedCity && (
                        <p className="text-sm text-gray-500 mt-1">
                            Selected: {selectedCity.name} ({selectedCity.latitude}, {selectedCity.longitude})
                        </p>
                    )}
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
            {vedicChartData && !isLoading && (
               <div className="mt-8 space-y-6">
                   <VedicChartDisplay data={chartData} />
                   <DasaDisplay dasaData={chartResults?.dasa} />
                   <p className="text-center text-sm text-gray-600">Note: Full Dasha sequence/dates require further calculation.</p>
               </div>
           )}
        </div>
    );
};

export default VedicAstrologyCalculatorPage;
