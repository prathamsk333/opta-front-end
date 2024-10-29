"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, MapPin } from "lucide-react";
import { images, products } from "../utils/productImages";
import MapBoxMap from "../locationHandlers/MapBoxMap";
import DeliveryAddress from "../locationHandlers/DeliveryAddress";
import { getCurrentAddress } from "../utils/http";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

interface Address {
  data: String;
}

export default function Home() {
  const [currentImage, setCurrentImage] = useState(0);
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

  const { data, isLoading, error } = useQuery<{ currentAddress: Address }>({
    queryKey: ["address"],
    queryFn: getCurrentAddress,
  });

  useEffect(() => {
    if (error) {
      setShowLocationPopup(true);
      console.error("Error fetching address:", error);
    }
  }, [error]);

  useEffect(() => {
    if (data) {
      setShowLocationPopup(false);
      setShowMap(false);
      setCurrentLocation(true);
    }
  }, [data]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prevImage) => (prevImage + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (typeof navigator !== "undefined" && "permissions" in navigator) {
      navigator.permissions.query({ name: "geolocation" }).then((result) => {
        if (
          result.state === "prompt" ||
          (result.state === "denied" && !currentLocation)
        ) {
          setShowLocationPopup(true);
        } else if (result.state === "granted") {
          setShowLocationPopup(false);
        }
      });
    }
  }, []);

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

  const handleClosePopup = () => {
    setShowLocationPopup(false);
    setShowMap(true);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="bg-white text-red-600 py-4 shadow-md">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Opta Express</h1>
          <nav>
            <ul className="flex space-x-6 items-center">
              <li>
                <Link href="/addresses" className="hover:text-red-700 flex items-center">
                  <MapPin className="mr-1 h-4 w-4" /> Addresses
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-red-700 flex items-center">
                  <ShoppingCart className="mr-1 h-4 w-4" /> Cart
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <section className="mb-12">
          <div className="relative h-[400px] overflow-hidden rounded-lg">
            {images.map((src, index) => (
              <motion.img
                key={index}
                src={src}
                alt={`Slide ${index + 1}`}
                className="absolute top-0 left-0 w-full h-full object-cover"
                initial={{ opacity: 0 }}
                animate={{ opacity: index === currentImage ? 1 : 0 }}
                transition={{ duration: 0.5 }}
              />
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold mb-6 text-red-600">Our Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-[22rem] object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                  <p className="text-red-600 font-bold mb-4">
                    ${product.price.toFixed(2)}
                  </p>
                  <button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors duration-300">
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="bg-white text-red-600 py-4 mt-12 border-t border-red-100">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2023 Opta Express. All rights reserved.</p>
        </div>
      </footer>

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
                onClose={() => console.log("Map closed")}
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
    </div>
  );
}
