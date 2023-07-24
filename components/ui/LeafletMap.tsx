import { FC, ReactNode } from "react";

import type { MapOptions } from "leaflet";
import { MapContainer, TileLayer } from "react-leaflet";

import "leaflet/dist/leaflet.css";

interface ILeafletMapProps extends MapOptions {
  center: [number, number];
  children?: ReactNode;
  zoom: number;
  style?: any;
}

const LeafletMap: FC<ILeafletMapProps> = ({ children, ...options }) => {
  return (
    <MapContainer maxZoom={18} {...options}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      />
      {children}
    </MapContainer>
  );
};

export default LeafletMap;
