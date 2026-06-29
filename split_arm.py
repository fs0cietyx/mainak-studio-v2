import re

with open('src/components/RoboticArm.tsx', 'r') as f:
    lines = f.readlines()

new_lines = []
in_scene = False
created_refs = False

for i, line in enumerate(lines):
    if "export function RoboticArm(props: JSX.IntrinsicElements['group']) {" in line:
        new_lines.append(line)
        new_lines.append("  const baseGroup = React.useRef<THREE.Group>(null)\n")
        continue

    if "<group ref={robotCore} {...props} dispose={null}>" in line:
        new_lines.append(line.replace("ref={robotCore} ", ""))
        continue
        
    if "<group name=\"Scene\">" in line:
        new_lines.append(line)
        new_lines.append("        <group ref={baseGroup} name=\"Base_Group\">\n")
        in_scene = True
        continue
        
    if in_scene and '<group name="roboarm001_low_0"' in line:
        new_lines.append("        </group>\n")
        new_lines.append("        <group ref={robotCore} name=\"Arm_Group\">\n")
        new_lines.append(line)
        continue
        
    if in_scene and '<group name="robot_base002_low_31"' in line:
        new_lines.append("        </group>\n")
        new_lines.append("        <group name=\"Base_Group_2\">\n")
        new_lines.append(line)
        continue
        
    if in_scene and '</group>' in line and i == len(lines) - 4:
        new_lines.append("        </group>\n")
        new_lines.append(line)
        continue
        
    new_lines.append(line)

with open('src/components/RoboticArm.tsx', 'w') as f:
    f.writelines(new_lines)
