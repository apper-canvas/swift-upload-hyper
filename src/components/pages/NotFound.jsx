import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-indigo-50 to-violet-50 px-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center max-w-lg space-y-8"
      >
        {/* 404 Animation */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", bounce: 0.4 }}
          className="relative"
        >
          <motion.div
            animate={{ 
              rotate: [0, 5, -5, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{ 
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="text-8xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent"
          >
            404
          </motion.div>
          
          {/* Floating icons */}
          {[
            { icon: "Upload", position: { top: "10%", left: "10%" }, delay: 0 },
            { icon: "File", position: { top: "20%", right: "15%" }, delay: 0.5 },
            { icon: "Zap", position: { bottom: "20%", left: "20%" }, delay: 1 },
            { icon: "Share", position: { bottom: "10%", right: "10%" }, delay: 1.5 }
          ].map((item, index) => (
            <motion.div
              key={item.icon}
              animate={{
                y: [-10, -20, -10],
                rotate: [0, 10, -10, 0],
                opacity: [0.4, 0.8, 0.4]
              }}
              transition={{
                duration: 3 + index,
                repeat: Infinity,
                delay: item.delay,
                ease: "easeInOut"
              }}
              className="absolute text-indigo-300"
              style={item.position}
            >
              <ApperIcon name={item.icon} size={24} />
            </motion.div>
          ))}
        </motion.div>
        
        {/* Content */}
        <div className="space-y-4">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-4xl font-bold text-gray-900"
          >
            Page Not Found
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-xl text-gray-600 leading-relaxed"
          >
            Oops! The page you're looking for seems to have been uploaded to a different location.
          </motion.p>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-gray-500"
          >
            Don't worry, let's get you back to uploading files at lightning speed.
          </motion.p>
        </div>
        
        {/* Actions */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button
            variant="primary"
            size="lg"
            onClick={() => navigate("/")}
            className="flex items-center gap-3"
          >
            <ApperIcon name="Home" size={20} />
            Back to Upload
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            onClick={() => window.history.back()}
            className="flex items-center gap-3"
          >
            <ApperIcon name="ArrowLeft" size={20} />
            Go Back
          </Button>
        </motion.div>
        
        {/* Help text */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="pt-8 border-t border-gray-200"
        >
<p className="text-sm text-gray-500">
            If you believe this is an error, please refresh the page or return to the home page.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFound;