import React, { useEffect, useRef } from 'react'
import { motion, useAnimation } from 'framer-motion'
import { techIcons } from '../../app/utils/icons' // Corrected import

// --- Configuration ---
const BASE_CUBE_SIZE_REM = 10 // Base size (e.g., 4rem = 64px) - Ensure this isn't too big for parent
const GAP_SIZE_REM = 0.5 // Gap between cubes (e.g., 0.5rem = 8px)
const PERSPECTIVE_PX = 3000 // Perspective value for 3D effect

const MAX_RANDOM_OFFSET_PX = 10
const MAX_RANDOM_DEPTH_PX = 100
const MIN_RANDOM_SCALE = 0.95
const MAX_RANDOM_SCALE = 1.05
const MIN_ANIM_DURATION_S = 2.0
const MAX_ANIM_DURATION_S = 3.5
const MIN_DELAY_BETWEEN_ANIMS_S = 0.9
const MAX_DELAY_BETWEEN_ANIMS_S = 2.0
const HOVER_SCALE = 1.5
const HOVER_DEPTH_PX = 100

// --- Helper ---
const random = (min, max) => Math.random() * (max - min) + min

// --- Cube Component (Should be okay, no changes needed here) ---
const Cube = ({ itemData }) => {
  const controls = useAnimation()
  const timeoutRef = useRef(null)

  useEffect(() => {
    let isMounted = true

    const runRandomAnimation = () => {
      if (!isMounted) return

      const randomX = random(-MAX_RANDOM_OFFSET_PX, MAX_RANDOM_OFFSET_PX)
      const randomY = random(-MAX_RANDOM_OFFSET_PX, MAX_RANDOM_OFFSET_PX)
      const randomZ = random(-MAX_RANDOM_DEPTH_PX, MAX_RANDOM_DEPTH_PX)
      const randomScale = random(MIN_RANDOM_SCALE, MAX_RANDOM_SCALE)
      const duration = random(MIN_ANIM_DURATION_S, MAX_ANIM_DURATION_S)
      const nextDelay =
        random(MIN_DELAY_BETWEEN_ANIMS_S, MAX_DELAY_BETWEEN_ANIMS_S) * 1000

      controls
        .start({
          x: [0, randomX, 0],
          y: [0, randomY, 0],
          z: [0, randomZ, 0],
          scale: [1, randomScale, 1],
          transition: {
            duration: duration,
            ease: 'easeInOut',
            times: [0, 0.5, 1],
          },
        })
        .then(() => {
          if (isMounted && timeoutRef.current !== null) {
            timeoutRef.current = setTimeout(runRandomAnimation, nextDelay)
          }
        })
        .catch(() => {})
    }

    const initialDelay = random(0, MAX_DELAY_BETWEEN_ANIMS_S) * 500
    timeoutRef.current = setTimeout(runRandomAnimation, initialDelay)

    return () => {
      isMounted = false
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
      controls.stop()
    }
  }, [controls])

  return (
    <motion.div
      className={`
        aspect-square
        bg-black 
        rounded-lg
        cursor-pointer
        shadow-lg
        origin-center
        justify-center items-center
        flex flex-col w-full h-full
      `}
      style={{ transformStyle: 'preserve-3d' }}
      initial={{ x: 0, y: 0, z: 0, scale: 1 }}
      animate={controls}
      whileHover={{
        scale: HOVER_SCALE,
        z: HOVER_DEPTH_PX,
        zIndex: 10,
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
        transition: { type: 'spring', stiffness: 300, damping: 20, delay: 0 },
      }}
    >
      <span className="w-full h-fit aspect-square text-black  justify-center items-center flex">
        {itemData.icon}
      </span>
      <span className="w-full min-h-5 h-fit justify-center aspect-square text-white items-center flex ">
        {itemData.name}
      </span>
    </motion.div>
  )
}

// --- Main Grid Component ---
const SkillsCubes = ({ maxCubes = 250 }) => {
  const cubes = Array.from({ length: maxCubes })

  return (
    // This component tries to fill its parent.
    // Ensure the PARENT element has a defined width and height.
    <div
      className={`
        w-full h-full // Takes size from parent
         items-center justify-center // Centers the grid container itself
        bg-gray-900
        overflow-hidden // Prevents cubes going outside bounds
      `}
      style={{
        perspective: `${PERSPECTIVE_PX}px`, // Apply perspective for 3D
      }}
    >
      {/* Grid Container: Tries to fill the above div */}
      <div
        className={`
          w-full h-full // Use full width/height of the perspective container
          place-content-center // Center grid items if they don't perfectly fill
        `}
        style={{
          '--cube-base-size': `${BASE_CUBE_SIZE_REM}rem`,
          '--grid-gap': `${GAP_SIZE_REM}rem`,
          // This IS the correct way to get auto-wrapping matrix behavior
          gridTemplateColumns: `repeat(auto-fill, minmax(var(--cube-base-size), 1fr))`,
          gridAutoRows: `minmax(var(--cube-base-size), auto)`, // Let rows define height based on aspect-square
          gap: 'var(--grid-gap)',
          transformStyle: 'preserve-3d', // For 3D children
        }}
      >
        {/* Render the Cube child components */}
        {cubes.map((_, index) => {
          const itemIndex = index % techIcons.length
          const currentItemData = techIcons[itemIndex] // Get the actual item object
          return <Cube key={index} itemData={currentItemData} /> // Pass the object
        })}
      </div>
    </div>
  )
}

export default SkillsCubes
