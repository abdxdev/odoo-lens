"use client";

import { motion } from "framer-motion";

export default function ExploreModelPage() {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex-1 flex-col space-y-6"
    >

    </motion.main>
  );
}