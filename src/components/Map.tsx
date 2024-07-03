import { useEffect, useRef } from "react";
import { MapWidget } from "./map-widget";

export default function Map({ mapLayer }: { mapLayer: string }) {
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

  return (
    <div
      style={{ width: "100%", height: "100%" }}
      ref={containerRef}
    />
  );
}
