'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const BurgerMenu = () => {
  const [step, setStep] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setTimeout(() => setStep(1), 1000); // Start shrinking after 1s
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <motion.div
      className="absolute top-0 
      right-0 bg-red-500 aspect-square w-20 h-full 
      overflow-hidden flex flex-col items-end justify-center"
      initial={{ width: '0px' }}
      animate={
        step === 0
          ? { width: '100%' } // Expands to fill parent width
          : isOpen 
            ? { width: '17rem', height: '100vh', backgroundColor: 'white' } 
            : { width: '60px', backgroundColor: '#ef4444' } // Collapsed state
      }
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1.0] }}
    >
      <AnimatePresence mode="wait">
        {!isOpen ? (
          // Burger icon (span) when closed
          <motion.div
            key="burger"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col items-center justify-center cursor-pointer mr-3"
            onClick={toggleMenu}
          >
            <motion.span className="w-8 h-2 bg-white mb-[5px]" />
            <motion.span className="w-8 h-2 bg-black/80 mb-[5px]" />
            <motion.span className="w-8 h-2 bg-black/80" />
          </motion.div>
        ) : (
          // Links when open
          <motion.div
            key="menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-4 text-center mt-8 w-full items-end pr-6"
          >
            <motion.div 
              className="absolute top-6 right-6 cursor-pointer hover:bg-gray-100 rounded-full p-2 transition-colors"
              onClick={toggleMenu}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </motion.div>
            
            {['Experience', 'Projects', 'Resume'].map((text, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ 
                  opacity: 1, 
                  x: 0,
                  transition: { 
                    duration: 0.4,
                    delay: 0.1 * index
                  }
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
      </AnimatePresence>
    </motion.div>
  );
};

export default BurgerMenu;