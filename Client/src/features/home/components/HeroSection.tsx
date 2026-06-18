import { Link } from 'react-router-dom';
import './HeroSection.css';

export default function HeroSection() {
  return (
    <section className="hero" id="hero-section">
      <div className="hero-bg">
        <div className="hero-gradient-orb hero-orb-1" />
        <div className="hero-gradient-orb hero-orb-2" />
        <div className="hero-gradient-orb hero-orb-3" />
        <div className="hero-grid-pattern" />
      </div>

      <div className="container hero-content">
        <span className="hero-label animate-fade-in-up">Creative Studio</span>
        <h1 className="hero-title animate-fade-in-up stagger-1">
          Crafting Digital
          <br />
          <span className="hero-title-accent">Experiences</span>
        </h1>
        <p className="hero-description animate-fade-in-up stagger-2">
          We design and build stunning digital products that push boundaries,
          spark engagement, and deliver real results.
        </p>
        <div className="hero-actions animate-fade-in-up stagger-3">
          <Link to="/projects" className="btn btn-primary btn-lg" id="hero-cta-projects">
            View Projects
          </Link>
          <Link to="/about" className="btn btn-secondary btn-lg" id="hero-cta-about">
            Learn More
          </Link>
        </div>
      </div>
    </section>
  );
}
