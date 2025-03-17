import React, { useEffect, useRef } from 'react'

const FloatingDots = ({
  numDots,
  connectionDistance,
  focusRadius,
  containerRef = null,
}) => {
  const canvasRef = useRef(null)
  const dotsRef = useRef([])
  const mouseRef = useRef({ x: 0, y: 0 })
  const animationFrameRef = useRef(null)

  // Setup and animation for dots
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')

    // Initialize dots
    dotsRef.current = Array.from({ length: numDots }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      speedX: (Math.random() - 0.5) * 1,
      speedY: (Math.random() - 0.5) * 1,
      size: Math.random() * 2 + 2, // Size between 2-4px
    }))

    // Set canvas size to match window
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Mouse movement tracker that doesn't trigger React renders
    const handleMouseMove = (event) => {
      // Get mouse position relative to the page
      const x = event.clientX
      const y = event.clientY

      // Store the position
      mouseRef.current = { x, y }
    }

    window.addEventListener('mousemove', handleMouseMove)

    // Calculate opacity based on distance from mouse
    const getOpacityBasedOnDistance = (x, y) => {
      const dx = x - mouseRef.current.x
      const dy = y - mouseRef.current.y
      const distance = Math.sqrt(dx * dx + dy * dy)

      if (distance <= focusRadius) {
        // Calculate a smooth transition from the edge to the center
        const normalizedDistance = distance / focusRadius
        const opacity = 0.1 + (1 - normalizedDistance) * 0.9 // Transition from 0.3 to 1.0
        return Math.min(opacity, 1) // Cap at 1.0
      }

      return 0.1 // Default opacity
    }

    // Animation function for dots and connections
    const animate = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const dots = dotsRef.current

      // Move dots
      for (let i = 0; i < dots.length; i++) {
        const dot = dots[i]

        // Update position
        dot.x += dot.speedX
        dot.y += dot.speedY

        // Bounce off edges
        if (dot.x <= 0 || dot.x >= canvas.width) {
          dot.speedX = -dot.speedX
          dot.x += dot.speedX
        }
        if (dot.y <= 0 || dot.y >= canvas.height) {
          dot.speedY = -dot.speedY
          dot.y += dot.speedY
        }
      }

      // Draw connections between regular dots
      ctx.lineWidth = 1
      for (let i = 0; i < dots.length; i++) {
        const dot1 = dots[i]

        // Check connections with other regular dots
        for (let j = 0; j < dots.length; j++) {
          if (i === j) continue

          const dot2 = dots[j]

          const dx = dot1.x - dot2.x
          const dy = dot1.y - dot2.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < connectionDistance) {
            // Get average position of the line for opacity calculation
            const avgX = (dot1.x + dot2.x) / 2
            const avgY = (dot1.y + dot2.y) / 2

            // Calculate opacity based on mouse distance
            const baseOpacity = getOpacityBasedOnDistance(avgX, avgY)
            const lineOpacity =
              baseOpacity * (1 - distance / connectionDistance)

            ctx.beginPath()
            ctx.moveTo(dot1.x, dot1.y)
            ctx.lineTo(dot2.x, dot2.y)
            ctx.strokeStyle =
              i % 2 === 0 || j % 2 === 0
                ? `rgb(239, 239, 239, ${lineOpacity})`
                : `rgba(255, 255, 255, ${lineOpacity})`
            ctx.stroke()
          }
        }

        // Check connection between this dot and the mouse cursor dot
        const dx = dot1.x - mouseRef.current.x
        const dy = dot1.y - mouseRef.current.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < connectionDistance) {
          // Get average position of the line for opacity calculation
          const avgX = (dot1.x + mouseRef.current.x) / 2
          const avgY = (dot1.y + mouseRef.current.y) / 2

          // Calculate opacity based on mouse distance
          const baseOpacity = getOpacityBasedOnDistance(avgX, avgY)
          const lineOpacity = baseOpacity * (1 - distance / connectionDistance)

          ctx.beginPath()
          ctx.moveTo(dot1.x, dot1.y)
          ctx.lineTo(mouseRef.current.x, mouseRef.current.y)
          ctx.strokeStyle =
            i % 2 === 0
              ? `rgb(235, 91, 0, ${lineOpacity})`
              : `rgba(255, 255, 255, ${lineOpacity})`
          ctx.stroke()
        }
      }

      // Draw regular dots with varying opacity
      for (let i = 0; i < dots.length; i++) {
        const dot = dots[i]

        // Calculate dot opacity based on mouse distance
        const dotOpacity = getOpacityBasedOnDistance(dot.x, dot.y)

        ctx.beginPath()
        ctx.arc(dot.x, dot.y, dot.size, 0, Math.PI * 2)
        ctx.fillStyle =
          i % 2 === 0
            ? `rgb(235, 91,0,${dotOpacity})`
            : `rgba(255, 255, 255, ${dotOpacity})`
        ctx.fill()
      }

      // Draw mouse cursor dot (always fully opaque)
      ctx.beginPath()
      ctx.arc(mouseRef.current.x, mouseRef.current.y, 6, 0, Math.PI * 2)
      ctx.fillStyle = 'rgb(235, 91, 0)'
      ctx.fill()

      // Continue animation loop
      animationFrameRef.current = requestAnimationFrame(animate)
    }

    // Start animation
    animate()

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas)
      window.removeEventListener('mousemove', handleMouseMove)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [numDots, connectionDistance, focusRadius, containerRef])

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-screen z-0 pointer-events-none"
      style={{ background: 'transparent' }}
    />
  )
}

// For integration with your Next.js app
const LandingPageDots = () => {
  const containerRef = useRef(null)

  return (
    <div ref={containerRef} className="w-full h-screen bg-black">
      <FloatingDots
        numDots={250}
        connectionDistance={150}
        focusRadius={200}
        containerRef={containerRef}
      />
    </div>
  )
}

export { FloatingDots }
export default LandingPageDots
