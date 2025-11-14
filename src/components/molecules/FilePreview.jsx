import React from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const FilePreview = ({ 
  file, 
  className = "",
  size = "md"
}) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
    xl: "w-24 h-24"
  };
  
  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24,
    xl: 32
  };
  
  if (file.thumbnail) {
    return (
      <motion.div
        whileHover={{ scale: 1.05 }}
        className={cn(
          "relative rounded-lg overflow-hidden bg-gray-100 border-2 border-gray-200",
          sizeClasses[size],
          className
        )}
      >
        <img
          src={file.thumbnail}
          alt={file.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-200" />
      </motion.div>
    );
  }
  
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={cn(
        "flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg border-2 border-gray-200",
        sizeClasses[size],
        className
      )}
    >
      <ApperIcon 
        name={file.icon} 
        size={iconSizes[size]} 
        className="text-gray-500" 
      />
    </motion.div>
  );
};

export default FilePreview;