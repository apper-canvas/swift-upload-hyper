import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import uploadService from "@/services/api/uploadService";

const UploadDropZone = ({ onFilesSelected, disabled = false }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Only set to false if leaving the drop zone entirely
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsDragOver(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (disabled) return;

    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    handleFiles(files);
    // Reset input value so same file can be selected again
    e.target.value = '';
  };

  const handleFiles = async (files) => {
    if (files.length === 0) return;

    setIsSelecting(true);
    const validFiles = [];
    let invalidCount = 0;

    for (const file of files) {
      const validation = uploadService.validateFile(file);
      if (validation.isValid) {
        validFiles.push(file);
      } else {
        invalidCount++;
        validation.errors.forEach(error => {
          toast.error(`${file.name}: ${error}`);
        });
      }
    }

    if (validFiles.length > 0) {
      onFilesSelected(validFiles);
      toast.success(`${validFiles.length} file${validFiles.length > 1 ? 's' : ''} ready for upload`);
    }

    if (invalidCount > 0) {
      toast.warning(`${invalidCount} file${invalidCount > 1 ? 's' : ''} could not be added`);
    }

    setIsSelecting(false);
  };

  const openFileDialog = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <motion.div
        whileHover={!disabled ? { scale: 1.01, y: -2 } : {}}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={openFileDialog}
        className={`
          relative border-3 border-dashed rounded-2xl p-12 text-center cursor-pointer
          transition-all duration-300 ease-out min-h-[280px] flex flex-col items-center justify-center
          ${isDragOver && !disabled
            ? 'border-indigo-500 bg-gradient-to-br from-indigo-50 to-violet-50 drop-zone-active'
            : disabled
            ? 'border-gray-300 bg-gray-50 cursor-not-allowed'
            : 'border-gray-300 bg-white hover:border-indigo-400 hover:bg-gradient-to-br hover:from-gray-50 hover:to-indigo-50'
          }
        `}
      >
        {/* Background Animation */}
        {isDragOver && !disabled && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-gradient-to-br from-indigo-100/50 to-violet-100/50 rounded-2xl"
          />
        )}

        {/* Upload Icon */}
        <motion.div
          animate={isDragOver && !disabled ? {
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          } : {}}
          transition={{ duration: 0.6, repeat: isDragOver ? Infinity : 0 }}
          className={`
            mb-6 w-24 h-24 rounded-full flex items-center justify-center relative
            ${isDragOver && !disabled
              ? 'bg-gradient-to-br from-indigo-200 to-violet-200'
              : disabled
              ? 'bg-gray-200'
              : 'bg-gradient-to-br from-indigo-100 to-violet-100'
            }
          `}
        >
          <ApperIcon 
            name={isDragOver ? "Download" : "Upload"} 
            size={36} 
            className={disabled ? "text-gray-400" : "text-indigo-500"} 
          />
          
          {/* Floating particles around icon */}
          {isDragOver && !disabled && [...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                y: [-10, -20, -10],
                opacity: [0.4, 0.8, 0.4]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.3
              }}
              className="absolute w-2 h-2 bg-indigo-400 rounded-full"
              style={{
                top: `${20 + i * 15}%`,
                left: `${80 + i * 10}%`,
              }}
            />
          ))}
        </motion.div>

        {/* Content */}
        <div className="space-y-4 relative z-10">
          <motion.h3 
            animate={isDragOver && !disabled ? { scale: 1.05 } : { scale: 1 }}
            className={`text-2xl font-bold ${
              disabled ? 'text-gray-400' : 'text-gray-900'
            }`}
          >
            {isDragOver && !disabled
              ? "Drop your files here!"
              : disabled
              ? "Upload Disabled"
              : "Drag & drop your files"
            }
          </motion.h3>
          
          <p className={`text-lg ${disabled ? 'text-gray-400' : 'text-gray-600'}`}>
            {isDragOver && !disabled
              ? "Release to start uploading"
              : disabled
              ? "Please wait while other files are uploading"
              : "or click to browse from your device"
            }
          </p>
          
          {!disabled && (
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-center pt-4">
              <Button
                variant="primary"
                size="lg"
                disabled={disabled || isSelecting}
                loading={isSelecting}
                onClick={(e) => {
                  e.stopPropagation();
                  openFileDialog();
                }}
                className="flex items-center gap-3"
              >
                <ApperIcon name="FolderOpen" size={20} />
                {isSelecting ? "Processing..." : "Browse Files"}
              </Button>
              
              <div className="text-sm text-gray-500">
                Maximum file size: 100MB
              </div>
            </div>
          )}
        </div>

        {/* File Input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          accept="*/*"
        />

        {/* Loading Overlay */}
        {isSelecting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-2xl flex items-center justify-center"
          >
            <div className="text-center space-y-3">
              <div className="w-8 h-8 border-3 border-indigo-200 border-t-indigo-500 rounded-full animate-spin mx-auto" />
              <p className="text-indigo-600 font-semibold">Processing files...</p>
            </div>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default UploadDropZone;