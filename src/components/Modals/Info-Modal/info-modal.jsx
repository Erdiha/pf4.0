import React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { MdOutlineClose } from 'react-icons/md'

// ✅ Modal Animation Variants
const modalVariants = {
  hidden: { opacity: 0, rotateY: -90 },
  visible: {
    opacity: 1,
    rotateY: 0,
    transition: { duration: 0.5, ease: 'easeOut', delay: 0.2 }, // ✅ Delay modal first
  },
  exit: { opacity: 0, rotateY: 90, transition: { duration: 0.6 } },
}

// ✅ List Items Animation (Slide in from Y = 10px)
const listItemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut', delay: i * 0.2 + 0.5 }, // ✅ Sequential delay
  }),
}

function Modal({ show, index, data, items, setCloseModal, closeModal }) {
  // console.log('show', show);

  const handleClose = () => {
    console.log('Close button clicked!')
    setCloseModal((prevState) => !prevState) // This ensures you get the latest state
  }

  return (
    <AnimatePresence mode="wait">
      (
      <motion.div
        key={index} // ✅ Ensures re-animation when new item is selected
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="relative w-[90%] lg:w-full min-h-full lg:h-[50vh] h-[85vh] flex bg-white
   flex-col rounded lg:max-w-[65rem] justify-center items-start p-10
   overflow-visible  z-[1000000]
   "
      >
        {/* ✅ Selected Item Display */}
        <motion.div variants={listItemVariants} className="w-fit h-fit flex">
          {items}
        </motion.div>
        {/* ✅ Animated List with Delayed Slide-in Effect */}
        <ul
          className="lg:text-lg w-full text-sm font-normal text-black flex flex-col 
        flex-wrap 
        lg:max-w-[80%] space-y-2 pl-5 list-disc"
        >
          {data?.details.map((item, i) => (
            <motion.li
              key={i}
              className="list-item"
              variants={listItemVariants}
              initial="hidden"
              animate="visible"
              custom={i} // ✅ Pass index for staggered delay
            >
              {item}
            </motion.li>
          ))}
        </ul>

        <motion.button
          onClick={handleClose} // Use the updated functionright-1/4
          className="z-[999999999] top-10 right-10  absolute lg:top-0           hover:border-black h-fit border-[1px] aspect-square flex lg:right-0"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{
            scale: 1.1,
            borderColor: 'rgba(0, 0, 0, 1)', // Use an animatable color
            transition: { type: 'spring', stiffness: 600, damping: 20 },
          }}
          whileTap={{
            scale: 0.99,
            borderColor: 'rgba(0, 0, 0, 0)', // Use a transparent equivalent (not "transparent")
          }}
          transition={{ duration: 0.3 }}
        >
          <MdOutlineClose size={40} />
        </motion.button>
      </motion.div>
      )
    </AnimatePresence>
  )
}

export default Modal
