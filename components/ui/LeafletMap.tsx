import { FC, ReactNode } from "react";
import type { MapOptions } from "leaflet";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { Icon } from "leaflet";

import "leaflet/dist/leaflet.css";
import { Typography } from "@mui/material";

interface ILeafletMapProps extends MapOptions {
  markerData: any;
  children?: ReactNode;
  zoom: number;
  style?: any;
}

const LeafletMap: FC<ILeafletMapProps> = ({ children, ...options }) => {
  const { markerData } = options;

  const customIcon = new Icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-image.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  });

  let markers = null;

  if (Array.isArray(markerData)) {
    markers = markerData.map((data, index) => {
      const latitude = parseFloat(data.latitude);
      const longitude = parseFloat(data.longitude);

      if (!isNaN(latitude) && !isNaN(longitude)) {
        const position: [number, number] = [latitude, longitude];

        return (
          <Marker key={index} position={position} icon={customIcon}>
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
        <Marker position={position} icon={customIcon}>
          <Popup>
            <Typography fontSize={{ xs: 9, sm: 10, md: 12, lg: 14 }} fontWeight={600}>
              {markerData?.name}
            </Typography>
            <Typography fontSize={{ xs: 9, sm: 10, md: 12, lg: 14 }} fontWeight={500}>
              {markerData?.address?.fullName}
            </Typography>
          </Popup>
        </Marker>
      );
    }
  }

  return (
    <MapContainer maxZoom={18} center={[42.8777895, 74.6066926]} {...options}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      />
      <MarkerClusterGroup>{markers}</MarkerClusterGroup>
      {children}
    </MapContainer>
  );
};

export default LeafletMap;
