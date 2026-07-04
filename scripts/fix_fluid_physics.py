import re

with open('src/components/Hero.tsx', 'r') as f:
    content = f.read()

# Replace the BlobBackground import with Fluid
content = content.replace("import { BlobBackground } from './BlobBackground';", "import { Fluid } from '@whatisjery/react-fluid-distortion';")

# Replace the first canvas block
old_canvas_block = """        {/* Wobbly Black Fluid Blob Background */}
        <div className="absolute inset-0 z-[4] pointer-events-none">
          <Canvas eventSource={containerRef} gl={{ alpha: true }} camera={{ position: [0, 0, 8], fov: 45 }}>
            <ambientLight intensity={1} />
            <directionalLight position={[10, 10, 10]} intensity={1} />
            
            <BlobBackground />
            
            <EffectComposer>
              <ChromaticAberration 
                blendFunction={2} 
                offset={new THREE.Vector2(0.003, 0.003)}
                radialModulation={false}
                modulationOffset={0}
              />
            </EffectComposer>
          </Canvas>
        </div>"""

new_canvas_block = """        {/* Free Flowing Fluid Simulation Background */}
        <div className="absolute inset-0 z-[4] pointer-events-none">
          <Canvas eventSource={containerRef}>
            <EffectComposer>
              <Fluid 
                radius={0.25} 
                curl={5} 
                swirl={4} 
                distortion={0.2} 
                force={4.0} 
                pressure={0.8} 
                densityDissipation={0.95} 
                velocityDissipation={0.98} 
                intensity={8.0} 
                rainbow={false} 
                fluidColor="#000000" 
                showBackground={true} 
                backgroundColor="#E3E3D5" 
              />
              <ChromaticAberration 
                blendFunction={2} 
                offset={new THREE.Vector2(0.003, 0.003)}
                radialModulation={false}
                modulationOffset={0}
              />
            </EffectComposer>
          </Canvas>
        </div>"""

content = content.replace(old_canvas_block, new_canvas_block)

with open('src/components/Hero.tsx', 'w') as f:
    f.write(content)
