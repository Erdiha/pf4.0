'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const BurgerMenu = ({ cubeFace, setCubeFace, isMobile }) => {
  const [step, setStep] = useState(0)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    setTimeout(() => setStep(1), 2000)
  }, [])

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  // Direct scrolling function
  const navigateToSection = (index) => {
    console.log('Navigating to section:', index)

    // Update cubeFace for visual consistency
    setCubeFace(index)

    // Close menu
    setIsOpen(false)

    // Map of section IDs
    const sectionIds = ['home', 'experince', 'project', 'resume']
    const targetId = sectionIds[index]

    // Use direct ID targeting
    const targetElement = document.getElementById(targetId)

    if (targetElement) {
      console.log(`Found element with ID: ${targetId}`)

      // Force a small scroll to "unlock" any scroll state
      window.scrollBy(0, 1)

      // Wait a tiny bit then scroll to the element
      setTimeout(() => {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
        console.log(`Scrolled to ${targetId}`)
      }, 50)
    } else {
      console.error(`Element with ID ${targetId} not found`)

      // Fallback to basic position-based scrolling
      const position = index * window.innerHeight
      console.log(`Fallback: scrolling to position ${position}px`)

      window.scrollTo({
        top: position,
        behavior: 'smooth',
      })
    }
  }

  // Enhanced liquid wobble paths - focus on smooth motion
  const liquidPath = {
    start: 'M 0,0 C 25,15 65,-10 100,0 L 100,100 C 75,110 25,85 0,100 L 0,0 Z',
    wobble1:
      'M 0,0 C 30,20 60,-15 100,0 L 100,100 C 60,115 30,80 0,100 L 0,0 Z',
    wobble2: 'M 0,0 C 40,10 70,-5 100,0 L 100,100 C 70,105 40,90 0,100 L 0,0 Z',
    wobble3: 'M 0,0 C 20,5 80,5 100,0 L 100,100 C 80,95 20,95 0,100 L 0,0 Z',
    middle: 'M 0,0 C 15,10 85,10 100,0 L 100,100 C 85,90 15,90 0,100 L 0,0 Z',
    almostEnd: 'M 0,0 C 5,5 95,5 100,0 L 100,100 C 95,95 5,95 0,100 L 0,0 Z',
    end: 'M 0,0 L 100,0 L 100,100 L 0,100 L 0,0 Z',
  }

  return (
    <>
      {/* The liquid animated container - simplified for better performance */}
      {step === 0 && (
        <motion.div
          className="absolute mt-10 right-0 w-16 h-16 overflow-visible"
          initial={{ scale: 1 }}
          animate={{
            scale: [1, 1.05, 0.98, 1.02, 0.99, 1],
          }}
          transition={{
            duration: 2,
            times: [0, 0.2, 0.4, 0.6, 0.8, 1],
            ease: 'easeInOut',
            repeat: 0,
          }}
        >
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 100 100"
            style={{ position: 'absolute', top: 0, left: 0 }}
          >
            <clipPath id="liquidClip">
              <motion.path
                d={liquidPath.start}
                animate={{
                  d: [
                    liquidPath.start,
                    liquidPath.wobble1,
                    liquidPath.wobble2,
                    liquidPath.wobble3,
                    liquidPath.middle,
                    liquidPath.almostEnd,
                    liquidPath.end,
                  ],
                }}
                transition={{
                  duration: 2,
                  times: [0, 0.15, 0.3, 0.5, 0.7, 0.85, 1],
                  ease: 'easeInOut',
                }}
              />
            </clipPath>

            {/* White fill for the liquid shape */}
            <rect
              width="100"
              height="100"
              fill="white"
              clipPath="url(#liquidClip)"
            />
          </svg>

          {/* Burger icon inside the liquid */}
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ clipPath: 'url(#liquidClip)' }}
          >
            <div className="flex flex-col items-center justify-center">
              <div className="w-8 h-2 bg-red-500 mb-[5px]" />
              <div className="w-8 h-2 bg-black/80 mb-[5px]" />
              <div className="w-8 h-2 bg-black/80" />
            </div>
          </div>
        </motion.div>
      )}

      {/* The regular menu after the liquid animation */}
      <motion.div
        className="absolute mt-10 right-0 bg-white overflow-hidden flex flex-col items-center justify-center"
        initial={{
          width: '60px',
          height: '60px',
          opacity: step === 0 ? 0 : 1,
        }}
        animate={
          step === 0
            ? {
                width: '60px',
                height: '60px',
                opacity: 0,
              }
            : isOpen
            ? {
                width: '10rem',
                height: isMobile ? '85vh' : '90vh',
                opacity: 1,
                backgroundColor: '#FFFFFF',
              }
            : {
                width: '60px',
                height: '60px',
                opacity: 1,
                backgroundColor: 'white',
              }
        }
        transition={{
          duration: 0.8,
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        <AnimatePresence mode="wait">
          {!isOpen ? (
            <motion.div
              key="burger"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col items-center justify-center cursor-pointer"
              onClick={toggleMenu}
            >
              <motion.span className="w-8 h-2 bg-red-500 mb-[5px]" />
              <motion.span className="w-8 h-2 bg-black/80 mb-[5px]" />
              <motion.span className="w-8 h-2 bg-black/80" />
            </motion.div>
          ) : (
            <motion.div
              key="menu"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-4 p-5 h-full text-center w-full items-end justify-center"
            >
              <motion.div
                className="absolute top-5 right-5 mx-auto cursor-pointer hover:bg-gray-100 
                rounded-full transition-colors"
                onClick={toggleMenu}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </motion.div>

              {/* Navigation items with direct navigation function */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{
                  opacity: 1,
                  x: 0,
                  transition: { duration: 0.4, delay: 0 },
                }}
                className="relative"
              >
                <div
                  onClick={() => navigateToSection(0)}
                  className="text-black hover:text-gray-700 text-lg font-semibold relative cursor-pointer"
                >
                  Home
                  <motion.div
                    className="absolute left-0 bottom-0 h-[2px] bg-black w-full origin-left"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                  />
                </div>
              </motion.div>

              {/* Repeat for other navigation items */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{
                  opacity: 1,
                  x: 0,
                  transition: { duration: 0.4, delay: 0.1 },
                }}
                className="relative"
              >
                <div
                  onClick={() => navigateToSection(1)}
                  className="text-black hover:text-gray-700 text-lg font-semibold relative cursor-pointer"
                >
                  Experience
                  <motion.div
                    className="absolute left-0 bottom-0 h-[2px] bg-black w-full origin-left"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{
                  opacity: 1,
                  x: 0,
                  transition: { duration: 0.4, delay: 0.2 },
                }}
                className="relative"
              >
                <div
                  onClick={() => navigateToSection(2)}
                  className="text-black hover:text-gray-700 text-lg font-semibold relative cursor-pointer"
                >
                  Projects
                  <motion.div
                    className="absolute left-0 bottom-0 h-[2px] bg-black w-full origin-left"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{
                  opacity: 1,
                  x: 0,
                  transition: { duration: 0.4, delay: 0.3 },
                }}
                className="relative"
              >
                <div
                  onClick={() => navigateToSection(3)}
                  className="text-black hover:text-gray-700 text-lg font-semibold relative cursor-pointer"
                >
                  Resume
                  <motion.div
                    className="absolute left-0 bottom-0 h-[2px] bg-black w-full origin-left"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                  />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  )
}

export default BurgerMenu
