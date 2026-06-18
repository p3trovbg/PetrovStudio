import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProjects } from '../../projects/projectsApi';
import type { ShortProjectOutput } from '../../projects/types';
import ProjectCard from '../../projects/components/ProjectCard';
import './FeaturedProjects.css';

export default function FeaturedProjects() {
  const [projects, setProjects] = useState<ShortProjectOutput[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProjects({ page: 1, pageSize: 6 })
      .then((result) => setProjects(result.items))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="section featured-section" id="featured-projects">
      <div className="container">
        <div className="featured-header">
          <div>
            <h2 className="section-title">Latest Projects</h2>
            <p className="section-subtitle">Selected works from our portfolio</p>
          </div>
          <Link to="/projects" className="btn btn-secondary" id="featured-view-all">
            View All →
          </Link>
        </div>

        {loading ? (
          <div className="featured-grid">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="skeleton featured-skeleton" />
            ))}
          </div>
        ) : projects.length > 0 ? (
          <div className="featured-grid">
            {projects.map((project, index) => (
              <div
                key={project.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <ProjectCard project={project} />
              </div>
            ))}
          </div>
        ) : (
          <p className="featured-empty">No projects yet. Check back soon!</p>
        )}
      </div>
    </section>
  );
}
