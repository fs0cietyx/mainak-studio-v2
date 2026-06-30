import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, Sphere, Environment, Float, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

const Blob = () => {
  const mesh = useRef<THREE.Mesh>(null!);
  
  useFrame((state) => {
    if (mesh.current) {
      // Interactive - mouse follow with lerping
      const targetX = (state.pointer.x * 1.5);
      const targetY = (state.pointer.y * 1.5);
      
      mesh.current.position.x += (targetX - mesh.current.position.x) * 0.05;
      mesh.current.position.y += (targetY - mesh.current.position.y) * 0.05;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <Sphere ref={mesh} args={[1.4, 128, 128]}>
        <MeshDistortMaterial 
          color="#a0a0a0"
          attach="material" 
          distort={0.4} 
          speed={2.5} 
          roughness={0} 
          metalness={1}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </Sphere>
    </Float>
  );
};

export const Hero3D = () => {
  return (
    <div className="absolute inset-0 w-full h-full z-0 pointer-events-auto">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }} dpr={[1, 1.5]} performance={{ min: 0.5 }} gl={{ powerPreference: "high-performance", antialias: false }}>
        {/* Transparent background so we can blend with hero container if needed */}
        <ambientLight intensity={1} />
        <directionalLight position={[10, 10, 10]} intensity={2} color="#ffffff" />
        <directionalLight position={[-10, -10, -10]} intensity={1} color="#E1E0CC" />
        <spotLight position={[0, 5, 0]} intensity={2} penumbra={1} angle={0.5} />
        <Blob />
        <Environment preset="studio" />
        <ContactShadows position={[0, -2, 0]} opacity={0.5} scale={10} blur={1.5} far={4} color="#000000" />
      </Canvas>
    </div>
  );
};
