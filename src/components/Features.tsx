import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Check, ArrowRight } from 'lucide-react';
import { WordsPullUpMultiStyle } from './animations';

interface FeatureCardProps {
  title: string;
  number: string;
  icon: string;
  items: string[];
  delay: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, number, icon, items, delay }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      className="bg-[#212121] rounded-3xl p-6 sm:p-8 flex flex-col h-full"
    >
      <div className="flex justify-between items-start mb-8">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded overflow-hidden">
          <img src={icon} alt={title} className="w-full h-full object-cover" />
        </div>
        <span className="text-gray-500 text-xs sm:text-sm font-medium">({number})</span>
      </div>

      <h3 className="text-[#E1E0CC] text-xl sm:text-2xl font-medium mb-6">{title}</h3>

      <ul className="space-y-3 mb-auto">
        {items.map((item, idx) => (
          <li key={idx} className="flex gap-3">
            <Check className="text-primary w-4 h-4 sm:w-5 sm:h-5 shrink-0 mt-0.5" />
            <span className="text-gray-400 text-xs sm:text-sm leading-tight">{item}</span>
          </li>
        ))}
      </ul>

      <button className="group mt-8 flex items-center gap-2 text-primary text-xs sm:text-sm font-medium uppercase tracking-wider">
        Learn more
        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 -rotate-45" />
      </button>
    </motion.div>
  );
};

export const Features = () => {
  const headerSegments = [
    { text: "Engineering intelligence for a cinematic future.", className: "text-primary" },
    { text: "Code as logic. Visuals as emotion.", className: "text-gray-500" },
  ];

  return (
    <section className="min-h-screen bg-black relative py-24 px-6 overflow-hidden">
      <div className="absolute inset-0 bg-noise opacity-[0.15] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="mb-20 text-center sm:text-left">
          <WordsPullUpMultiStyle
            segments={headerSegments}
            className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-normal max-w-2xl text-left justify-start"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-2 md:gap-1 lg:h-[480px]">
          {/* Card 1 - Video Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0, ease: [0.22, 1, 0.36, 1] }}
            className="relative rounded-3xl overflow-hidden h-[300px] lg:h-full group"
          >
            <video
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            >
              <source src="/feature-video.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
            <div className="absolute bottom-6 left-6 right-6">
              <p className="text-[#E1E0CC] text-lg sm:text-xl font-medium">The Cinematic Interface.</p>
            </div>
          </motion.div>

          {/* Card 2 */}
          <FeatureCard
            title="Neural Systems."
            number="01"
            icon={import.meta.env.VITE_FEATURE_1_ICON}
            items={["PyTorch / TensorFlow", "Computer Vision pipelines", "LLM fine-tuning", "Predictive Analytics"]}
            delay={0.15}
          />

          {/* Card 3 */}
          <FeatureCard
            title="Digital Craft."
            number="02"
            icon={import.meta.env.VITE_FEATURE_2_ICON}
            items={["React / TypeScript / Vite", "Framer Motion animations", "High-performance architectures", "UI/UX for AI tools"]}
            delay={0.3}
          />

          {/* Card 4 */}
          <FeatureCard
            title="Leadership."
            number="03"
            icon={import.meta.env.VITE_FEATURE_3_ICON}
            items={["Google Student Ambassador", "KIIT University Leadership", "Community Growth", "Technical Mentorship"]}
            delay={0.45}
          />
        </div>
      </div>
    </section>
  );
};
