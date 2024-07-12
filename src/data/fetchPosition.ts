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
    const filteredParsedPositions = filterOutPositionsForYesterday(parsedPositions)

    return {
      ship,
      posisjons: filteredParsedPositions
    }
  } catch (error) {
    console.error(error)
    throw new Error('Failed to fetch data');
  }
}

async function fetchFromBarenswatchForDate(date: Date, ship: Ship): Promise<ShipPosition> {
  try {
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

async function fetchFromKystdatahuset(date: Date, ship: Ship): Promise<ShipPosition> {
  try {
    const day1 = new Date(date)
    day1.setDate(day1.getDate() - 1)
    const day2 = date

    const responseDayOne = await fetch('https://kystdatahuset.no/ws/api/ais/positions/for-mmsi-date', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ mmsi: ship.mmsi, date: parseDateToKartverketTimeFormat(day1) }),
    });
    const dataDayOne = await responseDayOne.json();
    const parsedPositionsDayOne = transformResponseFromKystdatahuset(dataDayOne)
    
    const responseDayTwo = await fetch('https://kystdatahuset.no/ws/api/ais/positions/for-mmsi-date', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ mmsi: ship.mmsi, date: parseDateToKartverketTimeFormat(day2) }),
    });
    const dataDayTwo = await responseDayTwo.json();
    const parsedPositionsDayTwo = transformResponseFromKystdatahuset(dataDayTwo)

    const parsedPositions = filterOutPositionsForOneDate(parsedPositionsDayOne, parsedPositionsDayTwo, date)
    return {
      ship,
      posisjons: parsedPositions
    }
  } catch (error) {
    throw new Error('Failed to fetch data');
  }
}

// Problem: BarentsWatch returns positions for the last 24 hours, not only for today
function filterOutPositionsForYesterday(posisjons: Position[]) : Position[] {
  const today = new Date()

  var arr: Position[] = []
  
  posisjons.forEach(position => {
    const date = new Date(position.timestamp)
    if (date.getDate() === today.getDate()) {
      arr.push(position)
    }
  })

  return arr
}

// Problem: Kartverket returns all positions for a date, with utc time, not local time, so midnight is off
function filterOutPositionsForOneDate(positionDay1: Position[], positionDay2: Position[], date: Date) : Position[] {
  var arr: Position[] = []
  
  positionDay2.forEach(position => {
    const timestamp = new Date(position.timestamp)
    if (timestamp.getDate() === date.getDate()) {
      arr.push(position)
    }
  })

  positionDay1.forEach(position => {
    const timestamp = new Date(position.timestamp)
    if (timestamp.getDate() === date.getDate()) {
      arr.push(position)
    }
  })

  return arr
}

function transformResponseFromKystdatahuset(arr: KystdatahusetResponse[]): Position[] {
  var positions: Position[] = []

  for (var i = (arr.length - 1); i > -1; i--) {
    // clean up dataset
    // if distance traveled is negative or speed is 100 knots or more
    if (arr[i].dist_prevpoint < 0 || arr[i].calc_speed >= 100) {
      i--; // skip point
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