import re

with open('src/components/Hero.tsx', 'r') as f:
    content = f.read()

# Change all #FFD600 to #E3E3D5
content = content.replace('#FFD600', '#E3E3D5')

# Revert typography
content = content.replace(
    'className="font-sans text-[14vw] sm:text-[12vw] md:text-[10vw] lg:text-[9vw] font-black leading-[0.8] tracking-[-0.06em] text-center uppercase"',
    'className="font-pixelify text-[12vw] sm:text-[10vw] md:text-[8vw] lg:text-[7vw] font-bold leading-[1] tracking-[-0.05em] text-center"'
)

content = content.replace('text="MAINAK"', 'text="Mainak"')
content = content.replace('text="BISWAS"', 'text="Biswas"')

with open('src/components/Hero.tsx', 'w') as f:
    f.write(content)
