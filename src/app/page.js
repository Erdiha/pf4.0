'use client';

import React, { useEffect, useState, useRef } from 'react';
import LandingPage from '@/app/LandingPage/landing-page';
import BurgerMenu from '@/components/Navigation';
import Experience from './Experience/experience-page';
import Scene from '@/components/shapes/Scenes';
import Projects from './Projects/projects-page';
import Contact from './Contact/Contact';
import Modal from '../components/Modals/Info-Modal/info-modal';
import { easeInOut, motion, useScroll, useTransform } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Line, Box } from '@react-three/drei';
import { a, useSpring } from '@react-spring/three';
import ParachuteScene from '@/components/shapes/Parachute/parachute';
import ResumeViewer from '@/components/Resume/resume';
import { useMediaQuery } from 'react-responsive'


export default function Home() {
  const [showNav, setShowNav] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { scrollYProgress, scrollY } = useScroll();
  const triggerAnimation = useTransform(scrollYProgress, [0.9, 1], [0, 1]);
  const [cubeFace, setCubeFace] = useState(0);
  const [activeSection, setActiveSection] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [indx, setIndx] = useState({ initial: true, index: -1 });
  const [closeModal, setCloseModal] = useState(false);
  const animationOpacity = useTransform(scrollYProgress, [0.7, 1], [0, 1]);
  const animationY = useTransform(scrollYProgress, [0.7, 1], [100, 0]);
  const cubeScale = useTransform(scrollYProgress, [0, 1], [1, 2]); // Scale


  const isDesktopOrLaptop = useMediaQuery({ minWidth: 1224 })
  const isBigScreen = useMediaQuery({ minWidth: 1824 })
  const isTabletOrMobile = useMediaQuery({ maxWidth: 1224 })
  const isPortrait = useMediaQuery({ orientation: 'portrait' })
  const isRetina = useMediaQuery({ minResolution: '2dppx' })
  const isMobile = useMediaQuery({maxWidth:757})


  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (closeModal) {
      setIndx({ index: -1, initial: false });
      setCloseModal(() => !closeModal);
    }
  }, [closeModal]);

  const sectionRefs = useRef([]);
  useEffect(() => {
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 50);

    setCubeFace(0);
    setShowModal(false);
    setIndx((prev) => ({ ...prev, index: -1 }));
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setShowNav(!(currentScrollY > lastScrollY && currentScrollY > 99));
      setLastScrollY(currentScrollY);
    };
  
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);
  
  // useEffect(()=>{
  //   if(indx.index===1){

  //   }

  // },[indx,cubeFace])


  useEffect(() => {
    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionIndex = sectionRefs.current.findIndex(
            (el) => el === entry.target
          );
          if (sectionIndex !== null && sectionIndex !== cubeFace) {
            setCubeFace(sectionIndex);
            setIndx((indx) => (indx.index = -1));
          }
        }
      });
    };

    if (cubeFace !== 0 && indx?.index >= 0) {
      setShowModal(true);
    } else {
      setShowModal(false);
      setIndx((prev) =>
        prev.index !== -1 ? { index: -1, initial: false } : prev
      );
    }
    if(cubeFace!==1){
      setIndx((prev) =>
        prev.index !== -1 ? { index: -1, initial: false } : prev
      )
    }

    const observer = new IntersectionObserver(observerCallback, {
      root: null,
      rootMargin: '-100% 0% -100% 0%',
      threshold: 1.0,
    });

    sectionRefs.current.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, [cubeFace, showModal, indx]);



  console.log('scrolllll', scrollYProgress.get(), lastScrollY);
  return (
    <main className="min-h-screen  w-full flex justify-center items-center
     relative flex-col overflow-hidden ">
      {/* Navbar */}
      <div className="fixed top-0 
      z-[99999999] flex  w-full 
      max-w-[100rem] h-16 
     ">
        <BurgerMenu />
      </div>
      {/* Cube controlled by scroll progress */}

      <div
      style={{
        zIndex:
          indx.index > 0 ||
          cubeFace === 1 ||
          cubeFace === 3 ||
          scrollYProgress.get() > 2.5
            ? 9999
            : 999999,
      }}
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
            type: "tween",
            ease: "anticipate",
            duration: 1
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
      <div
       
        className="relative  w-full  md:w-[90%] mx-auto  max-w-[100rem]   h-full flex flex-col justify-center items-center"
      >
        <div
          className=" flex justify-center items-center h-[100vh] w-full"
          ref={(el) => (sectionRefs.current[0] = el)}
        >
          <LandingPage />
        </div>
        <div
          className="w-[100vw] h-screen flex justify-center items-center
           z-[99999]  "
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
        <div
          className="w-full h-screen flex justify-center items-center z-[999999]"
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
          />
        </div>
        <div
          style={{
            zIndex: cubeFace === 3 ? 999999 : 0,
          }}
          className="w-full h-screen flex justify-center items-center relative overflow-hidden"
          ref={(el) => (sectionRefs.current[3] = el)}
        >
          {scrollYProgress.get() >= 0.99 && (
            <div className="w-full h-full max-w-full max-h-full flex justify-center items-center overflow-hidden">
              <ResumeViewer />
            </div>
          )}
        </div>
      </div>
      {/* Animation triggered at end of scroll */}
    </main>
  );
}
