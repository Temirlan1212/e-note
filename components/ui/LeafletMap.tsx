import { FC, ReactNode } from "react";
import type { MapOptions } from "leaflet";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";

import "leaflet/dist/leaflet.css";
import { Typography } from "@mui/material";

L.Icon.Default.imagePath = "https://unpkg.com/leaflet@1.5.0/dist/images/";

interface ILeafletMapProps extends MapOptions {
  center: [number, number];
  markerData: any;
  children?: ReactNode;
  zoom: number;
  style?: any;
}

const LeafletMap: FC<ILeafletMapProps> = ({ children, ...options }) => {
  const { markerData } = options;

  let markers = null;

  if (Array.isArray(markerData)) {
    markers = markerData.map((data, index) => {
      const latitude = parseFloat(data.latitude);
      const longitude = parseFloat(data.longitude);

      if (!isNaN(latitude) && !isNaN(longitude)) {
        const position: [number, number] = [latitude, longitude];

        return (
          <Marker key={index} position={position}>
            <Popup>
              <Typography fontSize={{ xs: 9, sm: 10, md: 12, lg: 14 }} fontWeight={600}>
                {data.name}
              </Typography>
            </Popup>
          </Marker>
        );
      }

      return null;
    });
  } else if (typeof markerData === "object") {
    const latitude = parseFloat(markerData.latitude);
    const longitude = parseFloat(markerData.longitude);

    if (!isNaN(latitude) && !isNaN(longitude)) {
      const position: [number, number] = [latitude, longitude];

      markers = (
        <Marker position={position}>
          <Popup>
            <Typography fontSize={{ xs: 9, sm: 10, md: 12, lg: 14 }} fontWeight={600}>
              {markerData?.name}
            </Typography>
            <Typography fontSize={{ xs: 9, sm: 10, md: 12, lg: 14 }} fontWeight={600}>
              {markerData?.address?.fullName}
            </Typography>
          </Popup>
        </Marker>
      );
    }
  }

  return (
    <MapContainer maxZoom={18} {...options} center={options?.center}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      />
      {markers}
    </MapContainer>
  );
};

export default LeafletMap;
