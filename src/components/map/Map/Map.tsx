import 'leaflet/dist/leaflet.css';

import { LatLngTuple } from 'leaflet';
import { ReactNode, useEffect, useRef } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';

import { MapController } from '../MapController/MapController';
import styles from './Map.module.scss';

interface MapProps {
  polyline: ReactNode;
  curLocation: LatLngTuple | undefined;
  curLocationZoom: number;
  scrollIntoView: boolean;
}

const Map = ({ polyline, curLocation, scrollIntoView, curLocationZoom }: MapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollIntoView && mapRef.current) {
      mapRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [polyline]);

  return (
    <div className={styles.Map} ref={mapRef}>
      <MapContainer
        className={styles.mapContainer}
        center={[51.505, -0.09]}
        zoom={13}
        scrollWheelZoom={true}
      >
        <TileLayer url="https://tile.opentopomap.org/{z}/{x}/{y}.png" />
        <MapController location={curLocation} curLocationZoom={curLocationZoom} />
        {polyline ?? ''}
      </MapContainer>
    </div>
  );
};

export default Map;
