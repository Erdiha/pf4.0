'use client';

import { motion } from 'framer-motion';

const draw = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: (i) => {
    const delay = i * 0.5;
    return {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { delay, type: 'spring', duration: 1.5, bounce: 0 },
        opacity: { delay, duration: 0.01 },
      },
    };
  },
};

export default function PathDrawing() {
  return (
    <div className="w-full h-full flex  justify-center items-center">
      <motion.svg
        width="100%"
        height="100%"
        viewBox="-50 -50 600 600"
        initial="hidden"
        animate="visible"
        style={{
          width: screen,
          height: screen,
          display: 'fex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <motion.circle
          className="circle-path"
          cx="100"
          cy="100"
          r="80"
          stroke="#ff0088"
          variants={draw}
          custom={1}
          style={shape}
        />
        \
      </motion.svg>
    </div>
  );
}

const shape = {
  strokeWidth: 10,
  strokeLinecap: 'round',
  fill: 'transparent',
};
