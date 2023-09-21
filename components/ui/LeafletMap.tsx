import { FC, ReactNode, useMemo } from "react";
import type { MapOptions } from "leaflet";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { Icon } from "leaflet";

import "leaflet/dist/leaflet.css";
import { Typography } from "@mui/material";
import { INotaryInfoData } from "@/models/notaries";

interface ILeafletMapProps extends MapOptions {
  markerData?: INotaryInfoData;
  children?: ReactNode;
  zoom: number;
  style?: any;
}

const customIcon = new Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const isValidCoordinates = (latitude: number, longitude: number) => !isNaN(latitude) && !isNaN(longitude);

const createMarker = (data: INotaryInfoData, index: number) => {
  const latitude = parseFloat(data.latitude);
  const longitude = parseFloat(data.longitude);

  if (!isValidCoordinates(latitude, longitude)) {
    return null;
  }

  const position: [number, number] = [latitude, longitude];

  return (
    <Marker key={index} position={position} icon={customIcon}>
      <Popup>
        <Typography fontSize={{ xs: 9, sm: 10, md: 12, lg: 14 }} fontWeight={600}>
          {data?.name}
        </Typography>
        <Typography fontSize={{ xs: 9, sm: 10, md: 12, lg: 14 }} fontWeight={500}>
          {data?.address?.fullName}
        </Typography>
      </Popup>
    </Marker>
  );
};

const LeafletMap: FC<ILeafletMapProps> = ({ children, ...options }) => {
  const { markerData } = options;

  const markers = useMemo(() => {
    if (Array.isArray(markerData)) {
      return markerData.map(createMarker);
    } else if (typeof markerData === "object") {
      return [createMarker(markerData, 0)];
    }
    return [];
  }, [markerData]);

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
