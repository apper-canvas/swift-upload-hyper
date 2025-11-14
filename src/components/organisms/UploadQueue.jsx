import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Empty from "@/components/ui/Empty";
import FileCard from "@/components/organisms/FileCard";
import uploadService from "@/services/api/uploadService";

const UploadQueue = ({ files, onFilesUpdate, triggerUpload, onUploadComplete }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [stats, setStats] = useState(null);

  // Update stats when files change
  useEffect(() => {
    updateStats();
  }, [files]);

  // Handle upload trigger
  useEffect(() => {
    if (triggerUpload && files.some(f => f.status === 'pending')) {
      startUploads();
    }
  }, [triggerUpload]);

  const updateStats = async () => {
    try {
      const newStats = await uploadService.getStats();
      setStats(newStats);
    } catch (error) {
      console.error("Failed to update stats:", error);
    }
  };

  const startUploads = async () => {
    const pendingFiles = files.filter(f => f.status === 'pending');
    if (pendingFiles.length === 0) {
      toast.info("No files to upload");
      return;
    }

    setIsUploading(true);
    toast.info(`Starting upload of ${pendingFiles.length} file${pendingFiles.length > 1 ? 's' : ''}...`);

    // Upload files concurrently with progress tracking
    const uploadPromises = pendingFiles.map(file => 
      uploadService.startUpload(file.Id, (fileId, progress) => {
        // Update progress in real-time
        onFilesUpdate(prevFiles => 
          prevFiles.map(f => 
            f.Id === fileId ? { ...f, progress, status: 'uploading' } : f
          )
        );
      })
    );

    try {
      const results = await Promise.allSettled(uploadPromises);
      
      let successCount = 0;
      let failedCount = 0;

      results.forEach((result, index) => {
        const fileId = pendingFiles[index].Id;
        
        if (result.status === 'fulfilled') {
          successCount++;
          onFilesUpdate(prevFiles =>
            prevFiles.map(f =>
              f.Id === fileId ? { ...result.value } : f
            )
          );
        } else {
          failedCount++;
          onFilesUpdate(prevFiles =>
            prevFiles.map(f =>
              f.Id === fileId ? { ...f, status: 'error', error: result.reason.message } : f
            )
          );
        }
      });

      // Show completion toast
      if (successCount > 0) {
        toast.success(`${successCount} file${successCount > 1 ? 's' : ''} uploaded successfully!`);
      }
      
      if (failedCount > 0) {
        toast.error(`${failedCount} file${failedCount > 1 ? 's' : ''} failed to upload`);
      }

      await updateStats();
      onUploadComplete();
      
    } catch (error) {
      toast.error("Upload process failed");
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRetry = async (fileId) => {
    onFilesUpdate(prevFiles =>
      prevFiles.map(f =>
        f.Id === fileId ? { ...f, status: 'pending', error: null, progress: 0 } : f
      )
    );
    
    toast.info("File added back to upload queue");
  };

  const handleRemove = async (fileId) => {
    try {
      await uploadService.remove(fileId);
      onFilesUpdate(prevFiles => prevFiles.filter(f => f.Id !== fileId));
      await updateStats();
    } catch (error) {
      throw error;
    }
  };

  const handleClearAll = async () => {
    if (files.some(f => f.status === 'uploading')) {
      toast.warning("Cannot clear queue while files are uploading");
      return;
    }

    try {
      await uploadService.clearAll();
      onFilesUpdate([]);
      await updateStats();
      toast.success("All files removed from queue");
    } catch (error) {
      toast.error("Failed to clear queue");
    }
  };

  if (files.length === 0) {
    return (
      <Empty 
        title="No files in queue"
        description="Add files using the drop zone above to get started with your uploads."
        icon="Upload"
      />
    );
  }

  const pendingCount = files.filter(f => f.status === 'pending').length;
  const uploadingCount = files.filter(f => f.status === 'uploading').length;
  const completedCount = files.filter(f => f.status === 'complete').length;
  const failedCount = files.filter(f => f.status === 'error').length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Queue Header */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload Queue</h2>
            <div className="flex flex-wrap gap-4 text-sm">
              <span className="text-gray-600">
                Total: <span className="font-semibold text-gray-900">{files.length}</span>
              </span>
              {pendingCount > 0 && (
                <span className="text-amber-600">
                  Pending: <span className="font-semibold">{pendingCount}</span>
                </span>
              )}
              {uploadingCount > 0 && (
                <span className="text-indigo-600">
                  Uploading: <span className="font-semibold">{uploadingCount}</span>
                </span>
              )}
              {completedCount > 0 && (
                <span className="text-green-600">
                  Completed: <span className="font-semibold">{completedCount}</span>
                </span>
              )}
              {failedCount > 0 && (
                <span className="text-red-600">
                  Failed: <span className="font-semibold">{failedCount}</span>
                </span>
              )}
            </div>
          </div>

          <div className="flex gap-3">
            {pendingCount > 0 && (
              <Button
                variant="primary"
                size="lg"
                onClick={startUploads}
                disabled={isUploading || uploadingCount > 0}
                loading={isUploading}
                className="flex items-center gap-2"
              >
                <ApperIcon name="Upload" size={18} />
                Upload {pendingCount} File{pendingCount > 1 ? 's' : ''}
              </Button>
            )}

            <Button
              variant="outline"
              size="lg"
              onClick={handleClearAll}
              disabled={uploadingCount > 0}
              className="flex items-center gap-2"
            >
              <ApperIcon name="Trash2" size={18} />
              Clear All
            </Button>
          </div>
        </div>
      </div>

      {/* File Cards */}
      <div className="space-y-4">
        <AnimatePresence mode="wait">
          {files.map((file, index) => (
            <motion.div
              key={file.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ delay: index * 0.05 }}
            >
              <FileCard
                file={file}
                onRemove={handleRemove}
                onRetry={handleRetry}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Upload Progress Indicator */}
      {uploadingCount > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed bottom-6 right-6 bg-white rounded-xl p-4 shadow-xl border border-gray-200 min-w-[280px]"
        >
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <ApperIcon name="Upload" size={20} className="text-indigo-500" />
            </motion.div>
            
            <div className="flex-grow">
              <p className="font-semibold text-gray-900">
                Uploading {uploadingCount} file{uploadingCount > 1 ? 's' : ''}...
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(completedCount / files.length) * 100}%` }}
                  className="h-2 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full"
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default UploadQueue;