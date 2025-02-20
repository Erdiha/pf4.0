'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from 'react-three-fiber';
import { Text, OrbitControls } from '@react-three/drei';

const Cube = ({ cubeFace, setCubeFace, scrollYProgress }) => {
  const groupRef = useRef();
  const lastFaceIndex = useRef(null);
  const mousePos = useRef([0, 0, 3]);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeout = useRef(null);

  useEffect(() => {
    const handleMouseMove = (event) => {
      if (!isScrolling) {
        const x = (event.clientX / window.innerWidth) * 2 - 1;
        const y = -(event.clientY / window.innerHeight) * 2 + 1;
        mousePos.current = [x, y, 3];
      }
    };

    const handleScroll = () => {
      setIsScrolling(true);
      clearTimeout(scrollTimeout.current);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout.current);
    };
  }, [isScrolling]);

  useFrame(() => {
    if (groupRef.current) {
      if (!isScrolling) {
        groupRef.current.lookAt(...mousePos.current);
      } else {
        groupRef.current.lookAt(0, 0, 3);
      }

      // ✅ Rotate cube over 400vh (4 sections)
      groupRef.current.rotation.x = scrollYProgress.get() * Math.PI * 6;

      // ✅ Detect face index (each 100vh = one face)
      const faceIndex = Math.floor(scrollYProgress.get() * 2) % 4;

      if (lastFaceIndex.current !== faceIndex) {
        lastFaceIndex.current = faceIndex;
        setCubeFace(faceIndex); // ✅ Update face state
        console.log(`Face changed to: ${faceIndex}`);
      }
    }
  });

  const colors = ['white', 'white', 'white', 'white', 'black', 'white'];

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      <mesh>
        <boxGeometry args={[3, 3, 3]} />
        {colors.map((color, index) => (
          <meshStandardMaterial
            key={index}
            attach={`material-${index}`}
            color={color}
          />
        ))}
      </mesh>
      <Text billboard position={[0, 0.2, 1.6]} fontSize={0.3} color="white">
        Hi, I am Erdi.
      </Text>
      <Text billboard position={[-0.1, -0.2, 1.6]} fontSize={0.15} color="gray">
        A Software Engineer.
      </Text>
    </group>
  );
};

export default Cube;
