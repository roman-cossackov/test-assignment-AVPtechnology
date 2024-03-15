import { CircleMarker, Popup, Tooltip, TooltipProps } from 'react-leaflet';

interface TemperatureTooltipProps extends TooltipProps {
  temperature: number;
}

const TemperatureTooltip = ({ temperature, position }: TemperatureTooltipProps) => {
  console.log(temperature, position);
  if (position === undefined) return <div></div>;
  return (
    <CircleMarker center={position} radius={1}>
      <Tooltip permanent>Температура: {temperature}</Tooltip>;
    </CircleMarker>
  );
};

export default TemperatureTooltip;
