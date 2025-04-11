import React from 'react';

// Define the expected props structure
interface DasaDisplayProps {
  dasaData: any; // Replace 'any' with a specific type based on API response
}

const DasaDisplay: React.FC<DasaDisplayProps> = ({ dasaData }) => {
  console.log('Rendering Dasa Display with data:', dasaData);

  // TODO: Implement Dasa display logic based on vimsottariData from Dasa.ts
  //       and the actual data received from the API

  return (
    <div className="p-4 border rounded-lg shadow-inner bg-gray-50">
      <h3 className="text-xl font-semibold mb-4">Vimshottari Dasha (Placeholder)</h3>
      {/* 
        TODO: 
        - Determine the starting Dasha based on Moon's Nakshatra (requires calculation logic)
        - List Mahadashas, Antardashas, etc. with start/end dates
        - Use data from src/vedic-logic/Dasa.ts
      */}
      <div className="text-gray-500 text-sm">
        (Dasha display not implemented)
      </div>
      <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto mt-2">
        {JSON.stringify(dasaData, null, 2)}
      </pre>
    </div>
  );
};

export default DasaDisplay;
