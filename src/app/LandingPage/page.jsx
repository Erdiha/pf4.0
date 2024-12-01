'use client';

import React, { useState } from 'react';
import Flag from 'react-flagkit';
import Square from '@/components/shapes/Box';
import Router from 'next/router';
import Link from 'next/link';

export default function Page() {
  const [country, setCountry] = useState('US');
  const [faceClick, setFaceClick] = useState({ face: null });
  const [isHovered, setIsHovered] = useState(false);
  const handleMouseEnter = () => {
    setIsHovered(true);
  };
  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleFlagChange = (newCountry) => {
    setCountry(newCountry);
  };

  return (
    <div className="w-screen h-screen flex flex-col relative bg-transparent  items-center overflow-hidden 2xl:w-[70%] max-w-[100rem]">
      {/* Country Selection */}
      <div className="absolute top-5 right-5 flex space-x-1 z-50">
        {['US', 'TR'].map((code) => (
          <button
            key={code}
            className={`p-2 shadow-xl ${
              country === code
                ? 'bg-slate-900 text-white'
                : 'bg-transparent blur-[0.5px]'
            }`}
            onClick={() => handleFlagChange(code)}
          >
            <Flag country={code} />
          </button>
        ))}
      </div>

      {/* Content Layout */}
      <div className="flex flex-grow w-full h-full">
        {/* Greeting Message */}
        <div className="flex-shrink-0 flex-grow-0 basis-[15%] min-w-[10%] max-w-[20%] h-full p-3 bg-red-100">
          <h1 className="text-2xl mt-4 text-slate-800/60 greetingMessage font-bold px-2">
            Hi, I'm Erdi
          </h1>
          <p className="text-sm mt-4 text-slate-800/60 greetingMessage p-2 text-pretty opacity-85 italic">
            A Full Stack Software Developer
          </p>
          <ul className="mt-16 text-slate-800/60 h-full flex flex-col justify-start space-y-7">
            <Link
              href="/Experience"
              className="hover:shadow-xl p-2 transition-all duration-300 ease-in-out cursor-pointer"
            >
              Experience
            </Link>
            <li className="hover:shadow-xl p-2 transition-all duration-300 ease-in-out cursor-pointer">
              Projects
            </li>
            <li className="hover:shadow-xl p-2 transition-all duration-300 ease-in-out cursor-pointer">
              Resume
            </li>
          </ul>
        </div>

        {/* Square (3D Box) */}
        <div className="flex-grow h-full flex justify-center items-center w-full">
          <Square faceClick={faceClick} setFaceClick={setFaceClick} />
        </div>
      </div>
    </div>
  );
}
