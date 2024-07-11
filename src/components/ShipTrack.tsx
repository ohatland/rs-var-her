import { useEffect, useState } from "react"
import { allShips, Ship } from "../data/fartoy"
import { fetchPositions, ShipPosition } from "../data/fetchPosition"
import Map from "./map/Map"
import Calendar from "./calendar/Calendar"

export default function ShipTrack() {
  const [ship, setShip] = useState<Ship>(allShips[31])
  const [date, setDate] = useState<Date>(() => {
    const date = new Date()
    date.setDate(date.getDate() - 7)
    return date
  })
  const [shipTrack, setShipTrack] = useState<ShipPosition | null>(null)

  useEffect(() => {
    const shipTrackStart = parseDateToKartverketTimeFormat(date)
    const shipTrackEnd = parseDateToKartverketTimeFormat(new Date(new Date(date).setDate(date.getDate() + 1))) // the next day

    fetchPositions(shipTrackStart, shipTrackEnd, ship).then(result => setShipTrack(result))
  }, [ship, date])

  const handleDateClick = (date: Date) => {
    setDate(date);
  };

  const handleShipSelect = (shipNr: string) => {
    const ship = allShips.find((ship) => ship.nr === parseInt(shipNr))
    setShip(ship!)
  }

  return (
    <main>
      <Calendar date={date} handleDateClick={handleDateClick} />
      <Map ship={ship} shipTrack={shipTrack} handleShipSelect={handleShipSelect} />
    </main>
  )
}

// Takes Date and returns YYYYMMDDTTTT at 00:00 for that day
function parseDateToKartverketTimeFormat(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Legger til 1 siden månedene er 0-indekserte
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}${month}${day}00000`;
}