import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProjects } from '../../projects/projectsApi';
import { deleteProject } from '../../projects/projectsApi';
import type { ShortProjectOutput } from '../../projects/types';
import type { PaginatedResult } from '../../../shared/types/pagination';
import Pagination from '../../../shared/components/Pagination';
import ConfirmDialog from '../../../shared/components/ConfirmDialog';
import LoadingSpinner from '../../../shared/components/LoadingSpinner';
import './AdminProjectsPage.css';

export default function AdminProjectsPage() {
  const [result, setResult] = useState<PaginatedResult<ShortProjectOutput> | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<ShortProjectOutput | null>(null);

  const fetchProjects = (page: number) => {
    setLoading(true);
    getProjects({ page, pageSize: 10 })
      .then(setResult)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProjects(currentPage);
  }, [currentPage]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteProject(deleteTarget.id);
      setDeleteTarget(null);
      fetchProjects(currentPage);
    } catch (err) {
      console.error('Failed to delete project:', err);
    }
  };

  return (
    <div className="page-enter" id="admin-projects-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Projects</h1>
          <p className="admin-page-subtitle">Manage your portfolio projects</p>
        </div>
      </div>

      <div className="admin-toolbar">
        <span className="admin-count">
          {result ? `${result.totalCount} project${result.totalCount !== 1 ? 's' : ''}` : ''}
        </span>
        <Link to="/admin/projects/create" className="btn btn-primary" id="admin-create-project">
          + New Project
        </Link>
      </div>

      {loading ? (
        <LoadingSpinner text="Loading projects..." />
      ) : result && result.items.length > 0 ? (
        <>
          <div className="table-container">
            <table className="table" id="admin-projects-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Featured</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {result.items.map((project) => (
                  <tr key={project.id}>
                    <td>
                      <img
                        src={project.mainImageUrl}
                        alt={project.name}
                        className="admin-project-thumb"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </td>
                    <td>
                      <span className="admin-project-name">{project.name}</span>
                    </td>
                    <td>
                      {project.isFeatured ? (
                        <span className="badge badge-success">Featured</span>
                      ) : (
                        <span className="badge" style={{ opacity: 0.5 }}>—</span>
                      )}
                    </td>
                    <td>
                      {new Date(project.createdOn).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                    <td>
                      <div className="table-actions">
                        <Link
                          to={`/admin/projects/${project.id}/edit`}
                          className="btn btn-secondary btn-sm"
                          id={`admin-edit-project-${project.id}`}
                        >
                          Edit
                        </Link>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => setDeleteTarget(project)}
                          id={`admin-delete-project-${project.id}`}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination
            currentPage={result.pageNumber}
            totalPages={result.totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      ) : (
        <div className="admin-empty glass-card">
          <p>No projects yet.</p>
          <Link to="/admin/projects/create" className="btn btn-primary">
            Create Your First Project
          </Link>
        </div>
      )}

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete Project"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        variant="danger"
      />
    </div>
  );
}
