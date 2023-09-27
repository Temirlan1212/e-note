import { FC, ReactNode, useMemo, useRef } from "react";
import type { MapOptions } from "leaflet";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { Icon } from "leaflet";

import "leaflet/dist/leaflet.css";

interface ILeafletMapProps extends MapOptions {
  markers?: any;
  children?: ReactNode;
  popup?: any;
  style?: any;
}

interface IMarkers {
  latitude: string;
  longitude: string;
  popup?: any;
}

const customIcon = new Icon({
  iconUrl: "/icons/map-marker.svg",
  iconSize: [35, 40],
  shadowUrl: "/icons/map-marker-shadow.png",
  shadowSize: [41, 41],
  shadowAnchor: [12, 23],
});

const isValidCoordinates = (latitude: number, longitude: number) => !isNaN(latitude) && !isNaN(longitude);

const createMarker = (data: IMarkers, index: number, popup: any) => {
  const latitude = parseFloat(data.latitude);
  const longitude = parseFloat(data.longitude);

  if (!isValidCoordinates(latitude, longitude)) {
    return null;
  }

  const position: [number, number] = [latitude, longitude];

  return (
    <Marker key={index} position={position} icon={customIcon}>
      {popup && <Popup>{popup(data)}</Popup>}
    </Marker>
  );
};

const LeafletMap: FC<ILeafletMapProps> = ({ children, ...options }) => {
  const { markers } = options;

  const marker: IMarkers = useMemo(() => {
    if (markers != null) {
      return markers.map((data: IMarkers, index: number) => createMarker(data, index, options?.popup));
    }
    return [];
  }, [markers, options?.popup]);

  return (
    <MapContainer maxZoom={18} center={options.center || [42.8777895, 74.6066926]} {...options}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      />
      <MarkerClusterGroup maxClusterRadius={40} spiderfyDistanceMultiplier={1.5}>
        {marker}
      </MarkerClusterGroup>
      {children}
    </MapContainer>
  );
};

export default LeafletMap;
