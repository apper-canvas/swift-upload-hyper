import React from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const Footer = () => {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-50 border-t border-gray-200 mt-16"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center space-y-4">
          {/* Logo */}
          <div className="flex items-center justify-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-lg flex items-center justify-center">
              <ApperIcon name="Zap" size={16} className="text-white" />
            </div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              Swift Upload
            </h3>
          </div>

          {/* Features */}
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <ApperIcon name="Upload" size={14} className="text-indigo-500" />
              <span>Drag & Drop</span>
            </div>
            <div className="flex items-center gap-2">
              <ApperIcon name="BarChart3" size={14} className="text-violet-500" />
              <span>Real-time Progress</span>
            </div>
            <div className="flex items-center gap-2">
              <ApperIcon name="Copy" size={14} className="text-pink-500" />
              <span>Instant Links</span>
            </div>
            <div className="flex items-center gap-2">
              <ApperIcon name="Shield" size={14} className="text-green-500" />
              <span>Secure Transfer</span>
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Swift Upload makes file sharing effortless with instant drag-and-drop uploads, 
            real-time progress tracking, and shareable links. Your files are processed 
            securely and made available instantly.
          </p>

          {/* Copyright */}
          <div className="pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-400">
              © 2024 Swift Upload. Built for speed, designed for simplicity.
            </p>
          </div>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;