import re

with open('src/components/RoboticArm.tsx', 'r') as f:
    content = f.read()

# I need to add back the actions.Animation.time logic to useFrame

pattern = r'(      robotCore\.current\.scale\.z = THREE\.MathUtils\.lerp\(robotCore\.current\.scale\.z, targetScaleZ, lerpFactor\))'
replacement = r'''\1
      
      // 6. Animation Scrubbing (unfold the arm)
      // Map pointer.y and pointer.x into distance to drive the mechanical unfold animation
      const distance = Math.max(Math.abs(pointer.x), Math.abs(pointer.y))
      const duration = actions.Animation.getClip().duration
      const targetTime = distance * duration
      actions.Animation.time = THREE.MathUtils.lerp(actions.Animation.time, targetTime, 0.02)'''

content = re.sub(pattern, replacement, content)

with open('src/components/RoboticArm.tsx', 'w') as f:
    f.write(content)
