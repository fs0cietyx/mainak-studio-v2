import { Hero } from './components/Hero';
import { About } from './components/About';
import { Features } from './components/Features';
import { Projects } from './components/Projects';
import { Footer } from './components/Footer';
import { Terminal } from './components/Terminal';

function App() {
  return (
    <main className="bg-black min-h-screen">
      <div id="hero">
        <Hero />
      </div>
      <div id="about">
        <About />
      </div>
      <div id="focus">
        <Features />
      </div>
      <div id="projects">
        <Projects />
      </div>
      <Footer />
      <Terminal />
    </main>
  );
}

export default App;
