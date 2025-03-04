import React, { useEffect, useState } from 'react';
import { AiOutlineDownload } from 'react-icons/ai';
import { motion } from 'framer-motion';
import AbstractAurora from './aurora';

const Resume = () => {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    // Check if we're on a mobile device
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkMobile();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
      className="flex flex-col  
      items-center justify-end w-full h-full bg-transparent  text-white overflow-hidden relative"
    >
      {/* Resume Display - using object tag instead of iframe for better PDF support on mobile */}
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
        className={`bg-gray-800 w-full max-w-6xl ${isMobile ? 'h-[60vh]' : 'h-[70%]'} max-h-8xl rounded-lg overflow-hidden flex shadow-lg ${isMobile ? 'mt-16' : ''}`}
      >
        {isMobile ? (
          // For mobile: Direct link to PDF with fallback text
          <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center">
            <p className="text-lg mb-4">Resume preview not available on mobile</p>
            <a 
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-gray-700 rounded-md hover:bg-gray-600 transition-colors"
            >
              Open Resume
            </a>
          </div>
        ) : (
          // For desktop: Keep the iframe as it is
          <iframe
            src="/resume.pdf"
            className="w-full h-full object-contain"
            title="Resume"
          />
        )}
      </motion.div>

      {/* Download Button */}
      <motion.a
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4, ease: 'easeOut' }}
        href="/resume.pdf"
        download="YourName_Resume.pdf"
        className={`inline-flex items-center px-4 py-2.5 bg-gray-900 text-gray-100 rounded-md 
                transition-all hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 
                focus:ring-gray-500 text-sm font-medium ${isMobile ? 'mb-10 mt-6' : 'mb-20 mt-10'}`}
      >
        <AiOutlineDownload className="text-xl mr-2" />
        Download Resume
      </motion.a>
      
      {/* Mobile-only helper text */}
      {isMobile && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-xs text-gray-900 mb-8 text-center px-4"
        >
          For the best experience, download the resume to view it on your device
        </motion.p>
      )}
    </motion.div>
  );
};

export default Resume;