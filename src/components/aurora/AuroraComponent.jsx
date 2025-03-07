'use client';

import React, { useRef, useEffect } from 'react';

// Utility function for smooth interpolation
const lerp = (start, end, t) => start * (1 - t) + end * t;

const Aurora = ({
  colors = ['#4f6fff', '#45c2ff', '#b8d4ff'],
  speed = 0.3, // Lower value for more gentle movement
  complexity = 4,
  opacity = 0.8,
  blur = 60,
  dampFactor = 0.03, // Controls how "wobbly" and damped the movement is
}) => {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const animationRef = useRef(null);
  const blobsRef = useRef([]);
  const prevTimeRef = useRef(0);

  // Initialize blobs on component mount
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      // Reinitialize blobs when canvas resizes
      initializeBlobs();
    };

    // Set up canvas
    handleResize();
    window.addEventListener('resize', handleResize);

    // Get context
    contextRef.current = canvas.getContext('2d');

    // Initialize blobs
    initializeBlobs();

    // Start animation
    startAnimation();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Re-initialize when props change
  useEffect(() => {
    if (canvasRef.current) {
      initializeBlobs();
    }
  }, [colors, complexity]);

  // Create blobs with random properties
  const initializeBlobs = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const width = canvas.width;
    const height = canvas.height;
    const blobs = [];

    // Create multiple blobs for a more complex effect
    const blobCount = complexity * 3;

    for (let i = 0; i < blobCount; i++) {
      // Determine which color group this blob belongs to
      const colorIndex = Math.floor(i / 3) % colors.length;
      const color = colors[colorIndex];

      // Initial position
      const x = Math.random() * width;
      const y = Math.random() * height;

      // Create blob with random properties
      const blob = {
        x: x,
        y: y,
        targetX: x,
        targetY: y,
        size: Math.random() * (width / 4) + 150,
        // Very slow base movement for more ethereal feel
        speedX: (Math.random() - 0.5) * speed * 0.5,
        speedY: (Math.random() - 0.5) * speed * 0.5,
        // Lower values for wobble speed = smoother motion
        wobbleSpeed: 0.0003 + Math.random() * 0.0007,
        wobbleAmplitude: width * 0.05 * (Math.random() + 0.5),
        wobbleOffset: Math.random() * Math.PI * 2,
        // Create variations in each blob's shape
        points: Array.from({ length: 12 }, () => ({
          angle: 0, // Will be set properly in updateBlobs
          dist: 0.5 + Math.random() * 0.5,
          // Each point has its own oscillation speed and amplitude
          oscillationSpeed: 0.001 + Math.random() * 0.002, // Very slow for smoother transitions
          oscillationAmplitude: 0.1 + Math.random() * 0.15,
          oscillationOffset: Math.random() * Math.PI * 2,
          // Current and target values for smooth transitions
          currentDist: 0,
          targetDist: 0,
        })),
        // Create gradients with slight variations of the main color
        color,
        opacity: 0.05 + Math.random() * 0.2,
      };

      // Initialize current distance to match target for smooth start
      blob.points.forEach((point) => {
        point.currentDist = point.dist;
        point.targetDist = point.dist;
      });

      blobs.push(blob);
    }

    blobsRef.current = blobs;
  };

  // Generate new target positions and shapes periodically
  const updateTargets = (time) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const width = canvas.width;
    const height = canvas.height;
    const blobs = blobsRef.current;

    // Update each blob's target
    blobs.forEach((blob) => {
      // Add some gentle wobble to movement
      const wobbleX =
        Math.sin(time * blob.wobbleSpeed + blob.wobbleOffset) *
        blob.wobbleAmplitude;
      const wobbleY =
        Math.cos(time * blob.wobbleSpeed + blob.wobbleOffset + Math.PI / 3) *
        blob.wobbleAmplitude;

      // Move blob with wobble
      blob.targetX += blob.speedX + wobbleX * 0.01;
      blob.targetY += blob.speedY + wobbleY * 0.01;

      // Bounce off edges very gently
      if (blob.targetX < -blob.size) blob.targetX = width + blob.size;
      if (blob.targetX > width + blob.size) blob.targetX = -blob.size;
      if (blob.targetY < -blob.size) blob.targetY = height + blob.size;
      if (blob.targetY > height + blob.size) blob.targetY = -blob.size;

      // Update points for organic shape morphing - target values
      blob.points.forEach((point, i) => {
        // Distribute points evenly around circle
        point.angle = (i / blob.points.length) * Math.PI * 2;

        // Add slow oscillation to create morphing effect
        const oscillation =
          Math.sin(time * point.oscillationSpeed + point.oscillationOffset) *
          point.oscillationAmplitude;
        // Update target with smoother values
        point.targetDist = 0.5 + oscillation;
      });
    });
  };

  // Update actual positions with smooth interpolation
  const updateBlobs = (time, deltaTime) => {
    const blobs = blobsRef.current;

    // Adjust damp factor based on delta time
    const adjustedDampFactor = dampFactor * (deltaTime / 16.66); // Normalized to 60fps

    // Update each blob
    blobs.forEach((blob) => {
      // Smoothly interpolate actual position toward target
      blob.x = lerp(blob.x, blob.targetX, adjustedDampFactor);
      blob.y = lerp(blob.y, blob.targetY, adjustedDampFactor);

      // Smoothly update each point's current value toward its target
      blob.points.forEach((point) => {
        point.currentDist = lerp(
          point.currentDist,
          point.targetDist,
          adjustedDampFactor
        );
      });
    });
  };

  // Render blobs to canvas with improved blending
  const renderBlobs = () => {
    const context = contextRef.current;
    const canvas = canvasRef.current;
    if (!context || !canvas) return;

    // Clear canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Enable global compositing for more interesting blending
    context.globalCompositeOperation = 'screen';

    // Render each blob
    blobsRef.current.forEach((blob) => {
      context.save();

      // Create radial gradient
      const gradient = context.createRadialGradient(
        blob.x,
        blob.y,
        0,
        blob.x,
        blob.y,
        blob.size
      );

      // Add color stops with varying opacity - more subtle gradient
      const color = blob.color;
      gradient.addColorStop(
        0,
        `${color}${Math.floor(blob.opacity * 255)
          .toString(16)
          .padStart(2, '0')}`
      );
      gradient.addColorStop(
        0.4,
        `${color}${Math.floor(blob.opacity * 150)
          .toString(16)
          .padStart(2, '0')}`
      );
      gradient.addColorStop(1, `${color}00`); // Fully transparent at edges

      // Begin drawing blob shape
      context.beginPath();

      // Use points to create a curved blob shape
      const firstPoint = blob.points[0];
      const startX =
        blob.x +
        Math.cos(firstPoint.angle) * blob.size * firstPoint.currentDist;
      const startY =
        blob.y +
        Math.sin(firstPoint.angle) * blob.size * firstPoint.currentDist;

      context.moveTo(startX, startY);

      // Draw curved segments between points
      for (let i = 0; i < blob.points.length; i++) {
        const currentPoint = blob.points[i];
        const nextPoint = blob.points[(i + 1) % blob.points.length];

        const currentX =
          blob.x +
          Math.cos(currentPoint.angle) * blob.size * currentPoint.currentDist;
        const currentY =
          blob.y +
          Math.sin(currentPoint.angle) * blob.size * currentPoint.currentDist;

        const nextX =
          blob.x +
          Math.cos(nextPoint.angle) * blob.size * nextPoint.currentDist;
        const nextY =
          blob.y +
          Math.sin(nextPoint.angle) * blob.size * nextPoint.currentDist;

        // Calculate control points for smoother curves
        const cpX1 = currentX + (nextX - currentX) * 0.33;
        const cpY1 = currentY + (nextY - currentY) * 0.33;
        const cpX2 = currentX + (nextX - currentX) * 0.66;
        const cpY2 = currentY + (nextY - currentY) * 0.66;

        // Use bezier curve for smoother shapes
        context.bezierCurveTo(cpX1, cpY1, cpX2, cpY2, nextX, nextY);
      }

      context.closePath();

      // Fill with gradient
      context.fillStyle = gradient;
      context.fill();

      context.restore();
    });
  };

  // Animation loop with time-based updates and fixed delta time to prevent scroll interference
  const startAnimation = () => {
    const animate = (timestamp) => {
      // Use a consistent delta time rather than measuring actual time between frames
      // This prevents stuttering when scrolling interferes with requestAnimationFrame timing
      const fixedDeltaTime = 16.67; // Assume 60fps (1000ms / 60 = 16.67ms)

      // Convert to seconds
      const timeInSeconds = timestamp / 1000;

      // Update targets periodically
      updateTargets(timeInSeconds);

      // Apply damped spring physics to move toward targets using fixed delta time
      updateBlobs(timeInSeconds, fixedDeltaTime);

      // Render the blobs
      renderBlobs();

      // Continue animation loop with high priority
      animationRef.current = window.requestAnimationFrame(animate);
    };

    animationRef.current = window.requestAnimationFrame(animate);
  };

  return (
    <div
      style={{
        position: 'fixed', // Changed from absolute to fixed
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        zIndex: 0, // Changed from -1 to 0 for better visibility
        pointerEvents: 'none', // Prevents interaction with the Aurora layer
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          filter: `blur(${blur}px)`,
          opacity: opacity,
          willChange: 'transform',
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden',
        }}
      />
    </div>
  );
};

export default Aurora;
