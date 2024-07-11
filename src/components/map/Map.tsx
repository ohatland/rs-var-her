import { useEffect, useRef, useState } from "react";
import { MapWidget } from "./map-widget";
import { ShipPosition } from "../../data/fetchPosition";
import { availableMapLayers } from "./map-layers";
import './Map.css'
import { allShips, Ship } from "../../data/fartoy";

export default function Map({ ship, shipTrack, handleShipSelect }: { ship: Ship, shipTrack: ShipPosition | null, handleShipSelect: (shipNr: string) => void }) {
  const [mapLayer, setMapLayer] = useState(availableMapLayers[5].id);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapWidget | null>(null);

  useEffect(() => {
    if (mapRef.current === null && containerRef.current !== null) {
      mapRef.current = new MapWidget(containerRef.current);
    }

    if (mapRef.current !== null) {
      mapRef.current.setLayer(mapLayer);
    }

  }, [mapLayer]);

  useEffect(() => {
    if (mapRef.current !== null && shipTrack !== null) {
      mapRef.current.addTrackLine(shipTrack.posisjons)
    }
  }, [shipTrack])


  return (
    <div className="map-container">
      <div className="map-selector">
        <select
          className="select-option"
          value={mapLayer}
          onChange={(e) => setMapLayer(e.target.value)}
        >
          {availableMapLayers.map((map) => {
            return (
              <option
                value={map.id}
                key={map.id}
              >
                {map.title}
              </option>
            );
          })}
        </select>
      </div>
      <div className="ship-selector">
        <select
          className="select-option"
          value={ship.nr}
          onChange={(e) => handleShipSelect(e.target.value)}
        >
          {allShips.map((ship) => {
            return (
              <option
                value={ship.nr}
                key={ship.nr}
              >
                RS {ship.nr} - {ship.navn}
              </option>
            );
          })}
        </select>
      </div>
      <div className="map"
        ref={containerRef}
      />
    </div>
  )
}
