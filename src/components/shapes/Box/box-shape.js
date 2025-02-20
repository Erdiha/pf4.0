'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { a, useSpring } from '@react-spring/three';

const Cube = ({ scrollYProgress, setCubeFace, cubeFace }) => {
  const groupRef = useRef();
  const topFaceRef = useRef(); // Reference for top face fill
  const backFaceRef = useRef(); // Reference for back face fill
  const bottomFaceRef = useRef(); // Reference for bottom face fill
  const [hasScrolled, setHasScrolled] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const isClient = typeof window !== 'undefined';

  const fadeOpacity = useSpring({
    opacity: isClient ? 1 : 0, // Ensure same value on SSR and client
    from: { opacity: 0 },
    config: { duration: 800 },
  });

  const fadePosition = useSpring({
    position: isClient ? [0, 0, 0] : [0, -10, 0], // Avoid mismatch
    from: [0, -10, 0],
    config: { duration: 800 },
  });

  const textOpacity = useSpring({
    opacity: isClient ? 1 : 0, // Fix hydration mismatch
    from: { opacity: 0 },
    config: { duration: 800 },
  });

  // ✅ Handle Mouse Movement (Only before scrolling)
  const handleMouseMove = (event) => {
    if (!hasScrolled) {
      const { clientX, clientY } = event;
      const x = (clientX / window.innerWidth - 0.5) * 2;
      const y = -(clientY / window.innerHeight - 0.5) * 2;
      setMousePosition({ x, y });
    }
  };

  // ✅ Detect First Scroll & Disable Mouse Tracking Permanently
  useEffect(() => {
    const handleScroll = () => setHasScrolled(true);
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // ✅ Apply Scroll Rotation + Mouse Follow (Only if hasScrolled = false)
  useFrame(() => {
    if (groupRef.current) {
      const rotationX = scrollYProgress.get() * Math.PI * 1.5;
      const rotationY = hasScrolled ? 0 : mousePosition.x * 0.3;
      const rotationZ = hasScrolled ? 0 : mousePosition.y * 0.3;

      groupRef.current.rotation.x = rotationX;
      groupRef.current.rotation.y = rotationY;
      groupRef.current.rotation.z = rotationZ;

      // ✅ Detect current face (0-3)
      const newFace = Math.round((rotationX / (Math.PI * 0.5)) % 4);
      if (newFace !== cubeFace) {
        setCubeFace(newFace);
        console.log(`Face changed to: ${newFace}`);
      }
    }

    // ✅ Smooth animation for entry & exit for **top (red), back (blue), and bottom (grayish-blue) faces**
    if (topFaceRef.current) {
      if (cubeFace === 1) {
        topFaceRef.current.scale.x = Math.min(
          topFaceRef.current.scale.x + 0.02,
          1
        ); // Fill left to right
      } else {
        topFaceRef.current.scale.x = Math.max(
          topFaceRef.current.scale.x - 0.02,
          0
        ); // Exit right to left
      }
    }

    if (backFaceRef.current) {
      if (cubeFace === 2) {
        backFaceRef.current.scale.x = Math.min(
          backFaceRef.current.scale.x + 0.02,
          1
        ); // Fill left to right
      } else {
        backFaceRef.current.scale.x = Math.max(
          backFaceRef.current.scale.x - 0.02,
          0
        ); // Exit right to left
      }
    }

    if (bottomFaceRef.current) {
      if (cubeFace === 3) {
        bottomFaceRef.current.scale.x = Math.min(
          bottomFaceRef.current.scale.x + 0.02,
          1
        ); // Fill left to right
      } else {
        bottomFaceRef.current.scale.x = Math.max(
          bottomFaceRef.current.scale.x - 0.02,
          0
        ); // Exit right to left
      }
    }
  });

  // ✅ Define dynamic colors for faces (Restored!)
  const faceColors = ['', '', '', '', '', ''];

  return (
    <a.group
      ref={groupRef}
      position={fadePosition.position}
      style={{ opacity: fadeOpacity.opacity }}
    >
      {/* Cube Structure */}
      <mesh>
        <boxGeometry args={[3, 3, 3]} />
        {faceColors.map((color, index) => (
          <meshBasicMaterial
            key={index}
            attach={`material-${index}`}
            color={color}
            toneMapped={false}
          />
        ))}
      </mesh>

      {/* ✅ Front Face Text (Restored!) */}
      <a.group position={[0, 0, 1.55]} style={{ opacity: textOpacity.opacity }}>
        <Text billboard position={[0, 0.2, 0]} fontSize={0.3} color="black">
          Hi, I am Erdi.
        </Text>
        <Text billboard position={[-0.1, -0.2, 0]} fontSize={0.15} color="gray">
          A Software Engineer.
        </Text>
      </a.group>

      {/* ✅ Top Face (Red) with Smooth Fill Animation */}
      <mesh
        ref={topFaceRef}
        position={[0, 1.51, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={[0, 1, 1]}
      >
        <planeGeometry args={[3, 3]} />
        <meshBasicMaterial color="red" />
        <Text billboard position={[0, 0, 0.2]} fontSize={0.4} color="white">
          Experience
        </Text>
      </mesh>

      {/* ✅ Back Face (Blue) with Smooth Fill Animation */}
      <mesh
        ref={backFaceRef}
        position={[0, 0, -1.51]}
        rotation={[-Math.PI, 0, 0]}
        scale={[0, 1, 1]}
      >
        <planeGeometry args={[3, 3]} />
        <meshBasicMaterial color="#5C7285" />
        <Text billboard position={[0, 0, 0.2]} fontSize={0.4} color="white">
          Projects
        </Text>
      </mesh>

      {/* ✅ Bottom Face (Grayish-Blue) with Smooth Fill Animation */}
      <mesh
        ref={bottomFaceRef}
        position={[0, -1.51, 0]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={[0, 1, 1]}
      >
        <planeGeometry args={[3, 3]} />
        <meshBasicMaterial color="#FFE6A9" />
        <Text billboard position={[0, 0, 0.2]} fontSize={0.4} color="black">
          Contact
        </Text>
      </mesh>
    </a.group>
  );
};

export default Cube;
