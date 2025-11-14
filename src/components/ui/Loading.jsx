import { motion } from "framer-motion";

const Loading = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-indigo-50">
      <div className="text-center space-y-8">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="relative"
        >
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-500 rounded-full mx-auto"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-violet-500 rounded-full animate-spin"></div>
        </motion.div>
        
        <div className="space-y-3">
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent"
          >
            Swift Upload
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-600 font-medium"
          >
            Preparing your upload experience...
          </motion.p>
        </div>
        
        {/* Animated dots */}
        <div className="flex justify-center space-x-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{
                scale: [1, 1.3, 1],
                backgroundColor: ["#e5e7eb", "#6366f1", "#e5e7eb"]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut"
              }}
              className="w-3 h-3 rounded-full bg-gray-300"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Loading;