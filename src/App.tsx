import './App.css';

import { LatLng, LatLngExpression, LatLngTuple, LeafletMouseEvent } from 'leaflet';
import { ReactNode, useCallback, useMemo, useState } from 'react';
import { Marker, Polyline, Popup } from 'react-leaflet';

import Map from './components/map/Map/Map';
import TemperatureTooltip from './components/map/TemperatureTooltip/TemperatureTooltip';
import * as locationJson from './data/location.json';
import * as temperaturesJson from './data/temperatures.json';

function App() {
  const [locationData, setLocationData] = useState(locationJson);
  const [temperaturesData, setTemperaturesData] = useState(temperaturesJson);
  const [route, setRoute] = useState<ReactNode>();
  const [routeLocation, setRouteLocation] = useState<LatLngTuple>();
  const [nearestTemperature, setNearestTemperature] = useState<number>(0);
  const [temperatureTooltipPotisions, setTemperatureTooltipPotisions] =
    useState<LatLngExpression>();
  //   const [temperatureTooltip, setTemperaturesTooltip] = useState<ReactNode>(null);

  const coordinates: LatLngTuple[] = [];
  const timestamp: string[] = [];

  const eventHandlers = {
    mouseover(event: LeafletMouseEvent) {
      const { latlng } = event;
      let nearestPoint = coordinates[0];
      let nearestPointDate = new Date(timestamp[0]);

      coordinates.forEach((c, i) => {
        if (latlng.distanceTo(c) < latlng.distanceTo(nearestPoint)) {
          nearestPoint = c;
          nearestPointDate = new Date(timestamp[i]);
        }
      });

      let nearestDate = new Date(temperaturesData.Timestamp[0]);
      let nearestTemp = temperaturesData.OutsideTemp[0];

      temperaturesData.Timestamp.forEach((t, i) => {
        const difference1 = Math.abs(nearestPointDate.getTime() - nearestDate.getTime());
        const difference2 = Math.abs(nearestPointDate.getTime() - new Date(t).getTime());
        if (difference2 < difference1) {
          nearestDate = new Date(t);
          nearestTemp = temperaturesData.OutsideTemp[i];
        }
      });

      setNearestTemperature(nearestTemp);
      setTemperatureTooltipPotisions(nearestPoint);
      showRoute();
    },
  };

  const showRoute = (): void => {
    const latitude = locationData.Latitude;
    const longtitude = locationData.Longitude;

    if (latitude.length !== longtitude.length) {
      throw new Error('Incorrect data');
    }

    latitude.forEach((el, i) => {
      if (isNaN(+el) || isNaN(+longtitude[i])) {
        return;
      }
      coordinates.push([+el, +longtitude[i]]);
      timestamp.push(locationData.Timestamp[i]);
    });

    const pathOptions = { color: 'purple' };
    const positions = coordinates;

    const polyline = (
      <Polyline
        pathOptions={pathOptions}
        positions={positions}
        eventHandlers={eventHandlers}
      >
        <TemperatureTooltip temperature={nearestTemperature} position={coordinates[0]} />

        <Popup>
          <div>Номер локомотива: {locationData.LocoNumber}</div>
          <div>Тип локомотива: {locationData.LocoType}</div>
        </Popup>
        <Marker position={positions[0]}>
          <Popup>Начало маршрута</Popup>
        </Marker>
        <Marker position={positions[positions.length - 1]}>
          <Popup>Конец маршрута</Popup>
        </Marker>
      </Polyline>
    );

    setRoute(polyline);
    setRouteLocation(coordinates[0]);
  };

  return (
    <div className="App">
      <div>Выбранный поезд:</div>
      <button onClick={showRoute}>показать маршрут</button>
      <Map
        polyline={route}
        scrollIntoView={true}
        curLocation={routeLocation}
        curLocationZoom={14}
      />
    </div>
  );
}

export default App;
