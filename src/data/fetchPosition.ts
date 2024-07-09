import { Ship } from './fartoy';

export interface ShipPosition {
  ship: Ship,
  posisjonData: any[][]
}

export const fetchPositions = async (start: string, end: string, ship: Ship): Promise<ShipPosition> => {
  const mmsi = ship.mmsi
  const response = await fetch('https://kystdatahuset.no/ws/api/ais/positions/for-mmsis-time', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ mmsiIds: [mmsi], start, end, minSpeed: 0.0 }),
  });

  const data = await response.json();
  console.log(data)
  if (data.success) {
    return {
      ship,
      posisjonData: data.data
    }
  } else {
    throw new Error('Failed to fetch data');
  }
};