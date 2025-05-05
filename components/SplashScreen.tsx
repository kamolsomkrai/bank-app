"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export default function SplashScreen() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 1800); // 1.8 วิ

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {showSplash && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-gray-900 z-[9999]"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ duration: 0.8 }}
            className="text-white text-4xl font-bold"
          >
            🏦 Bank System
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
