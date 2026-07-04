import re

with open('src/components/Hero.tsx', 'r') as f:
    content = f.read()

# Modify Canvas to have filter: 'invert(1)'
content = content.replace(
    '<Canvas',
    '<Canvas style={{ filter: "invert(1)" }}'
)

# Replace the Fluid colors
old_fluid = """              <Fluid 
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
                fluidColor="#FFFFFF" 
                showBackground={true} backgroundColor="#1C1C2A" 
              />"""

content = content.replace(old_fluid, new_fluid)

with open('src/components/Hero.tsx', 'w') as f:
    f.write(content)
