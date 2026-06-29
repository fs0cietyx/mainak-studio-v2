import re

with open('src/components/RoboticArm.tsx', 'r') as f:
    content = f.read()

tracking_pattern = r'      // 1\. Exact 3D Inverse Kinematics Targeting.*?actions\.Animation\.time = THREE\.MathUtils\.lerp\(actions\.Animation\.time, targetTime, 0\.02\)'

new_tracking = '''      // 1. Raycast cursor to exactly Z=4 (the glass of the screen)
      const vec = new THREE.Vector3(pointer.x, pointer.y, 0.5)
      vec.unproject(camera)
      vec.sub(camera.position).normalize()
      
      const targetZ = 4
      const distanceToPlane = (targetZ - camera.position.z) / vec.z
      const cursor3D = camera.position.clone().add(vec.multiplyScalar(distanceToPlane))

      // 2. Absolute Tracking Calculation (Local Space)
      const baseWorldPos = new THREE.Vector3(0, -3.2, 0)
      const targetLocalPos = cursor3D.clone().sub(baseWorldPos)

      // 3. Perfect 3D LookAt (Pitch + Yaw)
      // Since robotCore now ONLY contains the upper arm and NOT the base, we can freely rotate it in 3D!
      dummy.position.set(0, 0, 0)
      dummy.lookAt(targetLocalPos)

      const targetRotX = dummy.rotation.x
      const targetRotY = dummy.rotation.y
      const targetRotZ = dummy.rotation.z

      // 4. Telescopic Reach (Stretch exactly to the cursor's true 3D distance)
      const distanceToCursor = targetLocalPos.length()
      const baseArmLength = 4.0 
      const targetScaleZ = distanceToCursor / baseArmLength

      // 5. Apply Buttery Smooth Physics
      const lerpFactor = 0.015 
      robotCore.current.rotation.x = THREE.MathUtils.lerp(robotCore.current.rotation.x, targetRotX, lerpFactor)
      robotCore.current.rotation.y = THREE.MathUtils.lerp(robotCore.current.rotation.y, targetRotY, lerpFactor)
      robotCore.current.rotation.z = THREE.MathUtils.lerp(robotCore.current.rotation.z, targetRotZ, lerpFactor)
      
      robotCore.current.scale.x = 1
      robotCore.current.scale.y = 1
      robotCore.current.scale.z = THREE.MathUtils.lerp(robotCore.current.scale.z, targetScaleZ, lerpFactor)'''

content = re.sub(tracking_pattern, new_tracking, content, flags=re.DOTALL)

with open('src/components/RoboticArm.tsx', 'w') as f:
    f.write(content)
