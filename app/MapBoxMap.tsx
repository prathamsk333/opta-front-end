import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = 'pk.eyJ1IjoicHJhdGhhbXNrIiwiYSI6ImNsemI0Y3lkczBwODYycXNhdnRtcmNpNXgifQ.jb72CnbhadnnADNWkl3NJQ';

interface MapBoxMapProps {
  onClose: () => void;
  coordinates: [number, number];
}

export default function MapBoxMap({ onClose, coordinates }: MapBoxMapProps) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (mapContainerRef.current && !mapRef.current) {
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/streets-v11",
        center: coordinates,
        zoom: 12,
      });

      mapRef.current.on("click", (e) => {
        const { lng, lat } = e.lngLat;
        console.log(`Selected Coordinates: [${lng}, ${lat}]`);
        onClose();
      });
    }
  }, [coordinates, onClose]);

  return <div ref={mapContainerRef} className="w-full h-full"></div>;
}
