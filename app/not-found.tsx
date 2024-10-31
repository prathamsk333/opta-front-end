import { AlertCircle } from "lucide-react"
import Link from "next/link"

export default function Component() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-red-600 text-white px-4">
      <AlertCircle className="w-16 h-16 mb-4" />
      <h1 className="text-7xl font-bold mb-2">404</h1>
      <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
      <p className="text-center mb-8 max-w-md">
        We're sorry, the page you requested could not be found. Please check the URL or return to the homepage.
      </p>
      <Link
        href="/"
        className="bg-white text-red-600 px-6 py-3 rounded-md font-semibold transition-colors hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-red-600"
      >
        Return to Homepage
      </Link>
    </div>
  )
}