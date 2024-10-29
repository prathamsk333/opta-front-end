"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X, MapPin, ChevronRight } from "lucide-react";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX || "";

interface MapBoxMapProps {
  onClose: () => void;
  coordinates: [number, number];
  onProceed: (coords: [number, number], address: string) => void;
}

export default function MapBoxMap({
  onClose,
  coordinates,
  onProceed,
}: MapBoxMapProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [selectedCoordinates, setSelectedCoordinates] = useState<
    [number, number] | null
  >(null);

  useEffect(() => {
    if (mapContainerRef.current && !mapRef.current) {
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/streets-v11",
        center: coordinates,
        zoom: 6,
      });

      markerRef.current = new mapboxgl.Marker({ draggable: true })
        .setLngLat(coordinates)
        .addTo(mapRef.current);

      markerRef.current.on("dragend", () => {
        if (markerRef.current) {
          const lngLat = markerRef.current.getLngLat();
          updateSelectedLocation([lngLat.lng, lngLat.lat]);
        }
      });

      mapRef.current.on("click", (e) => {
        const { lng, lat } = e.lngLat;
        markerRef.current?.setLngLat([lng, lat]);
        updateSelectedLocation([lng, lat]);
      });
    }
  }, [coordinates]);

  const updateSelectedLocation = async (coords: [number, number]) => {
    setSelectedCoordinates(coords);
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${coords[0]},${coords[1]}.json?access_token=${mapboxgl.accessToken}`
    );
    const data = await response.json();
    if (data.features && data.features.length > 0) {
      setSelectedAddress(data.features[0].place_name);
    }
  };

  const handleSearchQueryChange = async (query: string) => {
    setSearchQuery(query);

    if (query) {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          query
        )}.json?access_token=${mapboxgl.accessToken}`
      );
      const data = await response.json();
      setSuggestions(data.features || []);
    } else {
      setSuggestions([]);
    }
  };

  const handleSelectSuggestion = (location: any) => {
    const [lng, lat] = location.geometry.coordinates;
    setSearchQuery(location.place_name);
    setSuggestions([]);
    mapRef.current?.flyTo({ center: [lng, lat], zoom: 12 });
    markerRef.current?.setLngLat([lng, lat]);
    updateSelectedLocation([lng, lat]);
  };

  const handleLocateMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          mapRef.current?.flyTo({ center: [longitude, latitude], zoom: 12 });
          markerRef.current?.setLngLat([longitude, latitude]);
          updateSelectedLocation([longitude, latitude]);
        },
        (error) => console.error("Geolocation error:", error),
        { enableHighAccuracy: true }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };
  return (
    <div className="relative w-full h-full bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="absolute top-4 left-4 right-16 z-10 flex flex-col space-y-2">
        <div className="flex space-x-2">
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearchQueryChange(e.target.value)}
            placeholder="Search location..."
            className="flex-grow"
          />
          <Button
            onClick={() => handleSearchQueryChange(searchQuery)}
            variant="outline"
            className="bg-white hover:bg-gray-100"
          >
            <Search className="w-4 h-4 mr-2" />
            Search
          </Button>
        </div>
        {suggestions.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-lg shadow-lg max-h-40 overflow-y-auto">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleSelectSuggestion(suggestion)}
              >
                {suggestion.place_name}
              </div>
            ))}
          </div>
        )}
      </div>
      <Button
        onClick={onClose}
        variant="outline"
        size="icon"
        className="absolute top-4 right-4 z-10 bg-white hover:bg-gray-100"
      >
        <X className="h-4 w-4" />
      </Button>
      <Button
        onClick={handleLocateMe}
        variant="outline"
        size="icon"
        className={`absolute ${
          selectedAddress ? "bottom-[10rem]" : "bottom-14"
        } right-4 z-10 bg-red-500 hover:bg-red-600 border-none w-[8rem] text-white`}
        aria-label="Locate Me"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="29"
          height="29"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-locate-fixed text-white"
        >
          <line x1="2" x2="5" y1="12" y2="12" />
          <line x1="19" x2="22" y1="12" y2="12" />
          <line x1="12" x2="12" y1="2" y2="5" />
          <line x1="12" x2="12" y1="19" y2="22" />
          <circle cx="12" cy="12" r="7" />
          <circle cx="12" cy="12" r="3" />
        </svg>
        Locate Me
      </Button>

      <div ref={mapContainerRef} className="w-full h-full" />
      {selectedAddress && (
        <div className="absolute bottom-4 left-4 right-4 bg-white p-4 rounded-lg shadow-lg z-10">
          <div className="flex items-start mb-2">
            <MapPin className="w-5 h-5 mr-2 mt-1 text-red-500" />
            <div>
              <h3 className="font-semibold">Selected Location</h3>
              <p className="text-sm text-gray-600">{selectedAddress}</p>
            </div>
          </div>
          <div className="flex justify-between mt-4">
            <Button
              variant="outline"
              onClick={() => {
                setSelectedAddress("");
                setSelectedCoordinates(null);
              }}
            >
              Change
            </Button>
            <Button
              onClick={() => {
                if (selectedCoordinates) {
                  onProceed(selectedCoordinates, selectedAddress);
                }
              }}
            >
              Proceed
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
