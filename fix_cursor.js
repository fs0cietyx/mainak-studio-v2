const fs = require('fs');
const content = fs.readFileSync('src/components/CustomCursor.tsx', 'utf-8');
const lines = content.split('\n');

const startIdx = lines.findIndex(l => l.includes('// Draw IK Tentacle'));
const newContent = lines.slice(0, startIdx).join('\n') + `
      // Draw IK Tentacle
      if (currentBlobSize.current > 0.5) {
        ctx.fillStyle = 'white';
        
        // Draw connecting fluid
        ctx.beginPath();
        for (let i = 0; i < nodes.current.length; i++) {
          const node = nodes.current[i];
          const thicknessRatio = 1 - (i / nodes.current.length);
          const size = currentBlobSize.current * Math.max(0.1, Math.pow(thicknessRatio, 0.5));
          
          ctx.moveTo(node.x, node.y);
          ctx.arc(node.x, node.y, size, 0, Math.PI * 2);
        }
        ctx.fill();
        
        if (isOver3D.current) {
          trailDroplets.current = [];
        } else {
          // Spawn slimy trail droplets left behind when dragging
          if (speed > 3 && Math.random() > 0.4) {
            const spawnIndex = Math.floor(Math.random() * (nodes.current.length - 5)) + 5;
            const spawnNode = nodes.current[spawnIndex];
            if (spawnNode) {
              trailDroplets.current.push({
                x: spawnNode.x + (Math.random() - 0.5) * 10,
                y: spawnNode.y + (Math.random() - 0.5) * 10,
                size: currentBlobSize.current * (0.15 + Math.random() * 0.3),
                life: 1.0
              });
            }
          }

          // Draw and update the detached gooey trail droplets
          ctx.beginPath();
          for (let i = trailDroplets.current.length - 1; i >= 0; i--) {
            const drop = trailDroplets.current[i];
            drop.life -= 0.012; // Slow dissolve
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
            <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="blur" />
            <feColorMatrix 
              in="blur" 
              mode="matrix" 
              values="1 0 0 0 0  
                      0 1 0 0 0  
                      0 0 1 0 0  
                      0 0 0 60 -15" 
              result="goo" 
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop"/>
          </filter>
        </defs>
      </svg>

      {/* Layer 1: The Bio-Slime Trail Canvas (The Body) */}
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
`;

fs.writeFileSync('src/components/CustomCursor.tsx', newContent);
