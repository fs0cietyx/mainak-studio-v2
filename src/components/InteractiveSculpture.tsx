import React, { useRef, useEffect } from 'react';
import { Canvas, useLoader, useFrame } from '@react-three/fiber';
import { STLLoader } from 'three-stdlib';
import { Center, OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';
import { ArrowUpRight } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  category: string;
  link: string;
}

const projects: Project[] = [
  {
    id: "01",
    title: "CytoGraph ML",
    category: "AI / Machine Learning",
    link: "https://github.com/fs0cietyx/CytoGraph-ML"
  },
  {
    id: "02",
    title: "Maze Crawler",
    category: "Algorithms / Pathfinding",
    link: "https://github.com/fs0cietyx/maze-crawler"
  },
  {
    id: "03",
    title: "AI Slop Detector",
    category: "AI Governance / NLP",
    link: "https://github.com/fs0cietyx/ai-slop-detector"
  },
  {
    id: "04",
    title: "Semantic Repo Mapper",
    category: "AST / Code Analysis",
    link: "https://github.com/fs0cietyx/semantic-repo-mapper"
  }
];

const ModelObj = () => {
  const geometry = useLoader(STLLoader, '/model.stl');
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  
  useEffect(() => {
    if (geometry && meshRef.current) {
      geometry.computeVertexNormals();

      geometry.computeBoundingBox();
      if (geometry.boundingBox) {
        const box = geometry.boundingBox;
        const size = new THREE.Vector3();
        box.getSize(size);
        const maxDim = Math.max(size.x, size.y, size.z);
        if (maxDim > 0) {
          const scale = 6.0 / maxDim; // Maximize space
          meshRef.current.scale.set(scale, scale, scale);
        }
        
        const center = new THREE.Vector3();
        box.getCenter(center);
        geometry.translate(-center.x, -center.y, -center.z);
      }
    }
  }, [geometry]);

  // Rotate smoothly based on global window scroll
  useFrame(() => {
    if (groupRef.current) {
      const scrollY = window.scrollY;
      const height = document.body.scrollHeight - window.innerHeight;
      const progress = height > 0 ? scrollY / height : 0;
      
      // Target rotation (e.g. 2 full rotations over the course of the whole page)
      const targetRotation = progress * Math.PI * 4;
      
      // Lerp for buttery smooth deceleration
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y, 
        targetRotation, 
        0.05
      );
    }
  });

  return (
    <group ref={groupRef}>
      <mesh ref={meshRef} geometry={geometry} rotation={[-Math.PI / 2, 0, 0]}>
        <meshStandardMaterial 
          color="#F9F9F8" 
          roughness={0.15} 
          metalness={0.05} 
        />
      </mesh>

      {/* Place project cards in 3D space orbiting the sculpture */}
      {projects.map((project, i) => {
        // Calculate points in a circle (Radius = 5.5)
        const angle = i * (Math.PI * 2) / projects.length;
        const radius = 5.5;
        const x = Math.sin(angle) * radius;
        const z = Math.cos(angle) * radius;
        // Stagger heights so they aren't all on the same flat plane
        const y = (i % 2 === 0 ? 1.5 : -1.5);

        return (
          <Html 
            key={project.id} 
            position={[x, y, z]} 
            center
            distanceFactor={10} // Scales down slightly as it gets further away
            zIndexRange={[100, 0]}
          >
            <div className="w-[220px]">
              <ProjectCard project={project} />
            </div>
          </Html>
        );
      })}
    </group>
  );
};

import { motion, useScroll, useTransform } from 'framer-motion';

export const InteractiveSculpture: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  });

  // Massive background text translating to the right, spans the ENTIRE section
  const textX = useTransform(scrollYProgress, [0, 1], ["-50vw", "100vw"]);

  return (
    <section ref={containerRef} className="relative w-full h-[300vh] bg-black text-[#E1E0CC]">
      <div className="sticky top-0 w-full h-screen overflow-hidden flex flex-col items-center justify-center">
        
        {/* Massive Animated Background Text */}
        <motion.div 
          className="absolute inset-0 flex items-center justify-center pointer-events-none z-0"
          style={{ x: textX, willChange: "transform" }}
        >
          <span 
            className="text-[20vw] md:text-[18vw] font-black text-white/15 drop-shadow-2xl whitespace-nowrap tracking-tighter"
            style={{ fontFamily: "'Libre Mono', monospace" }}
          >
            PROJECTS
          </span>
        </motion.div>

        {/* 3D Canvas Background */}
        <div className="absolute inset-0 z-10 cursor-grab active:cursor-grabbing" style={{ touchAction: 'pan-y' }}>
          <Canvas 
            camera={{ position: [0, 0, 10], fov: 45 }} 
            dpr={[1, 1]} // Hard limit to 1x to ensure massive performance gains on Retina/high-res screens
            performance={{ min: 0.5 }}
            frameloop="always" 
            gl={{ antialias: false, powerPreference: "high-performance" }} // Disable MSAA, rely on fast rendering
          >
          
          <ambientLight intensity={0.5} color="#ffffff" />
          <directionalLight position={[10, 10, 10]} intensity={2.5} color="#ffffff" />
          <directionalLight position={[-10, -10, -5]} intensity={1.0} color="#b0d4ff" />
          <pointLight position={[0, -10, 0]} intensity={1.5} color="#ffddaa" />
          
          <OrbitControls 
            makeDefault
            enableZoom={false}
            minDistance={4}
            maxDistance={15}
            enablePan={false}
            enableDamping
            dampingFactor={0.05}
          />

          <Center>
            <React.Suspense fallback={null}>
              <ModelObj />
            </React.Suspense>
          </Center>
        </Canvas>
      </div>

      {/* Vignette */}
      <div className="absolute inset-0 z-10 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.95)_100%)] pointer-events-none" />

      {/* Title */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 z-20 text-center pointer-events-none w-full px-4">
        <span className="text-primary text-[10px] font-black uppercase tracking-[0.5em] mb-2 block drop-shadow-lg">
          Proof of Labor
        </span>
        <h2 className="text-[#E1E0CC] text-2xl md:text-3xl font-serif italic tracking-tight drop-shadow-2xl">
          "It works on my machine"
        </h2>
      </div>
      
      {/* Footer instructional text */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 text-center w-full text-white/40 text-xs tracking-[0.3em] uppercase pointer-events-none">
        [ Drag to interact & explore projects ]
      </div>

      </div>
    </section>
  );
};

const ProjectCard = ({ project }: { project: Project }) => (
  <a 
    href={project.link} 
    target="_blank" 
    rel="noreferrer"
    className="group pointer-events-auto bg-black/40 backdrop-blur-md border border-white/10 p-5 rounded-2xl hover:bg-white/10 hover:border-white/30 transition-all no-underline flex flex-col items-start shadow-2xl"
  >
    <p className="text-primary text-[9px] font-black uppercase tracking-[0.3em] mb-2">{project.id}</p>
    <h3 className="text-[#E1E0CC] text-lg font-medium mb-1 group-hover:text-white transition-colors leading-tight">{project.title}</h3>
    <p className="text-gray-400 text-[10px] tracking-wider mb-4">{project.category}</p>
    <div className="inline-flex items-center text-[10px] font-bold uppercase tracking-widest text-[#E1E0CC]">
      Explore <ArrowUpRight className="w-3 h-3 ml-2 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
    </div>
  </a>
);
