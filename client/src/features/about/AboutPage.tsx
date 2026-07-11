import './AboutPage.css';

export default function AboutPage() {
  return (
    <div className="page-enter" id="about-page">
      <section className="about-hero">
        <div className="container">
          <span className="about-label">About Us</span>
          <h1 className="about-title">
            We Are <span className="text-accent">PetrovStudio</span>
          </h1>
          <p className="about-intro">
            A creative studio passionate about crafting exceptional digital experiences
            that blend aesthetics with functionality.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="about-grid">
            <div className="about-card glass-card animate-fade-in-up">
              <div className="about-card-icon">🎨</div>
              <h3>Design Philosophy</h3>
              <p>
                We believe in the power of minimalist design combined with bold
                accents. Every pixel is intentional, every interaction is
                meaningful. Our work speaks through clarity and elegance.
              </p>
            </div>

            <div className="about-card glass-card animate-fade-in-up stagger-1">
              <div className="about-card-icon">⚡</div>
              <h3>Technical Excellence</h3>
              <p>
                Built on modern technologies and best practices, our solutions
                are performant, scalable, and maintainable. We write code that
                stands the test of time.
              </p>
            </div>

            <div className="about-card glass-card animate-fade-in-up stagger-2">
              <div className="about-card-icon">🚀</div>
              <h3>Innovation Driven</h3>
              <p>
                We stay at the forefront of technology, continuously exploring
                new tools and techniques to deliver cutting-edge solutions that
                exceed expectations.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section about-story-section">
        <div className="container">
          <div className="about-story">
            <div className="about-story-content animate-fade-in-up">
              <h2 className="section-title">Our Story</h2>
              <p>
                PetrovStudio was founded with a simple mission: to bridge the
                gap between beautiful design and robust engineering. We started
                as a small team of passionate creators and have grown into a
                studio that delivers projects across multiple domains.
              </p>
              <p>
                Our approach is collaborative and iterative. We work closely
                with our clients to understand their vision, then bring it to
                life with meticulous attention to detail. From concept to
                deployment, every step is crafted with care.
              </p>
            </div>
            <div className="about-story-stats animate-fade-in-up stagger-1">
              <div className="stat-item glass-card">
                <span className="stat-number">50+</span>
                <span className="stat-label">Projects Delivered</span>
              </div>
              <div className="stat-item glass-card">
                <span className="stat-number">5+</span>
                <span className="stat-label">Years Experience</span>
              </div>
              <div className="stat-item glass-card">
                <span className="stat-number">100%</span>
                <span className="stat-label">Client Satisfaction</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
