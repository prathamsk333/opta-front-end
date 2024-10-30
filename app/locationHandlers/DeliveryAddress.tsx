"use client";

import { useState } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { MapPin, Home, Briefcase, Users, Heart } from "lucide-react";
import { saveAddress } from "../utils/http";
import Notification from "../utils/notification";
import { useMutation } from "@tanstack/react-query";

interface AddressConfirmationProps {
  selectedAddress: {
    coordinates: [number, number] | null;

    address: string;
  };

  onSaveAddress: (addressDetails: {
    fullAddress: {
      coordinates: [number, number] | null;
      address: string;
    };

    houseNumber: string;

    street: string;

    saveAs: string;
  }) => void;

  onBack: () => void;
}
interface IAddress {
  coordinates: [number, number] | null;
  address: string;
}

export default function AddressConfirmation({
  selectedAddress,
  onSaveAddress,
  onBack,
}: AddressConfirmationProps) {
  const [houseNumber, setHouseNumber] = useState("");
  const [street, setStreet] = useState("");
  const [saveAs, setSaveAs] = useState("home");
  const [message, setMessage] = useState<JSX.Element | null>(null);

  interface ExtendedFormData extends FormData {
    coordinates: [number, number] | null;
    address: string;
    houseDetails: string;
    street: string;
    addressType: string;
  }
  
  const { mutate, isPending } = useMutation<IAddress, Error, ExtendedFormData>({
    mutationFn: saveAddress,
    onError: (error) => {
      console.error("Error saving address:", error);
    },
    onSuccess: () => {
      setMessage(
        <div className="fixed z-50">
          <Notification
            message="You have successfully saved your address."
            status="success"
          />
        </div>
      );
    },
  });

  const handleSaveAddress = () => {
    console.log(selectedAddress, " ", houseNumber, " ", street, " ", saveAs);
    onSaveAddress({
      fullAddress: selectedAddress,
      houseNumber,
      street,
      saveAs,
    });

    const formData = new FormData() as ExtendedFormData;
    formData.coordinates = selectedAddress.coordinates;
    formData.address = selectedAddress.address;
    formData.houseDetails = houseNumber;
    formData.street = street;
    formData.addressType = saveAs;
    console.log(formData.coordinates)
    mutate(formData);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      {message}
      <div className="flex items-start mb-6">
        <MapPin className="w-5 h-5 mr-2 mt-1 text-red-500 flex-shrink-0" />
        <div>
          <h2 className="text-lg font-semibold mb-1">Selected Address</h2>
          <p className="text-sm text-gray-600">{selectedAddress.address}</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="houseNumber">House / Flat / Block No.</Label>
          <Input
            id="houseNumber"
            value={houseNumber}
            onChange={(e) => setHouseNumber(e.target.value)}
            placeholder="Enter house/flat/block number"
          />
        </div>

        <div>
          <Label htmlFor="street">Apartment / Road / Area</Label>
          <Input
            id="street"
            value={street}
            onChange={(e) => setStreet(e.target.value)}
            placeholder="Enter apartment/road/area"
          />
        </div>

        <div>
          <Label>Save address as</Label>
          <RadioGroup
            value={saveAs}
            onValueChange={setSaveAs}
            className="flex space-x-4 mt-2"
          >
            <div className="flex flex-col items-center">
              <RadioGroupItem value="home" id="home" className="sr-only" />
              <Label
                htmlFor="home"
                className={`flex flex-col items-center cursor-pointer p-2 rounded-lg ${
                  saveAs === "home" ? "bg-red-100" : "hover:bg-gray-100"
                }`}
              >
                <Home
                  className={`w-6 h-6 ${
                    saveAs === "home" ? "text-red-500" : "text-gray-500"
                  }`}
                />
                <span className="text-sm mt-1">Home</span>
              </Label>
            </div>
            <div className="flex flex-col items-center">
              <RadioGroupItem value="office" id="office" className="sr-only" />
              <Label
                htmlFor="office"
                className={`flex flex-col items-center cursor-pointer p-2 rounded-lg ${
                  saveAs === "office" ? "bg-red-100" : "hover:bg-gray-100"
                }`}
              >
                <Briefcase
                  className={`w-6 h-6 ${
                    saveAs === "office" ? "text-red-500" : "text-gray-500"
                  }`}
                />
                <span className="text-sm mt-1">Office</span>
              </Label>
            </div>
            <div className="flex flex-col items-center">
              <RadioGroupItem
                value="friends"
                id="friends"
                className="sr-only"
              />
              <Label
                htmlFor="friends"
                className={`flex flex-col items-center cursor-pointer p-2 rounded-lg ${
                  saveAs === "friends" ? "bg-red-100" : "hover:bg-gray-100"
                }`}
              >
                <Users
                  className={`w-6 h-6 ${
                    saveAs === "friends" ? "text-red-500" : "text-gray-500"
                  }`}
                />
                <span className="text-sm mt-1">Friends</span>
              </Label>
            </div>
            <div className="flex flex-col items-center">
              <RadioGroupItem value="family" id="family" className="sr-only" />
              <Label
                htmlFor="family"
                className={`flex flex-col items-center cursor-pointer p-2 rounded-lg ${
                  saveAs === "family" ? "bg-red-100" : "hover:bg-gray-100"
                }`}
              >
                <Heart
                  className={`w-6 h-6 ${
                    saveAs === "family" ? "text-red-500" : "text-gray-500"
                  }`}
                />
                <span className="text-sm mt-1">Family</span>
              </Label>
            </div>
          </RadioGroup>
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={handleSaveAddress}>Save Address</Button>
      </div>
    </div>
  );
}
