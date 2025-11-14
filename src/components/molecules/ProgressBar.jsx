import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

const ProgressBar = ({ 
  progress = 0, 
  showPercentage = true, 
  size = "md",
  variant = "primary",
  animated = true,
  className = ""
}) => {
  const sizeClasses = {
    sm: "h-2",
    md: "h-3",
    lg: "h-4"
  };
  
  const variants = {
    primary: "from-indigo-500 to-violet-500",
    success: "from-green-500 to-emerald-500",
    warning: "from-yellow-500 to-amber-500",
    error: "from-red-500 to-pink-500",
    info: "from-blue-500 to-cyan-500"
  };
  
  const clampedProgress = Math.min(Math.max(progress, 0), 100);
  
  return (
    <div className={cn("space-y-2", className)}>
      {showPercentage && (
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600 font-medium">Progress</span>
          <span className="text-gray-900 font-semibold">
            {Math.round(clampedProgress)}%
          </span>
        </div>
      )}
      
      <div className={cn(
        "relative bg-gray-200 rounded-full overflow-hidden",
        sizeClasses[size]
      )}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${clampedProgress}%` }}
          transition={{ 
            duration: animated ? 0.3 : 0, 
            ease: "easeOut" 
          }}
          className={cn(
            "h-full bg-gradient-to-r rounded-full relative overflow-hidden",
            variants[variant]
          )}
        >
          {animated && clampedProgress > 0 && clampedProgress < 100 && (
            <motion.div
              animate={{
                x: ["-100%", "100%"]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            />
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ProgressBar;