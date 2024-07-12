import { useEffect, useState } from 'react';
import { allShips, Ship } from '../data/fartoy';
import { fetchPositions, ShipPosition } from '../data/fetchPosition';
import Map from './map/Map';
import Calendar from './calendar/Calendar';
import './ShipTrack.css';

export default function ShipTrack() {
  const [ship, setShip] = useState<Ship>(allShips[31]);
  const [date, setDate] = useState<Date>(new Date());
  const [shipTrack, setShipTrack] = useState<ShipPosition | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    fetchPositions(date, ship)
      .then((result) => setShipTrack(result))
      .finally(() => setLoading(false));
  }, [ship, date]);

  const handleDateClick = (date: Date) => {
    setDate(date);
  };

  const handleShipSelect = (shipNr: string) => {
    const ship = allShips.find((ship) => ship.nr === parseInt(shipNr));
    setShip(ship!);
  };

  return (
    <main>
      {loading ? <div className="loader"></div> : <></>}
      <Calendar date={date} handleDateClick={handleDateClick} />
      <Map ship={ship} shipTrack={shipTrack} handleShipSelect={handleShipSelect} />
    </main>
  );
}
