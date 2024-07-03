import "leaflet/dist/leaflet.css";
import * as L from "leaflet";

export class MapWidget {
  private map: L.Map;
  private layer: L.TileLayer | null = null;

  constructor(domNode: HTMLElement) {
    this.map = L.map(domNode, {
      zoomControl: false,
      // doubleClickZoom: false,
      // boxZoom: false,
      // keyboard: false,
      // scrollWheelZoom: false,
      // zoomAnimation: false,
      // touchZoom: false,
      // zoomSnap: 0.1,
    });
    // this.setLayer(availableMapLayers[0].id);
    this.map.setView([65.505, 12], 5);
  }

  setLayer(id: string): void {
    if (this.layer !== null) {
      this.map.removeLayer(this.layer);
    }

    if (id === "satellitt") {
      this.layer = L.tileLayer(
        "http://{s}.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        {
          minZoom: 1,
          maxZoom: 18,
          subdomains: ["server", "services"],
          attribution:
            '<a href="http://www.esri.com/">Esri</a>, DigitalGlobe, GeoEye, i-cubed, USDA, USGS, AEX, Getmapping, Aerogrid, IGN, IGP, swisstopo, and the GIS User Community',
        }
      );
    } else if (id === "osm") {
      this.layer = L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
        attribution:
          '<a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      });
    } else {
      this.layer = L.tileLayer(
        `https://opencache{s}.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=${id}&zoom={z}&x={x}&y={y}`,
        {
          maxZoom: 20,
          detectRetina: true,
          attribution: '<a href="https://www.kartverket.no/">Kartverket</a>',
          subdomains: ["", "2", "3"],
        }
      );
    }

    this.layer.addTo(this.map);
  }
}
