import { Link } from 'react-router-dom';
import type { ShortProjectOutput } from '../types';
import './ProjectCard.css';

interface ProjectCardProps {
  project: ShortProjectOutput;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link
      to={`/projects/${project.id}`}
      className="project-card glass-card"
      id={`project-card-${project.id}`}
    >
      <div className="project-card-image">
        <img
          src={project.mainImageUrl}
          alt={project.name}
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMWExYTJlIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjE4IiBmaWxsPSIjNjY2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+Tm8gSW1hZ2U8L3RleHQ+PC9zdmc+';
          }}
        />
        {project.isFeatured && (
          <span className="project-card-featured">★ Специален</span>
        )}
      </div>
      <div className="project-card-body">
        <h3 className="project-card-title">{project.name}</h3>
        <time className="project-card-date">
          {new Date(project.createdOn).toLocaleDateString('bg-BG', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
        </time>
      </div>
    </Link>
  );
}
