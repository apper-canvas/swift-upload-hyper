import React from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const Header = () => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border-b border-gray-200 sticky top-0 z-50 backdrop-blur-sm bg-white/95"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-xl flex items-center justify-center shadow-lg">
              <ApperIcon name="Zap" size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                Swift Upload
              </h1>
              <p className="text-sm text-gray-500 font-medium">
                Lightning fast file uploads
              </p>
            </div>
          </motion.div>

          {/* Info */}
          <div className="hidden sm:flex items-center gap-6">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <ApperIcon name="Shield" size={16} className="text-green-500" />
              <span>Secure uploads</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <ApperIcon name="Zap" size={16} className="text-indigo-500" />
              <span>Instant processing</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <ApperIcon name="HardDrive" size={16} className="text-violet-500" />
              <span>100MB max</span>
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;