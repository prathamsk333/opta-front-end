"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Search,
  MapPin,
  Home,
  Briefcase,
  Users,
  ArrowRight,
  Heart,
  ArrowLeft,
  Plus,
} from "lucide-react";
import { useState, useEffect } from "react";
import { fetchSavedLocations } from "../utils/http";
import { useRouter } from "next/navigation";
import ShowAddressSelector from "../dashboard/ShowAddressSelector";
import getToken from "../utils/getToken";
import { jwtDecode } from "jwt-decode";


interface Location {
  _id: string;
  coordinates: [number, number];
  address: string;
  houseDetails: string;
  street: string;
  addressType: string;
  userId: string;
  recentlyUsed: string;
}

export default function Component() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showMap, setShowMap] = useState(false);
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

  const {
    data: savedLocationsResponse,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["savedLocations"],
    queryFn: fetchSavedLocations,
  });

  const onAddAddress = () => {
    setShowMap(true);
  };

  const savedLocations: Location[] =
    savedLocationsResponse?.data?.currentAddress || [];

  const recentSearches = savedLocations.filter(
    (location) => location.recentlyUsed
  );

  const filteredLocations = savedLocations.filter((location) =>
    location.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getLocationIcon = (type: string) => {
    switch (type) {
      case "home":
        return <Home className="h-5 w-5" />;
      case "office":
        return <Briefcase className="h-5 w-5" />;
      case "friends":
        return <Users className="h-5 w-5" />;
      default:
        return <Heart className="h-5 w-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="mx-auto max-w-3xl px-4 py-6 md:py-12">
        <div className="overflow-hidden rounded-xl bg-white shadow-lg">
          {/* Header */}
          <div className="bg-red-600 px-4 py-4 sm:px-6">
            <div className="flex items-center justify-between">
              <button
                onClick={() => router.push("/dashboard")}
                className="rounded-full p-2 text-white hover:bg-red-500 transition-colors"
                aria-label="Go back"
              >
                <ArrowLeft className="h-6 w-6" />
              </button>
              <h1 className="text-xl font-semibold text-white sm:text-2xl">
                Your Location
              </h1>
              <button
                onClick={onAddAddress}
                className="flex items-center gap-2 rounded-lg bg-white px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Add Address</span>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-6 p-4 sm:p-6">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search your area/pincode/apartment"
                className="h-12 w-full rounded-lg border pl-10 pr-4 text-lg outline-none focus:border-red-500 focus:ring-4 focus:ring-red-100"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Saved Locations */}
            <div>
              <h2 className="mb-4 text-xl font-semibold text-gray-900">
                Saved Location
              </h2>
              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((n) => (
                    <div
                      key={n}
                      className="h-20 animate-pulse rounded-lg bg-gray-100"
                    />
                  ))}
                </div>
              ) : isError ? (
                <div className="rounded-lg bg-red-50 p-4 text-center text-sm text-red-600">
                  Failed to load saved locations. Please try again later.
                </div>
              ) : filteredLocations.length === 0 ? (
                <div className="rounded-lg bg-gray-50 p-6 text-center">
                  <MapPin className="mx-auto h-8 w-8 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500">
                    No saved addresses found
                  </p>
                  <button
                    onClick={onAddAddress}
                    className="mt-4 inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    Add New Address
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredLocations.map((location) => (
                    <button
                      key={location._id}
                      onClick={() => {
                        router.push(`/addresses/${location._id}`);
                      }}
                      className="group flex w-full items-start gap-4 rounded-lg border bg-white p-4 text-left hover:bg-red-50 transition-colors"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-600">
                        {getLocationIcon(location.addressType)}
                      </div>
                      <div className="flex-grow">
                        <h3 className="text-lg font-semibold capitalize">
                          {location.addressType}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                          {location.address}
                        </p>
                      </div>
                      <ArrowRight className="h-5 w-5 flex-shrink-0 text-red-600 opacity-0 transition-opacity group-hover:opacity-100" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="h-px bg-gray-200" />

            {/* Recent Searches */}
            <div>
              <h2 className="mb-4 text-xl font-semibold">Recent Searches</h2>
              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((n) => (
                    <div
                      key={n}
                      className="h-20 animate-pulse rounded-lg bg-gray-100"
                    />
                  ))}
                </div>
              ) : isError ? (
                <div className="rounded-lg bg-red-50 p-4 text-center text-sm text-red-600">
                  Failed to load recent searches. Please try again later.
                </div>
              ) : recentSearches.length === 0 ? (
                <div className="rounded-lg bg-gray-50 p-6 text-center">
                  <Search className="mx-auto h-8 w-8 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500">
                    No recent searches found
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentSearches.map((search) => (
                    <button
                      key={search._id}
                      className="group flex w-full items-start gap-4 rounded-lg border bg-white p-4 text-left hover:bg-red-50 transition-colors"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-600">
                        <MapPin className="h-5 w-5" />
                      </div>
                      <div className="flex-grow">
                        <h3 className="text-lg font-semibold line-clamp-1">
                          {search.address}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500 line-clamp-1">
                          {search.street}
                        </p>
                      </div>
                      <ArrowRight className="h-5 w-5 flex-shrink-0 text-red-600 opacity-0 transition-opacity group-hover:opacity-100" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {showMap && <ShowAddressSelector data="true" addLocation={true} />}
    </div>
  );
}
