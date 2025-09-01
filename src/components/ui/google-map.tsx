import { useEffect, useRef, useState } from 'react';
import { Wrapper } from '@googlemaps/react-wrapper';
import { Input } from './input';
import { Button } from './button';
import { MapPin, AlertCircle } from 'lucide-react';
import { Card } from './card';

interface GoogleMapProps {
  center?: { lat: number; lng: number };
  zoom?: number;
  markers?: Array<{
    position: { lat: number; lng: number };
    title: string;
    info?: string;
  }>;
  height?: string;
  className?: string;
}

interface MapComponentProps extends GoogleMapProps {
  apiKey: string;
}

const MapComponent: React.FC<MapComponentProps & { map: google.maps.Map | null; setMap: (map: google.maps.Map) => void }> = ({
  center = { lat: 7.3369, lng: -2.3284 }, // Sunyani coordinates
  zoom = 14,
  markers = [],
  map,
  setMap
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current && !map) {
      const newMap = new window.google.maps.Map(ref.current, {
        center,
        zoom,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          }
        ]
      });
      setMap(newMap);
    }
  }, [ref, map, center, zoom, setMap]);

  useEffect(() => {
    if (map) {
      // Clear existing markers
      // Add new markers
      markers.forEach((marker) => {
        const mapMarker = new window.google.maps.Marker({
          position: marker.position,
          map: map,
          title: marker.title,
        });

        if (marker.info) {
          const infoWindow = new window.google.maps.InfoWindow({
            content: marker.info,
          });

          mapMarker.addListener('click', () => {
            infoWindow.open(map, mapMarker);
          });
        }
      });
    }
  }, [map, markers]);

  return <div ref={ref} style={{ width: '100%', height: '400px' }} />;
};

const GoogleMapWithApiKey: React.FC<GoogleMapProps> = (props) => {
  const apiKey = 'AIzaSyAgQNLKIPWkKJiS5oQYZRnuael-uTvlwbI';
  const [map, setMap] = useState<google.maps.Map | null>(null);

  return (
    <div className={props.className}>
      <Wrapper apiKey={apiKey} libraries={['places']}>
        <MapComponent {...props} apiKey={apiKey} map={map} setMap={setMap} />
      </Wrapper>
    </div>
  );
};

export default GoogleMapWithApiKey;