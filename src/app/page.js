'use client';

import React, { useEffect, useState, useRef } from 'react';
import LandingPage from '@/app/LandingPage/landing-page';
import BurgerMenu from '@/components/Navigation';
import Experience from './Experience/experience-page';
import Scene from '@/components/shapes/Scenes';
import Projects from './Projects/projects-page';
import Contact from './Contact/Contact';
import Modal from '../components/Modals/Info-Modal/info-modal';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function Home() {
  const [showNav, setShowNav] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { scrollYProgress, scrollY } = useScroll(); // Keep scrollYProgress for cube rotation
  const backgroundY = useTransform(scrollY, [0, 500], ['0%', '-10%']); // Parallax effect

  const [cubeFace, setCubeFace] = useState(0);
  const [activeSection, setActiveSection] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [indx, setIndx] = useState({ initial: true, index: null });
  const [closeModal, setCloseModal] = useState(false);

  useEffect(() => {
    if (closeModal) {
      setShowModal(false);
      setIndx({ index: null, initial: false });
      setCloseModal(!closeModal);
    } else if (cubeFace !== 1) {
      setIndx({ index: null, initial: false });
      setShowModal(false);
    }
  }, [closeModal, cubeFace]);

  const sectionRefs = useRef([]);
  useEffect(() => {
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 50);

    setCubeFace(0);
    setShowModal(false);
    setIndx((prev) => ({ ...prev, index: null }));
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setShowNav(!(currentScrollY > lastScrollY && currentScrollY > 99));
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionIndex = sectionRefs.current.findIndex(
            (el) => el === entry.target
          );
          if (sectionIndex !== null && sectionIndex !== cubeFace) {
            setCubeFace(sectionIndex);
            setIndx((indx) => (indx.index = null));
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

  console.log('cube face:', cubeFace);

  return (
    <main className="min-h-screen w-full flex justify-center items-center relative flex-col overflow-hidden bg-transparent">
      {/* Parallax Background */}/{/* Navbar */}
      <div className="fixed top-0 z-[99999999] w-full h-20">
        <BurgerMenu />
      </div>
      {/* Cube controlled by scroll progress (Restored) */}
      <div
        style={{
          zIndex:
            (showModal && cubeFace === 1) || setCubeFace === 2 ? 0 : 999999,
        }}
        className="fixed top-1/4 left-1/4  duration-300 ease-in-out transition-all"
      >
        <Scene
          scrollYProgress={scrollYProgress} // Cube rotation logic restored
          cubeFace={cubeFace}
          setCubeFace={setCubeFace}
          showModal={showModal}
          indx={indx}
        />
      </div>
      {/* Content Sections */}
      <div
        style={{
          zIndex: (showModal && cubeFace === 1) || cubeFace === 2 ? 999999 : 0,
        }}
        className="min-h-full h-[400vh] w-full flex justify-center items-center z-10 flex-col"
      >
        <div
          className="w-full h-full flex justify-center items-center"
          ref={(el) => (sectionRefs.current[0] = el)}
        >
          <LandingPage />
        </div>
        <div
          style={{ zIndex: 99999 }}
          className="w-full h-full flex justify-center items-center"
          ref={(el) => (sectionRefs.current[1] = el)}
        >
          <Experience
            cubeFace={cubeFace}
            scrollYProgress={scrollYProgress} // Ensuring cube rotation still works
            showModal={showModal}
            indx={indx}
            setIndx={setIndx}
            setCloseModal={setCloseModal}
            closeModal={closeModal}
          />
        </div>

        <div
          style={{ zIndex: cubeFace === 2 ? 999999 : 10 }}
          className="w-full h-full flex justify-center items-center "
          ref={(el) => (sectionRefs.current[2] = el)}
        >
          <Projects
            cubeFace={cubeFace}
            scrollYProgress={scrollYProgress} // Keeping the cube rotation intact
            showModal={showModal}
            indx={indx}
            setIndx={setIndx}
            setCloseModal={setCloseModal}
            closeModal={closeModal}
          />
        </div>
        <div
          className="w-full h-full flex justify-center items-center"
          ref={(el) => (sectionRefs.current[3] = el)}
        >
          <Contact />
        </div>
      </div>
    </main>
  );
}
