import re

with open('src/components/Hero.tsx', 'r') as f:
    content = f.read()

# Replace the single canvas with two canvases
old_canvas_block = """        {/* 3D Robotic Arm Interactive Background Layer */}
        <div className="absolute inset-0 z-[5] pointer-events-auto">
          <Canvas style={{ filter: "invert(1)" }} camera={{ position: [0, 0, 8], fov: 45 }}>
            <ambientLight intensity={0.5} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
            
            <React.Suspense fallback={null}>
              <RoboticArm 
                position={[0, -3.2, 0]} 
                scale={4}
              />
            </React.Suspense>
            
            <Environment preset="city" />
            
            <EffectComposer>
              <Fluid 
                radius={0.08} 
                curl={0} 
                swirl={0} 
                distortion={0.1} 
                force={2.0} 
                pressure={0.2} 
                densityDissipation={0.94} 
                velocityDissipation={0.98} 
                intensity={0.8} 
                rainbow={false} 
                fluidColor="#FFFFFF" 
                showBackground={true} backgroundColor="#1C1C2A" 
              />
              <ChromaticAberration 
                blendFunction={2} 
                offset={new THREE.Vector2(0.002, 0.002)}
                radialModulation={false}
                modulationOffset={0}
              />
            </EffectComposer>

          </Canvas>
        </div>"""

new_canvas_block = """        {/* Fluid Background Canvas (Inverted for black fluid) */}
        <div className="absolute inset-0 z-[4] pointer-events-none">
          <Canvas eventSource={containerRef} style={{ filter: "invert(1)" }}>
            <EffectComposer>
              <Fluid 
                radius={0.08} 
                curl={0} 
                swirl={0} 
                distortion={0.1} 
                force={2.0} 
                pressure={0.2} 
                densityDissipation={0.94} 
                velocityDissipation={0.98} 
                intensity={0.8} 
                rainbow={false} 
                fluidColor="#FFFFFF" 
                showBackground={true} backgroundColor="#1C1C2A" 
              />
              <ChromaticAberration 
                blendFunction={2} 
                offset={new THREE.Vector2(0.002, 0.002)}
                radialModulation={false}
                modulationOffset={0}
              />
            </EffectComposer>
          </Canvas>
        </div>

        {/* 3D Robotic Arm Interactive Foreground Layer */}
        <div className="absolute inset-0 z-[5] pointer-events-none">
          <Canvas eventSource={containerRef} camera={{ position: [0, 0, 8], fov: 45 }} gl={{ alpha: true }}>
            <ambientLight intensity={0.5} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
            
            <React.Suspense fallback={null}>
              <RoboticArm 
                position={[0, -3.2, 0]} 
                scale={4}
              />
            </React.Suspense>
            
            <Environment preset="city" />
          </Canvas>
        </div>"""

content = content.replace(old_canvas_block, new_canvas_block)

# Also ensure the container has pointer events
content = content.replace(
    '<div className="w-full h-full overflow-hidden relative" style={{ backgroundColor: \'#E3E3D5\' }}>',
    '<div className="w-full h-full overflow-hidden relative pointer-events-auto" style={{ backgroundColor: \'#E3E3D5\' }}>'
)

with open('src/components/Hero.tsx', 'w') as f:
    f.write(content)
