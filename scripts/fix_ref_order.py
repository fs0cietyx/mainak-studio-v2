import re

with open('src/components/RoboticArm.tsx', 'r') as f:
    lines = f.readlines()

new_lines = []
group_lines = []

# Extract the group refs
for line in lines:
    if 'const group = React.useRef' in line or 'const robotCore = React.useRef' in line:
        group_lines.append(line)
    else:
        new_lines.append(line)

# Insert them before useGLTF and useAnimations
final_lines = []
for line in new_lines:
    if 'const { nodes, materials, animations } = useGLTF' in line:
        final_lines.extend(group_lines)
    final_lines.append(line)

with open('src/components/RoboticArm.tsx', 'w') as f:
    f.writelines(final_lines)
