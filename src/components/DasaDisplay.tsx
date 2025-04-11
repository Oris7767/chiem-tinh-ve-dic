import React from 'react';

interface DasaDisplayProps {
    dasaData: any;
}

const DasaDisplay: React.FC<DasaDisplayProps> = ({ dasaData }) => {
    return (
        <div>
            <h3>Dasa Display</h3>
            <p>Moon Nakshatra Lord: {dasaData?.moonNakshatraLord}</p>
        </div>
    );
};

export default DasaDisplay;
