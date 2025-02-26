'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Line, Box } from '@react-three/drei';
import { a, useSpring } from '@react-spring/three';

const ParachuteItem = () => {
  const groupRef = useRef();

  // Smooth swinging motion using springs
  const { rotationZ } = useSpring({
    from: { rotationZ: -0.1 },
    to: { rotationZ: 0.1 },
    loop: { reverse: true },
    config: { tension: 20, friction: 5 },
  });

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.position.y -= 0.008; // Slow fall
    }
  });

  return (
    <a.group ref={groupRef} rotation-z={rotationZ}>
      {/* Parachute Canopy */}
      <Sphere args={[0.7, 32, 32]} position={[0, 1, 0]}>
        <meshStandardMaterial color="red" />
      </Sphere>

      {/* Suspension Cords */}
      {[
        [-0.4, 0.6],
        [0.4, 0.6],
        [-0.3, 0.8],
        [0.3, 0.8],
      ].map(([x, y], i) => (
        <Line
          key={i}
          points={[
            [x, y, 0],
            [x / 2, -0.3, 0],
          ]}
          color="white"
        />
      ))}

      {/* Falling Box */}
      <Box args={[0.1, 0.1, 0.1]} position={[0, -0.7, 0]}>
        <meshStandardMaterial color="blue" />
      </Box>
    </a.group>
  );
};

// ✅ Only renders when `cubeFace === 3`
export default function ParachuteScene({ cubeFace }) {
  return (
    <Canvas camera={{ position: [0, 1.5, 3] }}>
      <ambientLight />
      <directionalLight position={[3, 3, 3]} />
      {cubeFace === 3 && <ParachuteItem />}{' '}
      {/* Parachute triggers on cubeFace 3 */}
    </Canvas>
  );
}
