'use client';

import { useState, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { a, useSpring } from '@react-spring/three';
import { useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';

export default function Dial({ isHovered, setIsHovered }) {
  const orbitControlsRef = useRef();

  // Define the items with their initial positions
  const items = [
    { id: 1, isMain: true, initialPosition: [0, 0, 0] }, // Main sphere
    { id: 2, initialPosition: [0, 0, 0] }, // Secondary spheres
    { id: 3, initialPosition: [0, 0, 0] },
    { id: 4, initialPosition: [0, 0, 0] },
    { id: 5, initialPosition: [0, 0, 0] },
  ];

  const isMain = items[0].isMain;

  const handleHoverStart = () => {
    setIsHovered(true);
  };

  const handleHoverEnd = () => {
    setIsHovered(false);
  };

  return (
    <Canvas
      shadows
      camera={{
        position: [0, 0, 7],
        fov: 10,
      }}
      style={{
        borderRadius: '100%',
        backgroundColor: 'transparent',
        position: 'absolute', // Ensure it sits above everything
        border: 'solid 1px red',
        width: '45%', // Adjust width\
        height: '51%', // Adjust height based on width
        maxWidth: '20rem',
        padding: '0', // Remove padding
        margin: '0', // Remove margin
        boxShadow: '5px 5px 5px white',
        zIndex: 9999, // Ensures it sits on top of all elements
      }}
    >
      <group>
        <Sphere
          initialPosition={items.initialPosition}
          isHovered={isHovered}
          setIsHovered={setIsHovered}
        />
      </group>
      <Env />
      <OrbitControls
        ref={orbitControlsRef}
        autoRotate={!isHovered}
        reset={isHovered}
        autoRotateSpeed={isHovered ? 0 : 2}
        enablePan={false}
        enableZoom={false}
        minPolarAngle={Math.PI / 2.1}
        maxPolarAngle={Math.PI / 2.1}
        onMouseEnter={handleHoverStart} // Capture the rotation when hovered
        onMouseLeave={handleHoverEnd} // Reset the rotation when hover ends
      />
    </Canvas>
  );
}

function Sphere({ isMain, initialPosition, isHovered, setIsHovered }) {
  // Define positions for the secondary spheres (relative to the main sphere)
  const secondaryPositions = [
    [0, 0, 0], // Position for the main sphere
    [0, 0.8, 0], // Position for secondary sphere 1
    [0.8, 0, 0], // Position for secondary sphere 2
    [0, -0.8, 0], // Position for secondary sphere 3
    [-0.8, 0, 0], // Position for secondary sphere 4
  ];
  const texture = useLoader(TextureLoader, '/mercury.jpg'); // Ensure this path is correct

  // Check if texture is loaded
  console.log(texture);

  // Use useSpring to animate the position of the spheres when hovered
  const { position } = useSpring({
    position: initialPosition,
    config: { tension: 500, friction: 50 },
  });

  const roughness = 50;

  return (
    <a.mesh
      position={position} // Use animated position
      onPointerOver={() => setIsHovered(true)} // Hovering over main sphere triggers hover
      onPointerOut={() => setIsHovered(false)} // Hover out of main sphere triggers hover off
      castShadow
    >
      <sphereGeometry args={[0.6, 64, 64]} />
      <meshStandardMaterial
        metalness={1}
        roughness={roughness}
        map={texture} // Apply the loaded texture here
      />
    </a.mesh>
  );
}

function Env() {
  const blur = 0.5;

  return <Environment preset="sunset" background={true} blur={blur} />;
}
