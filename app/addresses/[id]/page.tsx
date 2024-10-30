"use client";

import { useEffect, useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useRouter, useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MapPin, Search, Star } from "lucide-react";
import { getAddressDetails, updateAddress } from "../../utils/http";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX || "";

interface AddressDetailsData {
  addressDetails: {
    address: string;
    houseDetails: string;
    street: string;
    addressType: string;
    coordinates: [number, number];
    favorite: boolean;
  };
}

interface UpdateAddressData {
  address: string;
  houseDetails: string;
  street: string;
  addressType: string;
  coordinates: [number, number] | null;
  favorite: boolean;
}

export default function AddressDetails() {
  const [address, setAddress] = useState("");
  const [houseDetails, setHouseDetails] = useState("");
  const [street, setStreet] = useState("");
  const [addressType, setAddressType] = useState("home");
  const [coordinates, setCoordinates] = useState<[number, number] | null>(null);
  const [favorite, setIsFavorite] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const queryClient = useQueryClient();

  const { data, status } = useQuery<{ data: AddressDetailsData }>({
    queryKey: ["addressDetails", id],
    queryFn: () => getAddressDetails(id),
  });

  useEffect(() => {
    if (data) {
      const details = data.data.addressDetails;
      setAddress(details.address);
      setHouseDetails(details.houseDetails);
      setStreet(details.street);
      setAddressType(details.addressType);
      setCoordinates(details.coordinates);
      setIsFavorite(details.favorite);
    }
  }, [data]);

  const mutation = useMutation({
    mutationFn: (newData: UpdateAddressData) => updateAddress(id, newData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["addressDetails", id as string],
      });
      alert("Address updated successfully!");
    },
  });

  const handleMapSearch = (query: string) => {
    fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        query
      )}.json?access_token=${mapboxgl.accessToken}`
    )
      .then((response) => response.json())
      .then((data) => {
        if (isTyping) {
          setSuggestions(data.features);
        }
      });
  };

  interface Suggestion {
    center: [number, number];
    place_name: string;
    id: string;
  }

  const handleSuggestionClick = (suggestion: Suggestion) => {
    const coordinates = suggestion.center;
    setCoordinates(coordinates);
    setAddress(suggestion.place_name);
    mapRef.current?.flyTo({ center: coordinates, zoom: 15 });
    if (markerRef.current) {
      markerRef.current.setLngLat(coordinates);
    }
    setSuggestions([]);
    setIsTyping(false);
  };

  useEffect(() => {
    if (mapContainerRef.current && !mapRef.current && coordinates) {
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/streets-v11",
        center: coordinates,
        zoom: 12,
      });

      markerRef.current = new mapboxgl.Marker({
        draggable: true,
        color: "#FF0000",
      })
        .setLngLat(coordinates)
        .addTo(mapRef.current);

      markerRef.current.on("dragend", () => {
        const lngLat = markerRef.current?.getLngLat();
        if (lngLat) {
          setCoordinates([lngLat.lng, lngLat.lat]);
          handleMapSearch(`${lngLat.lng},${lngLat.lat}`);
          fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${lngLat.lng},${lngLat.lat}.json?access_token=${mapboxgl.accessToken}`
          )
            .then((response) => response.json())
            .then((data) => {
              if (data.features.length > 0) {
                setAddress(data.features[0].place_name);
              }
            });
        }
      });

      mapRef.current.on("click", (event) => {
        const { lng, lat } = event.lngLat;
        setCoordinates([lng, lat]);
        markerRef.current?.setLngLat([lng, lat]);
        setSuggestions([]);
        setIsTyping(false);
        fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${mapboxgl.accessToken}`
        )
          .then((response) => response.json())
          .then((data) => {
            if (data.features.length > 0) {
              setAddress(data.features[0].place_name);
            }
          });
      });
    }
  }, [coordinates]);

  const handleAddressUpdate = () => {
    mutation.mutate({
      address,
      houseDetails,
      street,
      addressType,
      coordinates,
      favorite,
    });
    router.push("/addresses");
  };

  const toggleFavorite = () => setIsFavorite(!favorite);

  if (status === "pending")
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  if (status === "error")
    return (
      <div className="flex justify-center items-center h-screen text-red-600">
        Error fetching address details.
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="w-full max-w-4xl mx-auto bg-white shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-red-600 flex items-center">
            <MapPin className="mr-2" /> Address Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="relative">
            <div className="flex items-center space-x-2">
              <Input
          type="text"
          value={address}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setAddress(e.target.value);
            setIsTyping(true);
            handleMapSearch(e.target.value);
          }}
          placeholder="Search for an address"
          className="flex-grow"
              />
              <Button
          onClick={() => handleMapSearch(address)}
          variant="outline"
          className="bg-red-600 text-white hover:bg-red-700"
              >
          <Search className="w-4 h-4 mr-2" /> Search
              </Button>
            </div>
            {suggestions.length > 0 && (
              <ul className="absolute z-10 mt-2 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-56 overflow-auto">
          {suggestions.map((suggestion: Suggestion) => (
            <li
              key={suggestion.id}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion.place_name}
            </li>
          ))}
              </ul>
            )}
          </div>

          <div
            ref={mapContainerRef}
            className="w-full h-80 rounded-lg overflow-hidden"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              type="text"
              value={street}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStreet(e.target.value)}
              placeholder="Street name"
              className="flex-grow"
            />
            <Select value={addressType} onValueChange={(value: string) => setAddressType(value)}>
              <SelectTrigger>
          <SelectValue placeholder="Address type" />
              </SelectTrigger>
              <SelectContent>
          <SelectItem value="home">Home</SelectItem>
          <SelectItem value="office">Office</SelectItem>
          <SelectItem value="friends">Friends</SelectItem>
          <SelectItem value="family">Family</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Input
            type="text"
            value={houseDetails}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setHouseDetails(e.target.value)}
            placeholder="House details (e.g. flat, apartment)"
            className="flex-grow"
          />
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            onClick={toggleFavorite}
            variant={favorite ? "default" : "outline"}
            className={`flex items-center ${
              favorite ? "bg-yellow-400 hover:bg-yellow-500" : ""
            }`}
          >
            <Star
              className={`w-4 h-4 mr-2 ${favorite ? "fill-current" : ""}`}
            />
            {favorite ? "Favorited" : "Add to Favorites"}
          </Button>
          <Button
            onClick={handleAddressUpdate}
            className="bg-black text-white hover:bg-green-700"
          >
            Update Address
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
