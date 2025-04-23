import React from "react";
import { motion } from "framer-motion";

interface ShowcaseCardProps {
  title: string;
  icon: React.ReactNode;
  delay?: number;
  children: React.ReactNode;
  className?: string;
}

export function ShowcaseCard({
  title,
  icon,
  delay = 0,
  children,
  className = ""
}: ShowcaseCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay }}
      className={`bg-card/50 backdrop-blur-sm rounded-lg overflow-hidden border border-border/50 shadow-sm ${className}`}
    >
      <div className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-5 h-5 relative">
            {icon}
          </div>
          <h3 className="font-medium">{title}</h3>
        </div>
        {children}
      </div>
    </motion.div>
  );
}
