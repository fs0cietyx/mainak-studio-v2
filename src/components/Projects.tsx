import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { WordsPullUpMultiStyle } from './animations';

interface Project {
  id: string;
  title: string;
  category: string;
  asset: string;
  type: 'video' | 'image';
  link: string;
}

const projects: Project[] = [
  {
    id: "01",
    title: "Neural Cine-Synthesizer",
    category: "AI / Visual Storytelling",
    asset: "/neural-cine.gif",
    type: 'image',
    link: "#"
  },
  {
    id: "02",
    title: "Ambassador Hub",
    category: "Leadership / Community",
    asset: "/ambassador-hub.mp4",
    type: 'video',
    link: "#"
  },
  {
    id: "03",
    title: "Autonomous Frame Analysis",
    category: "Computer Vision",
    asset: "/autonomous-frame.mp4",
    type: 'video',
    link: "#"
  },
  {
    id: "04",
    title: "The Imagination Engine",
    category: "LLM / Generative Art",
    asset: "/imagination-engine.mp4",
    type: 'video',
    link: "#"
  }
];

const ProjectCard = ({ project, index }: { project: Project, index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="group relative cursor-pointer"
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-[#1A1A1A]">
        {project.type === 'video' ? (
          <video
            autoPlay
            loop
            muted
            playsInline
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          >
            <source src={project.asset} type="video/mp4" />
          </video>
        ) : (
          <img
            src={project.asset}
            alt={project.title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
        
        <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
          <div>
            <p className="text-primary text-[10px] uppercase tracking-widest mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">{project.category}</p>
            <h3 className="text-[#E1E0CC] text-2xl font-medium leading-tight">{project.title}</h3>
          </div>
          <div className="bg-primary rounded-full p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <ArrowUpRight className="text-black w-5 h-5" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const Projects = () => {
  const headerSegments = [
    { text: "Selected Artifacts.", className: "text-[#E1E0CC]" },
    { text: "Where code meets canvas.", className: "text-gray-500" },
  ];

  return (
    <section className="bg-black py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <div className="max-w-xl">
            <span className="text-primary text-[10px] uppercase tracking-widest mb-6 block">Portfolio</span>
            <WordsPullUpMultiStyle
              segments={headerSegments}
              className="text-4xl sm:text-5xl md:text-6xl font-medium leading-[0.9] text-left justify-start"
            />
          </div>
          <div className="pb-2">
            <p className="text-gray-400 text-sm max-w-[300px] leading-relaxed">
              A collection of systems and stories designed to push the boundaries of digital interaction.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-20 flex justify-center"
        >
          <button className="text-[#E1E0CC] border border-[#E1E0CC]/20 rounded-full px-8 py-3 text-sm font-medium hover:bg-[#E1E0CC] hover:text-black transition-colors">
            View all work
          </button>
        </motion.div>
      </div>
    </section>
  );
};
