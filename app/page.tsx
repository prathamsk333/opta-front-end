import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";

export default function SimpleLandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <header className="w-full py-4 px-4 sm:px-6 lg:px-8 bg-red-600">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShoppingCart className="h-6 w-6 text-white" />
            <span className="text-xl font-bold text-white">Opta Express</span>
          </div>
        </div>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
          Welcome to Opta Express
        </h1>
        <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
          Your one-stop shop for all your needs. Fast delivery, wide selection,
          and unbeatable prices.
        </p>
        <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
          <div className="rounded-md shadow">
            <Link href="/dashboard">
              <Button size="lg" className="w-full bg-red-600 hover:bg-red-700">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <footer className="w-full py-4 px-4 sm:px-6 lg:px-8 bg-gray-100">
        <div className="text-center text-sm text-gray-500">
          © 2024 Opta Express. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
