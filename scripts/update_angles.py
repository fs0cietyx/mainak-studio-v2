import re

with open('src/components/RoboticArm.tsx', 'r') as f:
    content = f.read()

# Replace the arbitrary 0.15 and 0.25 angles with mathematically exact FOV-matching angles
# Vertical FOV = 45 degrees -> 22.5 deg half-angle -> ~0.392 radians
# Assuming typical 16:9 aspect ratio, Horizontal FOV is ~73 degrees -> 36.5 deg half-angle -> ~0.637 radians

pattern = r'const targetX = -pointer\.y \* Math\.PI \* 0\.15 // Pitch up/down\s*const targetY = -pointer\.x \* Math\.PI \* 0\.25 // Yaw left/right'
replacement = r'''// Mathematically match the 45-degree Camera FOV to ensure it points exactly at the screen edges
      const verticalFOV = (45 * Math.PI) / 180
      const horizontalFOV = verticalFOV * (viewport.width / viewport.height)
      
      const targetX = -pointer.y * (verticalFOV / 2) // Exact vertical pitch
      const targetY = -pointer.x * (horizontalFOV / 2) // Exact horizontal yaw'''

content = re.sub(pattern, replacement, content)

with open('src/components/RoboticArm.tsx', 'w') as f:
    f.write(content)
