'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { a, useSpring } from '@react-spring/three';
import { VideoTexture } from 'three';

const Cube = ({ scrollYProgress, setCubeFace, cubeFace,indx ,isMobile}) => {
  const groupRef = useRef();
  const videoRef = useRef(null);
  const [videoTexture, setVideoTexture] = useState(null);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  // Setup video texture
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const video = document.createElement('video');
    video.src = '/water.mp4';
    video.autoplay = video.loop = video.muted = video.playsInline = true;
    videoRef.current = video;
    
    const texture = new VideoTexture(video);
    setVideoTexture(texture);
    
    const playVideo = () => video.play().catch(() => setTimeout(playVideo, 1000));
    const handleVisibility = () => document.visibilityState === 'visible' && playVideo();
    
    document.addEventListener('visibilitychange', handleVisibility);
    playVideo();
    
    return () => {
      if (video) {
        video.pause();
        video.removeAttribute('src');
        video.load();
      }
      texture?.dispose();
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);
  
  // Setup mouse and scroll tracking
  useEffect(() => {
    const handleScroll = () => setHasScrolled(true);
    const handleMouseMove = (e) => {
      if (!hasScrolled) {
        setMousePosition({
          x: (e.clientX / window.innerWidth - 0.5) * 2,
          y: -(e.clientY / window.innerHeight - 0.5) * 2
        });
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [hasScrolled]);
  
  // Animation and face detection
  useFrame(() => {
    if (!groupRef.current) return;
    
    const rotX = scrollYProgress.get() * Math.PI * 1.5;
    const rotY = hasScrolled ? 0 : mousePosition.x * 0.3;
    const rotZ = hasScrolled ? 0 : mousePosition.y * 0.3;
    
    groupRef.current.rotation.set(rotX, rotY, rotZ);
    
    const newFace = Math.round((rotX / (Math.PI * 0.5)) % 4);
    if (newFace !== cubeFace) setCubeFace(newFace);
  });
  
  // Animations and styles
  const fadeIn = useSpring({ opacity: 1, from: { opacity: 0 }, config: { duration: 800 } });
  const size = useSpring({
    scale: cubeFace === 3 ? [4.5, 4.5, 4.5] : 
           cubeFace === 0 ? [2, 2, 2] : 
           cubeFace === 2 ? [3.5, 3.5, 3.5] : [2.5, 2.5, 2.5],
    config: { mass: 1, tension: 200, friction: 20 }
  });
  
  // Face content based on current face
  const getFaceContent = (face) => {
    switch(face) {
      case 0: return (
        <>
          <Text billboard position={[0, 0.05, 0.1]} fontSize={0.2} color="white">Hi, I am Erdi.</Text>
          <Text billboard position={[-0.1, -0.2, 0.1]} fontSize={0.1} color="white">A Software Engineer.</Text>
        </>
      );
      case 1: return <Text  position={[0, 0, 0.6]} fontSize={0.25} color={ isMobile ?'white':"black"}>Experience</Text>;
      case 2: return <Text position={isMobile?[-0,1.5,0.8]:[-1.1, 1.2, 0.8]} fontSize={0.25} color={isMobile ?'white':"black"}>Projects</Text>;
      case 3: return <Text position={isMobile?[0,1.6,1.6]:[-1.34, 1.5, 1.6]} 
      fontSize={0.2} color="black">Resume</Text>;
      default: return null;
    }
  };
  console.log('index',indx.index)
  return (
    <a.group ref={groupRef} style={{ opacity: fadeIn.opacity }}>
      {/* Main cube */}
      <a.mesh scale={size.scale}>
        <boxGeometry args={[1, 1, 1]} />
        {[...Array(6)].map((_, i) => (
          <meshBasicMaterial key={i} attach={`material-${i}`}  color={indx.index>=0 || (isMobile && cubeFace===1||cubeFace===3) 
             ? '#ffffff' : 'red'} />
        ))}
      </a.mesh>
      
      {/* Front face */}
      <a.group position={[0, 0, 1.01]}>
        <mesh position={[0, 0, 0.001]}>
          <planeGeometry args={[2, 2]} />
          <meshBasicMaterial color="red" transparent />
        </mesh>
        {cubeFace === 0 && getFaceContent(0)}
      </a.group>
      
      {/* Top face */}
      <mesh position={[0, 1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.5, 1.5]} />
        <meshBasicMaterial color="red" opacity={0} transparent={true}/>
        {cubeFace === 1 && getFaceContent(1)}
      </mesh>
      
      {/* Back face */}
      <mesh position={[0, 0, -1]} rotation={[Math.PI, 0, 0]}>
        <planeGeometry args={[1.5, 1.5]} />
        <meshBasicMaterial color="red" />
        {cubeFace === 2 && getFaceContent(2)}
      </mesh>
      
      {/* Bottom face */}
 {/* Bottom face */}
<mesh position={[0, -1, 0]} rotation={[Math.PI / 2, 0, 0]}>
    <planeGeometry args={[2, 2]} />
    {videoTexture ? (
        <meshBasicMaterial map={videoTexture} toneMapped={false} />
    ) : (
        <meshBasicMaterial color="black" />
    )}
    {cubeFace === 3 && getFaceContent(3)}
</mesh>

    </a.group>
  );
};

export default Cube;