import re

with open('src/components/Hero.tsx', 'r') as f:
    content = f.read()

# Import the effects
imports = """import { EffectComposer } from '@react-three/postprocessing';
import { Fluid } from '@whatisjery/react-fluid-distortion';
"""

# Find the last import and add these
content = content.replace("import { Model as RoboticArm } from './RoboticArm';", "import { Model as RoboticArm } from './RoboticArm';\n" + imports)

# Add EffectComposer inside the Canvas, right after Environment
effect = """            
            <EffectComposer>
              <Fluid 
                radius={0.05} 
                curl={10} 
                swirl={5} 
                distortion={1.5} 
                force={2} 
                pressure={0.9} 
                densityDissipation={0.98} 
                velocityDissipation={0.99} 
                intensity={0.3} 
                rainbow={false} 
                fluidColor="#000000" 
                showBackground={false} 
              />
            </EffectComposer>
"""

content = content.replace("<Environment preset=\"city\" />", "<Environment preset=\"city\" />\n" + effect)

with open('src/components/Hero.tsx', 'w') as f:
    f.write(content)
