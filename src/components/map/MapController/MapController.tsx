import { LatLngTuple } from 'leaflet';
import { FC, useEffect } from 'react';
import { useMap } from 'react-leaflet';

interface MapControllerProps {
  location: LatLngTuple | undefined;
  curLocationZoom: number;
}

const MapController: FC<MapControllerProps> = ({ location, curLocationZoom }) => {
  const map = useMap();
  const flyToDuration = 1.5;

  const flyTo = (location: LatLngTuple) => {
    map.flyTo(location, curLocationZoom, {
      animate: true,
      duration: flyToDuration,
    });
  };

  useEffect(() => {
    if (location) {
      flyTo(location);
    }
  }, [location]);

  return null;
};

export { MapController };
