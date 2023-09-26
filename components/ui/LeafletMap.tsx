import { FC, ReactNode, useMemo, useRef } from "react";
import type { MapOptions } from "leaflet";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { Icon } from "leaflet";

import "leaflet/dist/leaflet.css";

interface ILeafletMapProps extends MapOptions {
  markerData?: any;
  slots?: (data: any) => ReactNode;
  children?: ReactNode;
  zoom: number;
  style?: any;
}

const customIcon = new Icon({
  iconUrl: "/icons/map-marker.svg",
  iconSize: [35, 40],
  shadowUrl: "/icons/map-marker-shadow.png",
  shadowSize: [41, 41],
  shadowAnchor: [12, 23],
});

const isValidCoordinates = (latitude: number, longitude: number) => !isNaN(latitude) && !isNaN(longitude);

const createMarker = (data: { latitude: string; longitude: string }, index: number, slots: any) => {
  const latitude = parseFloat(data.latitude);
  const longitude = parseFloat(data.longitude);

  if (!isValidCoordinates(latitude, longitude)) {
    return null;
  }

  const position: [number, number] = [latitude, longitude];

  return (
    <Marker key={index} position={position} icon={customIcon}>
      {slots && <Popup>{slots(data)}</Popup>}
    </Marker>
  );
};

const LeafletMap: FC<ILeafletMapProps> = ({ children, ...options }) => {
  const { markerData, slots } = options;

  const mapCenterRef = useRef<[number, number] | null>(null);

  const markers = useMemo(() => {
    if (Array.isArray(markerData)) {
      return markerData.map((data, index) => createMarker(data, index, slots));
    } else if (typeof markerData === "object") {
      mapCenterRef.current = [parseFloat(markerData?.latitude), parseFloat(markerData?.longitude)];
      return [createMarker(markerData, 0, slots)];
    }
    return [];
  }, [markerData]);

  return (
    <MapContainer maxZoom={18} center={mapCenterRef.current || [42.8777895, 74.6066926]} {...options}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      />
      <MarkerClusterGroup maxClusterRadius={40} spiderfyDistanceMultiplier={1.5}>
        {markers}
      </MarkerClusterGroup>
      {children}
    </MapContainer>
  );
};

export default LeafletMap;
