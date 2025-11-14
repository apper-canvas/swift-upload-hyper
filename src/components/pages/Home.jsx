import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import UploadDropZone from "@/components/organisms/UploadDropZone";
import UploadQueue from "@/components/organisms/UploadQueue";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import ApperIcon from "@/components/ui/ApperIcon";
import uploadService from "@/services/api/uploadService";

const Home = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [autoUpload, setAutoUpload] = useState(false);
  const [triggerUpload, setTriggerUpload] = useState(false);

  // Load existing files on mount
  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    try {
      setError(null);
      const existingFiles = await uploadService.getAll();
      setFiles(existingFiles);
    } catch (err) {
      setError("Failed to load files. Please try again.");
      console.error("Load files error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilesSelected = async (selectedFiles) => {
    try {
      const newUploadFiles = [];
      
      for (const file of selectedFiles) {
        const uploadFile = await uploadService.createUploadFile(file);
        newUploadFiles.push(uploadFile);
      }
      
      setFiles(prevFiles => [...prevFiles, ...newUploadFiles]);
      
      // Auto-upload if enabled
      if (autoUpload) {
        setTimeout(() => {
          setTriggerUpload(prev => !prev);
        }, 500);
      }
      
    } catch (err) {
      toast.error("Failed to prepare files for upload");
      console.error("File selection error:", err);
    }
  };

  const handleUploadComplete = () => {
    // Reset trigger
    setTriggerUpload(false);
  };

  if (loading) return <Loading />;
  if (error) return <ErrorView error={error} onRetry={loadFiles} />;

  const isUploading = files.some(f => f.status === 'uploading');

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-indigo-50 via-white to-violet-50 py-16"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6"
            >
              Upload files at{" "}
              <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                lightning speed
              </span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
            >
              Drag, drop, and share your files instantly with real-time progress tracking 
              and shareable links. No registration required.
            </motion.p>
          </div>

          {/* Upload Drop Zone */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="max-w-4xl mx-auto"
          >
            <UploadDropZone 
              onFilesSelected={handleFilesSelected}
              disabled={isUploading}
            />
          </motion.div>

          {/* Quick Options */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="max-w-2xl mx-auto mt-8 flex flex-wrap items-center justify-center gap-6"
          >
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={autoUpload}
                onChange={(e) => setAutoUpload(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
              />
              <span className="text-sm font-medium text-gray-700">
                Auto-upload files
              </span>
            </label>
            
            <div className="text-sm text-gray-500">
              Supported: All file types up to 100MB
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Upload Queue Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <UploadQueue
            files={files}
            onFilesUpdate={setFiles}
            triggerUpload={triggerUpload}
            onUploadComplete={handleUploadComplete}
          />
        </div>
      </section>

      {/* Features Section */}
      {files.length === 0 && (
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="py-16 bg-white"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Why choose Swift Upload?
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Experience the fastest and most reliable file uploading with features designed for modern workflows.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: "Zap",
                  title: "Lightning Fast",
                  description: "Advanced chunking and parallel processing for maximum upload speed.",
                  gradient: "from-yellow-400 to-orange-500"
                },
                {
                  icon: "BarChart3",
                  title: "Real-time Progress",
                  description: "Watch your files upload with smooth progress bars and live updates.",
                  gradient: "from-indigo-500 to-violet-500"
                },
                {
                  icon: "Copy",
                  title: "Instant Sharing",
                  description: "Get shareable links immediately after upload completion.",
                  gradient: "from-green-500 to-emerald-500"
                },
                {
                  icon: "Shield",
                  title: "Secure Transfer",
                  description: "Your files are encrypted during transfer and processing.",
                  gradient: "from-blue-500 to-cyan-500"
                }
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ y: -5 }}
                  className="text-center group"
                >
                  <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300`}>
                    <ApperIcon name={feature.icon} size={24} className="text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>
      )}
    </div>
  );
};

export default Home;