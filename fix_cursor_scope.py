import re

with open('src/components/CustomCursor.tsx', 'r') as f:
    content = f.read()

# Add containerRef prop
content = content.replace("export const CustomCursor = () => {", "export const CustomCursor = ({ containerRef }: { containerRef: React.RefObject<HTMLElement> }) => {")

# Add visible state
content = content.replace("const [hoverState, setHoverState] = useState<'default' | 'link' | 'text' | 'image'>('default');", "const [hoverState, setHoverState] = useState<'default' | 'link' | 'text' | 'image'>('default');\n  const [isVisible, setIsVisible] = useState(false);")

# Update event listeners
listeners = """
    const container = containerRef?.current || document.body;
    
    const onMouseEnter = () => setIsVisible(true);
    const onMouseLeave = () => setIsVisible(false);

    container.addEventListener('mousemove', onMouseMove as any, { passive: true });
    container.addEventListener('mouseover', onMouseOver as any, { passive: true });
    container.addEventListener('mouseenter', onMouseEnter);
    container.addEventListener('mouseleave', onMouseLeave);
    
    return () => {
      document.body.style.cursor = '';
      container.removeEventListener('mousemove', onMouseMove as any);
      container.removeEventListener('mouseover', onMouseOver as any);
      container.removeEventListener('mouseenter', onMouseEnter);
      container.removeEventListener('mouseleave', onMouseLeave);
    };
"""

content = re.sub(r"window\.addEventListener\('mousemove', onMouseMove, \{ passive: true \}\);.*?return \(\) => \{.*?\};", listeners, content, flags=re.DOTALL)

# Add opacity to hide when outside
content = content.replace("<div className=\"fixed inset-0 pointer-events-none z-[9999]\">", "<div className=\"fixed inset-0 pointer-events-none z-[9999] transition-opacity duration-500\" style={{ opacity: isVisible ? 1 : 0 }}>")

with open('src/components/CustomCursor.tsx', 'w') as f:
    f.write(content)

# Update Hero.tsx to pass the ref
with open('src/components/Hero.tsx', 'r') as f:
    hero_content = f.read()

hero_content = hero_content.replace("<CustomCursor />", "<CustomCursor containerRef={containerRef} />")

with open('src/components/Hero.tsx', 'w') as f:
    f.write(hero_content)
