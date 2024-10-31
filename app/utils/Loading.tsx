import { Loader2 } from "lucide-react"

export default function Component() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-red-600">
      <div className="mb-8">
        <svg
          className="w-16 h-16 text-white"
          fill="none"
          height="24"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          width="24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
      </div>
      <div className="text-white">
        <Loader2 className="w-12 h-12 animate-spin" />
      </div>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white">Loading</h1>
      <p className="mt-2 text-sm text-red-100">Please wait while we prepare your dashboard</p>
    </div>
  )
}