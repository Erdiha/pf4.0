import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { techIcons } from '@/app/utils/icons'; // Corrected import

function InfiniteCarousel({ direction = 'left', speed }) {
  const containerRef = useRef(null);
  const items = techIcons; // Use the correct array
  const itemWidth = 200; // Width of each item
  const gap = 16; // Space between items
  const totalWidth = (itemWidth + gap) * items.length; // Total width of all items

  return (
    <div
      ref={containerRef}
      className="relative w-full h-1/3 overflow-hidden flex items-center"
    >
      <motion.div
        className="flex space-x-1"
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
            className="w-[200px] h-[100px] flex flex-col items-center justify-center rounded-md shadow-lg"
          >
            {item.icon} <hr /> {item.name}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export default InfiniteCarousel;
