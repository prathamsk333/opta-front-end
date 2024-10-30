"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MapBoxMap from "../locationHandlers/MapBoxMap";
import DeliveryAddress from "../locationHandlers/DeliveryAddress";
import { ShoppingCart, MapPin } from "lucide-react";

interface DataType {
  data: String;
  addLocation: boolean;
}

export default function ShowAddressSelector({ data, addLocation }: DataType) {
  const [showLocationPopup, setShowLocationPopup] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{
    coordinates: [number, number] | null;
    address: string;
  }>({
    coordinates: null,
    address: "",
  });
  console.log(addLocation);
  useEffect(() => {
    if (addLocation) {
      console.log("hloooooo");
      setShowMap(true);
      setShowLocationPopup(false);
    } else {
      setShowLocationPopup(true);
    }
  }, [addLocation]);

  const handleClosePopup = () => {
    setShowLocationPopup(false);
    setShowMap(true);
  };

  const handleLocationSelect = (coords: [number, number], address: string) => {
    setSelectedLocation({ coordinates: coords, address });
    setShowMap(false);
  };

  const handleAllowLocation = async () => {
    if (typeof navigator !== "undefined" && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setTimeout(() => {
            setShowLocationPopup(false);
          }, 6000);

          const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX;
          const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${mapboxToken}`;

          try {
            const response = await fetch(url);
            const data = await response.json();
            const address = data.features[0]?.place_name;
            console.log("Address:", address);
            setSelectedLocation({
              coordinates: [longitude, latitude],
              address,
            });
          } catch (error) {
            console.error("Error fetching address:", error);
          }
        },
        (error) => {
          console.error("Error accessing location:", error);
          setShowLocationPopup(true);
        }
      );
    }
  };

  return (
    <>
      <AnimatePresence>
        {showLocationPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full"
            >
              <div className="text-center">
                <h3 className="text-2xl font-bold text-red-600 mb-4">
                  Enable Location Services
                </h3>
                <p className="text-gray-600 mb-6">
                  Allow Opta Express to access your location for a personalized
                  shopping experience and accurate delivery estimates.
                </p>
                <div className="flex flex-col space-y-3">
                  <button
                    onClick={handleAllowLocation}
                    className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-300"
                  >
                    Allow Location
                  </button>
                  <button
                    onClick={handleClosePopup}
                    className="w-full px-4 py-2 border border-red-600 text-red-600 rounded-md hover:bg-red-50 transition-colors duration-300"
                  >
                    Update Manually
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showMap && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl h-[500px] overflow-hidden relative">
              <button
                onClick={() => setShowMap(false)}
                className="absolute top-4 right-4 bg-red-600 text-white rounded-full p-2"
              >
                <span className="sr-only">Close Map</span>X
              </button>
              <MapBoxMap
                onClose={() => {
                  if (!addLocation) {
                    setShowLocationPopup(true);
                    setShowMap(false);
                  } else {
                    setShowMap(false);
                  }
                }}
                coordinates={[78.9629, 20.5937]}
                onProceed={handleLocationSelect}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {selectedLocation.coordinates && !currentLocation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <DeliveryAddress
              selectedAddress={selectedLocation}
              onSaveAddress={() => setCurrentLocation(true)}
              onBack={() => {
                setShowMap(true);
                setSelectedLocation({ coordinates: null, address: "" });
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
