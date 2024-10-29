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
import { useState } from "react";
import { fetchSavedLocations } from "../utils/http";

interface Location {
  _id: string;
  coordinates: [number, number];
  address: string;
  houseDetails: string;
  street: string;
  addressType: string;
  userId: string;
  __v: number;
}

interface ComponentProps {
  onBack?: () => void;
  onAddAddress?: () => void;
}

// Mock API functions - replace with actual API calls
const fetchRecentSearches = async () => {
  return [
    {
      id: 1,
      name: "Wadala West",
      address:
        "near Shitla Devi Mandir, Chembur Colony, Chembur, Mumbai, Maharashtra, India",
    },
    {
      id: 2,
      name: "Chembur East",
      address:
        "near Shitla Devi Mandir, Chembur Colony, Chembur, Mumbai, Maharashtra, India",
    },
    {
      id: 3,
      name: "Wadala East",
      address:
        "near Shitla Devi Mandir, Chembur Colony, Chembur, Mumbai, Maharashtra, India",
    },
  ];
};

export default function Component({ onBack, onAddAddress }: ComponentProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: savedLocationsResponse,
    isLoading: isLoadingSaved,
    isError: isErrorSaved,
  } = useQuery({
    queryKey: ["savedLocations"],
    queryFn: fetchSavedLocations,
  });

  const {
    data: recentSearches,
    isLoading: isLoadingRecent,
    isError: isErrorRecent,
  } = useQuery({
    queryKey: ["recentSearches"],
    queryFn: fetchRecentSearches,
  });

  const savedLocation = savedLocationsResponse?.data?.currentAddress;

  const getLocationIcon = (type: string) => {
    switch (type) {
      case "home":
        return <Home className="relative top-1 h-5 w-5" />;
      case "office":
        return <Briefcase className="relative top-1 h-5 w-5" />;
      case "friends":
        return <Users className="relative top-1 h-5 w-5" />;
      default:
        return <Heart className="relative top-1 h-5 w-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-[1200px] px-4 py-6 md:py-12">
        <div className="mx-auto max-w-3xl">
          <div className="overflow-hidden rounded-xl bg-white shadow-lg">
            {/* Header */}
            <div className="bg-red-600 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {onBack && (
                    <button
                      onClick={onBack}
                      className="flex items-center justify-center rounded-full p-1 text-white transition-colors hover:bg-red-500"
                      aria-label="Go back"
                    >
                      <ArrowLeft className="h-6 w-6" />
                    </button>
                  )}
                  <h1 className="text-2xl font-semibold text-white">
                    Your Location
                  </h1>
                </div>
                {onAddAddress && (
                  <button
                    onClick={onAddAddress}
                    className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
                  >
                    <Plus className="h-4 w-4" />
                    Add Address
                  </button>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="space-y-8 p-6">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search your area/pincode/apartment"
                  className="h-12 w-full rounded-lg border border-gray-200 pl-10 pr-4 text-lg outline-none transition-colors placeholder:text-gray-400 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Saved Locations */}
              <div>
                <h2 className="mb-4 text-xl font-semibold text-gray-900">
                  Saved Location
                </h2>
                {isLoadingSaved ? (
                  <div className="h-24 animate-pulse rounded-lg bg-gray-100" />
                ) : isErrorSaved ? (
                  <div className="rounded-lg border border-red-100 bg-red-50 p-4 text-center text-sm text-red-600">
                    Failed to load saved locations. Please try again later.
                  </div>
                ) : !savedLocation ? (
                  <div className="rounded-lg border border-gray-100 bg-gray-50 p-6 text-center">
                    <MapPin className="mx-auto h-8 w-8 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500">
                      No saved addresses found
                    </p>
                    {onAddAddress && (
                      <button
                        onClick={onAddAddress}
                        className="mt-4 inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
                      >
                        <Plus className="h-4 w-4" />
                        Add New Address
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="grid gap-3">
                    <button className="group w-full rounded-lg border border-gray-100 bg-white p-4 text-left transition-all hover:border-red-100 hover:bg-red-50">
                      <div className="flex items-start gap-4">
                        <div className="text-red-600">
                          {getLocationIcon(savedLocation.addressType)}
                        </div>
                        <div className="flex-1 space-y-1">
                          <h3 className="text-lg font-semibold capitalize text-gray-900">
                            {savedLocation.addressType}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {savedLocation.address}
                          </p>
                        </div>
                        <ArrowRight className="h-5 w-5 text-red-600 opacity-0 transition-all duration-200 ease-in-out group-hover:opacity-100" />
                      </div>
                    </button>
                  </div>
                )}
              </div>

              <div className="my-6 h-px bg-gray-100" />

              {/* Recent Searches */}
              <div>
                <h2 className="mb-4 text-xl font-semibold text-gray-900">
                  Recent Searches
                </h2>
                {isLoadingRecent ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((n) => (
                      <div
                        key={n}
                        className="h-24 animate-pulse rounded-lg bg-gray-100"
                      />
                    ))}
                  </div>
                ) : isErrorRecent ? (
                  <div className="rounded-lg border border-red-100 bg-red-50 p-4 text-center text-sm text-red-600">
                    Failed to load recent searches. Please try again later.
                  </div>
                ) : !recentSearches?.length ? (
                  <div className="rounded-lg border border-gray-100 bg-gray-50 p-6 text-center">
                    <Search className="mx-auto h-8 w-8 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500">
                      No recent searches found
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-3">
                    {recentSearches.map((search) => (
                      <button
                        key={search.id}
                        className="group w-full rounded-lg border border-gray-100 bg-white p-4 text-left transition-all hover:border-red-100 hover:bg-red-50"
                      >
                        <div className="flex items-start gap-4">
                          <MapPin className="h-5 w-5 text-red-600" />
                          <div className="flex-1 space-y-1">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {search.name}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {search.address}
                            </p>
                          </div>
                          <ArrowRight className="h-5 w-5 text-red-600 opacity-0 transition-all duration-200 ease-in-out group-hover:opacity-100" />
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
