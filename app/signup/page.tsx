"use client";

import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signUpPOST } from "../utils/http";
import { useMutation } from "@tanstack/react-query";
import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser, setError } from "../store/userslice";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import Notification from "../utils/notification";

export default function SignUpPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });

  const { mutate, data, isPending, isError } = useMutation({
    mutationFn: signUpPOST,
    onSuccess: (data) => {
      Cookies.set("token", data.token, { expires: 7, path: "/" });
      dispatch(setUser(data));
    },
    onError: (error) => {
      dispatch(setError(error.message));
    },
  });

  useEffect(() => {
    if (data) {
      router.push("/dashboard");
    }
  }, [data, dispatch]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate(formData);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-red-50">
      {isError && (
        <Notification message="please enter valid data" status="error" />
      )}
      {data && <Notification message="Login successful" status="success" />}
      <div className="bg-white p-8 rounded-3xl shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-red-600 mb-2">
          Log in to Opta Express
        </h1>
        <p className="text-center text-gray-600 mb-6">
          manage your locations and addressess
        </p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Name:
            </label>
            <Input
              type="text"
              id="name"
              placeholder="Enter your Name"
              className="w-full px-3 py-2 bg-gray-100 rounded-md"
              onChange={handleChange}
              value={formData.name}
            />
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Phone No:
            </label>
            <Input
              type="tel"
              id="phone"
              placeholder="Enter your Phone Number"
              className="w-full px-3 py-2 bg-gray-100 rounded-md"
              onChange={handleChange}
              value={formData.phone}
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email:
            </label>
            <Input
              type="email"
              id="email"
              placeholder="Enter your Email"
              className="w-full px-3 py-2 bg-gray-100 rounded-md"
              onChange={handleChange}
              value={formData.email}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password:
            </label>
            <Input
              type="password"
              id="password"
              placeholder="Enter your Password"
              className="w-full px-3 py-2 bg-gray-100 rounded-md"
              onChange={handleChange}
              value={formData.password}
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Confirm Password:
            </label>
            <Input
              type="password"
              id="passwordConfirm"
              placeholder="Confirm your Password"
              className="w-full px-3 py-2 bg-gray-100 rounded-md"
              onChange={handleChange}
              value={formData.passwordConfirm}
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-md transition duration-300"
            disabled={isPending}
          >
            {isPending ? "Signing Up..." : "Sign Up"}
          </Button>
        </form>

        <p className="text-center mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-red-600 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
