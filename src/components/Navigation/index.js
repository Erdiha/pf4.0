'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const BurgerMenu = () => {
  const [step, setStep] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    setTimeout(() => setStep(1), 1000); // Start shrinking after 1s
  }, []);

  return (
    <motion.div
      className="fixed top-4 right-0 bg-white/60 h-[60px] shadow-md overflow-hidden flex flex-col items-center justify-center max-w-screen"
      initial={{ width: '0px', left: 0 }}
      animate={
        step === 0
          ? { width: '100%' } // Expands fully to the right
          : { width: '60px', left: 'calc(100% - 75px)' } // Shrinks from left
      }
      transition={{ duration: 1, ease: 'easeOut' }}
      whileHover={{
        width: '20%', // Expand left
        height: '100vh', // Expand downward
        top: 0,
        bottom: 0,
        borderRadius: '100px 0px 0px 100px',
        left: '80%', // Ensures right stays fixed
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {!isHovered ? (
        // 🔹 Burger icon (span) before hover
        <motion.div
          initial={{ opacity: 1 }}
          animate={{
            opacity: isHovered ? 0 : 1,
            transition: { duration: 0.3 },
          }}
          className="flex flex-col items-center justify-center"
        >
          <motion.span className="w-8 h-2 bg-black/80 mb-[5px]  " />
          <motion.span className="w-8 h-2 bg-black/80 mb-[5px] " />
          <motion.span className="w-8 h-2 bg-black/80 " />
        </motion.div>
      ) : (
        // 🔹 Links with animated underline
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{
            opacity: 1,
            y: 0,
            transition: { delay: 0.3, duration: 0.5, staggerChildren: 0.2 },
          }}
          className="flex flex-col gap-4 text-center mt-8"
        >
          {['Experience', 'Projects', 'Resume'].map((text, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 20 }}
              animate={{
                opacity: 1,
                x: 0,
                transition: { duration: 0.4 + index * 0.1 },
              }}
              className="relative"
            >
              <Link
                href="#"
                className="text-black hover:text-gray-700 text-lg font-semibold relative"
              >
                {text}
                <motion.div
                  className="absolute left-0 bottom-0 h-[2px] bg-black w-full origin-left"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                />
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

export default BurgerMenu;
