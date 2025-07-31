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
  const [apiKey, setApiKey] = useState<string>('');
  const [map, setMap] = useState<google.maps.Map | null>(null);

  if (!apiKey) {
    return (
      <Card className="p-6 space-y-4">
        <div className="flex items-center space-x-2 text-muted-foreground">
          <AlertCircle className="h-5 w-5" />
          <span>Google Maps API Key Required</span>
        </div>
        <p className="text-sm text-muted-foreground">
          To display the map, please enter your Google Maps API key. You can get one from the Google Cloud Console.
        </p>
        <div className="flex space-x-2">
          <Input
            type="text"
            placeholder="Enter your Google Maps API key..."
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="flex-1"
          />
          <Button onClick={() => setApiKey(apiKey)} disabled={!apiKey}>
            Load Map
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Get your API key at: <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google Cloud Console</a>
        </p>
      </Card>
    );
  }

  return (
    <div className={props.className}>
      <Wrapper apiKey={apiKey} libraries={['places']}>
        <MapComponent {...props} apiKey={apiKey} map={map} setMap={setMap} />
      </Wrapper>
    </div>
  );
};

export default GoogleMapWithApiKey;