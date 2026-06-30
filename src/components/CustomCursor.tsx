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
  const previousMouse = useRef({ ...initialPos });
  
  // Interaction State
  const isClicking = useRef(false);
  const hoverTarget = useRef<HTMLElement | null>(null);
  const isOver3D = useRef(false);
  const canvasDirty = useRef(false);
  const nodes = useRef<BiologicalNode[]>([]);
  const trailDroplets = useRef<{x: number, y: number, size: number, life: number}[]>([]);
  
  // Smooth size interpolation so it doesn't just blip out of existence
  
  // Generate a spherical normal map for the refraction lens
  const lensDataUrl = React.useMemo(() => {
    if (typeof document === 'undefined') return '';
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      for (let y = 0; y < 64; y++) {
        for (let x = 0; x < 64; x++) {
          const dx = x - 32;
          const dy = y - 32;
          const dist = Math.sqrt(dx * dx + dy * dy) / 32;
          if (dist > 1) {
             ctx.fillStyle = 'rgba(128, 128, 255, 0)';
             ctx.fillRect(x, y, 1, 1);
          } else {
             const nx = dx / 32;
             const ny = dy / 32;
             const r = Math.floor((nx * 0.5 + 0.5) * 255);
             const g = Math.floor((ny * 0.5 + 0.5) * 255);
             
             let a = 255;
             if (dist > 0.7) {
                a = Math.floor(((1 - dist) / 0.3) * 255);
             }
             ctx.fillStyle = `rgba(${r}, ${g}, 255, ${a / 255})`;
             ctx.fillRect(x, y, 1, 1);
          }
        }
      }
    }
    return canvas.toDataURL();
  }, []);

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
      // Default resting radius (massive for more liquid volume)
      let blobTargetSize = 60 + respiration; 
      
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
        
        blobTargetSize = 75 + respiration; 
      } else if (isOver3D.current) {
        // Subtle contraction when entering 3D space
        blobTargetSize = 40 + respiration; 
      }

      if (isClicking.current) {
        blobTargetSize *= 0.7; // Compress smoothly on click
      }

      // Calculate head movement speed for fluid pull physics

      // 3. Calculate Head Velocity for Visibility
      const vx = mouse.current.x - previousMouse.current.x;
      const vy = mouse.current.y - previousMouse.current.y;
      const speed = Math.sqrt(vx * vx + vy * vy);
      previousMouse.current = { ...mouse.current };

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
      // A small number of nodes (15) creates a cohesive fluid drop instead of a long snake tail
      if (nodes.current.length < 15) {
        nodes.current = [];
        for (let i = 0; i < 15; i++) {
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
        
        // Extreme drag for thick, viscous fluid (no bouncing)
        const drag = 0.7 + (i / nodes.current.length) * 0.2; 
        
        // Very weak spring so it oozes instead of snapping back like a rubber band
        curr.vx += (prev.x - curr.x) * 0.08;
        curr.vy += (prev.y - curr.y) * 0.08;
        
        // ORGANIC WRITHE: The symbiote "breathes" or "spasms" rhythmically
        const spasm = Math.pow(Math.sin(currentTime * 1.5 - i * 0.05), 8); // Deep pulses that travel down the tail
        const writheX = Math.sin(currentTime * 2 + i * 0.3) * (0.8 + spasm * 3.5);
        const writheY = Math.cos(currentTime * 1.8 + i * 0.3) * (0.8 + spasm * 3.5);
        curr.vx += writheX * 0.5; // Dampened writhe so it doesn't shake wildly
        curr.vy += writheY * 0.5;
        
        curr.vx *= (1 - drag);
        curr.vy *= (1 - drag);
        
        if (speed < 0.5) {
          // Slow, oozing collapse when resting (0.05) instead of violent snapping (0.85)
          curr.x += (prev.x - curr.x) * 0.08;
          curr.y += (prev.y - curr.y) * 0.08;
          // Keep a tiny bit of momentum so it settles naturally
          curr.vx *= 0.8;
          curr.vy *= 0.8;
          curr.x += curr.vx;
          curr.y += curr.vy;
        } else {
          curr.x += curr.vx;
          curr.y += curr.vy;
        }

        // INELASTIC CONSTRAINT (The Symbiote Web)
        const newDx = prev.x - curr.x;
        const newDy = prev.y - curr.y;
        const newDist = Math.sqrt(newDx * newDx + newDy * newDy) || 1;
        const maxStretch = 4.5; // Allow it to stretch more to feel like a larger volume of fluid
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

      // No displacement map update needed anymore

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

      // Update SVG Lenses
      for (let i = 0; i < 8; i++) {
        const lens = document.getElementById(`lens-${i}`);
        if (lens) {
          if (currentBlobSize.current < 0.5 && trailDroplets.current.length === 0) {
            lens.setAttribute('width', '0');
            lens.setAttribute('height', '0');
          } else {
            // Map to the first 8 nodes
            const nodeIndex = i * 2;
            const node = nodes.current[nodeIndex];
            if (node) {
              const thicknessRatio = 1 - (nodeIndex / nodes.current.length);
              const sizeMultiplier = currentBlobSize.current * Math.max(0.05, Math.pow(thicknessRatio, 0.7));
              const lensSize = Math.max(sizeMultiplier * 2.2, 10);
              
              lens.setAttribute('x', String(node.x - lensSize / 2));
              lens.setAttribute('y', String(node.y - lensSize / 2));
              lens.setAttribute('width', String(lensSize));
              lens.setAttribute('height', String(lensSize));
            }
          }
        }
      }

      
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
          // High minimum thickness (0.8) and very subtle taper (0.1 exponent) 
          // to maintain massive liquid volume throughout the shape
          const size = currentBlobSize.current * Math.max(0.8, Math.pow(thicknessRatio, 0.1));
          
          ctx.beginPath();
          ctx.moveTo(curr.x, curr.y);
          ctx.lineTo(next.x, next.y);
          ctx.lineWidth = size * 2;
          ctx.stroke();
        }
        
        if (isOver3D.current) {
          trailDroplets.current = [];
        } else {
          // Spawn thick viscous trail droplets left behind when dragging
          if (speed > 0.5) { 
             const numDroplets = Math.floor(speed / 3) + 4;
             for (let j = 0; j < Math.min(numDroplets, 12); j++) {
               // Spawn from the back half of the fluid capsule
               const spawnIndex = nodes.current.length - 1 - Math.floor(Math.random() * 5);
               const spawnNode = nodes.current[spawnIndex];
               if (spawnNode) {
                 trailDroplets.current.push({
                   x: spawnNode.x + (Math.random() - 0.5) * 12,
                   y: spawnNode.y + (Math.random() - 0.5) * 12,
                   // Massive droplets (60% to 110% of blob size) for insane fluid volume
                   size: currentBlobSize.current * (0.8 + Math.random() * 0.7),
                   life: 1.0
                 });
               }
             }
          }

          // Draw and update the detached gooey trail droplets
          ctx.beginPath();
          for (let i = trailDroplets.current.length - 1; i >= 0; i--) {
            const drop = trailDroplets.current[i];
            // Extremely slow evaporation to leave massive lingering pools of fluid
            drop.life -= speed < 0.5 ? 0.02 : 0.008;
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
      {/* Hidden SVG Filter Definition for the Gooey Metaball effect */}
      <svg className="hidden">
        <defs>
          <filter id="metaball-goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="15" result="blur" />
            <feColorMatrix 
              in="blur" 
              mode="matrix" 
              values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 30 -12" 
              result="goo" 
            />
                                                <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>

          <filter id="text-refraction-lens" x="0%" y="0%" width="100%" height="100%" colorInterpolationFilters="sRGB">
            <feImage id="lens-0" href={lensDataUrl} x="0" y="0" width="0" height="0" result="lens0" />
            <feImage id="lens-1" href={lensDataUrl} x="0" y="0" width="0" height="0" result="lens1" />
            <feImage id="lens-2" href={lensDataUrl} x="0" y="0" width="0" height="0" result="lens2" />
            <feImage id="lens-3" href={lensDataUrl} x="0" y="0" width="0" height="0" result="lens3" />
            <feImage id="lens-4" href={lensDataUrl} x="0" y="0" width="0" height="0" result="lens4" />
                                                
            <feComposite in="lens0" in2="lens1" operator="over" result="c1" />
            <feComposite in="c1" in2="lens2" operator="over" result="c2" />
            <feComposite in="c2" in2="lens3" operator="over" result="c3" />
                                                <feComposite in="c3" in2="lens4" operator="over" result="displacement_map" />
            
            {/* Generate a neutral background (RGB 128) */}
            <feFlood floodColor="#808080" result="neutral" />
            {/* Composite the displacement map over the neutral background */}
            <feComposite in="displacement_map" in2="neutral" operator="over" result="full_displacement" />

            <feColorMatrix in="SourceGraphic" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="text_r" />
            <feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="text_g" />
                        <feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="text_b" />
            
            <feDisplacementMap in="text_r" in2="full_displacement" scale="12" xChannelSelector="R" yChannelSelector="G" result="refracted_r" />
            <feDisplacementMap in="text_g" in2="full_displacement" scale="8" xChannelSelector="R" yChannelSelector="G" result="refracted_g" />
            <feDisplacementMap in="text_b" in2="full_displacement" scale="4" xChannelSelector="R" yChannelSelector="G" result="refracted_b" />
                                                
            <feBlend in="refracted_r" in2="refracted_g" mode="screen" result="rg" />
            <feBlend in="rg" in2="refracted_b" mode="screen" result="rgb" />
            
            {/* Alpha mask using the displacement map itself so it STRICTLY only applies where lenses exist */}
            <feColorMatrix in="displacement_map" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 1 0" result="mask_alpha" />
            <feComposite in="rgb" in2="mask_alpha" operator="in" result="masked_rgb" />
          </filter>

        </defs>
      </svg>

      {/* 
        Layer 3: Refraction Overlay (Applies to EVERYTHING behind it across the whole site) 
        This is placed at z-[9997] so any 3D models at z-[9999] will be placed ON TOP of it
        and thus will NOT be refracted or inverted!
      */}
      <div 
        className="pointer-events-none fixed inset-0 z-[9997]"
        style={{
          backdropFilter: 'url(#text-refraction-lens)',
          WebkitBackdropFilter: 'url(#text-refraction-lens)',
          willChange: 'backdrop-filter, transform',
          transform: 'translateZ(0)'
        }}
      />
      
      {/* Layer 4: The Biological Blob & Tail Canvas (Inversion effect) */}
      <canvas
        id="symbiote-canvas"
        ref={canvasRef}
        className="pointer-events-none fixed inset-0 z-[9998]"
        style={{
          mixBlendMode: 'difference',
          width: '100vw',
          height: '100vh',
          filter: 'url(#metaball-goo)',
          willChange: 'filter, transform',
          transform: 'translateZ(0)'
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
