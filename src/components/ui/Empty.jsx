import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "No files uploaded yet",
  description = "Drag and drop your files or click to browse and start uploading.",
  actionText = "Browse Files",
  onAction,
  icon = "Upload"
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-16 px-6"
    >
      {/* Animated Icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: "spring", bounce: 0.3 }}
        className="mx-auto w-32 h-32 bg-gradient-to-br from-indigo-100 to-violet-100 rounded-full flex items-center justify-center mb-8 relative overflow-hidden"
      >
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <ApperIcon 
            name={icon} 
            size={48} 
            className="text-indigo-500"
          />
        </motion.div>
        
        {/* Floating particles */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute inset-0 bg-gradient-to-r from-indigo-200 to-violet-200 opacity-20 rounded-full"
        />
      </motion.div>
      
      {/* Content */}
      <div className="space-y-4 max-w-md mx-auto">
        <motion.h3 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-bold text-gray-900"
        >
          {title}
        </motion.h3>
        
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-gray-600 leading-relaxed"
        >
          {description}
        </motion.p>
      </div>
      
      {/* Action Button */}
      {onAction && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <motion.button
            whileHover={{ 
              scale: 1.05, 
              y: -3,
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
            }}
            whileTap={{ scale: 0.95 }}
            onClick={onAction}
            className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 flex items-center gap-3 mx-auto hover:from-indigo-600 hover:to-violet-600"
          >
            <ApperIcon name="FolderOpen" size={20} />
            {actionText}
          </motion.button>
        </motion.div>
      )}
      
      {/* Decorative elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [-20, -40, -20],
              x: [0, 10, 0],
              opacity: [0.1, 0.3, 0.1]
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              delay: i * 1.5,
              ease: "easeInOut"
            }}
            className="absolute w-2 h-2 bg-gradient-to-r from-indigo-400 to-violet-400 rounded-full"
            style={{
              left: `${20 + i * 30}%`,
              top: `${60 + i * 10}%`,
            }}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default Empty;