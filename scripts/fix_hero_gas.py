import re

with open('src/components/Hero.tsx', 'r') as f:
    content = f.read()

# Fix imports
content = content.replace(
    "import { EffectComposer } from '@react-three/postprocessing';",
    "import { EffectComposer, ChromaticAberration } from '@react-three/postprocessing';\nimport * as THREE from 'three';"
)

# Replace Fluid block
old_fluid = """              <Fluid 
                radius={0.04} 
                curl={2} 
                swirl={1} 
                distortion={0.2} 
                force={1} 
                pressure={0.5} 
                densityDissipation={0.97} 
                velocityDissipation={0.99} 
                intensity={0.5} 
                rainbow={true} 
                fluidColor="#000000" 
                showBackground={true} backgroundColor="#E3E3D5" 
              />"""

new_fluid = """              <Fluid 
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
                fluidColor="#000000" 
                showBackground={true} backgroundColor="#E3E3D5" 
              />
              <ChromaticAberration 
                blendFunction={2} 
                offset={new THREE.Vector2(0.002, 0.002)}
                radialModulation={false}
                modulationOffset={0}
              />"""

content = content.replace(old_fluid, new_fluid)

with open('src/components/Hero.tsx', 'w') as f:
    f.write(content)
