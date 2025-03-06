import React, { useEffect, useState } from 'react'
import { AiOutlineDownload } from 'react-icons/ai'
import { motion } from 'framer-motion'
import ResumeText from './ResumeText'

const Resume = () => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Check if we're on a mobile device
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    // Initial check
    checkMobile()

    // Add event listener for window resize
    window.addEventListener('resize', checkMobile)

    // Cleanup
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{
        opacity: 0,
        y: -50,
        transition: { duration: 0.8, ease: 'easeInOut' },
      }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
      className="flex flex-col items-center justify-end w-full h-full bg-transparent 
       text-white  relative p-4"
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
    >
      {/* Resume Display - using object tag instead of iframe for better PDF support on mobile */}
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
        className={`md:bg-gray-800 w-full md:h-[70%] overflow-y-hidden flex justify-center items-center
      
        md:max-w-5xl rounded-lg ${isMobile ? 'mt-16' : 'mt-0'}`}
      >
        {isMobile ? (
          // Ensure proper scrolling within this container only
          <div className="w-full h-full overflow-hidden p-4 mt-10">
            <h1 className="text-black w-full text-2xl pl-6 font-bold pb-4 ">
              Resume
            </h1>
            <ResumeText />
          </div>
        ) : (
          // For desktop: Keep the iframe as it is
          <iframe
            src="/resume.pdf"
            className="w-full h-full object-contain flex"
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
                focus:ring-gray-500 text-sm font-medium ${
                  isMobile ? 'mb-10 mt-6' : 'mb-20 mt-10'
                }`}
      >
        <AiOutlineDownload className="text-xl mr-2" />
        Download Resume
      </motion.a>
    </motion.div>
  )
}

export default Resume
