import { useState } from "react";
import Map from "./components/Map";
import { availableMapLayers } from "./components/map-layers";

function App() {
  const [mapLayer, setMapLayer] = useState(availableMapLayers[0].id);
  return (
    <div
      id="map"
      style={{ width: "100%", height: "100vh" }}
    >
      <select
        id="map-selector"
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
      <Map mapLayer={mapLayer} />
    </div>
  );
}

export default App;
