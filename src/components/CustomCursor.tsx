import React, { useEffect, useRef } from 'react';

// A single viscous droplet/node of the biological tail
class BiologicalNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  baseSize: number;
  
  constructor(x: number, y: number, vx: number, vy: number, size: number) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.maxLife = 25; // Splashes survive longer before dissolving
    this.life = this.maxLife;
    this.baseSize = size;
  }

  update(blobX: number, blobY: number, speed: number) {
    if (speed < 0.5) {
      // 1) BUTTERY SNAP BACK: When the main body stops, droplets are smoothly absorbed
      this.x += (blobX - this.x) * 0.15;
      this.y += (blobY - this.y) * 0.15;
      // Shrink organically
      this.life -= 1.2; 
    } else {
      // Normal watery drift outward
      this.x += this.vx;
      this.y += this.vy;
      // Fluid friction
      this.vx *= 0.92;
      this.vy *= 0.92;
      this.life--;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    const progress = Math.max(0, this.life / this.maxLife);
    const easeProgress = Math.pow(progress, 2); // Accelerate shrinking
    
    ctx.beginPath();
    ctx.arc(this.x, this.y, Math.max(0, this.baseSize * easeProgress), 0, Math.PI * 2);
    ctx.fillStyle = 'white'; // Solid white for metaball thresholding
    ctx.fill();
  }
}

export const CustomCursor = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  // Core Position State
  const initialPos = { 
    x: typeof window !== 'undefined' ? window.innerWidth / 2 : 0, 
    y: typeof window !== 'undefined' ? window.innerHeight / 2 : 0 
  };
  const mouse = useRef({ ...initialPos });
  const dot = useRef({ ...initialPos });
  const previousBlob = useRef({ ...initialPos });
  
  // Interaction State
  const isClicking = useRef(false);
  const hoverTarget = useRef<HTMLElement | null>(null);
  const isOver3D = useRef(false);
  const canvasDirty = useRef(false);
  const nodes = useRef<BiologicalNode[]>([]);
  const trailDroplets = useRef<{x: number, y: number, size: number, life: number}[]>([]);
  
  // Smooth size interpolation so it doesn't just blip out of existence
  const currentBlobSize = useRef(0);

  useEffect(() => {
    // Disable on touch devices
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const canvas = canvasRef.current;
    const dotEl = dotRef.current;
    if (!canvas || !dotEl) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Hide native cursor globally
    document.documentElement.style.cursor = 'none';

    // Handle Resize
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    // Mouse Events
    const onMouseMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;

      // Dynamically disable negative filter when hovering over 3D models (canvases)
      const target = e.target as HTMLElement;
      if (target.tagName.toLowerCase() === 'canvas' || target.closest('.no-difference') || target.closest('[data-3d-section="true"]')) {
        isOver3D.current = true;
        dotEl.style.mixBlendMode = 'normal';
      } else {
        isOver3D.current = false;
        dotEl.style.mixBlendMode = 'difference';
      }
    };
    const onMouseDown = () => (isClicking.current = true);
    const onMouseUp = () => (isClicking.current = false);

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);

    // Magnetic Hover Detection (Event Delegation)
    const onMouseOver = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a, button, [data-magnetic]') as HTMLElement;
      if (target) hoverTarget.current = target;
    };
    const onMouseOut = (e: MouseEvent) => {
      if (hoverTarget.current && !(e.relatedTarget as HTMLElement)?.closest('a, button, [data-magnetic]')) {
        hoverTarget.current = null;
      }
    };
    window.addEventListener('mouseover', onMouseOver);
    window.addEventListener('mouseout', onMouseOut);

    // Main Render Loop
    let rafId: number;
    
    const tick = (time: number) => {
      // 1. Core Physics & Organism State
      let targetX = mouse.current.x;
      let targetY = mouse.current.y;
      
      // Respiration: The organism breathes even when perfectly still
      const respiration = Math.sin(time * 0.005) * 6; 
      let blobTargetSize = 42 + respiration; 
      
      // 2. Buttery Magnetic Hover (State of the Art)
      if (hoverTarget.current) {
        const rect = hoverTarget.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // Smooth LERP pull instead of hard snap
        const distX = centerX - mouse.current.x;
        const distY = centerY - mouse.current.y;
        
        targetX = mouse.current.x + distX * 0.45;
        targetY = mouse.current.y + distY * 0.45;
        
        blobTargetSize = 35 + respiration; 
      }

      if (isClicking.current) {
        blobTargetSize *= 0.7; // Compress smoothly on click
      }

      if (isOver3D.current) {
        blobTargetSize = 0;
      }

      // Calculate head movement speed for fluid pull physics

      // 3. Calculate Head Velocity for Visibility
      const vx = targetX - previousBlob.current.x;
      const vy = targetY - previousBlob.current.y;
      const speed = Math.sqrt(vx * vx + vy * vy);

      // Expand radius based on movement speed (vigorous shaking)
      if (!hoverTarget.current) {
        const velocityExpansion = Math.min(speed * 0.5, 45);
        blobTargetSize += velocityExpansion;
      }

      // --- INVISIBLE WHEN STATIONARY ---
      if (speed < 0.5 && !hoverTarget.current) {
        blobTargetSize = 0;
        dotEl.style.opacity = '0';
      } else {
        dotEl.style.opacity = '1';
      }

      // Smoothly interpolate the size for buttery transitions
      currentBlobSize.current += (blobTargetSize - currentBlobSize.current) * 0.12;

      const currentTime = Date.now() * 0.003;
      const isFocused = hoverTarget.current || isOver3D.current;

      // 1. Brain logic: The nucleus (dot) wanders nervously inside the head
      const eyeTwitchX = (Math.random() - 0.5) * (isFocused ? 2 : 12);
      const eyeTwitchY = (Math.random() - 0.5) * (isFocused ? 2 : 12);
      
      // 4. Interpolate Dot (The Nucleus) - Buttery smooth dragging + twitching
      dot.current.x += (targetX + eyeTwitchX - dot.current.x) * 0.25;
      dot.current.y += (targetY + eyeTwitchY - dot.current.y) * 0.25;

      // 5. UPDATE INVERSE KINEMATICS (IK) CHAIN
      // Initialize nodes array if empty
      if (nodes.current.length < 80) {
        nodes.current = [];
        for (let i = 0; i < 80; i++) {
           nodes.current.push(new BiologicalNode(targetX, targetY, 0, 0, 0));
        }
      }

      // The head (Node 0) follows a wandering target to feel alive
      previousBlob.current.x = nodes.current[0].x;
      previousBlob.current.y = nodes.current[0].y;
      
      // It explores a radius around the cursor, but locks on instantly if hovering a button
      const wanderSpeed = currentTime * 1.5;
      const exploreRadius = isFocused ? 0 : 25;
      
      const autonomousOffsetX = Math.sin(wanderSpeed) * Math.cos(wanderSpeed * 0.73) * exploreRadius;
      const autonomousOffsetY = Math.cos(wanderSpeed * 0.89) * Math.sin(wanderSpeed * 1.2) * exploreRadius;
      
      const brainTargetX = targetX + autonomousOffsetX;
      const brainTargetY = targetY + autonomousOffsetY;

      nodes.current[0].x += (brainTargetX - nodes.current[0].x) * 0.25;
      nodes.current[0].y += (brainTargetY - nodes.current[0].y) * 0.25;
      
      // The rest of the body follows using highly viscous spring physics
      for (let i = 1; i < nodes.current.length; i++) {
        const prev = nodes.current[i - 1];
        const curr = nodes.current[i];
        
        const dx = prev.x - curr.x;
        const dy = prev.y - curr.y;
        
        // Lower drag for wilder whip mechanics (0.2 to 0.5)
        const drag = 0.2 + (i / nodes.current.length) * 0.3; 
        
        // Spring pulling toward the node in front
        curr.vx += (prev.x - curr.x) * 0.5;
        curr.vy += (prev.y - curr.y) * 0.5;
        
        // ORGANIC WRITHE: The symbiote "breathes" or "spasms" rhythmically
        const spasm = Math.pow(Math.sin(currentTime * 1.5 - i * 0.05), 8); // Deep pulses that travel down the tail
        const writheX = Math.sin(currentTime * 2 + i * 0.3) * (0.8 + spasm * 3.5);
        const writheY = Math.cos(currentTime * 1.8 + i * 0.3) * (0.8 + spasm * 3.5);
        curr.vx += writheX;
        curr.vy += writheY;
        
        // Apply friction/drag
        curr.vx *= (1 - drag);
        curr.vy *= (1 - drag);
        
        curr.x += curr.vx;
        curr.y += curr.vy;

        // INELASTIC CONSTRAINT (The Symbiote Web)
        const newDx = prev.x - curr.x;
        const newDy = prev.y - curr.y;
        const newDist = Math.sqrt(newDx * newDx + newDy * newDy) || 1;
        const maxStretch = 3.5; // Tighter constraint for denser fluid
        if (newDist > maxStretch) {
           curr.x = prev.x - (newDx / newDist) * maxStretch;
           curr.y = prev.y - (newDy / newDist) * maxStretch;
        }
      }

      // 7. Update DOM (Inner Dot / Nucleus)
      const dotScale = isClicking.current ? 0.5 : (hoverTarget.current ? 1.5 : 1);
      dotEl.style.transform = `translate3d(${dot.current.x}px, ${dot.current.y}px, 0) translate(-50%, -50%) scale(${dotScale})`;

      // Update Global CSS variables for cursor tracking (e.g. for flashlight mask effects)
      const baseSize = Math.max(currentBlobSize.current, 15);
      const cx = nodes.current[0].x;
      const cy = nodes.current[0].y;
      const maskRadius = baseSize * 1.5;
      
      document.body.style.setProperty('--cursor-x', `${cx}px`);
      document.body.style.setProperty('--cursor-y', `${cy}px`);
      document.body.style.setProperty('--cursor-size', `${baseSize}px`);
      document.body.style.setProperty('--mask-size', `${maskRadius}px`);

      // Calculate head movement speed for fluid pull physics
      const headSpeed = speed * 0.15;
      
      // Update Liquid Lens Displacement
      const lensEl = document.getElementById('liquid-lens');
      if (lensEl) {
        // Track the head node exactly
        lensEl.style.transform = `translate3d(${nodes.current[0].x}px, ${nodes.current[0].y}px, 0) translate(-50%, -50%)`;
      }
      
      const velocityMatrix = document.getElementById('velocity-matrix');
      const pullMap = document.getElementById('pull-map');
      
      if (velocityMatrix && pullMap) {
        // Directional pull: push pixels in the direction of movement
        const maxOffset = 0.45;
        const pullFactor = 0.008;
        // Invert vx/vy because sampling from the opposite direction moves pixels along the velocity vector
        const offsetX = Math.max(-maxOffset, Math.min(maxOffset, -vx * pullFactor));
        const offsetY = Math.max(-maxOffset, Math.min(maxOffset, -vy * pullFactor));
        
        velocityMatrix.setAttribute('values', `1 0 0 0 ${offsetX}  0 1 0 0 ${offsetY}  0 0 1 0 0  0 0 0 1 0`);
        
        // Keep ripples minimal. Base scale is small, expands slightly on movement
        const baseScale = 15;
        const dynamicScale = Math.min(headSpeed * 1.5, 30);
        
        const currentScale = parseFloat(pullMap.getAttribute('scale') || '0');
        const newScale = currentScale + ((baseScale + dynamicScale) - currentScale) * 0.15;
        pullMap.setAttribute('scale', newScale.toString());
      }



      // 8. Render Canvas (IK Metaball Engine) - EXTREME CPU OPTIMIZATION
      if (currentBlobSize.current < 0.5 && trailDroplets.current.length === 0) {
        if (canvasDirty.current) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          canvasDirty.current = false;
        }
        // Short-circuit the rest of the render pipeline
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvasDirty.current = true;
      
      // Draw IK Tentacle
      if (currentBlobSize.current > 0.5) {
        ctx.strokeStyle = 'white';
        ctx.fillStyle = 'white';
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        // Draw connecting fluid as a continuous variable-width stroke
        for (let i = 0; i < nodes.current.length - 1; i++) {
          const curr = nodes.current[i];
          const next = nodes.current[i + 1];
          const thicknessRatio = 1 - (i / nodes.current.length);
          // Exponent 0.7 creates a sharper, teardrop/snail-like taper
          const size = currentBlobSize.current * Math.max(0.05, Math.pow(thicknessRatio, 0.7));
          
          ctx.beginPath();
          ctx.moveTo(curr.x, curr.y);
          ctx.lineTo(next.x, next.y);
          ctx.lineWidth = size * 2;
          ctx.stroke();
        }
        
        if (isOver3D.current) {
          trailDroplets.current = [];
        } else {
          // Spawn slimy trail droplets left behind when dragging
          if (speed > 1.5) { // Spawn more often (lower speed threshold)
             const numDroplets = Math.floor(speed / 4) + 1;
             for (let j = 0; j < Math.min(numDroplets, 3); j++) {
               if (Math.random() > 0.4) {
                 // Mostly spawn from the end of the tail for a true continuous trail
                 const spawnIndex = nodes.current.length - 1 - Math.floor(Math.random() * 8);
                 const spawnNode = nodes.current[spawnIndex];
                 if (spawnNode) {
                   trailDroplets.current.push({
                     x: spawnNode.x + (Math.random() - 0.5) * 6,
                     y: spawnNode.y + (Math.random() - 0.5) * 6,
                     // Tiny wet droplets
                     size: currentBlobSize.current * (0.08 + Math.random() * 0.15),
                     life: 1.0
                   });
                 }
               }
             }
          }

          // Draw and update the detached gooey trail droplets
          ctx.beginPath();
          for (let i = trailDroplets.current.length - 1; i >= 0; i--) {
            const drop = trailDroplets.current[i];
            drop.life -= 0.02; // Faster dissolve for wet trail evaporation
            if (drop.life <= 0) {
              trailDroplets.current.splice(i, 1);
            } else {
              ctx.moveTo(drop.x, drop.y);
              ctx.arc(drop.x, drop.y, Math.max(0, drop.size * Math.pow(drop.life, 0.5)), 0, Math.PI * 2);
            }
          }
          ctx.fill();
        }
      }
      }

      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    return () => {
      document.documentElement.style.cursor = '';
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('mouseover', onMouseOver);
      window.removeEventListener('mouseout', onMouseOut);
      cancelAnimationFrame(rafId);
    };
  }, []);

  if (typeof window !== 'undefined' && window.matchMedia("(pointer: coarse)").matches) {
    return null;
  }

  return (
    <>
      {/* Liquid Displacement Lens - Warps DOM elements behind the cursor directionally */}
      <div 
        id="liquid-lens"
        className="pointer-events-none fixed z-[9997]"
        style={{
          width: '260px', 
          height: '260px',
          left: 0, top: 0,
          backdropFilter: 'url(#pull-filter)',
          WebkitBackdropFilter: 'url(#pull-filter)',
          maskImage: 'radial-gradient(circle at center, black 0%, transparent 55%)',
          WebkitMaskImage: 'radial-gradient(circle at center, black 0%, transparent 55%)',
          willChange: 'transform'
        }}
      />
      
      {/* Hidden SVG Filter Definition for the Gooey Metaball effect */}
      <svg className="hidden">
        <defs>
          <filter id="metaball-goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix 
              in="blur" 
              mode="matrix" 
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 15 -5" 
              result="goo" 
            />
          </filter>
          
          {/* Liquid Lens Pull Filter */}
          <filter id="pull-filter" x="-20%" y="-20%" width="140%" height="140%">
            {/* Very low frequency for smooth organic liquid, minimal ripples */}
            <feTurbulence type="fractalNoise" baseFrequency="0.005" numOctaves="1" result="noise" />
            
            {/* Directional bias injected via React physics loop */}
            <feColorMatrix 
              id="velocity-matrix"
              in="noise" 
              type="matrix" 
              values="1 0 0 0 0   0 1 0 0 0   0 0 1 0 0   0 0 0 1 0" 
              result="biasedNoise" 
            />
            
            <feDisplacementMap 
              id="pull-map"
              in="SourceGraphic" 
              in2="biasedNoise" 
              scale="0" 
              xChannelSelector="R" 
              yChannelSelector="G" 
            />
          </filter>
        </defs>
      </svg>

      {/* Layer 3 & 4: The Biological Blob & Tail Canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-[9998]"
        style={{ 
          mixBlendMode: 'difference',
          filter: 'url(#metaball-goo)'
        }}
      />
      
      {/* Layer 2: The Inner Precision Dot (The Nucleus) */}
      <div 
        ref={dotRef}
        className="fixed top-0 left-0 w-[6px] h-[6px] bg-white rounded-full pointer-events-none z-[9999] shadow-[0_0_10px_rgba(0,0,0,0.5)]"
        style={{
          mixBlendMode: 'difference',
          willChange: 'transform',
          transition: 'transform 0.1s cubic-bezier(0.25, 1, 0.5, 1)',
        }}
      />
    </>
  );
};
