import { FC, ReactNode, useMemo } from "react";
import type { LeafletMouseEvent, MapOptions } from "leaflet";
import { MapContainer, Marker, Popup, TileLayer, useMapEvents } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { Icon } from "leaflet";

import "leaflet/dist/leaflet.css";

interface ILeafletMapProps extends MapOptions {
  markers?: IMarker[];
  isSearchCoordinates?: boolean;
  onCoordinatesChange?: (coordinates: { lat: number; lng: number; zoom: number }) => void;
  children?: ReactNode;
  style?: any;
}

export interface IMarker {
  coordinates: {
    lat: string;
    lng: string;
    zoom?: number;
  };
  popup?: ReactNode;
}

const customIcon = new Icon({
  iconUrl: "/icons/map-marker.svg",
  iconSize: [35, 40],
  shadowUrl: "/icons/map-marker-shadow.png",
  shadowSize: [41, 41],
  shadowAnchor: [12, 23],
});

const isValidCoordinates = (latitude: number, longitude: number) => !isNaN(latitude) && !isNaN(longitude);

const createMarker = (data: IMarker, index: number) => {
  const latitude = parseFloat(data?.coordinates.lat);
  const longitude = parseFloat(data?.coordinates.lng);

  if (!isValidCoordinates(latitude, longitude)) {
    return null;
  }

  const position: [number, number] = [latitude, longitude];

  return (
    <Marker key={index} position={position} icon={customIcon}>
      {data?.popup && <Popup>{data.popup}</Popup>}
    </Marker>
  );
};

const LeafletMap: FC<ILeafletMapProps> = ({
  children,
  markers,
  isSearchCoordinates,
  onCoordinatesChange,
  ...options
}) => {
  const marker = useMemo(() => {
    if (markers != null) {
      return markers.map((data: IMarker, index: number) => createMarker(data, index));
    }
    return [];
  }, [markers]);

  const MapEventWrapper = () => {
    const map = useMapEvents({
      click: (event: LeafletMouseEvent) => {
        if (isSearchCoordinates && onCoordinatesChange) {
          onCoordinatesChange({
            lat: parseFloat(event.latlng.lat.toFixed(6)),
            lng: parseFloat(event.latlng.lng.toFixed(6)),
            zoom: map.getZoom(),
          });
        }
      },
    });

    return null;
  };

  return (
    <MapContainer maxZoom={18} center={options.center || [42.8777895, 74.6066926]} {...options}>
      <MapEventWrapper />
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
