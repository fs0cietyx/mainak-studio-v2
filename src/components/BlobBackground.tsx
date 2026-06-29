import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

export const BlobBackground = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  const mouse = useRef({ x: 0, y: 0 });
  const currentPos = useRef({ x: 0, y: 0 });
  
  // Spring physics state for squash and stretch
  const stretch = useRef(1);
  const stretchVelocity = useRef(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;

    // 1. Convert global mouse [-1, 1] to viewport coordinates
    const targetX = (mouse.current.x * state.viewport.width) / 2;
    const targetY = (mouse.current.y * state.viewport.height) / 2;

    // Calculate instantaneous velocity (how far the mouse moved this frame)
    const dx = targetX - currentPos.current.x;
    const dy = targetY - currentPos.current.y;
    
    // 2. Very tight tracking so cursor stays inside the blob
    currentPos.current.x += dx * 0.4;
    currentPos.current.y += dy * 0.4;
    
    meshRef.current.position.x = currentPos.current.x;
    meshRef.current.position.y = currentPos.current.y;

    // 3. Calculate movement speed for stretching
    const speed = Math.sqrt(dx * dx + dy * dy);
    
    // 4. Spring physics for the squash/stretch effect
    // Target stretch increases based on speed
    const targetStretch = 1 + Math.min(speed * 2.5, 1.5); 
    
    // Spring math
    const tension = 0.1;
    const friction = 0.8;
    
    const stretchForce = (targetStretch - stretch.current) * tension;
    stretchVelocity.current += stretchForce;
    stretchVelocity.current *= friction;
    stretch.current += stretchVelocity.current;

    // Apply scale (stretch on Y, squash on X and Z to maintain volume)
    // We will stretch along the Y axis of the mesh, then rotate the mesh to point in the direction of movement
    meshRef.current.scale.set(
      1 / Math.sqrt(stretch.current), // Squash X
      stretch.current,               // Stretch Y
      1 / Math.sqrt(stretch.current)  // Squash Z
    );

    // 5. Rotate the blob to align with the direction of movement
    if (speed > 0.01) {
      const angle = Math.atan2(dy, dx);
      // We subtract PI/2 because we are stretching along the Y axis, so Y axis needs to point at the angle
      const targetRotation = angle - Math.PI / 2;
      
      // Smoothly interpolate rotation (taking the shortest path)
      const currentRotation = meshRef.current.rotation.z;
      
      // Normalize angles to avoid spinning the wrong way
      let diff = targetRotation - currentRotation;
      while (diff < -Math.PI) diff += Math.PI * 2;
      while (diff > Math.PI) diff -= Math.PI * 2;
      
      meshRef.current.rotation.z += diff * 0.2;
    }
  });

  return (
    <Sphere ref={meshRef} args={[1.5, 64, 64]} position={[0, 0, 0]}>
      <MeshDistortMaterial 
        color="#000000" 
        envMapIntensity={0}
        clearcoat={0}
        clearcoatRoughness={0}
        metalness={0.1}
        roughness={0.9}
        distort={0.4} 
        speed={3} 
      />
    </Sphere>
  );
};
