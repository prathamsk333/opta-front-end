import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle } from "lucide-react";

type NotificationProps = {
  message: string;
  status: "success" | "error";
};

export default function Notification({ message, status }: NotificationProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false); // Hide the notification after 4 seconds
    }, 4000);

    return () => clearTimeout(timer); // Cleanup the timer on unmount
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 300, opacity: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className="fixed top-4 right-4 z-700 w-72 shadow-lg rounded-lg overflow-hidden"
        >
          <div
            className={`p-4 ${
              status === "success" ? "bg-teal-500" : "bg-red-500"
            } text-white flex items-center`}
          >
            {status === "success" ? (
              <CheckCircle className="w-6 h-6 mr-2" />
            ) : (
              <XCircle className="w-6 h-6 mr-2" />
            )}
            <p className="flex-1">{message}</p>
          </div>
          <motion.div
            initial={{ width: "100%" }}
            animate={{ width: "0%" }}
            transition={{ duration: 4, ease: "linear" }}
            className={`h-1 ${
              status === "success" ? "bg-teal-300" : "bg-red-300"
            }`}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
