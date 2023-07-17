import { FC, ReactNode } from "react";

import type { MapOptions } from "leaflet";
import { MapContainer, TileLayer } from "react-leaflet";

import "leaflet/dist/leaflet.css";

const LeafletMap: FC<
  {
    center: [number, number];
    children?: ReactNode;
    zoom: number;
  } & MapOptions
> = ({ children, ...options }) => {
  return (
    <MapContainer
      style={{
        height: "600px",
      }}
      maxZoom={18}
      {...options}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      />
      {children}
    </MapContainer>
  );
};

export default LeafletMap;
