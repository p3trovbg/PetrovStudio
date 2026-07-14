import { Link } from 'react-router-dom';
import './HeroSection.css';

export default function HeroSection() {
  return (
    <section className="hero" id="hero-section">
      <div className="hero-bg">
        <div className="hero-grid-pattern" />
      </div>

      <div className="container hero-content">
        <span className="hero-label animate-fade-in-up">
          Работилница Петров
        </span>

        <h1 className="hero-title animate-fade-in-up stagger-1">
          Мебели по поръчка, създадени за вашия дом
        </h1>

        <p className="hero-description animate-fade-in-up stagger-2">
          Проектиране, изработка и монтаж на кухни, гардероби и мебели
          по индивидуален проект. От първоначалната идея до завършения интериор.
        </p>

        <div className="hero-actions animate-fade-in-up stagger-3">
          <Link
            to="/projects"
            className="btn btn-primary btn-lg"
            id="hero-cta-projects"
          >
            Разгледайте проектите
          </Link>

          <Link
            to="/about"
            className="btn btn-secondary btn-lg"
            id="hero-cta-about"
          >
            За нас
          </Link>
        </div>
      </div>
    </section>
  );
}