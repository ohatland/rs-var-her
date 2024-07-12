import { Ship } from './fartoy';

export interface ShipPosition {
  ship: Ship,
  posisjons: Position[]
}

export interface Position {
  timestamp: string,
  latitude: number,
  longitude: number,
  courseOverGround: number,
  speedOverGround: number,
  trueHeading: number
}

// Kystdatahuset
interface KystdatahusetResponse {
  mmsi: number,
  date_time_utc: string, // 2024-07-11T13:10:19.687Z,
  sog: number,
  cog: number,
  true_heading: number,
  nav_status: number,
  message_nr: number,
  rot: number,
  dist_prevpoint: number,
  sec_prevpoint: number,
  calc_speed: number,
  source: string,
  longitude: number,
  latitude: number,
}

interface BarentsWatchResponse {
  courseOverGround: number,
  latitude: number,
  longitude: number,
  mmsi: number,
  msgtime: string, // 2024-07-11T13:13:55.942Z
  name: string,
  rateOfTurn: number,
  shipType: number,
  speedOverGround: number,
  trueHeading: number,
}

export const fetchPositions = async (date: Date, ship: Ship): Promise<ShipPosition> => {
  const today = new Date()

  // if more than 13 days ago
  if (date < new Date(new Date().setDate(today.getDate() - 13))) {
    const data = await fetchFromKystdatahuset(date, ship)
    return data
  }

  // if today
  if (date.getDate() == today.getDate() && date.getMonth() == today.getMonth() && date.getFullYear() == today.getFullYear()) {
    const data = await fetchFromBarenswatchForToday(ship)
    return data
  }
  
  const data = await fetchFromBarenswatchForDate(date, ship)
  return data
};

async function fetchFromBarenswatchForToday(ship: Ship): Promise<ShipPosition> {
  try {    
    const response = await fetch(`https://barentswatch-ais-proxy-seven.vercel.app/api/for-today/${ship.mmsi}`, {
    // const response = await fetch(`http://localhost:3000/api/for-today/${ship.mmsi}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    const parsedPositions = transformResponseFromBarentsWatch(data)

    return {
      ship,
      posisjons: parsedPositions
    }
  } catch (error) {
    console.error(error)
    throw new Error('Failed to fetch data');
  }
}

async function fetchFromBarenswatchForDate(date: Date, ship: Ship): Promise<ShipPosition> {
  try {
    // const token = await authBarenswatch()
    const fromDateEncoded = encodeURIComponent(date.toISOString())
    const toDate = new Date(date)
    toDate.setDate(toDate.getDate() + 1)
    const toDateEncoded = encodeURIComponent(toDate.toISOString())

    const response = await fetch(`https://barentswatch-ais-proxy-seven.vercel.app/api/for-date/${ship.mmsi}/${fromDateEncoded}/${toDateEncoded}`, {
    // const response = await fetch(`http://localhost:3000/api/for-date/${ship.mmsi}/${fromDateEncoded}/${toDateEncoded}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    const parsedPositions = transformResponseFromBarentsWatch(data)

    return {
      ship,
      posisjons: parsedPositions
    }
  } catch (error) {
    console.error(error)
    throw new Error('Failed to fetch data');
  }
}

// async function authBarenswatch(): Promise<BarentsWatchTokenResponse> {
//   try {
//     const clientId = import.meta.env.VITE_BARENTSWATCH_CLIENT_ID;
//     const clientSecret = import.meta.env.VITE_BARENTSWATCH_CLIENT_SECRET;


//     const params = new URLSearchParams();
//     params.append('client_id', clientId!);
//     params.append('client_secret', clientSecret!);
//     params.append('scope', 'ais');
//     params.append('grant_type', 'client_credentials');

//     const response = await fetch('https://id.barentswatch.no/connect/token', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/x-www-form-urlencoded',
//       },
//       body: params.toString(),
//     });

//     const data = await response.json();
//     return data

//   } catch (error) {
//     throw new Error('Failed to authenticate against BarentsWatch');
//   }
// }

async function fetchFromKystdatahuset(date: Date, ship: Ship): Promise<ShipPosition> {
  try {
    const response = await fetch('https://kystdatahuset.no/ws/api/ais/positions/for-mmsi-date', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ mmsi: ship.mmsi, date: parseDateToKartverketTimeFormat(date) }),
    });

    const data = await response.json();
    const parsedPositions = transformResponseFromKystdatahuset(data)

    return {
      ship,
      posisjons: parsedPositions
    }
  } catch (error) {
    throw new Error('Failed to fetch data');
  }
}

function transformResponseFromKystdatahuset(arr: KystdatahusetResponse[]): Position[] {
  var positions: Position[] = []

  for (var i = 0; i < arr.length; i++) {
    // clean up dataset
    // if distance traveled is negative or speed is 100 knots or more
    if (arr[i].dist_prevpoint < 0 || arr[i].calc_speed >= 100) {
      i++; // skip point
    } else {
      positions.push({
        timestamp: arr[i].date_time_utc,
        latitude: arr[i].latitude,
        longitude: arr[i].longitude,
        courseOverGround: arr[i].cog,
        speedOverGround: arr[i].sog,
        trueHeading: arr[i].true_heading
      })
    }
  }

  return positions
}

function transformResponseFromBarentsWatch(arr: BarentsWatchResponse[]): Position[] {
  return arr.map((i): Position => {
    return {
      timestamp: i.msgtime,
      latitude: i.latitude,
      longitude: i.longitude,
      courseOverGround: i.courseOverGround,
      speedOverGround: i.speedOverGround,
      trueHeading: i.trueHeading
    }
  })
}

// Takes Date and returns YYYY-MM-DD at 00:00 for that day
function parseDateToKartverketTimeFormat(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Legger til 1 siden månedene er 0-indekserte
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}