"use client";

import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormEvent, useState, useEffect, ChangeEvent } from "react";
import { useMutation } from "@tanstack/react-query";
import { setUser, setError } from "../store/userslice";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import { loginPOST } from "../utils/http";
import { useRouter } from "next/navigation";
import Notification from "../utils/notification";

export default function Component() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { mutate, data, isPending, isError, error } = useMutation({
    mutationFn: loginPOST,
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
      router.push("/");
    }
  }, [data, dispatch]);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    mutate(formData);
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#e6faf8]">
      {isError && <Notification message={error.message} status="error" />}
      {data && <Notification message="Login successful" status="success" />}
      <div className="bg-white p-8 rounded-3xl shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-[#40ceb8] mb-2">
          Log in to SchedulEase
        </h1>
        <p className="text-center text-gray-600 mb-6">
          manage your appointments with Ease
        </p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email :
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
              Password :
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

          <Button
            type="submit"
            className="w-full bg-[#40ceb8] hover:bg-[#3bbaA6] text-white py-2 rounded-md transition duration-300"
            disabled={isPending}
          >
            {isPending ? "Logging In..." : "Log In"}
          </Button>
        </form>

        <p className="text-center mt-6">
          Don&apos;t have an account?
          <Link href="/signup" className="text-[#40ceb8] hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
