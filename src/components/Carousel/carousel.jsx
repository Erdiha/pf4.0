import React, { useRef, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { techIcons } from '../../app/utils/icons' // Corrected import

function InfiniteCarousel({ direction = 'left', speed }) {
  const containerRef = useRef(null)
  const items = techIcons // Use the correct array
  const [isMobile, setIsMobile] = useState(false)

  // Detect mobile devices
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)

    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Adjust sizes based on device
  const itemWidth = isMobile ? 120 : 200 // Smaller on mobile
  const itemHeight = isMobile ? 50 : 100 // Smaller height on mobile
  const gap = isMobile ? 8 : 16 // Smaller gap on mobile
  const totalWidth = (itemWidth + gap) * items.length // Total width of all items

  return (
    <div
      ref={containerRef}
      className="relative w-full h-1/3 overflow-hidden flex items-center"
    >
      <motion.div
        className="flex"
        style={{ gap: `${gap}px` }} // Apply dynamic gap
        animate={{
          x: direction === 'left' ? [0, -totalWidth] : [-totalWidth, 0],
        }}
        transition={{
          repeat: Infinity,
          repeatType: 'loop',
          ease: 'linear',
          duration: totalWidth / speed,
        }}
      >
        {[...items, ...items, ...items].map((item, index) => (
          <div
            key={index}
            style={{
              width: `${itemWidth}px`,
              height: `${itemHeight}px`,
            }}
            className="flex flex-col items-center justify-center text-whitblacke"
          >
            {/* Resize icon based on device */}
            <div className={isMobile ? 'transform scale-75' : ''}>
              {item.icon}
            </div>
            {/* <hr className={isMobile ? "w-3/4 my-1" : "my-2"} /> */}
            <span className={isMobile ? 'text-xs' : 'text-sm'}>
              {item.name}
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  )
}

export default InfiniteCarousel
