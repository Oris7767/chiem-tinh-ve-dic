import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';


enum HouseName {
  House1 = "House1",
  House2 = "House2",
  House3 = "House3",
  House4 = "House4",
  House5 = "House5",
  House6 = "House6",
  House7 = "House7",
  House8 = "House8",
  House9 = "House9",
  House10 = "House10",
  House11 = "House11",
  House12 = "House12",
}

interface House {
  middleLongitude: Angle;
  beginLongitude: Angle;
  endLongitude: Angle;
  houseNumber: HouseName;
}

//Placeholder components
const PageTop: React.FC = ({ImageWidth, ImageName, Title, DescriptionText}) => {
    return (
        <div>
            Banner {Title}
        </div>
    )
}

const PersonSelectorBox: React.FC = () => {
    return (
        <div>
            Person selector
        </div>
    )
}

const IconButton: React.FC = ({TooltipPosition, TooltipText, IconName, OnClickCallback, SmallSize, Color, ButtonText}) => {
    return(
        <button onClick={ () => {
            if (OnClickCallback) {
                OnClickCallback()
            }
        }}>
            {ButtonText}
        </button>
    )
}

const InfoBox: React.FC = ({MaxWidth, Title, Description, IconName, ClickUrl}) => {
    return (
        <div>
            Info Box
        </div>
    )
}

const StrengthChart: React.FC = () => {
    return(
        <div>
            Strength chart
        </div>
    )
}

const SkyChartViewer: React.FC = () => {
    return(
        <div>
            Sky chart viewer
        </div>
    )
}

const IndianChart: React.FC = () => {
    return (
        <div>
            Indian chart
        </div>
    )
}

const AIPrediction: React.FC = () => {
    return (
        <div>
            AI predictions
        </div>
    )
}

const HoroscopeReferenceList: React.FC = () => {
    return (
        <div>
            reference list
        </div>
    )
}

const PageRoute = {
    ChatAPI: '/chat',
    Import: '/import',
    BirthTimeFinder: '/birthtime',
    Horoscope: '/horoscope',
}


interface ApiResponse {
  HousePositions: {
      House1: {Begin: number, Middle:number, End:number},
      House2: {Begin: number, Middle:number, End:number},
      House3: {Begin: number, Middle:number, End:number},
      House4: {Begin: number, Middle:number, End:number},
      House5: {Begin: number, Middle:number, End:number},
      House6: {Begin: number, Middle:number, End:number},
      House7: {Begin: number, Middle:number, End:number},
      House8: {Begin: number, Middle:number, End:number},
      House9: {Begin: number, Middle:number, End:number},
      House10: {Begin: number, Middle:number, End:number},
      House11: {Begin: number, Middle:number, End:number},
      House12: {Begin: number, Middle:number, End:number},
    }
  // Define other properties as needed based on the API response
}


//React version
const VedicAstrologyChart: React.FC = () => {
    const [selectedChartStyle, setSelectedChartStyle] = useState("South");
    const [selectedAyanamsa, setSelectedAyanamsa] = useState("Raman");
    const [showAdvanced, setShowAdvanced] = useState(false);
    const calculateButtonRef = useRef<HTMLButtonElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const [isCalculated, setIsCalculated] = useState(false);
    const [personIdUrl, setPersonIdUrl] = useState<string>('');
    const [houses, setHouses] = useState<House[]>([]);

    const fetchHousePositions = async () => {
    try {
      const apiKey = 'qqgGvpWGpl3D30KKDm7Ej8mJiPDMg6il8a3K4pjj';
      const apiUrl = `https://json.freeastrologyapi.com/api/HousePositions?api_key=${apiKey}`;

      const response = await axios.get<ApiResponse>(apiUrl); // Axios Instance
      const houseData = response.data.HousePositions;
       const housesArray: House[] = Object.entries(houseData).map(([key, value]) => {
            const houseNumber = key as HouseName; // Type casting here
            return {
                houseNumber: houseNumber,
                beginLongitude: { degrees: value.Begin },
                middleLongitude: { degrees: value.Middle },
                endLongitude: { degrees: value.End },
            };
        });
      console.log(housesArray)
       setHouses(housesArray);

    } catch (error) {
      console.error('Error fetching house positions:', error);
      // Handle the error appropriately (e.g., display an error message)
    }
  };

    const handleCalculate = () => {
        setIsCalculated(true);
        fetchHousePositions();
    }

    return (
        <>
            <PageTop 
                ImageWidth={255 + 97} 
                ImageName="horoscope-banner.png" 
                Title="Horoscope" 
                DescriptionText="Insight into a person's character, nature and general future. Over +370 planetary combinations are used." 
            />

            <div className="d-md-flex justify-content-between">
                {/* SELECTOR */}
                <div className="me-5">
                    {/* INPUT */}
                    <div className="d-flex flex-wrap mb-5" style={{ maxWidth: '352px' }}>
                        <div id="HoroscopeMainInputHolder" className="vstack gap-3">
                            <PersonSelectorBox Width="100%"  />

                            {/* ADVANCED PANEL DROP */}
                            <div id="HoroscopeAdvancedInputHolder" className="vstack gap-1 mt-2 pt-2 border-top" style={{ display: showAdvanced ? 'block' : 'none' }}>
                                {/* HEADER TEXT */}
                                <span style={{ fontSize: '11.5px', marginLeft: '0px', color: 'grey', marginTop: '-20px', position: 'absolute', backgroundColor: 'rgb(240, 242, 245)' }} className="px-1">Advanced Options</span>

                                {/* AYANAMSA */}
                                <div className="input-group mb-2">
                                    <label style={{ width: '134px' }} className="input-group-text">
                                         Ayanamsa
                                    </label>
                                    <select value={selectedAyanamsa} onChange={(e) => setSelectedAyanamsa(e.target.value)} className="form-select">
                                        <optgroup label="Easy">
                                            <option value="Raman">Raman</option>
                                            {/* Add other simple Ayanamsa options here */}
                                        </optgroup>
                                        <optgroup label="Advanced">
                                            {/* Add advanced Ayanamsa options here */}
                                        </optgroup>
                                    </select>
                                </div>

                                {/* CHART STYLE */}
                                <div className="input-group">
                                    <label style={{ width: '134.4px' }} className="input-group-text">
                                        Chart
                                    </label>
                                    <select value={selectedChartStyle} onChange={(e) => setSelectedChartStyle(e.target.value)} id="ChartStyleSelectElement" className="form-select">
                                        <option value="South">South Style</option>
                                        <option value="North">North Style</option>
                                    </select>
                                </div>
                            </div>

                            {/* BUTTONS */}
                            <div className="mt-2 d-flex justify-content-between">
                                <IconButton TooltipPosition="bottom" TooltipText="Advanced (optional)" IconName="gala:settings" OnClickCallback={() => setShowAdvanced(!showAdvanced)} SmallSize="true" />
                                <IconButton  IconName="uim:process" Color="success" ButtonText="Calculate" OnClickCallback={handleCalculate} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* SIDEBAR */}
                <div className="mt-md-0 mt-4 me-md-5">
                    <div className="vstack gap-0 gap-md-2">
                        <InfoBox MaxWidth={365} Title="Ask AI Chat" Description="Ask AI astrologer about your life aspects and horoscope" IconName="fluent-emoji:robot" ClickUrl={PageRoute.ChatAPI} IsNewTabOpen={true} />
                        <InfoBox MaxWidth={365} Title="Easy Import" Description="Birth data from Jagannatha Hora, Light of KP (LOKPA) or Parashara's Light 9" IconName="fluent-emoji-flat:outbox-tray" ClickUrl={PageRoute.Import} />
                        <InfoBox MaxWidth={365} Title="Forgoten Time" Description="Use advanced computation to find your lost birth time" IconName="noto:alarm-clock" ClickUrl={PageRoute.BirthTimeFinder} IsNewTabOpen={true}/>
                    </div>
                </div>
            </div>

            <hr />

            <div className="gap-3" style={{ maxWidth: '824px' }}>
                {/* OUTPUT */}
                {isCalculated && (
                    <div id="outputHoroscope" className="vstack gap-4">
                        <div id="HoroscopeChat" className="scrollspy mb-5"></div>
                        <div id="Strength" className="scrollspy">
                            <StrengthChart  />
                        </div>
                        <SkyChartViewer Id="SkyChart" ExtraClass="scrollspy"  />
                        <IndianChart Id="IndianChart" ExtraClass="scrollspy"  />
                         <h2>Houses</h2>
                        <ul>
                            {houses.map((house) => (
                            <li key={house.houseNumber}>
                             {house.houseNumber}: Begin {house.beginLongitude.degrees}, Middle {house.middleLongitude.degrees}, End {house.endLongitude.degrees}
                            </li>
                            ))}
                        </ul>
                        <div id="PlanetDataTable2" className="scrollspy"></div>
                        <div id="HouseDataTable2" className="scrollspy"></div>
                        <div id="Ashtakvarga" className="scrollspy"></div>
                        <div id="Prediction" className="scrollspy">
                            <AIPrediction  />
                        </div>
                        <div id="Reference" className="scrollspy">
                            <HoroscopeReferenceList  />
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default VedicAstrologyChart;
