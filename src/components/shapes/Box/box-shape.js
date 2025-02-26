'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { a, useSpring } from '@react-spring/three';
import { VideoTexture } from 'three';

const Cube = ({ scrollYProgress, setCubeFace, cubeFace }) => {
  const groupRef = useRef();
  const topFaceRef = useRef();
  const backFaceRef = useRef();
  const bottomFaceRef = useRef();
  const [hasScrolled, setHasScrolled] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const videoRef = useRef(null);
  const [videoTexture, setVideoTexture] = useState(null);

  const fadeOpacity = useSpring({
    opacity: 1,
    from: { opacity: 0 },
    config: { duration: 800 },
  });

  useEffect(() => {
    // Ensure this runs only on the client side
    if (typeof window !== 'undefined') {
      const video = document.createElement('video');
      video.src = '/water.mp4'; // Path to your video
      video.autoplay = true; // Enable autoplay
      video.loop = true; // Loop the video
      video.muted = true; // Ensure the video is muted
      video.playsInline = true; // Ensure video plays inline on mobile devices
      videoRef.current = video;

      // Create the video texture
      const texture = new VideoTexture(video);
      setVideoTexture(texture);

      // Function to play the video
      const playVideo = async () => {
        try {
          await video.play();
        } catch (error) {
          console.warn('Video play failed, retrying...', error);
          // Retry playing the video after a short delay
          setTimeout(playVideo, 1000);
        }
      };

      // Attempt to play the video when the page is visible
      const handleVisibilityChange = () => {
        if (document.visibilityState === 'visible') {
          playVideo();
        }
      };

      // Listen for visibility changes
      document.addEventListener('visibilitychange', handleVisibilityChange);

      // Initial attempt to play the video
      playVideo();

      // Cleanup on unmount
      return () => {
        if (videoRef.current) {
          videoRef.current.pause();
          videoRef.current.removeAttribute('src');
          videoRef.current.load();
        }
        if (texture) texture.dispose();
        document.removeEventListener(
          'visibilitychange',
          handleVisibilityChange
        );
      };
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => setHasScrolled(true);
    const handleMouseMove = (event) => {
      if (!hasScrolled) {
        const x = (event.clientX / window.innerWidth - 0.5) * 2;
        const y = -(event.clientY / window.innerHeight - 0.5) * 2;
        setMousePosition({ x, y });
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [hasScrolled]);

  useFrame(() => {
    if (groupRef.current) {
      const rotationX = scrollYProgress.get() * Math.PI * 1.5;
      const rotationY = hasScrolled ? 0 : mousePosition.x * 0.3;
      const rotationZ = hasScrolled ? 0 : mousePosition.y * 0.3;

      groupRef.current.rotation.set(rotationX, rotationY, rotationZ);

      const newFace = Math.round((rotationX / (Math.PI * 0.5)) % 4);
      if (newFace !== cubeFace) setCubeFace(newFace);
    }
  });

  // Determine the target size based on cubeFace
  const targetSize =
    cubeFace === 3
      ? [4.5, 4.5, 4.5]
      : cubeFace === 0
      ? [2, 2, 2]
      : cubeFace === 2
      ? [3.5, 3.5, 3.5]
      : [2.5, 2.5, 2.5];

  // Smooth transition for the cube size
  const animatedSize = useSpring({
    to: { scale: targetSize },
    config: { mass: 1, tension: 200, friction: 20 },
  });

  return (
    <a.group ref={groupRef} style={{ opacity: fadeOpacity.opacity }}>
      {/* Cube Structure */}
      <a.mesh scale={animatedSize.scale}>
        <boxGeometry args={[1, 1, 1]} />
        {[...Array(6)].map((_, index) => (
          <meshBasicMaterial
            key={index}
            attach={`material-${index}`}
            color="red"
          />
        ))}
      </a.mesh>

      {/* Front Face with Video */}
      <a.group position={[0, 0, 1.01]}>
        {/* Video Background */}
        {/* <mesh>
          <planeGeometry args={[2, 2]} />
          <meshBasicMaterial toneMapped={false}>
            {videoTexture && (
              <videoTexture attach="map" args={[videoRef.current]} />
            )}
          </meshBasicMaterial>
        </mesh> */}

        {/* Semi-transparent Overlay */}
        <mesh position={[0, 0, 0.001]}>
          <planeGeometry args={[2, 2]} />
          <meshBasicMaterial color="red" transparent />
        </mesh>

        {/* Text */}
        <Text billboard position={[0, 0.05, 0.1]} fontSize={0.2} color="white">
          Hi, I am Erdi.
        </Text>
        <Text
          billboard
          position={[-0.1, -0.2, 0.1]}
          fontSize={0.1}
          color="white"
        >
          A Software Engineer.
        </Text>
      </a.group>

      {/* Top Face */}
      <mesh
        ref={topFaceRef}
        position={[0, 1, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[1.5, 1.5]} />
        <meshBasicMaterial color="red" />
        {cubeFace === 1 && (
          <Text position={[0, 0, 0.6]} fontSize={0.25} color="black">
            Experience
          </Text>
        )}
      </mesh>

      {/* Back Face */}
      <mesh ref={backFaceRef} position={[0, 0, -1]} rotation={[Math.PI, 0, 0]}>
        <planeGeometry args={[1.5, 1.5]} />
        <meshBasicMaterial color="red" />
        {cubeFace === 2 && (
          <Text position={[-1.1, 1.2, 0.8]} fontSize={0.25} color="black">
            Projects
          </Text>
        )}
      </mesh>

      {/* Bottom Face */}
      <mesh
        ref={bottomFaceRef}
        position={[0, -1, 0]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[2, 2]} />
        <meshBasicMaterial toneMapped={false}>
          {videoTexture && (
            <videoTexture attach="map" args={[videoRef.current]} />
          )}
        </meshBasicMaterial>
        {cubeFace === 3 && (
          <Text position={[-1.34, 1.5, 1.6]} fontSize={0.2} color="black">
            Resume
          </Text>
        )}
      </mesh>
    </a.group>
  );
};

export default Cube;
