'use client'

import React, { useEffect, useState, useRef } from 'react'
import LandingPage from '../app/LandingPage/landing-page'
import BurgerMenu from '../components/Navigation'
import Experience from './Experience/experience-page'
import Scene from '../components/shapes/Scenes'
import Projects from './Projects/projects-page'
import ResumeViewer from '../components/Resume/resume'
import { easeInOut, motion, useScroll, useTransform } from 'framer-motion'
import { useMediaQuery } from 'react-responsive'
import NavCube from '../components/shapes/navCube'

export default function Home() {
  // ==================== STATE MANAGEMENT ====================
  // Client-side rendering state
  const [hasMounted, setHasMounted] = useState(false)

  // Section and UI states
  const [cubeFace, setCubeFace] = useState(0)
  const [activeSection, setActiveSection] = useState('')
  const [showNav, setShowNav] = useState(true)
  const [showResume, setShowResume] = useState(false)

  // Navigation and scroll states
  const [lastScrollY, setLastScrollY] = useState(0)
  const [isAutoScroll, setIsAutoScroll] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)

  // Modal states
  const [showModal, setShowModal] = useState(false)
  const [indx, setIndx] = useState({ initial: true, index: -1 })
  const [closeModal, setCloseModal] = useState(false)

  // ==================== REFS ====================
  const sectionRefs = useRef([])
  const mainRef = useRef(null)
  const resumeRef = useRef(null)

  // ==================== ANIMATIONS & SCROLL ====================
  const { scrollYProgress, scrollY } = useScroll()
  const triggerAnimation = useTransform(scrollYProgress, [0.9, 1], [0, 1])
  const animationOpacity = useTransform(scrollYProgress, [0.7, 1], [0, 1])
  const animationY = useTransform(scrollYProgress, [0.7, 1], [100, 0])
  const cubeScale = useTransform(scrollYProgress, [0, 1], [1, 2])

  // ==================== RESPONSIVE DESIGN ====================
  // Always call useMediaQuery hooks (regardless of mounted state)
  // to maintain consistent hook call order
  const isMobileQuery = useMediaQuery({ maxWidth: 757 })
  const isDesktopOrLaptopQuery = useMediaQuery({ minWidth: 1224 })
  const isBigScreenQuery = useMediaQuery({ minWidth: 1824 })
  const isTabletOrMobileQuery = useMediaQuery({ maxWidth: 1224 })
  const isPortraitQuery = useMediaQuery({ orientation: 'portrait' })
  const isRetinaQuery = useMediaQuery({ minResolution: '2dppx' })

  // Only use query results after mounting to prevent hydration mismatch
  const isMobile = hasMounted ? isMobileQuery : false
  const isDesktopOrLaptop = hasMounted ? isDesktopOrLaptopQuery : true
  const isBigScreen = hasMounted ? isBigScreenQuery : false
  const isTabletOrMobile = hasMounted ? isTabletOrMobileQuery : false
  const isPortrait = hasMounted ? isPortraitQuery : false
  const isRetina = hasMounted ? isRetinaQuery : false

  useEffect(() => {
    // Mark component as mounted
    setHasMounted(true)

    // Use a small delay to ensure DOM is fully ready before scrolling
    const timer = setTimeout(() => {
      if (typeof window !== 'undefined') {
        // Force scroll to top with both methods for maximum compatibility
        window.scrollTo(0, 0)

        // For iOS Safari and some mobile browsers that might ignore the first method
        document.documentElement.scrollTop = 0
        document.body.scrollTop = 0

        // Reset auto-scroll flag to prevent other effects from scrolling
        setIsAutoScroll(false)
      }
    }, 100)

    // Reset initial states
    setCubeFace(0)
    setShowModal(false)
    setIndx((prev) => ({ ...prev, index: -1 }))

    return () => clearTimeout(timer)
  }, [])

  // Update scroll progress state safely for use in JSX
  useEffect(() => {
    if (!hasMounted) return

    const unsubscribe = scrollYProgress.onChange((value) => {
      setScrollProgress(value)
    })

    return () => unsubscribe()
  }, [scrollYProgress, hasMounted])

  // ==================== INITIALIZATION ====================
  useEffect(() => {
    // Mark component as mounted
    setHasMounted(true)

    // Scroll to top on initial load
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0)
    }

    // Reset initial states
    setCubeFace(0)
    setShowModal(false)
    setIndx((prev) => ({ ...prev, index: -1 }))
  }, [])

  // ==================== VIEWPORT HANDLING ====================
  useEffect(() => {
    if (!hasMounted) return

    const setVh = () => {
      const vh = window.innerHeight * 0.01
      document.documentElement.style.setProperty('--vh', `${vh}px`)
    }

    setVh()

    window.addEventListener('resize', setVh)
    window.addEventListener('orientationchange', () => {
      setTimeout(setVh, 100)
    })

    return () => {
      window.removeEventListener('resize', setVh)
      window.removeEventListener('orientationchange', setVh)
    }
  }, [hasMounted])

  // ==================== IMPROVED SCROLL HANDLING ====================
  useEffect(() => {
    if (!hasMounted || !isMobile) return

    const handleMobileScroll = () => {
      // Calculate progress as a percentage of total scrollable area
      const scrollHeight = document.documentElement.scrollHeight
      const windowHeight = window.innerHeight
      const scrollableDistance = scrollHeight - windowHeight
      const currentScroll = window.scrollY
      const scrollPercentage =
        scrollableDistance > 0 ? currentScroll / scrollableDistance : 0

      // Check if near bottom for mobile
      if (scrollPercentage >= 0.99) {
        setCubeFace(3)
        setShowResume(true)
      }
    }

    // Call once to check initial position
    handleMobileScroll()

    // Add event listeners
    window.addEventListener('scroll', handleMobileScroll, { passive: true })
    window.addEventListener('touchmove', handleMobileScroll, { passive: true })
    window.addEventListener('touchend', handleMobileScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleMobileScroll)
      window.removeEventListener('touchmove', handleMobileScroll)
      window.removeEventListener('touchend', handleMobileScroll)
    }
  }, [hasMounted, isMobile])

  // Navigation visibility on scroll
  useEffect(() => {
    if (!hasMounted) return

    const handleScroll = () => {
      const currentScrollY = window.scrollY
      setShowNav(!(currentScrollY > lastScrollY && currentScrollY > 99))
      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [lastScrollY, hasMounted])

  // ==================== SECTION TRACKING ====================
  // Section tracking with proper mobile optimization
  // Replace the section tracking useEffect with this fine-tuned version
  useEffect(() => {
    if (!hasMounted) return

    if (isMobile) {
      // Mobile-specific approach with adjusted tolerance
      const calculateVisibleSections = () => {
        // Find which section has the most visibility in the viewport
        const viewportHeight = window.innerHeight
        const viewportCenter = viewportHeight / 2

        let bestSection = 0
        let smallestDistance = Infinity

        sectionRefs.current.forEach((section, index) => {
          if (!section) return

          const rect = section.getBoundingClientRect()
          // Adjust the calculation with a slight offset that compensates for the 5-10% visual offset
          // This offset value (0.05 * viewportHeight) creates a slight bias that matches the visual perception
          const sectionCenter =
            rect.top + rect.height / 2 - 0.05 * viewportHeight
          const distanceToCenter = Math.abs(sectionCenter - viewportCenter)

          if (distanceToCenter < smallestDistance) {
            smallestDistance = distanceToCenter
            bestSection = index
          }
        })

        // Use a lower threshold for triggering face changes
        // This makes the transition happen slightly earlier, compensating for visual lag
        if (
          bestSection !== cubeFace &&
          smallestDistance < viewportHeight * 0.4
        ) {
          setCubeFace(bestSection)
        }

        // Show resume only in section 3
        setShowResume(bestSection === 3)
      }

      // Run initially and on scroll events
      calculateVisibleSections()

      const handleScroll = () => {
        window.requestAnimationFrame(calculateVisibleSections)
      }

      window.addEventListener('scroll', handleScroll, { passive: true })

      return () => {
        window.removeEventListener('scroll', handleScroll)
      }
    } else {
      // Desktop approach using IntersectionObserver with improved thresholds
      const observerCallback = (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionIndex = sectionRefs.current.findIndex(
              (el) => el === entry.target,
            )

            if (sectionIndex !== cubeFace) {
              setCubeFace(sectionIndex)
            }

            // Show resume only in section 3
            setShowResume(sectionIndex === 3)
          }
        })
      }

      // More forgiving thresholds for smoother transitions
      const options = {
        root: null,
        rootMargin: '-40% 0% -40% 0%',
        threshold: 0.3,
      }

      const observer = new IntersectionObserver(observerCallback, options)

      sectionRefs.current.forEach((section) => {
        if (section) observer.observe(section)
      })

      return () => observer.disconnect()
    }
  }, [cubeFace, hasMounted, isMobile])

  // Update the auto-scroll function with improved behavior
  useEffect(() => {
    if (!isAutoScroll || !hasMounted) return

    const executeScroll = () => {
      if (sectionRefs.current[cubeFace]) {
        if (isMobile) {
          // Get target section element
          const section = sectionRefs.current[cubeFace]

          // Get positions
          const rect = section.getBoundingClientRect()
          const windowHeight = window.innerHeight

          // Calculate the position to center the section
          // Apply the same offset adjustment to maintain consistency
          const currentScrollY = window.scrollY
          const sectionCenter = rect.top + rect.height / 2
          const targetCenter = windowHeight / 2

          // Add a slight offset to account for the visual offset in the cube
          const offsetAdjustment = 0.05 * windowHeight // 5% of viewport height
          const adjustment = sectionCenter - targetCenter - offsetAdjustment

          // Scroll to position that centers the section with the offset
          window.scrollTo({
            top: currentScrollY + adjustment,
            behavior: 'smooth',
          })

          // Force the cube to update immediately
          setCubeFace(cubeFace)
        } else {
          // Desktop behavior (unchanged)
          sectionRefs.current[cubeFace].scrollIntoView({
            behavior: 'smooth',
            block: 'center',
          })
        }
      }

      setIsAutoScroll(false)
    }

    // Small delay to ensure DOM is ready
    setTimeout(executeScroll, 50)
  }, [isAutoScroll, cubeFace, hasMounted, isMobile])
  // ==================== MODAL MANAGEMENT ====================
  // Control modal visibility based on current section
  useEffect(() => {
    const shouldShowModal = cubeFace !== 0 && indx?.index >= 0
    setShowModal(shouldShowModal)

    if (!shouldShowModal && indx?.index !== -1) {
      setIndx({ index: -1, initial: false })
    }

    // Reset index when not on Experience section
    if (cubeFace !== 1 && indx?.index !== -1) {
      setIndx({ index: -1, initial: false })
    }
  }, [cubeFace, indx?.index])

  // Handle modal closing
  useEffect(() => {
    if (closeModal) {
      setIndx({ index: -1, initial: false })
      setCloseModal(false)
    }
  }, [closeModal])

  // ==================== RESUME VISIBILITY ====================
  useEffect(() => {
    if (!hasMounted) return

    // Show resume when on section 3 or near bottom of page
    const isNearBottom = scrollProgress >= 0.99
    setShowResume(cubeFace === 3 || isNearBottom)
  }, [cubeFace, scrollProgress, hasMounted])

  // ==================== COMPUTED VALUES ====================
  // Pre-compute z-index for cube to avoid direct method calls in JSX
  const cubeZIndex =
    indx.index > 0 || cubeFace === 1 || cubeFace === 3 || scrollProgress > 2.5
      ? 9999
      : 999999

  // ==================== RENDER ====================
  return (
    <main
      ref={mainRef}
      className="min-h-screen w-full flex justify-center items-center
      relative flex-col overflow-x-hidden smooth-scroll"
      style={{
        // Use CSS variable for reliable viewport height
        minHeight:
          hasMounted && isMobile ? 'calc(var(--vh, 1vh) * 100)' : '100vh',
      }}
    >
      {/* Mobile viewport height fix CSS */}
      {hasMounted && isMobile && (
        <style jsx global>{`
          :root {
            --vh: 1vh;
          }
          .full-mobile-height {
            height: calc(var(--vh, 1vh) * 100);
          }
          .section-container {
            min-height: calc(var(--vh, 1vh) * 100);
            height: calc(var(--vh, 1vh) * 100);
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .smooth-scroll {
            scroll-behavior: smooth;
          }
        `}</style>
      )}

      {/* Navbar */}
      <div className="fixed top-0 z-[99999999] flex w-full max-w-[100rem] h-16">
        <div
          className=" mt-10
       aspect-square w-full h-20  
     flex flex-col items-center justify-center"
        >
          {isMobile ? null : (
            <NavCube scrollYProgress={scrollYProgress} cubeFace={cubeFace} />
          )}
        </div>
        <BurgerMenu
          cubeFace={cubeFace}
          setCubeFace={setCubeFace}
          setIsAutoScroll={setIsAutoScroll}
          isMobile={isMobile}
          scrollToSection={scrollToSection}
        />
      </div>

      {/* 3D Cube */}
      <div
        style={{ zIndex: cubeZIndex }}
        className="fixed top-0 left-0 duration-300 ease-in-out transition-all"
      >
        <motion.div
          initial={{ opacity: 0, y: 300, scale: 1 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            duration: 1.2,
            ease: easeInOut,
            opacity: { duration: 0.9 },
            y: {
              type: 'tween',
              ease: 'anticipate',
              duration: 1,
            },
          }}
        >
          <Scene
            scrollYProgress={scrollYProgress}
            cubeFace={cubeFace}
            setCubeFace={setCubeFace}
            showModal={showModal}
            indx={indx}
            cubeScale={cubeScale}
            isMobile={isMobile}
          />
        </motion.div>
      </div>

      {/* Main Content Sections */}
      <div className="relative w-full md:w-[90%] mx-auto max-w-[100rem] h-full flex flex-col justify-center items-center">
        {/* Section 1: Home */}
        <div
          id="home"
          className={
            hasMounted && isMobile
              ? 'section-container w-full'
              : 'flex justify-center items-center h-[100vh] w-full'
          }
          ref={(el) => (sectionRefs.current[0] = el)}
        >
          <LandingPage />
        </div>

        {/* Section 2: Experience */}
        <div
          id="experince"
          className={
            hasMounted && isMobile
              ? 'section-container w-[100vw] z-[99999]'
              : 'w-[100vw] h-screen flex justify-center items-center z-[99999]'
          }
          ref={(el) => (sectionRefs.current[1] = el)}
        >
          <Experience
            cubeFace={cubeFace}
            scrollYProgress={scrollYProgress}
            showModal={showModal}
            indx={indx}
            setIndx={setIndx}
            setCloseModal={setCloseModal}
            closeModal={closeModal}
            isMobile={isMobile}
          />
        </div>

        {/* Section 3: Projects */}
        <div
          id="project"
          className={
            hasMounted && isMobile
              ? 'section-container w-full z-[999999]'
              : 'w-full h-screen flex justify-center items-center z-[999999]'
          }
          ref={(el) => (sectionRefs.current[2] = el)}
        >
          <Projects
            cubeFace={cubeFace}
            scrollYProgress={scrollYProgress}
            showModal={showModal}
            indx={indx}
            setIndx={setIndx}
            setCloseModal={setCloseModal}
            closeModal={closeModal}
            isMobile={isMobile}
          />
        </div>

        {/* Section 4: Resume */}
        <div
          id="resume"
          ref={(el) => {
            sectionRefs.current[3] = el
            resumeRef.current = el
          }}
          style={{
            zIndex: cubeFace === 3 ? 999999 : 0,
            minHeight:
              hasMounted && isMobile ? 'calc(var(--vh, 1vh) * 120)' : '100vh',
            paddingBottom: hasMounted && isMobile ? '150px' : '0',
          }}
          className={
            hasMounted && isMobile
              ? 'w-full flex justify-center items-center relative overflow-hidden'
              : 'w-full min-h-screen flex justify-center items-center relative overflow-hidden'
          }
        >
          {/* Only render ResumeViewer when appropriate conditions are met */}
          {hasMounted &&
            cubeFace === 3 &&
            showResume &&
            scrollProgress >= 0.9 && <ResumeViewer />}
        </div>
      </div>
    </main>
  )
}
