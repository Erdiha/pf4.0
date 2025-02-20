'use client';

import React, { useEffect, useState } from 'react';
import { delay, motion } from 'framer-motion';
import Modal from '@/components/Modals/Info-Modal/info-modal';
import { experienceObject } from '../utils/data';

// ✅ Motion Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.4, delayChildren: 0, ease: 'easeInOut' },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: '-100%', scale: 0.8 },
  delay: 1,
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { staggerChildren: 0.4, delayChildren: 0, ease: 'easeInOut' },
  },
};

// ✅ Underline animation from left to right
const underlineVariants = {
  hidden: { width: '0%' },
  hover: { width: '50%', transition: { duration: 0.4, ease: 'easeInOut' } },
};

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
};

// ✅ Extracted Modular Component
const ItemCard = ({ job, index, indx, setIndx, isInModal }) => {
  return (
    <motion.div
      key={index}
      variants={itemVariants}
      className="flex w-full justify-start cursor-pointer relative"
      onClick={() => setIndx({ index: index, initial: false })}
      style={{
        zIndex: indx.index === index ? 99 : 1, // ✅ Ensure highest zIndex for selected item
      }}
    >
      <motion.div
        variants={selectedItemVariants}
        animate={
          indx.index === index ? (isInModal ? 'toModal' : 'selected') : 'normal'
        }
        className="bg-white/90 p-2 rounded-lg min-w-fit w-full text-start relative"
      >
        {/* ✅ Title with underline animation */}
        <motion.div
          className="flex items-center gap-4"
          initial="hidden"
          whileHover="hover"
        >
          {/* <img src={job?.icon} alt={job?.title} className="w-8 h-8" /> */}
          <motion.p className="text-3xl font-semibold relative w-[20rem]">
            {job?.title}
            <motion.span
              className="absolute left-0 bottom-0 h-[2px] bg-red-500"
              variants={underlineVariants}
            />
          </motion.p>
        </motion.div>
        <p className="text-gray-600">{job?.company}</p>
        <p className="text-gray-500 text-sm">
          {job?.duration.start} - {job?.duration.end}
        </p>
        <p className="text-gray-500 text-sm italic">{job?.type}</p>
      </motion.div>
    </motion.div>
  );
};

// ✅ Main Experience Component
const Experience = ({
  cubeFace,
  indx,
  setIndx,
  showModal,
  setCloseModal,
  closeModal,
}) => {
  const [isActive, setIsActive] = useState(false);

  // ✅ Trigger animation only when `cubeFace === 1`
  useEffect(() => {
    setIsActive(cubeFace === 1);
  }, [cubeFace]);

  console.log('Selected Index:', indx);

  return (
    <motion.div
      className="w-full h-[100vh] flex flex-col bg-transparent justify-center items-center relative"
      variants={containerVariants}
      initial="hidden"
      animate={isActive ? 'visible' : 'hidden'}
    >
      <motion.div className="w-full flex gap-6 max-w-6xl justify-center items-center">
        <div className="w-full flex flex-col justify-evenly h-full">
          {experienceObject.map((job, index) => (
            <ItemCard
              key={index}
              job={job}
              index={index}
              indx={indx}
              setIndx={setIndx}
            />
          ))}
        </div>

        {/* ✅ Modal only renders when `indx` is set */}
        <div
          style={{ opacity: showModal || indx.index >= 0 ? 1 : 0 }}
          className="flex w-full z-[999] right-0"
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
      </motion.div>
    </motion.div>
  );
};

export default Experience;
