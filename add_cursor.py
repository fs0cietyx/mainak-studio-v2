import re

with open('src/components/Hero.tsx', 'r') as f:
    content = f.read()

# Import the cursor
imports = """import { CustomCursor } from './CustomCursor';
"""

content = content.replace("import { Model as RoboticArm } from './RoboticArm';", "import { Model as RoboticArm } from './RoboticArm';\n" + imports)

# Add CustomCursor inside the section
content = content.replace("<section ref={containerRef} className=\"h-screen w-full relative overflow-hidden\" style={{ backgroundColor: '#E3E3D5' }}>", "<section ref={containerRef} className=\"h-screen w-full relative overflow-hidden\" style={{ backgroundColor: '#E3E3D5' }}>\n      <CustomCursor />")

with open('src/components/Hero.tsx', 'w') as f:
    f.write(content)
