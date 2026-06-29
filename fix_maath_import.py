import re

with open('src/components/RoboticArm.tsx', 'r') as f:
    content = f.read()

# Add import if missing
if "import { easing } from 'maath'" not in content:
    content = content.replace("import type { GLTF } from 'three-stdlib'", "import type { GLTF } from 'three-stdlib'\nimport { easing } from 'maath'")

with open('src/components/RoboticArm.tsx', 'w') as f:
    f.write(content)
