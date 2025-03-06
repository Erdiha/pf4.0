'use client'

import React, { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Text } from '@react-three/drei'
import { delay } from 'framer-motion'

// Cube object with visible materials and text on each face
const CubeObject = ({ scrollYProgress }) => {
  const cubeRef = useRef()
  const [debugValue, setDebugValue] = useState(0)
  const [initialAnimationActive, setInitialAnimationActive] = useState(true)
  const initialAnimationRef = useRef({
    startTime: null,
    delay: 3000,
    duration: 3000, // Animation duration in milliseconds
    rotations: 1, // Number of full rotations
  })

  // Log scroll progress for debugging
  useEffect(() => {
    const interval = setInterval(() => {
      const progress = scrollYProgress?.get ? scrollYProgress.get() : 0
      setDebugValue(progress)
    }, 500)

    return () => clearInterval(interval)
  }, [scrollYProgress])

  // Initialize animation start time
  useEffect(() => {
    initialAnimationRef.current.startTime = Date.now()

    // Set a timeout to disable the initial animation after it completes
    const timer = setTimeout(() => {
      setInitialAnimationActive(false)
    }, initialAnimationRef.current.duration)

    return () => clearTimeout(timer)
  }, [])

  useFrame(() => {
    if (!cubeRef.current) return

    if (initialAnimationActive) {
      // Calculate animation progress (0 to 1)
      const currentTime = Date.now()
      const elapsed = currentTime - initialAnimationRef.current.startTime
      const progress = Math.min(
        elapsed / initialAnimationRef.current.duration,
        1,
      )

      // Apply rotation based on animation progress
      const rotationAmount =
        progress * Math.PI * 2 * initialAnimationRef.current.rotations
      cubeRef.current.rotation.y = rotationAmount

      // If animation is complete, disable it
      if (progress >= 1) {
        setInitialAnimationActive(false)
      }
    } else {
      // Once initial animation is complete, use scroll-based rotation
      const progress = scrollYProgress?.get ? scrollYProgress.get() : 0
      cubeRef.current.rotation.y = progress * Math.PI * 1.5
    }
  })

  // The order of materials in Three.js boxGeometry:
  // 0: right face (+X)
  // 1: left face (-X)
  // 2: top face (+Y)
  // 3: bottom face (-Y)
  // 4: front face (+Z)
  // 5: back face (-Z)

  return (
    <group ref={cubeRef}>
      {/* Main cube */}
      <mesh scale={[1, 1, 1]}>
        <boxGeometry args={[30, 10, 30]} />
        {/* Right face - Black */}
        <meshBasicMaterial attach="material-0" color="black" />
        {/* Left face - Black */}
        <meshBasicMaterial attach="material-1" color="black" />
        {/* Top face - Black */}
        <meshBasicMaterial attach="material-2" color="black" />
        {/* Bottom face - Black */}
        <meshBasicMaterial attach="material-3" color="black" />
        {/* Front face - White */}
        <meshBasicMaterial attach="material-4" color="white" />
        {/* Back face - Black */}
        <meshBasicMaterial attach="material-5" color="black" />
      </mesh>

      {/* Front face - Black text on white */}
      <Text
        position={[0, 0, 15.1]}
        fontSize={4}
        color="black"
        anchorX="center"
        anchorY="middle"
        renderOrder={1}
        depthTest={false}
      >
        Home
      </Text>

      {/* Back face - White text on black */}
      <Text
        position={[0, 0, -15.1]}
        fontSize={4}
        color="white"
        anchorX="center"
        anchorY="middle"
        rotation={[0, Math.PI, 0]}
        renderOrder={1}
        depthTest={false}
      >
        Projects
      </Text>

      {/* Right face - White text on black */}
      <Text
        position={[15.1, 0, 0]}
        fontSize={4}
        color="white"
        anchorX="center"
        anchorY="middle"
        rotation={[0, Math.PI / 2, 0]}
        renderOrder={1}
        depthTest={false}
      >
        Resume
      </Text>

      {/* Left face - White text on black */}
      <Text
        position={[-15.1, 0, 0]}
        fontSize={4}
        color="white"
        anchorX="center"
        anchorY="middle"
        rotation={[0, -Math.PI / 2, 0]}
        renderOrder={1}
        depthTest={false}
      >
        Experience
      </Text>
    </group>
  )
}

// Main NavCube component with proper sizing and controls
const NavCube = ({ scrollYProgress }) => {
  return (
    <Canvas camera={{ position: [0, 0, 30], fov: 50 }}>
      {/* Using full-brightness lighting to ensure colors display as intended */}
      <ambientLight intensity={1} />
      <CubeObject scrollYProgress={scrollYProgress} />
      {/* <OrbitControls enableZoom={false} enablePan={false} /> */}
    </Canvas>
  )
}

export default NavCube
