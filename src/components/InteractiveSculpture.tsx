import React, { useRef, useEffect, useMemo } from 'react';
import { Canvas, useLoader, useFrame, useThree } from '@react-three/fiber';
import { OBJLoader } from 'three-stdlib';
import { OrbitControls, Html, Line } from '@react-three/drei';
import * as THREE from 'three';

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

interface ProjectCardWrapperProps {
  project: Project;
  y: number;
  x: number;
  z: number;
  groupRef: React.RefObject<THREE.Group>;
}

const ProjectCardWrapper = ({ project, y, x, z, groupRef }: ProjectCardWrapperProps) => {
  const divRef = useRef<HTMLDivElement>(null);
  
  const cardLocalPos = useMemo(() => new THREE.Vector3(x, y, z), [x, y, z]);
  const computerLocalPos = useMemo(() => new THREE.Vector3(0, -1, -3), []);
  const tempWorldPos = useMemo(() => new THREE.Vector3(), []);
  const tempComputerPos = useMemo(() => new THREE.Vector3(), []);

  useFrame((state) => {
    if (groupRef.current && divRef.current) {
      // Get the card's actual world position using pre-allocated vectors to prevent GC spikes
      tempWorldPos.copy(cardLocalPos).applyMatrix4(groupRef.current.matrixWorld);
      
      // Get the computer's actual world position
      tempComputerPos.copy(computerLocalPos).applyMatrix4(groupRef.current.matrixWorld);

      const cardDist = tempWorldPos.distanceTo(state.camera.position);
      const computerDist = tempComputerPos.distanceTo(state.camera.position);

      // Card is "behind" if it is further away from the camera than the computer
      const diff = cardDist - computerDist;
      
      let opacity = 1;
      // Start fading as it approaches the depth of the computer, fully fade out slightly behind it
      if (diff > -1.5) {
         opacity = 1.0 - ((diff + 1.5) / 2.5);
         opacity = Math.max(0, Math.min(1, opacity));
      }
      
      divRef.current.style.opacity = opacity.toFixed(3);
      divRef.current.style.pointerEvents = opacity < 0.1 ? 'none' : 'auto';
    }
  });

  return (
    <Html 
      position={[x, y, z]} 
      center
      distanceFactor={10} 
      zIndexRange={[100, 0]}
    >
      <div ref={divRef} className="w-[220px]">
        <ProjectCard project={project} />
      </div>
    </Html>
  );
};

const ModelObj = () => {
  const obj = useLoader(OBJLoader, '/retro-computer.obj');
  const texture = useLoader(THREE.TextureLoader, '/retro-computer-texture.png');
  const { viewport } = useThree();
  
  const groupRef = useRef<THREE.Group>(null);
  const orbit1Ref = useRef<any>(null);
  const orbit2Ref = useRef<any>(null);
  const spokesRef = useRef<any[]>([]);
  
  // Apply material once
  useEffect(() => {
    if (obj) {
      // eslint-disable-next-line react-hooks/immutability
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.flipY = true;

      const originalMaterial = new THREE.MeshBasicMaterial({ 
        map: texture,
        side: THREE.DoubleSide
      });

      obj.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.material = originalMaterial;
          if (child.geometry) {
            child.geometry.computeVertexNormals();
          }
        }
      });
    }
  }, [obj, texture]);

  const { orbit1Pts, orbit2Pts, spokePts } = useMemo(() => {
    const pts1 = [];
    const pts2 = [];
    const spokes = [];
    
    const count = projects.length;
    const c1 = Math.ceil(count / 2);
    const c2 = Math.floor(count / 2);

    // Calculate project anchor points for the spokes
    for(let i=0; i<c1; i++) {
      const angle = i * (Math.PI * 2) / c1;
      pts1.push(new THREE.Vector3(Math.sin(angle) * 2.5, 1.0, Math.cos(angle) * 2.5));
    }
    
    for(let i=0; i<c2; i++) {
      const angle = (i * (Math.PI * 2) / c2) + (Math.PI / c2); // Offset to interleave with orbit 1
      pts2.push(new THREE.Vector3(Math.sin(angle) * 4.5, -1.0, Math.cos(angle) * 4.5));
    }

    for(let i=0; i<c1; i++) {
      const p1 = pts1[i];
      const p2 = pts2[Math.min(i, pts2.length - 1)];
      if (p2) spokes.push([p1, p2]);
    }
    
    // Generate perfect geometric circles for the orbit lines (64 segments)
    const circle1Pts = [];
    const circle2Pts = [];
    for(let i=0; i<=64; i++) {
      const angle = (i / 64) * Math.PI * 2;
      circle1Pts.push(new THREE.Vector3(Math.sin(angle) * 2.5, 1.0, Math.cos(angle) * 2.5));
      circle2Pts.push(new THREE.Vector3(Math.sin(angle) * 4.5, -1.0, Math.cos(angle) * 4.5));
    }

    return { 
        orbit1Pts: circle1Pts, 
        orbit2Pts: circle2Pts,
        spokePts: spokes
    };
  }, []);

  const { scrollYProgress } = useScroll();

  useFrame((_state, delta) => {
    if (groupRef.current) {
      // Use Framer Motion's highly optimized scroll value instead of forced DOM reflows
      const progress = scrollYProgress.get();
      const targetRotation = progress * Math.PI * 4;
      
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y, 
        targetRotation, 
        0.05
      );
    }
    
    if (orbit1Ref.current && orbit1Ref.current.material) {
      orbit1Ref.current.material.dashOffset -= delta * 1.5;
    }
    if (orbit2Ref.current && orbit2Ref.current.material) {
      orbit2Ref.current.material.dashOffset -= delta * 1.5;
    }
    spokesRef.current.forEach(spoke => {
      if(spoke && spoke.material) {
        spoke.material.dashOffset -= delta * 2.5;
      }
    });
  });

  const rawScale = Math.min(viewport.width, viewport.height) * 1.3;
  const dynamicScale = [rawScale, rawScale, rawScale] as [number, number, number];

  const computerRef = useRef<THREE.Group>(null);

  return (
    <group ref={groupRef}>
      {/* Background massive computer */}
      <group ref={computerRef} position={[0, -1, -3]}>
        <primitive object={obj} scale={dynamicScale} />
      </group>

      {/* Orbits */}
      <Line
        ref={orbit1Ref}
        points={orbit1Pts}
        color="#E1E0CC"
        lineWidth={2.0}
        dashed={true}
        dashSize={0.8}
        dashScale={2}
        opacity={0.4}
        transparent
      />
      <Line
        ref={orbit2Ref}
        points={orbit2Pts}
        color="#E1E0CC"
        lineWidth={2.0}
        dashed={true}
        dashSize={0.8}
        dashScale={2}
        opacity={0.4}
        transparent
      />
      
      {/* Connecting Spokes */}
      {spokePts.map((pts, i) => (
        <Line
          key={'spoke-'+i}
          ref={(el) => { spokesRef.current[i] = el; }}
          points={pts}
          color="#E1E0CC"
          lineWidth={1.0}
          dashed={true}
          dashSize={0.4}
          dashScale={2}
          opacity={0.2}
          transparent
        />
      ))}

      {/* Place project cards on their respective orbits */}
      {projects.map((project, i) => {
        const isOrbit1 = i % 2 === 0;
        const count = isOrbit1 ? Math.ceil(projects.length / 2) : Math.floor(projects.length / 2);
        const localIndex = Math.floor(i / 2);
        const baseAngle = localIndex * (Math.PI * 2) / count;
        const angle = isOrbit1 ? baseAngle : baseAngle + (Math.PI / count); // Apply matching stagger
        
        const radius = isOrbit1 ? 2.5 : 4.5;
        const height = isOrbit1 ? 1.0 : -1.0;
        
        const x = Math.sin(angle) * radius;
        const z = Math.cos(angle) * radius;

        return (
          <ProjectCardWrapper 
            key={project.id}
            project={project}
            x={x}
            y={height}
            z={z}
            groupRef={groupRef as React.RefObject<THREE.Group>}
          />
        );
      })}
    </group>
  );
};

import { motion, useScroll, useTransform, useInView } from 'framer-motion';

export const InteractiveSculpture: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Pause rendering when outside the viewport to save CPU/GPU cycles
  const isInView = useInView(containerRef, { margin: "200px 0px 200px 0px" });

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
        <div data-3d-section="true" className="absolute inset-0 z-10 cursor-grab active:cursor-grabbing" style={{ touchAction: 'pan-y' }}>
          <Canvas 
            camera={{ position: [0, 0, 10], fov: 45 }} 
            dpr={[1, 1]} // Hard limit to 1x to ensure massive performance gains on Retina/high-res screens
            performance={{ min: 0.5 }}
            frameloop={isInView ? "always" : "never"} // Only render frames when visible!
            gl={{ antialias: false, powerPreference: "high-performance", alpha: false }} // Disable MSAA, rely on fast rendering
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

          <React.Suspense fallback={null}>
            <ModelObj />
          </React.Suspense>
        </Canvas>
      </div>

      {/* Vignette */}
      <div className="absolute inset-0 z-10 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.95)_100%)] pointer-events-none" />

      {/* Title */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 z-20 text-center pointer-events-none w-full px-4">
        <span className="text-primary text-[10px] font-black uppercase tracking-[0.5em] mb-2 block drop-shadow-lg font-pixelify">
          Proof of Labor
        </span>
        <h2 className="text-[#E1E0CC] text-2xl md:text-3xl font-serif italic tracking-tight drop-shadow-2xl">
          "It works on my machine"
        </h2>
      </div>
      
      {/* Footer instructional text */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 text-center w-full text-white/40 text-xs tracking-[0.3em] uppercase pointer-events-none font-pixelify">
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
    className="group pointer-events-auto flex flex-col items-center justify-center transition-all duration-300 hover:scale-110 no-underline relative w-full"
  >
    <div className="relative w-24 h-24 drop-shadow-2xl group-hover:brightness-125 transition-all flex items-center justify-center">
      <img loading="lazy" decoding="async" 
        src="https://github.com/othyn/github-folder-icon-macOS/raw/main/art/preview_new.png" 
        alt="Project Folder" 
        className="absolute inset-0 w-full h-full object-contain"
      />
      {/* Graceful text overlay directly on the folder */}
      <div className="absolute inset-0 flex flex-col items-center justify-end pb-3 px-1.5 text-center z-10">
        <p className="text-white/70 text-[5px] font-pixelify font-black uppercase tracking-[0.2em] mb-0.5">{project.id}</p>
        <h3 className="text-white text-[8px] font-pixelify font-medium truncate w-full drop-shadow-md leading-tight">{project.title}</h3>
        <p className="text-white/50 text-[5px] tracking-wider font-pixelify truncate mt-0.5 drop-shadow-md">{project.category}</p>
      </div>
    </div>
  </a>
);
