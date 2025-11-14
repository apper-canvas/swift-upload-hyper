import uploadsData from "@/services/mockData/uploads.json";

let uploads = [...uploadsData];

// Simulate file upload with progress tracking
const simulateUpload = (file, onProgress) => {
  return new Promise((resolve, reject) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15 + 5; // Random progress between 5-20%
      
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        
        // Simulate success or failure (95% success rate)
        if (Math.random() > 0.05) {
          resolve({
            url: `https://swift-upload.demo/files/${file.name.replace(/\s+/g, '-')}`,
            uploadedAt: new Date().toISOString()
          });
        } else {
          reject(new Error("Upload failed. Please try again."));
        }
      } else {
        onProgress(Math.min(progress, 100));
      }
    }, 100 + Math.random() * 200); // Random interval between 100-300ms
  });
};

// Generate thumbnail for image files
const generateThumbnail = (file) => {
  return new Promise((resolve) => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.readAsDataURL(file);
    } else {
      resolve(null);
    }
  });
};

// Get file icon based on type
const getFileIcon = (type) => {
  if (type.startsWith('image/')) return 'Image';
  if (type.startsWith('video/')) return 'Video';
  if (type.startsWith('audio/')) return 'Music';
  if (type.includes('pdf')) return 'FileText';
  if (type.includes('word') || type.includes('document')) return 'FileText';
  if (type.includes('excel') || type.includes('spreadsheet')) return 'Sheet';
  if (type.includes('powerpoint') || type.includes('presentation')) return 'Presentation';
  if (type.includes('zip') || type.includes('rar')) return 'Archive';
  return 'File';
};

// Format file size
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const uploadService = {
  // Create upload file object
  createUploadFile: async (file) => {
    await new Promise(resolve => setTimeout(resolve, 50)); // Brief delay for thumbnail generation
    
    const thumbnail = await generateThumbnail(file);
    const uploadFile = {
      Id: uploads.length > 0 ? Math.max(...uploads.map(u => u.Id)) + 1 : 1,
      file: file,
      name: file.name,
      size: file.size,
      formattedSize: formatFileSize(file.size),
      type: file.type,
      status: 'pending', // pending, uploading, complete, error
      progress: 0,
      uploadedUrl: null,
      error: null,
      thumbnail: thumbnail,
      icon: getFileIcon(file.type),
      uploadedAt: null
    };
    
    uploads.push(uploadFile);
    return { ...uploadFile };
  },

  // Start upload process
  startUpload: async (fileId, onProgress) => {
    const fileIndex = uploads.findIndex(u => u.Id === fileId);
    if (fileIndex === -1) throw new Error("File not found");

    const uploadFile = uploads[fileIndex];
    uploadFile.status = 'uploading';
    uploadFile.error = null;

    try {
      const result = await simulateUpload(uploadFile.file, (progress) => {
        uploadFile.progress = progress;
        if (onProgress) onProgress(fileId, progress);
      });

      uploadFile.status = 'complete';
      uploadFile.progress = 100;
      uploadFile.uploadedUrl = result.url;
      uploadFile.uploadedAt = result.uploadedAt;
      
      return { ...uploadFile };
    } catch (error) {
      uploadFile.status = 'error';
      uploadFile.error = error.message;
      throw error;
    }
  },

  // Get all uploads
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return uploads.map(upload => ({ ...upload }));
  },

  // Get upload by ID
  getById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 100));
    const upload = uploads.find(u => u.Id === parseInt(id));
    return upload ? { ...upload } : null;
  },

  // Remove upload
  remove: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 150));
    const index = uploads.findIndex(u => u.Id === parseInt(id));
    if (index !== -1) {
      uploads.splice(index, 1);
      return true;
    }
    return false;
  },

  // Clear all uploads
  clearAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 200));
    uploads = [];
    return true;
  },

  // Validate file
  validateFile: (file, maxSize = 100 * 1024 * 1024) => { // 100MB default
    const errors = [];
    
    if (file.size > maxSize) {
      errors.push(`File size exceeds ${formatFileSize(maxSize)} limit`);
    }
    
    if (file.name.length > 255) {
      errors.push("File name is too long");
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  },

  // Get upload statistics
  getStats: async () => {
    await new Promise(resolve => setTimeout(resolve, 100));
    const totalFiles = uploads.length;
    const completedFiles = uploads.filter(u => u.status === 'complete').length;
    const failedFiles = uploads.filter(u => u.status === 'error').length;
    const uploadingFiles = uploads.filter(u => u.status === 'uploading').length;
    const totalSize = uploads.reduce((sum, u) => sum + u.size, 0);
    
    return {
      totalFiles,
      completedFiles,
      failedFiles,
      uploadingFiles,
      totalSize: formatFileSize(totalSize),
      successRate: totalFiles > 0 ? Math.round((completedFiles / totalFiles) * 100) : 0
    };
  }
};

export default uploadService;