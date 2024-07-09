import "leaflet/dist/leaflet.css";
import * as L from "leaflet";
import 'leaflet.timeline';
import 'leaflet-polylinedecorator';

export class MapWidget {
  private map: L.Map;
  private layer: L.TileLayer | null = null;
  private tracks: L.Polyline[] = [];

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

  addTrackLine(shipTrack: any[][]) {
    this.removeAllTrackLines()

    let skippNextPoint = false;
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

      let color = 'orange';
      // if (start[5] > 10) {
      //   color = 'orange';
      // }
      // if (start[5] > 20) {
      //   color = 'red';
      // }

      const polyline = L.polyline([
        [start[3], start[2]],
        [end[3], end[2]]
      ], { color }).addTo(this.map)

      this.tracks.push(polyline)

      polyline.on('mouseover', (e) => {
        L.popup()
          .setLatLng(e.latlng)
          .setContent(`
            <b>Speed: </b>${start[5]} knots<br>
            <b>Calculated Speed: </b>${start[7]} kph<br>
            <b>Time: </b>${new Date(start[1] as string).toLocaleString()}<br>
            <b>Distance: </b>${start[9]}
          `)
          .openOn(this.map)
      })
    }
  }

  removeAllTrackLines() {
    this.tracks.forEach(track => this.map.removeLayer(track))
    this.tracks = []
  }
}
