/* eslint-disable @typescript-eslint/ban-ts-comment */
import 'leaflet/dist/leaflet.css';
import * as L from 'leaflet';
//@ts-ignore
import { nauticalScale } from './leaflet/NauticalScaleControl';
import './leaflet/RotatedMarker';
import { Position } from '../../data/fetchPosition';

export class MapWidget {
  private map: L.Map;
  private layer: L.TileLayer | null = null;
  private tracks: L.Polyline[] = [];
  private markers: [L.Marker, L.Marker][] = [];

  private shipIcon = L.icon({
    iconUrl: '/ship.png',

    iconSize: [16, 16],
    iconAnchor: [8, 10],
  });

  constructor(domNode: HTMLElement) {
    this.map = L.map(domNode, {
      zoomControl: false,
      doubleClickZoom: false,
    });
    this.map.setView([65.505, 12], 5);
    nauticalScale({
      nautic: true,
      metric: false,
      imperial: false,
      maxWidth: 300,
    }).addTo(this.map);
    this.map.on('zoomend', () => {
      this.updateMarkerVisibility();
    });
  }

  setLayer(id: string): void {
    if (this.layer !== null) {
      this.map.removeLayer(this.layer);
    }

    if (id === 'satellitt') {
      this.layer = L.tileLayer('https://{s}.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        minZoom: 5,
        maxZoom: 18,
        subdomains: ['server', 'services'],
        attribution:
          '<a href="http://www.esri.com/">Esri</a>, DigitalGlobe, GeoEye, i-cubed, USDA, USGS, AEX, Getmapping, Aerogrid, IGN, IGP, swisstopo, and the GIS User Community',
      });
    } else if (id === 'osm') {
      this.layer = L.tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        minZoom: 5,
        attribution: '<a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      });
    } else {
      this.layer = L.tileLayer(`https://opencache{s}.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=${id}&zoom={z}&x={x}&y={y}`, {
        minZoom: 5,
        maxZoom: 20,
        detectRetina: true,
        attribution: '<a href="https://www.kartverket.no/">Kartverket</a>',
        subdomains: ['', '2', '3'],
      });
    }

    this.layer.addTo(this.map);
  }

  addTrackLine(shipTrack: Position[]) {
    this.removeAllTrackLines();

    let skipNextPoint = false;
    let lastMinute = 0;
    for (let i = 0; i < shipTrack.length - 1; i++) {
      if (skipNextPoint) {
        i++;
        skipNextPoint = false;
      }

      const point = shipTrack[i];
      const nextPoint = shipTrack[i + 1];

      const timestamp = new Date(point.timestamp);

      // marker

      // Only draw one point every minute
      if (lastMinute !== timestamp.getMinutes()) {
        this.addMarker(point.latitude, point.longitude, timestamp, point.courseOverGround, point.speedOverGround);
        lastMinute = timestamp.getMinutes();
      }

      // line
      const color = 'orange';

      const polyline = L.polyline(
        [
          [point.latitude, point.longitude],
          [nextPoint.latitude, nextPoint.longitude],
        ],
        { color, weight: 5 }
      ).addTo(this.map);

      this.tracks.push(polyline);

      polyline.on('click', (e) => this.onPolylineClick(e, point.courseOverGround, point.speedOverGround, timestamp));
    }

    if (shipTrack.length > 0) {
      const lastPositionLat = shipTrack[shipTrack.length - 1].latitude;
      const lastPositionLng = shipTrack[shipTrack.length - 1].longitude;
      this.map.setView([lastPositionLat, lastPositionLng], 12);
    }

    this.updateMarkerVisibility();
  }

  addMarker(lat: number, lng: number, timestamp: Date, heading: number, speed: number) {
    const shipMarker = L.marker([lat, lng], {
      // function extended in ./leaflet/RotatedMarker.js
      //@ts-ignore
      rotationAngle: heading,
      icon: this.shipIcon,
    });
    shipMarker.on('click', (e) => this.onPolylineClick(e, heading, speed, timestamp));

    const formattedTime = timestamp.toLocaleString('no', {
      hour: '2-digit',
      minute: '2-digit',
    });

    const icon = L.divIcon({
      className: 'timestamp-marker',
      html: `<div>${formattedTime}</div>`,
      iconSize: [60, 30],
      iconAnchor: [36, -20],
    });

    const timeMarker = L.marker([lat, lng], { icon });

    this.markers.push([shipMarker, timeMarker]);
    timeMarker.on('click', (e) => this.onPolylineClick(e, heading, speed, timestamp));
  }

  updateMarkerVisibility() {
    try {
      const zoom = this.map.getZoom();
      let minimumValue: number;

      switch (zoom) {
        case 20:
          minimumValue = 0;
          break;
        case 19:
          minimumValue = 0.01;
          break;
        case 18:
          minimumValue = 0.02;
          break;
        case 17:
          minimumValue = 0.05;
          break;
        case 16:
          minimumValue = 0.08;
          break;
        case 15:
          minimumValue = 0.1;
          break;
        case 14:
          minimumValue = 0.3;
          break;
        case 13:
          minimumValue = 0.5;
          break;
        case 12:
          minimumValue = 1.5;
          break;
        case 11:
          minimumValue = 2.5;
          break;
        case 10:
          minimumValue = 5;
          break;
        case 9:
          minimumValue = 10;
          break;
        case 8:
          minimumValue = 20;
          break;
        case 7:
          minimumValue = 40;
          break;
        case 6:
          minimumValue = 80;
          break;
        case 5:
          minimumValue = 100;
          break;

        default:
          minimumValue = 0.01;
          break;
      }

      const displayedMarkers: [L.Marker, L.Marker][] = [];

      this.markers.forEach((marker) => {
        const shipMarker = marker[0];
        const timeMarker = marker[1];
        const latlng = timeMarker.getLatLng();
        const tooClose = displayedMarkers.some((displayedMarker) => {
          const displayedLatLng = displayedMarker[1].getLatLng();
          return this.getDistance(latlng.lat, latlng.lng, displayedLatLng.lat, displayedLatLng.lng) < minimumValue;
        });

        if (!tooClose) {
          shipMarker.addTo(this.map);
          timeMarker.addTo(this.map);
          displayedMarkers.push([shipMarker, timeMarker]);
        } else {
          this.map.removeLayer(shipMarker);
          this.map.removeLayer(timeMarker);
        }
      });
    } catch (error) {
      console.error(error);
    }
  }

  onPolylineClick(e: L.LeafletMouseEvent, heading: number, speed: number, timestamp: Date) {
    L.popup()
      .setLatLng(e.latlng)
      .setContent(
        `
          <b>COG: </b>${Math.round(heading).toString().padStart(3, '0')}°<br>
          <b>SOG: </b>${speed} knots<br>
          <b>Time: </b>${timestamp.toLocaleString('no', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          })}<br>
        `
      )
      .openOn(this.map);
  }

  removeAllTrackLines() {
    this.tracks.forEach((track) => this.map.removeLayer(track));
    this.tracks = [];

    this.markers.forEach((marker) => {
      this.map.removeLayer(marker[0]);
      this.map.removeLayer(marker[1]);
    });
    this.markers = [];
  }

  getDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radius of the Earth in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a = 0.5 - Math.cos(dLat) / 2 + (Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * (1 - Math.cos(dLon))) / 2;
    return R * 2 * Math.asin(Math.sqrt(a));
  }
}
