'use client'

import React, { useEffect, useState } from 'react'
import { delay, motion } from 'framer-motion'
import Modal from '../../components/Modals/Info-Modal/info-modal'
import { experienceObject } from '../utils/data'
import { IconArrowLeft, IconArrowRight } from '@tabler/icons-react'

// ✅ Motion Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.4, delayChildren: 0, ease: 'easeInOut' },
  },
}

const itemVariants = {
  hidden: { opacity: 0, x: '-100%', scale: 0.8 },
  delay: 1,
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { staggerChildren: 0.4, delayChildren: 0, ease: 'easeInOut' },
  },
}

// ✅ Underline animation from left to right
const underlineVariants = {
  hidden: { width: '0%' },
  hover: { width: '50%', transition: { duration: 0.4, ease: 'easeInOut' } },
}

// ✅ Selection animation (Move item to modal)
const selectedItemVariants = {
  selected: {
    x: 200, // ✅ Move item right behind the modal first
    opacity: 0, // ✅ Fade out while moving
    transition: { duration: 0.4, ease: 'easeOut' },
  },
  toModal: {
    x: '0%', // ✅ Move to top-left of the modal
    y: '0%',
    top: 0,
    opacity: 1, // ✅ Reappear
    scale: 1,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
  normal: {
    x: 0,
    y: 0,
    opacity: 1,
    scale: 1,
  },
}

// ✅ Extracted Modular Component
const ItemCard = ({ job, index, indx, setIndx, isInModal, isMobile }) => {
  // console.log(`Card ${index} - Selected Index: ${indx.index}`);
  return (
    <motion.div
      key={index}
      variants={itemVariants}
      className="flex w-fit justify-start cursor-pointer relative items-center group"
      onClick={() => setIndx({ index: index, initial: false })}
      style={{
        zIndex: indx.index === index ? 99 : 1,
      }}
    >
      <motion.div
        variants={selectedItemVariants}
        animate={
          indx.index === index ? (isInModal ? 'toModal' : 'selected') : 'normal'
        }
        className="bg-white p-2  min-w-fit w-full text-start relative"
      >
        <motion.div className="flex items-center gap-4">
          <p className="md:text-3xl text-xl font-semibold relative w-[20rem]">
            {job?.title}
            <span className="absolute left-0 bottom-0 h-[2px] bg-red-500 w-0 transition-all duration-300 group-hover:w-1/2" />
          </p>
        </motion.div>
        <p className="text-gray-600 w-full max-w-xs whitespace-normal break-words p-2 pl-0">
          {job?.company}
        </p>
        <p className="text-gray-500 text-sm w-full max-w-xs whitespace-normal break-words p-2 pl-0">
          {job?.duration.start} - {job?.duration.end}
        </p>
        <p className="text-gray-500 text-sm italic">{job?.type}</p>
      </motion.div>

      {index !== indx.index && (
        <IconArrowRight
          color="red"
          fontWeight={900}
          size="20px"
          className="absolute top-1/2 -right-0 h-6 w-6s text-black dark:text-neutral-400 duration-300 transform group-hover:-rotate-45 transition-all ease-in-out border-l-[1px] border-black"
        />
      )}
    </motion.div>
  )
}

// ✅ Main Experience Component
const Experience = ({
  cubeFace,
  indx,
  setIndx,
  showModal,
  setCloseModal,
  closeModal,
  isMobile,
}) => {
  const [isActive, setIsActive] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true) // Set this to true after the first render (client-side).
  }, [])
  // ✅ Trigger animation only when `cubeFace === 1`
  useEffect(() => {
    setIsActive(cubeFace === 1)
  }, [cubeFace])

  // console.log('Selected Index:', indx);
  if (!isMounted) return null // Prevent hydration mismatch during the initial render.

  return (
    <motion.div
      className="w-full h-[100vh] flex bg-transparent justify-center 
      items-center relative z-[99999]"
      variants={containerVariants}
      initial="hidden"
      animate={isActive ? 'visible' : 'hidden'}
    >
      <motion.div
        className="flex w-full h-full md:max-w-[100rem] mx-auto 
      justify-center items-center"
      >
        {((isMobile && indx.index < 0) || !isMobile) && (
          <div
            className="md:w-1/3 w-full flex flex-col justify-center items-center
          h-[60%] gap-2 "
          >
            {isMobile && (
              <p
                className={` text-2xl  capitalize font-bold text-pretty  self-start px-11`}
              >
                experience
              </p>
            )}
            {experienceObject.map((job, index) => (
              <div
                key={index}
                className="flex flex-col items-center "
                style={{
                  transition: 'opacity 0.3s ease, transform 0.3s ease',
                  opacity: isMobile && showModal ? 0 : 1,
                  transform:
                    isMobile && showModal
                      ? 'translateY(-10px)'
                      : 'translateY(0px)',
                  pointerEvents: isMobile && showModal ? 'none' : 'auto',
                }}
              >
                <ItemCard
                  job={job}
                  index={index}
                  indx={indx}
                  setIndx={setIndx}
                  isMobile={isMobile}
                />
              </div>
            ))}
          </div>
        )}

        {/* ✅ Modal only renders when `indx` is set */}
        {((isMobile && indx.index >= 0) || !isMobile) && (
          <div
            style={{
              opacity: showModal || indx.index >= 0 ? 1 : 0,
              transition: 'opacity 0.3s ease',
            }}
            className="flex md:w-3/4 w-full z-[999] h-[60%]
           justify-center items-center"
          >
            <Modal
              key={indx?.index}
              setCloseModal={setCloseModal}
              closeModal={closeModal}
              show={showModal}
              data={experienceObject[indx?.index]}
              index={indx?.index}
              items={
                <ItemCard
                  job={experienceObject[indx?.index]}
                  index={indx?.index}
                  indx={indx}
                  setIndx={setIndx}
                  isInModal
                />
              }
            />
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}

export default Experience
