import re

with open('src/components/Hero.tsx', 'r') as f:
    content = f.read()

# Change all #E3E3D5 to #FFD600
content = content.replace('#E3E3D5', '#FFD600')

with open('src/components/Hero.tsx', 'w') as f:
    f.write(content)

with open('src/components/RoboticArm.tsx', 'r') as f:
    arm = f.read()

# We might want to adjust lighting, but let's stick to Hero first.
