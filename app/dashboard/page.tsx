"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, MapPin } from "lucide-react";
import { images, products } from "../utils/productImages";
import { getCurrentAddress } from "../utils/http";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import getToken from "../utils/getToken";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import ShowAddressSelector from "./ShowAddressSelector";

interface Address {
  data: String;
}

export default function Home() {
  const [currentImage, setCurrentImage] = useState(0);
  const [showLocationPopup, setShowLocationPopup] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const token = getToken();
    console.log(token);
    if (token) {
      const decodedToken = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000);

      if (decodedToken.exp && decodedToken.exp < currentTime) {
        router.push("/login");
      } else {
        console.log("Token is valid");
      }
    } else router.push("/login");
  }, []);

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
    }
  }, [data]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prevImage) => (prevImage + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="bg-white text-red-600 py-4 shadow-md">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Opta Express</h1>
          <nav>
            <ul className="flex space-x-6 items-center">
              <li>
                <Link
                  href="/addresses"
                  className="hover:text-red-700 flex items-center"
                >
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
      {showLocationPopup && (
        <ShowAddressSelector data={data ? data.currentAddress.data : ""} addLocation={false}/>
      )}
    </div>
  );
}
