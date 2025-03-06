'use client'

import React from 'react'
import { a, useSpring } from '@react-spring/three'
import { Canvas } from '@react-three/fiber'
import Cube from './Box/box-shape' // Import Cube component
import Modal from '../Modals/Info-Modal/info-modal'
import { workHistory } from '@/app/utils/data'
import { isMac } from '@react-pdf-viewer/core'
import * as THREE from 'three'

const Scene = ({
  scrollYProgress,
  cubeFace,
  setCubeFace,
  showModal,
  indx,
  cubeScale,
  isMobile,
}) => {
  // Animate cube visibility when modal is active
  const cubeAnimation = useSpring({
    opacity: showModal ? 0 : 1, // Fade out when modal opens
    scale: showModal ? 0.5 : 1, // Shrink when modal opens
    config: { tension: 200, friction: 20 },
  })

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        position: 'fixed',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        pointerEvents: showModal ? 'none' : 'auto', // Prevent interactions when hidden
        transition: 'opacity 0.3s ease-in-out',
        backgroundColor: 'transparent',
      }}
    >
      {/* Use a proper toneMapping value instead of null */}
      <Canvas
        gl={{
          toneMapping: THREE.NoToneMapping, // Fixed tone mapping
          antialias: true,
          alpha: true,
        }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[2, 2, 2]} intensity={0.0} />
        {/* Animate Cube's visibility */}
        <a.group
          style={{
            opacity: showModal ? cubeAnimation.opacity : 0,
            scale: cubeAnimation.scale,
          }}
        >
          <Cube
            scrollYProgress={scrollYProgress}
            cubeFace={cubeFace}
            setCubeFace={setCubeFace}
            cubeScale={cubeScale}
            indx={indx}
            isMobile={isMobile}
          />
        </a.group>
      </Canvas>
    </div>
  )
}

export default Scene
