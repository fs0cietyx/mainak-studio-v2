import re

with open('src/components/RoboticArmClean.tsx', 'r') as f:
    clean_code = f.read()

# Add necessary imports
clean_code = clean_code.replace("import React from 'react'", "import React from 'react'\nimport { useFrame, useThree } from '@react-three/fiber'\nimport * as THREE from 'three'")

# Add useFrame and refs
use_frame_code = '''
  const group = React.useRef<THREE.Group>(null)
  const robotCore = React.useRef<THREE.Group>(null)

  // Fluidly track the mouse cursor with a "fake" IK that looks flawless from the camera's perspective
  useFrame(({ pointer, viewport }) => {
    if (robotCore.current && actions.Animation) {
      // 1. Precise Viewport Mapping
      // Instead of deep 3D IK which forces the base to tilt, we map the pointer strictly to visual rotations.
      // Top left: pointer = (-1, 1), Bottom right: pointer = (1, -1)
      
      const targetX = -pointer.y * Math.PI * 0.15 // Pitch up/down
      const targetY = -pointer.x * Math.PI * 0.25 // Yaw left/right

      // 2. Buttery Smooth Inertia (No rushing, no choppiness)
      const lerpFactor = 0.02
      robotCore.current.rotation.x = THREE.MathUtils.lerp(robotCore.current.rotation.x, targetX, lerpFactor)
      robotCore.current.rotation.y = THREE.MathUtils.lerp(robotCore.current.rotation.y, targetY, lerpFactor)

      // 3. Physical Reach & Lunge
      // We physically scale the entire arm model UP slightly when reaching to edges so it visually touches the cursor
      const distance = Math.max(Math.abs(pointer.x), Math.abs(pointer.y))
      const targetScale = 1 + (distance * 0.3)
      robotCore.current.scale.setScalar(THREE.MathUtils.lerp(robotCore.current.scale.x, targetScale, lerpFactor))

      // 4. Animation Scrubbing
      // We manually scrub the animation timeline so the arm "unfolds" its joints to reach further
      const duration = actions.Animation.getClip().duration
      const targetTime = distance * duration
      actions.Animation.time = THREE.MathUtils.lerp(actions.Animation.time, targetTime, 0.02)
    }
  })

  // Setup the animation for manual scrubbing
  React.useEffect(() => {
    if (actions.Animation) {
      actions.Animation.play()
      actions.Animation.paused = true
    }
  }, [actions])
'''

clean_code = clean_code.replace('const { actions } = useAnimations(animations, group)', 'const { actions } = useAnimations(animations, group)\n' + use_frame_code)

# Ensure refs are applied
clean_code = clean_code.replace('<group {...props} dispose={null}>', '<group ref={group} {...props} dispose={null}>')
clean_code = clean_code.replace('<group name="Sketchfab_Scene">', '<group name="Sketchfab_Scene" ref={robotCore}>')

with open('src/components/RoboticArm.tsx', 'w') as f:
    f.write(clean_code)

