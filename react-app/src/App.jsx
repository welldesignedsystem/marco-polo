import Hero from './components/Hero.jsx';
import Logos from './components/Logos.jsx';
import Stats from './components/Stats.jsx';
import Bento from './components/Bento.jsx';
import Solutions from './components/Solutions.jsx';
import ThreeUp from './components/ThreeUp.jsx';
import Pricing from './components/Pricing.jsx';
import Quotes from './components/Quotes.jsx';
import Devs from './components/Devs.jsx';
import Blog from './components/Blog.jsx';
import Contact from './components/Contact.jsx';
import Footer from './components/Footer.jsx';

export default function App() {
  return (
    <div className="page">
      <Hero />
      <Logos />
      <Stats />
      <Bento />
      <Solutions />
      <ThreeUp />
      <Pricing />
      <Quotes />
      <Devs />
      <Blog />
      <Contact />
      <Footer />
    </div>
  );
}
