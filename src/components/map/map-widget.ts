import "leaflet/dist/leaflet.css";
import * as L from "leaflet";
//@ts-ignore
import { nauticalScale } from './leaflet/NauticalScaleControl';
import './leaflet/RotatedMarker';

export class MapWidget {
  private map: L.Map;
  private layer: L.TileLayer | null = null;
  private tracks: L.Polyline[] = [];
  private markers: L.Marker[] = [];
  private icons: L.Icon[] = [];

  private shipIcon = L.icon({
    iconUrl: 'src/assets/ship.png',

    iconSize: [16, 16],
    iconAnchor: [8, 10]
  })

  constructor(domNode: HTMLElement) {
    this.map = L.map(domNode, {
      zoomControl: false,
      doubleClickZoom: false,
    });
    this.map.setView([65.505, 12], 5);
    nauticalScale({ nautic: true, metric: false, imperial: false, maxWidth: 300 }).addTo(this.map);
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

  addTrackLine(shipTrack: any[][]) {
    this.removeAllTrackLines()

    let skippNextPoint = false;
    let lastMinute = 0;
    for (let i = 0; i < shipTrack.length - 1; i++) {
      if (skippNextPoint) {
        i++
        skippNextPoint = false
      }

      const start = shipTrack[i]
      let end = shipTrack[i + 1]

      // if distance traveled is -99 or speed is 100 knots or more
      if (end[9] == -99 || end[7] >= 100) {
        end = shipTrack[i + 2]
        skippNextPoint = true
      }

      const timestamp = new Date(start[1] + 'z')
      const lat = start[3]
      const lng = start[2]
      const heading = start[4]
      const speed = start[5]

      // marker

      // Only draw one point every minute
      if (lastMinute !== timestamp.getMinutes()) {
        this.addMarker(lat, lng, timestamp, heading, speed);
        lastMinute = timestamp.getMinutes()
      }

      // line
      let color = 'orange';

      const polyline = L.polyline([
        [start[3], start[2]],
        [end[3], end[2]]
      ], { color, weight: 5 }).addTo(this.map)

      this.tracks.push(polyline)

      polyline.on('click', (e) => this.onPolylineClick(e, heading, speed, timestamp));
    }
  }

  addMarker(lat: number, lng: number, timestamp: Date, heading: number, speed: number) {
    const shipMarker = L.marker([lat, lng], {
      // function extended in ./leaflet/RotatedMarker.js
      //@ts-ignore
      rotationAngle: heading,
      icon: this.shipIcon
    }).addTo(this.map)
    this.markers.push(shipMarker)
    shipMarker.on('click', (e) => this.onPolylineClick(e, heading, speed, timestamp));

    const formattedTime = timestamp.toLocaleString("no", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const icon = L.divIcon({
      className: 'timestamp-marker',
      html: `<div>${formattedTime}</div>`,
      iconSize: [60, 30],
      iconAnchor: [32, -20]
    });

    const timeMarker = L.marker([lat, lng], { icon }).addTo(this.map);
    this.markers.push(timeMarker);
    timeMarker.on('click', (e) => this.onPolylineClick(e, heading, speed, timestamp));
  }

  onPolylineClick(e: L.LeafletMouseEvent, heading: number, speed: number, timestamp: Date) {
    L.popup()
        .setLatLng(e.latlng)
        .setContent(`
          <b>COG: </b>${Math.round(heading).toString().padStart(3, '0')}°<br>
          <b>SOG: </b>${speed} knots<br>
          <b>Time: </b>${timestamp.toLocaleString("no", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit"
        })}<br>
        `)
        .openOn(this.map)
  }

  removeAllTrackLines() {
    this.tracks.forEach(track => this.map.removeLayer(track))
    this.tracks = []

    this.markers.forEach(marker => this.map.removeLayer(marker))
    this.markers = []

    this.icons.forEach(icon => this.map.removeLayer(icon))
    this.icons = []
  }
}
