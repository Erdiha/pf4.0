'use client';

import { MdKeyboardArrowDown } from 'react-icons/md';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function LandingPage({ cubeFace }) {
  const [colors, setColors] = useState([]);

  // Generate random colors
  useEffect(() => {
    setColors(
      Array.from({ length: 2 }, () => `hsl(${Math.random() * 360}, 100%, 50%)`)
    );
  }, []);

  return (
    <div className="w-full h-screen flex items-center justify-center bg-white relative overflow-hidden">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
      >
        <source src="/vid.mp4" autoPlay type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Animated colored triangles */}
      <motion.span
        style={{
          clipPath: 'polygon(0 0, 0% 100%, 100% 0%)',
          zIndex: 10,
          backgroundColor: 'rgba(0, 0, 0, 0.5)', // Apply random color
        }}
        className="w-full h-full absolute"
        initial={{ x: '-100%', opacity: 0 }} // Hidden at the start
        animate={
          cubeFace === 0
            ? { x: 20, rotate: -180, opacity: 1 } // Normal animation
            : { x: '-100%', opacity: 0 } // Exit animation (reverse of initial)
        }
        transition={{
          duration: 1,
          ease: 'easeInOut',
        }}
      >
        <video
          autoPlay
          loop
          muted
          className="absolute top-0 left-0 w-full h-full object-cover z-0"
        >
          <source src="/water.mp4" autoPlay type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </motion.span>

      <motion.span
        style={{
          clipPath: 'polygon(100% 100%, -0% 100%, 100% -1%)',
          zIndex: 10,
          backgroundColor: '#3674B5', // Apply random color
        }}
        className="w-full h-full absolute"
        initial={{ x: '100%', opacity: 0 }} // Hidden at the start
        animate={
          cubeFace === 0
            ? { x: -20, rotate: 180, opacity: 1 } // Normal animation
            : { x: '100%', opacity: 0 } // Exit animation (reverse of initial)
        }
        transition={{
          duration: 1,
          ease: 'easeInOut',
        }}
      >
        <video
          autoPlay
          loop
          muted
          className="absolute top-0 left-0 w-full h-full object-cover z-0"
        >
          <source src="/water.mp4" autoPlay type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </motion.span>

      {/* Bouncing arrow */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex items-center justify-center z-20">
        <MdKeyboardArrowDown
          color="red"
          size="40px"
          className="cursor-pointer animate-bounce"
          title="SCROLL"
        />
      </div>
    </div>
  );
}
