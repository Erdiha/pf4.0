import React from 'react';
import { AiOutlineDownload } from 'react-icons/ai';
import { motion } from 'framer-motion';

const Resume = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }} // Start off-screen
      animate={{ opacity: 1, y: 0 }} // Fade-in and slide up
      exit={{ opacity: 0, y: 50 }} // Smooth exit if needed
      transition={{ duration: 0.8, ease: 'easeInOut' }} // Smooth animation
      className="flex flex-col items-center justify-end w-full h-full bg-transparent text-white overflow-hidden relative"
    >
      {/* Resume Display using iframe */}
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
        className="bg-gray-800 w-full  max-w-6xl h-[70%] max-h-8xl rounded-lg overflow-hidden flex shadow-lg "
      >
        <iframe
          src="/resume.pdf"
          className="w-full h-full object-contain"
          title="Resume"
        />
      </motion.div>

      {/* Download Button */}
      <motion.a
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4, ease: 'easeOut' }}
        href="/resume.pdf"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center px-4 py-2.5 bg-gray-900 text-gray-100 rounded-md 
                transition-all hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 
                focus:ring-gray-500 text-sm font-medium mb-20 mt-10 "
      >
        <AiOutlineDownload className="text-xl" />
        Download Resume
      </motion.a>
    </motion.div>
  );
};

export default Resume;
