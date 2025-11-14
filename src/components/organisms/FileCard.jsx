import React, { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ProgressBar from "@/components/molecules/ProgressBar";
import FilePreview from "@/components/molecules/FilePreview";

const FileCard = ({ 
  file, 
  onRemove, 
  onRetry,
  className = "" 
}) => {
  const [isRemoving, setIsRemoving] = useState(false);

  const getStatusVariant = (status) => {
    switch (status) {
      case 'complete': return 'success';
      case 'error': return 'error';
      case 'uploading': return 'primary';
      default: return 'default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Ready';
      case 'uploading': return 'Uploading';
      case 'complete': return 'Complete';
      case 'error': return 'Failed';
      default: return 'Unknown';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return 'Clock';
      case 'uploading': return 'Upload';
      case 'complete': return 'CheckCircle';
      case 'error': return 'XCircle';
      default: return 'HelpCircle';
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Link copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy link");
    }
  };

  const handleRemove = async () => {
    if (file.status === 'uploading') {
      toast.warning("Cannot remove file while uploading");
      return;
    }

    setIsRemoving(true);
    try {
      await onRemove(file.Id);
      toast.success(`${file.name} removed`);
    } catch (error) {
      toast.error("Failed to remove file");
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      whileHover={{ y: -2, shadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}
      className={`
        bg-white rounded-xl p-6 shadow-lg border border-gray-200 
        transition-all duration-300 hover:shadow-xl relative overflow-hidden
        ${className}
      `}
    >
      {/* Status Indicator Background */}
      {file.status === 'complete' && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-4 right-4 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center success-pulse"
        >
          <ApperIcon name="CheckCircle" size={16} className="text-green-600" />
        </motion.div>
      )}

      {file.status === 'uploading' && (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="absolute top-4 right-4 w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center"
        >
          <ApperIcon name="Upload" size={16} className="text-indigo-600" />
        </motion.div>
      )}

      <div className="flex items-start gap-4">
        {/* File Preview */}
        <div className="flex-shrink-0">
          <FilePreview file={file} size="lg" />
        </div>

        {/* File Details */}
        <div className="flex-grow min-w-0 space-y-3">
          {/* File Name and Status */}
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-grow">
              <h3 className="font-semibold text-gray-900 truncate" title={file.name}>
                {file.name}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {file.formattedSize} • {file.type.split('/')[1]?.toUpperCase() || 'Unknown'}
              </p>
            </div>
            
            <Badge variant={getStatusVariant(file.status)} size="sm">
              <ApperIcon 
                name={getStatusIcon(file.status)} 
                size={12} 
                className="mr-1" 
              />
              {getStatusText(file.status)}
            </Badge>
          </div>

          {/* Progress Bar */}
          {file.status === 'uploading' && (
            <ProgressBar 
              progress={file.progress} 
              variant="primary" 
              size="sm"
              animated={true}
            />
          )}

          {/* Error Message */}
          {file.status === 'error' && file.error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <ApperIcon name="AlertCircle" size={16} className="text-red-500 flex-shrink-0" />
                <p className="text-sm text-red-700">{file.error}</p>
              </div>
            </div>
          )}

          {/* Upload URL */}
          {file.status === 'complete' && file.uploadedUrl && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0 flex-grow">
                  <p className="text-sm font-medium text-green-800 mb-1">File uploaded successfully!</p>
                  <p className="text-xs text-green-600 font-mono truncate" title={file.uploadedUrl}>
                    {file.uploadedUrl}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(file.uploadedUrl)}
                  className="flex-shrink-0 text-green-600 hover:text-green-700 hover:bg-green-100"
                >
                  <ApperIcon name="Copy" size={14} />
                </Button>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-2 pt-2">
            {file.status === 'error' && onRetry && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => onRetry(file.Id)}
                className="flex items-center gap-2"
              >
                <ApperIcon name="RefreshCw" size={14} />
                Retry
              </Button>
            )}

            {file.status === 'complete' && file.uploadedUrl && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => copyToClipboard(file.uploadedUrl)}
                className="flex items-center gap-2"
              >
                <ApperIcon name="Copy" size={14} />
                Copy Link
              </Button>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={handleRemove}
              disabled={file.status === 'uploading' || isRemoving}
              loading={isRemoving}
              className="flex items-center gap-2 text-gray-500 hover:text-red-600 hover:bg-red-50 ml-auto"
            >
              <ApperIcon name="Trash2" size={14} />
              Remove
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FileCard;