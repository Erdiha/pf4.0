'use client';

import { MdKeyboardArrowDown } from 'react-icons/md';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function LandingPage() {
  const nums = 1;
  const [colors, setColors] = useState([]);

  useEffect(() => {
    setColors(
      Array.from(
        { length: nums },
        () => `hsl(${Math.random() * 360}, 100%, 50%)`
      )
    );
  }, []);

  return (
    <div className="w-full h-[100vh] flex items-center justify-center bg-transparent relative">
      {/* Animated container with rotating shadow effect */}
      <motion.div
        className="w-1/2 aspect-square rounded-full flex bg-black flex-col items-center justify-center relative shadow-2xl"
        animate={{
          boxShadow: [
            '0px 0px 25px 14px rgba(255, 255, 255, 0.3)',
            '25px 0px 20px 16px rgba(255, 200, 255, 0.5)',
            '0px 25px 25px 8px rgba(200, 255, 255, 0.7)',
            '-25px 0px 30px 20px rgba(255, 255, 200, 0.9)',
            '0px -25px 20px 18px rgba(255, 180, 200, 0.7)',
            '25px 20px 25px 16px rgba(200, 200, 255, 0.5)',
            '0px 0px 25px 14px rgba(255, 255, 255, 0.3)',
          ],
        }}
        transition={{
          duration: 5,
          repeat: 0,
          ease: 'easeInOut',
        }}
      >
        {/* {colors.length > 0 &&
          colors.map((color, i) => (
            <motion.span
              key={i}
              className="absolute  rounded-full "
              style={{
                width: `calc(100% - ${i * 10}%)`,
                aspectRatio: 1,
                borderRadius: '100%',
                backgroundColor: 'red',
              }}
              initial={{
                scale: 5,
                border: '0px  transparent  solid',
                boxShadow: 'inset 0px 0px 0px px transparent',
                rotateX: i % 2 === 0 ? 0 : -180,
                rotateY: i % 2 !== 0 ? 0 : 180,
              }}
              animate={{
                scale: [5, 0.0],
                rotateX: [0, 180],
                rotateY: [0, 180],
                boxShadow: 'inset 0px 0px 20px 5px black',
                rotateZ: i % 2 === 0 ? 180 : -360,
              }}
              transition={{
                duration: 3,
                delay: i * 0.09,
                ease: 'easeInOut',
                repeat: 0,
              }}
            ></motion.span>
          ))} */}
      </motion.div>

      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex items-center justify-center">
        <MdKeyboardArrowDown
          color="red"
          size="40px"
          className="cursor-pointer animate-bounce text-black"
          title="SCROLL"
        />
      </div>
    </div>
  );
}
