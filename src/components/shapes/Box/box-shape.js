'use client'

import React, { useRef, useEffect, useState, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import { a, useSpring, config } from '@react-spring/three'
import { VideoTexture, LinearFilter, MathUtils } from 'three'

const Cube = ({ scrollYProgress, setCubeFace, cubeFace, indx, isMobile }) => {
  const groupRef = useRef(null)
  const videoRef = useRef(null)
  const [videoTexture, setVideoTexture] = useState(null)
  const [hasScrolled, setHasScrolled] = useState(false)
  const mousePosition = useRef({ x: 0, y: 0 })
  const targetMousePosition = useRef({ x: 0, y: 0 })
  const lastFaceRef = useRef(cubeFace)
  const [isClient, setIsClient] = useState(false)
  const scrollRef = useRef(0)
  const lerpFactorRef = useRef(0.1) // Default lerp factor

  // Constants - fine-tuned for smoother motion
  const ROTATION_SENSITIVITY = 0.25 // Reduced for smoother mouse response
  const MOUSE_SMOOTHING = 0.07 // Increased for smoother mouse transitions
  const FACE_TRANSITION_THRESHOLD = 0.08 // Increased for more reliable face transitions
  const VIDEO_LOAD_THRESHOLD = 0.5
  const SCROLL_LERP_DEFAULT = 0.05 // For smooth scrolling
  const SCROLL_LERP_FAST = 0.15 // For faster transitions when needed

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Video texture setup with optimized loading
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
      // Preload metadata for faster playback
      video.preload = 'auto'
      videoRef.current = video

      const texture = new VideoTexture(video)
      texture.minFilter = LinearFilter
      texture.magFilter = LinearFilter
      setVideoTexture(texture)

      // Improved video playback handling
      const playVideo = () => {
        video.play().catch((err) => {
          console.warn('Video playback delayed:', err)
          setTimeout(playVideo, 300) // Retry faster
        })
      }

      const handleVisibility = () => {
        if (document.visibilityState === 'visible') {
          playVideo()
        } else {
          video.pause() // Pause when not visible to save resources
        }
      }

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

  // Optimized mouse and scroll tracking with passive listeners
  useEffect(() => {
    if (!isClient) return

    let scrollTimeout

    const handleScroll = () => {
      if (!hasScrolled) {
        setHasScrolled(true)
      }

      // Reset lerp factor to be faster during active scrolling
      lerpFactorRef.current = SCROLL_LERP_FAST

      // Then gradually return to smooth factor after scrolling stops
      clearTimeout(scrollTimeout)
      scrollTimeout = setTimeout(() => {
        lerpFactorRef.current = SCROLL_LERP_DEFAULT
      }, 100)
    }

    const handleMouseMove = (e) => {
      if (hasScrolled) return

      // Calculate normalized mouse position
      targetMousePosition.current = {
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: -(e.clientY / window.innerHeight - 0.5) * 2,
      }
    }

    // Use passive listeners for better performance
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('mousemove', handleMouseMove, { passive: true })

    return () => {
      clearTimeout(scrollTimeout)
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [hasScrolled, isClient])

  // Optimized animation frame with improved lerping
  useFrame(() => {
    if (!groupRef.current || !isClient) return

    // Get the current scroll progress
    const currentScrollProgress = scrollYProgress?.get
      ? scrollYProgress.get()
      : 0

    // Apply lerping to scroll for smoother transitions
    scrollRef.current = MathUtils.lerp(
      scrollRef.current,
      currentScrollProgress,
      lerpFactorRef.current,
    )

    // Calculate rotation based on smoothed scroll value
    const rotX = scrollRef.current * Math.PI * 1.5

    // Handle mouse movement with improved lerping when not scrolled
    if (!hasScrolled) {
      mousePosition.current = {
        x: MathUtils.lerp(
          mousePosition.current.x,
          targetMousePosition.current.x,
          MOUSE_SMOOTHING,
        ),
        y: MathUtils.lerp(
          mousePosition.current.y,
          targetMousePosition.current.y,
          MOUSE_SMOOTHING,
        ),
      }
    }

    // Apply rotations with smoothed values
    const rotY = hasScrolled
      ? 0
      : mousePosition.current.x * ROTATION_SENSITIVITY
    const rotZ = hasScrolled
      ? 0
      : mousePosition.current.y * ROTATION_SENSITIVITY

    // Apply smoothed rotations to the cube
    groupRef.current.rotation.set(rotX, rotY, rotZ)

    // Smoothed face detection logic
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

  // Improved animation springs with better configs
  const fadeIn = useSpring({
    opacity: 1,
    from: { opacity: 0 },
    config: { tension: 280, friction: 60, duration: 800 },
  })

  // Memoize the size configuration to prevent unnecessary updates
  const sizeConfig = useMemo(() => {
    return {
      scale: isMobile
        ? [2, 2, 2]
        : cubeFace === 0
        ? [2, 2, 2]
        : cubeFace === 1
        ? [2.5, 2.5, 2.5]
        : cubeFace === 2
        ? [3.5, 3.5, 3.5]
        : [4, 4, 4],
      // Gentler spring physics for smoother transitions
      config: {
        mass: 2.5,
        tension: 150,
        friction: 30,
        clamp: false,
        // Add some bounce for a more natural feel
        precision: 0.001,
      },
    }
  }, [cubeFace, isMobile])

  const size = useSpring(sizeConfig)

  // Face content
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
              A software engineer.
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
            Skills
          </Text>
        )
      default:
        return null
    }
  }

  const cubeColor = isMobile ? '#FFF5E4' : '#FF0000'

  // Memoize faces to prevent unnecessary re-renders
  const faces = useMemo(() => {
    return [
      // Front face
      <a.group key="front" position={[0, 0, 1.01]}>
        <mesh position={[0, 0, 0.001]}>
          <planeGeometry args={[2, 2]} />
          <meshBasicMaterial color="#FF0000" />
        </mesh>
        {cubeFace === 0 && getFaceContent(0)}
      </a.group>,

      // Top face
      <mesh key="top" position={[0, 1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2, 2]} />
        <meshBasicMaterial color={cubeColor} />
        {/* {cubeFace === 1 && getFaceContent(1)} */}
      </mesh>,

      // Back face
      <mesh key="back" position={[0, 0, -1]} rotation={[Math.PI, 0, 0]}>
        <planeGeometry args={[2, 2]} />
        <meshBasicMaterial color={cubeColor} />
        {/* {cubeFace === 2 && getFaceContent(2)} */}
      </mesh>,

      // Bottom face
      <mesh key="bottom" position={[0, -1, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2, 2]} />
        <meshBasicMaterial color={cubeColor} />
        {/* {cubeFace === 3 && getFaceContent(3)} */}
      </mesh>,
    ]
  }, [cubeFace, getFaceContent, cubeColor])

  return (
    <a.group ref={groupRef} style={{ opacity: fadeIn.opacity }}>
      {/* Main cube with animated scale */}
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

      {/* Memoized faces */}
      {faces}
    </a.group>
  )
}

export default Cube
