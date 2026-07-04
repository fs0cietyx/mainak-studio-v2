import re

with open('src/components/Hero.tsx', 'r') as f:
    content = f.read()

# Replace the Fluid import with our new BlobBackground
content = content.replace("import { Fluid } from '@whatisjery/react-fluid-distortion';", "import { BlobBackground } from './BlobBackground';")

# Replace the first canvas block
old_canvas_block = """        {/* Fluid Background Canvas (Inverted for black fluid) */}
        <div className="absolute inset-0 z-[4] pointer-events-none">
          <Canvas eventSource={containerRef} style={{ filter: "invert(1)" }}>
            <EffectComposer>
              <Fluid 
                radius={0.12} 
                curl={0} 
                swirl={0} 
                distortion={0} 
                force={1.5} 
                pressure={0.1} 
                densityDissipation={0.8} 
                velocityDissipation={0.8} 
                intensity={1.0} 
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

new_canvas_block = """        {/* Wobbly Black Fluid Blob Background */}
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

content = content.replace(old_canvas_block, new_canvas_block)

with open('src/components/Hero.tsx', 'w') as f:
    f.write(content)
