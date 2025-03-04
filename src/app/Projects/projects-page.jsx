import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import InfiniteCarousel from '@/components/Carousel/carousel';
import Card from '@/components/Card/card';

function Projects({ cubeFace }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(cubeFace === 2);
  }, [cubeFace]);

  const projectLinks = [
    'https://gand-c.vercel.app/home',
    'https://www.youtube.com/watch?v=U_5BrEn1fzg',
    'https://lift-budz.vercel.app/',
    'http://thoodies.com/',
    'https://myflix-eight.vercel.app/',
    'https://main--effortless-kangaroo-bb5cd4.netlify.app/',
    'https://main.d2en2iuoalsx7.amplifyapp.com/',
  ];
  const projectsCode = [
    'https://github.com/Erdiha/GlazedANDConfused',
    'https://github.com/Erdiha/LetterBee',
    'https://github.com/Erdiha/LiftBudz',
    'https://github.com/Erdiha/Thoodies',
    'https://github.com/Erdiha/myFLIX',
    'https://github.com/Erdiha/Camper',
    'https://github.com/Erdiha/Quiz-Game',
  ];
  const testimonials = useMemo(
    () =>
      [
        {
          description:
            'A testament to my freelance skills, a professional website project showcasing my full-stack development expertise in my portfolio.',
          name: 'Glazed & Confused',
          src: '/glazed&confused.jpg',
        },
        {
          description:
            'Exercise your vocabulary and analytical thinking skills with this striking Android app, published on the Google App Store.',
          name: 'LetterBee - An Android App',
          src: '/lb1.jpg',
        },
        {
          description:
            'A clever fitness social web app created using Tailwind, NextJS, React, TS, and Firebase.',
          name: 'LiftBudz',
          src: '/liftbudz.jpg',
        },
        {
          description:
            'Discover culinary delights on this pro recipe website built with NextJS, Tailwind, TypeScript, and Firebase.',
          name: 'Thoodies',
          src: '/food.jpg',
        },
        {
          description:
            'Immerse yourself in a cleverly designed Netflix mockup website powered by Tailwind, NextJS, React, TS, and Firebase.',
          name: 'MyFlix',
          src: '/movies.jpg',
        },
        {
          description:
            'Explore and bookmark US national parks effortlessly with this ingenious individualized park finder.',
          name: 'MyCamper',
          src: '/camping.jpg',
        },
        {
          description:
            'Engage in a fun and interactive side project, perfect for one or two players.',
          name: 'Quiz Game',
          src: '/trivia.jpg',
        },
      ].map((item, index) => ({
        ...item,
        links: [projectsCode[index], projectLinks[index]],
      })),
    []
  );

  return (
    <div className="w-[100%] h-[100%] flex  isolate  ring-10 ring-black/5 border-black flex-col relative">
      {/* Animated Card Section */}
      <motion.div
        initial={{ opacity: 0, y: '100px' }}
        animate={
          isVisible ? { opacity: 1, y: '0px' } : { opacity: 0, y: '-100px' }
        }
        transition={{
          type: 'spring',
          stiffness: 80, // Softer movement
          damping: 20, // More controlled stop
          mass: 1, // More weight for natural feel
          duration: 2.0, // Slower transition
          delay: 0.5,
          ease: 'easeInOut',
        }}
        className="w-full h-full flex relative overflow-hidden md:p-20 justify-center items-center"
      >
        <Card testimonials={testimonials} autoplay />
      </motion.div>

      {/* Carousel at the Bottom */}
      <div className="carousel w-full absolute h-fit bottom-0  justify-center flex items-center">
        <InfiniteCarousel direction={'left'} speed={35} />
      </div>
    </div>
  );
}

export default Projects;
