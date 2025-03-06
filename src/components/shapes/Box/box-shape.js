'use client'

import React, { useRef, useEffect, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import { a, useSpring } from '@react-spring/three'
import { VideoTexture, LinearFilter } from 'three'

const Cube = ({ scrollYProgress, setCubeFace, cubeFace, indx, isMobile }) => {
  const groupRef = useRef(null)
  const videoRef = useRef(null)
  const [videoTexture, setVideoTexture] = useState(null)
  const [hasScrolled, setHasScrolled] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const targetMousePosition = useRef({ x: 0, y: 0 })
  const lastFaceRef = useRef(cubeFace)
  const [isClient, setIsClient] = useState(false)

  // Constants
  const ROTATION_SENSITIVITY = 0.3
  const MOUSE_SMOOTHING = 0.1
  const FACE_TRANSITION_THRESHOLD = 0.05
  const VIDEO_LOAD_THRESHOLD = 0.5

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Video texture setup
  useEffect(() => {
    if (!isClient) return

    const shouldLoadVideo = scrollYProgress?.get
      ? scrollYProgress.get() > VIDEO_LOAD_THRESHOLD
      : false

    if (shouldLoadVideo && !videoRef.current) {
      const video = document.createElement('video')
      video.src = '/water.mp4'
      video.autoplay = true
      video.loop = true
      video.muted = true
      video.playsInline = true
      video.width = 256
      video.height = 256
      videoRef.current = video

      const texture = new VideoTexture(video)
      texture.minFilter = LinearFilter
      texture.magFilter = LinearFilter
      setVideoTexture(texture)

      const playVideo = () =>
        video.play().catch(() => setTimeout(playVideo, 1000))

      const handleVisibility = () =>
        document.visibilityState === 'visible' && playVideo()

      document.addEventListener('visibilitychange', handleVisibility)
      playVideo()
    }

    return () => {
      if (videoRef.current) {
        videoRef.current.pause()
        videoRef.current.removeAttribute('src')
        videoRef.current.load()
        document.removeEventListener('visibilitychange', null)
      }
      if (videoTexture) {
        videoTexture.dispose()
      }
    }
  }, [isClient, scrollYProgress])

  // Mouse and scroll tracking
  useEffect(() => {
    if (!isClient) return

    const handleScroll = () => {
      setHasScrolled(true)
    }

    const handleMouseMove = (e) => {
      if (hasScrolled) return
      targetMousePosition.current = {
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: -(e.clientY / window.innerHeight - 0.5) * 2,
      }
    }

    window.addEventListener('scroll', handleScroll)
    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [hasScrolled, isClient])

  // Animation and face detection
  useFrame(() => {
    if (!groupRef.current || !isClient) return

    const scrollProgress = scrollYProgress?.get ? scrollYProgress.get() : 0
    const rotX = scrollProgress * Math.PI * 1.5

    if (!hasScrolled) {
      setMousePosition((prev) => ({
        x: prev.x + (targetMousePosition.current.x - prev.x) * MOUSE_SMOOTHING,
        y: prev.y + (targetMousePosition.current.y - prev.y) * MOUSE_SMOOTHING,
      }))
    }

    const rotY = hasScrolled ? 0 : mousePosition.x * ROTATION_SENSITIVITY
    const rotZ = hasScrolled ? 0 : mousePosition.y * ROTATION_SENSITIVITY

    groupRef.current.rotation.set(rotX, rotY, rotZ)

    const newFace = Math.round((rotX / (Math.PI * 0.5)) % 4)

    if (newFace !== cubeFace && newFace !== lastFaceRef.current) {
      const faceProgress = (rotX / (Math.PI * 0.5)) % 4
      const distFromExact = Math.abs(faceProgress - newFace)

      if (distFromExact < FACE_TRANSITION_THRESHOLD) {
        setCubeFace(newFace)
        lastFaceRef.current = newFace
      }
    }
  })

  // Animation springs
  const fadeIn = useSpring({
    opacity: 1,
    from: { opacity: 0 },
    config: { duration: 800 },
  })

  const size = useSpring({
    scale: isMobile
      ? [2, 2, 2]
      : cubeFace === 0
      ? [2, 2, 2]
      : cubeFace === 1
      ? [2.5, 2.5, 2.5]
      : cubeFace === 2
      ? [3.5, 3.5, 3.5]
      : [4, 4, 4],
    config: { mass: 2, tension: 170, friction: 26, clamp: false },
  })

  // Face content
  const getFaceContent = (face) => {
    switch (face) {
      case 0: // Front face - Introduction
        return (
          <>
            <Text
              billboard
              position={[0, 0.05, 0.1]}
              fontSize={0.2}
              color="white"
            >
              Hi, I am Erdi.
            </Text>
            <Text
              billboard
              position={[-0.1, -0.2, 0.1]}
              fontSize={0.1}
              color="white"
            >
              A Software Engineer.
            </Text>
          </>
        )
      case 1: // Top face - Experience
        return (
          <Text position={[0, 0, 0.35]} fontSize={0.25} color="black">
            Experience
          </Text>
        )
      case 2: // Back face - Projects
        return (
          <Text
            position={isMobile ? [0, 1.75, 0.8] : [-1.5, 1.5, 0.8]}
            fontSize={0.3}
            color={isMobile ? 'white' : 'black'}
          >
            Projects
          </Text>
        )
      case 3: // Bottom face - Resume
        return (
          <Text
            position={isMobile ? [0, 1.75, 1.6] : [0, 1.8, 1.03]}
            fontSize={isMobile ? 0.2 : 0.25}
            color={isMobile ? 'white' : 'black'}
            anchorX="center"
          >
            Resume
          </Text>
        )
      default:
        return null
    }
  }
  const cubeColor = isMobile ? '#FFF5E4' : '#FF0000'

  return (
    <a.group ref={groupRef} style={{ opacity: fadeIn.opacity }}>
      {/* Main cube */}
      <a.mesh scale={size.scale}>
        <boxGeometry args={[1, 1, 1]} />
        {[...Array(6)].map((_, i) => (
          <meshBasicMaterial
            key={i}
            attach={`material-${i}`}
            color={cubeColor}
          />
        ))}
      </a.mesh>

      {/* Front face */}
      <a.group position={[0, 0, 1.01]}>
        <mesh position={[0, 0, 0.001]}>
          <planeGeometry args={[2, 2]} />
          <meshBasicMaterial color="#FF0000" />
        </mesh>
        {cubeFace === 0 && getFaceContent(0)}
      </a.group>

      {/* Top face */}
      <mesh position={[0, 1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2, 2]} />
        <meshBasicMaterial color={cubeColor} />
        {/* {cubeFace === 1 && getFaceContent(1)} */}
      </mesh>

      {/* Back face */}
      <mesh position={[0, 0, -1]} rotation={[Math.PI, 0, 0]}>
        <planeGeometry args={[2, 2]} />
        <meshBasicMaterial color={cubeColor} />
        {/* {cubeFace === 2 && getFaceContent(2)} */}
      </mesh>

      {/* Bottom face */}
      <mesh position={[0, -1, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2, 2]} />
        <meshBasicMaterial color={cubeColor} />
        {/* {cubeFace === 3 && getFaceContent(3)} */}
      </mesh>
    </a.group>
  )
}

export default Cube
