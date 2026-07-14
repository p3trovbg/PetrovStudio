import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProjectById } from './projectsApi';
import type { ProjectDetailsOutput } from './types';
import ImageGallery from './components/ImageGallery';
import CategoryBadge from '../categories/components/CategoryBadge';
import LoadingSpinner from '../../shared/components/LoadingSpinner';
import './ProjectDetailsPage.css';

export default function ProjectDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<ProjectDetailsOutput | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getProjectById(parseInt(id, 10))
      .then(setProject)
      .catch(() => setError('Project not found'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingSpinner size="lg" text="Зареждане на проекта..." />;

  if (error || !project) {
    return (
      <div className="container page-enter" id="project-not-found">
        <div className="project-error">
          <h2>Проектът не е намерен</h2>
          <p>Проектът, който търсите, не съществува или е бил премахнат.</p>
          <Link to="/projects" className="btn btn-primary">
            ← Обратно към проектите
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-enter" id="project-details-page">
      <div className="project-hero">
        <img
          src={project.mainImageUrl}
          alt={project.name}
          className="project-hero-image"
        />
        <div className="project-hero-overlay" />
      </div>

      <div className="container">
        <div className="project-content">
          <Link to="/projects" className="project-back" id="project-back-link">
            ← Обратно към проектите
          </Link>

          <div className="project-header animate-fade-in-up">
            <CategoryBadge name={project.categoryName} />
            <h1 className="project-title">{project.name}</h1>
            <time className="project-date">
              {new Date(project.createdAtUtc).toLocaleDateString('bg-BG', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
          </div>

          <div className="project-description animate-fade-in-up stagger-1">
            <p>{project.description}</p>
          </div>

          {project.additionalImageUrls.length > 0 && (
            <div className="project-gallery animate-fade-in-up stagger-2">
              <h2 className="project-gallery-title">Галерия</h2>
              <ImageGallery images={project.additionalImageUrls} alt={project.name} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
