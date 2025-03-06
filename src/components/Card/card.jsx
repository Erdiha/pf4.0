import { IconArrowLeft, IconArrowRight } from '@tabler/icons-react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { useEffect, useState, useMemo, useRef } from 'react'
import { HiOutlinePauseCircle } from 'react-icons/hi2'
import { HiOutlinePlayCircle } from 'react-icons/hi2'
import { LiaExternalLinkSquareAltSolid } from 'react-icons/lia'
import { PiCodeSimpleLight } from 'react-icons/pi'
import React from 'react'

const Card = ({ testimonials, autoplay }) => {
  const [active, setActive] = useState(0)
  const [randomRotateY, setRandomRotateY] = useState(0)
  const [pause, setPause] = useState(false)
  const [contentHeight, setContentHeight] = useState(0)
  const descriptionRefs = useRef(
    new Array(testimonials.length).fill(null).map(() => React.createRef()),
  )

  const handleNext = () => {
    setActive((prev) => (prev + 1) % testimonials.length)
  }

  const handlePrev = () => {
    setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  const isActive = (index) => index === active

  // Calculate max content height on initial load
  useEffect(() => {
    const calculateMaxHeight = () => {
      // Create temporary hidden elements to measure all testimonial descriptions
      const tempContainer = document.createElement('div')
      tempContainer.style.position = 'absolute'
      tempContainer.style.visibility = 'hidden'
      tempContainer.style.width = window.innerWidth <= 768 ? '100%' : '50%' // Match container width
      document.body.appendChild(tempContainer)

      // Measure each testimonial description
      let maxHeight = 0
      testimonials.forEach((testimonial, index) => {
        const tempElement = document.createElement('div')
        tempElement.className = 'text-lg'
        tempElement.innerHTML = testimonial.description
        tempContainer.appendChild(tempElement)

        const height = tempElement.offsetHeight + 200 // Add extra space for other elements
        if (height > maxHeight) {
          maxHeight = height
        }

        tempContainer.removeChild(tempElement)
      })

      document.body.removeChild(tempContainer)
      return maxHeight
    }

    // Set max content height after component mounts
    const maxHeight = calculateMaxHeight()
    setContentHeight(maxHeight)

    // Recalculate on window resize for responsive behavior
    const handleResize = () => {
      setContentHeight(calculateMaxHeight())
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [testimonials])

  useEffect(() => {
    if (autoplay && !pause) {
      const interval = setInterval(handleNext, 4000)
      return () => clearInterval(interval)
    }
  }, [autoplay, active, pause])

  // Fix: Memoize Random Rotation to Prevent SSR/CSR Mismatch
  useEffect(() => {
    setRandomRotateY(Math.floor(Math.random() * 21) - 10)
  }, [])

  return (
    <div
      className="max-w-sm md:max-w-4xl mx-auto antialiased font-sans px-4 md:px-8 
    lg:pl-16 z-[99999] md:mt-40 w-full"
    >
      <div className="relative grid grid-cols-1 md:grid-cols-2 md:gap-20 gap-10">
        {/* Image section */}
        <div>
          <div
            className="relative md:h-80 md:w-full w-64 h-48 flex justify-center 
          items-center"
          >
            <AnimatePresence>
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.src}
                  initial={{
                    opacity: 0,
                    scale: 0.9,
                    z: -100,
                    rotate: randomRotateY,
                  }}
                  animate={{
                    opacity: isActive(index) ? 1 : 0.7,
                    scale: isActive(index) ? 1 : 0.95,
                    z: isActive(index) ? 0 : -100,
                    rotate: isActive(index) ? 0 : randomRotateY,
                    zIndex: isActive(index)
                      ? 999
                      : testimonials.length + 2 - index,
                    y: isActive(index) ? [0, -80, 0] : 0,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.9,
                    z: 100,
                    rotate: randomRotateY,
                  }}
                  transition={{ duration: 0.4, ease: 'easeInOut' }}
                  className="absolute inset-0 origin-bottom"
                >
                  <Image
                    src={testimonial.src}
                    alt={testimonial.name}
                    width={500}
                    height={500}
                    draggable={false}
                    className="h-full w-full object-cover object-center border"
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Content section with fixed height */}
        <div
          className="flex justify-between flex-col md:py-6"
          style={{
            minHeight: contentHeight > 0 ? `${contentHeight}px` : 'auto',
            height: contentHeight > 0 ? `${contentHeight}px` : 'auto',
          }}
        >
          <motion.div
            key={active}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="flex flex-col md:min-h-48"
          >
            <h3 className="text-2xl font-bold dark:text-white text-black">
              {testimonials[active].name}
            </h3>
            <p className="text-sm text-black  md:text-black md:mb-6 dark:text-neutral-500">
              {testimonials[active].designation}
            </p>
            <motion.p
              className="text-lg text-black md:text-white md:mb-6
             dark:text-neutral-300"
            >
              {testimonials[active].description
                .split(' ')
                .map((word, index) => (
                  <motion.span
                    key={index}
                    initial={{ filter: 'blur(10px)', opacity: 0, y: 5 }}
                    animate={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.2,
                      ease: 'easeInOut',
                      delay: 0.02 * index,
                    }}
                    className="inline-block"
                  >
                    {word}&nbsp;
                  </motion.span>
                ))}
            </motion.p>
          </motion.div>

          <div className="flex md:gap-4  md:pt-0 flex-col">
            <div className="flex md:space-x-5">
              <div className="flex gap-3">
                {testimonials[active].links[0] && (
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={testimonials[active].links[0]}
                    className="inline-flex items-center px-2 md:px-4 md:py-2.5 bg-gray-900 text-gray-100 rounded-md 
                transition-all hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 
                focus:ring-gray-500 text-sm font-medium"
                  >
                    <PiCodeSimpleLight className="w-4 h-4 mr-2" />
                    Source Code
                  </a>
                )}

                {testimonials[active].links[1] && (
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={testimonials[active].links[1]}
                    className="inline-flex items-center px-2 md:px-4 py-2.5 bg-gray-900 text-gray-100 rounded-md 
                transition-all hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 
                focus:ring-gray-500 text-sm font-medium"
                  >
                    <LiaExternalLinkSquareAltSolid className="w-4 h-4 mr-2" />
                    Live Demo
                  </a>
                )}
              </div>
            </div>
            <div className="flex-row flex w-full h-fit justify-start space-x-5 md:pt-4 pt-10 items-center">
              <button
                onClick={handlePrev}
                className="h-7 w-7 rounded-full bg-gray-100 dark:bg-neutral-800 flex items-center justify-center group/button"
              >
                <IconArrowLeft className="h-5 w-5 text-black dark:text-neutral-400 group-hover/button:rotate-12 transition-transform duration-300" />
              </button>
              <button
                onClick={() => setPause(!pause)}
                className="bg-white p-1 text-white rounded-full flex self-center"
              >
                {pause ? (
                  <HiOutlinePlayCircle color="black" size={30} />
                ) : (
                  <HiOutlinePauseCircle color="black" size={30} />
                )}
              </button>
              <button
                onClick={handleNext}
                className="h-7 w-7 rounded-full bg-gray-100 dark:bg-neutral-800 flex items-center justify-center group/button"
              >
                <IconArrowRight className="h-5 w-5 text-black dark:text-neutral-400 group-hover/button:-rotate-12 transition-transform duration-300" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Card
