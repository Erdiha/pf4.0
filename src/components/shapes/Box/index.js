import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text3D, Text } from '@react-three/drei';

const Square = ({ faceClick, setFaceClick }) => {
  const Box = () => {
    const meshRef = useRef();
    const [targetRotation, setTargetRotation] = useState([0, 0, 0]);
    const [faceColors, setFaceColors] = useState({
      front: 'white',
      back: 'white',
      top: 'white',
      bottom: 'white',
      right: 'white',
      left: 'white',
    });

    // Gradually animate rotation
    useFrame(() => {
      if (meshRef.current) {
        meshRef.current.rotation.x +=
          (targetRotation[0] - meshRef.current.rotation.x) * 0.1;
        meshRef.current.rotation.y +=
          (targetRotation[1] - meshRef.current.rotation.y) * 0.1;
        meshRef.current.rotation.z +=
          (targetRotation[2] - meshRef.current.rotation.z) * 0.1;
      }
    });

    // Map faces to rotations
    const faceRotations = {
      front: [0, 0, 0],
      back: [0, Math.PI, 0],
      top: [-Math.PI / 2, 0, 0],
      bottom: [Math.PI / 2, 0, 0],
      right: [0, -Math.PI / 2, 0],
      left: [0, Math.PI / 2, 0],
    };

    const handleFaceClick = (face) => {
      setTargetRotation(faceRotations[face]);
      setFaceColors((prevColors) => ({
        ...prevColors,
        [face]: prevColors[face] === 'white' ? 'blue' : 'white', // Toggle color
      }));
    };

    return (
      <mesh scale={5} ref={meshRef}>
        <boxGeometry args={[1, 1, 1]} />
        {/* Add individual materials per face */}
        <meshStandardMaterial attachArray="material" color={faceColors.front} />
        <meshStandardMaterial attachArray="material" color={faceColors.back} />
        <meshStandardMaterial attachArray="material" color={faceColors.top} />
        <meshStandardMaterial
          attachArray="material"
          color={faceColors.bottom}
        />
        <meshStandardMaterial attachArray="material" color={faceColors.right} />
        <meshStandardMaterial attachArray="material" color={faceColors.left} />

        {/* Add clickable text on each face */}
        <Text
          position={[0, 0, 0.51]}
          fontSize={0.1}
          color="white"
          onClick={() => handleFaceClick('front')}
        >
          Front
        </Text>
        <Text
          position={[0, 0, -0.51]}
          fontSize={0.2}
          color="white"
          rotation={[0, Math.PI, 0]}
          onClick={() => handleFaceClick('back')}
        >
          Back
        </Text>
        <Text
          position={[0, 0.51, 0]}
          fontSize={0.2}
          color="white"
          rotation={[-Math.PI / 2, 0, 0]}
          onClick={() => handleFaceClick('top')}
        >
          Top
        </Text>
        <Text
          position={[0, -0.51, 0]}
          fontSize={0.2}
          color="white"
          rotation={[Math.PI / 2, 0, 0]}
          onClick={() => handleFaceClick('bottom')}
        >
          Bottom
        </Text>
        <Text
          position={[0.51, 0, 0]}
          fontSize={0.2}
          color="white"
          rotation={[0, -Math.PI / 2, 0]}
          onClick={() => handleFaceClick('right')}
        >
          Right
        </Text>
        <Text
          position={[-0.51, 0, 0]}
          fontSize={0.2}
          color="white"
          rotation={[0, Math.PI / 2, 0]}
          onClick={() => handleFaceClick('left')}
        >
          Left
        </Text>
      </mesh>
    );
  };

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Canvas style={{ width: '100%', height: '100%' }}>
        <ambientLight intensity={2.0} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <pointLight position={[-10, -10, -10]} />
        <Box />
      </Canvas>
    </div>
  );
};

export default Square;
