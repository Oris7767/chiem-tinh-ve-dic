# Vedic Astrology Swiss Ephemeris Backend

This is a standalone Express server that uses the Swiss Ephemeris library to calculate Vedic astrology charts.

## Setup

1. Install dependencies:
```
npm install
```

2. Create a `.env` file with the following variables (optional):
```
PORT=3000
```

3. Run the server:
```
npm start
```

## Deploy to Netlify

1. Make sure you have the Netlify CLI installed:
```
npm install -g netlify-cli
```

2. Login to Netlify:
```
netlify login
```

3. Deploy to Netlify:
```
netlify deploy --prod
```

## API Documentation

### Calculate Vedic Chart

**Endpoint**: `/.netlify/functions/calculate`

**Method**: POST

**Request Body**:
```json
{
  "birthDate": "1990-01-01",
  "birthTime": "12:00",
  "latitude": 21.03,
  "longitude": 105.85,
  "timezone": "Asia/Ho_Chi_Minh"
}
```

**Response**:
```json
{
  "ascendant": 123.45,
  "planets": [
    {
      "id": "su",
      "name": "Sun",
      "symbol": "☉",
      "longitude": 123.45,
      "sign": 4,
      "house": 10,
      "retrograde": false,
      "color": "#FFA500"
    },
    // other planets...
  ],
  "houses": [
    {
      "number": 1,
      "longitude": 123.45,
      "sign": 4
    },
    // other houses...
  ],
  "moonNakshatra": "Ashwini",
  "lunarDay": 5
}
```
