import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Badge = forwardRef(({ 
  children, 
  className = "", 
  variant = "default",
  size = "md",
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center font-semibold rounded-full transition-all duration-200";
  
  const variants = {
    default: "bg-gray-100 text-gray-800 border border-gray-200",
    primary: "bg-gradient-to-r from-indigo-100 to-violet-100 text-indigo-800 border border-indigo-200",
    success: "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200",
    warning: "bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 border border-yellow-200",
    error: "bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border border-red-200",
    info: "bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 border border-blue-200"
  };
  
  const sizes = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
    lg: "px-4 py-2 text-base"
  };
  
  return (
    <span
      ref={ref}
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
});

Badge.displayName = "Badge";

export default Badge;