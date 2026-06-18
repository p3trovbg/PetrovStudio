import { useState, useEffect, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getProjectById, createProject, updateProject } from '../../projects/projectsApi';
import { getAllCategories } from '../../categories/categoriesApi';
import type { CategoryOutput } from '../../categories/types';
import LoadingSpinner from '../../../shared/components/LoadingSpinner';
import './AdminProjectForm.css';

export default function AdminProjectForm() {
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState<number>(0);
  const [mainImage, setMainImage] = useState<File | null>(null);
  const [additionalImages, setAdditionalImages] = useState<File[]>([]);
  const [categories, setCategories] = useState<CategoryOutput[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditing);
  const [error, setError] = useState('');

  useEffect(() => {
    getAllCategories().then(setCategories).catch(console.error);
  }, []);

  useEffect(() => {
    if (isEditing && id) {
      setFetching(true);
      getProjectById(parseInt(id, 10))
        .then((project) => {
          setName(project.name);
          setDescription(project.description);
          setCategoryId(project.categoryId);
        })
        .catch(() => setError('Failed to load project'))
        .finally(() => setFetching(false));
    }
  }, [id, isEditing]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !description.trim() || !categoryId) {
      setError('Please fill in all required fields');
      return;
    }

    if (!isEditing && !mainImage) {
      setError('Please select a main image');
      return;
    }

    setLoading(true);
    try {
      if (isEditing) {
        await updateProject(parseInt(id!, 10), { name, description, categoryId });
      } else {
        await createProject({
          name,
          description,
          categoryId,
          mainImage: mainImage!,
          images: additionalImages.length > 0 ? additionalImages : undefined,
        });
      }
      navigate('/admin/projects');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to save project';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <LoadingSpinner text="Loading project..." />;

  return (
    <div className="page-enter" id="admin-project-form-page">
      <div className="admin-page-header">
        <h1 className="admin-page-title">
          {isEditing ? 'Edit Project' : 'Create Project'}
        </h1>
        <p className="admin-page-subtitle">
          {isEditing ? 'Update project details' : 'Add a new project to your portfolio'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="admin-form glass-card" id="admin-project-form">
        {error && <div className="admin-form-error">{error}</div>}

        <div className="form-group">
          <label className="form-label" htmlFor="project-name">Name *</label>
          <input
            id="project-name"
            type="text"
            className="form-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Project name"
            minLength={3}
            maxLength={100}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="project-description">Description *</label>
          <textarea
            id="project-description"
            className="form-textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the project..."
            minLength={5}
            maxLength={5000}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="project-category">Category *</label>
          <select
            id="project-category"
            className="form-select"
            value={categoryId}
            onChange={(e) => setCategoryId(parseInt(e.target.value, 10))}
            required
          >
            <option value={0} disabled>Select a category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        {!isEditing && (
          <>
            <div className="form-group">
              <label className="form-label" htmlFor="project-main-image">Main Image *</label>
              <input
                id="project-main-image"
                type="file"
                className="form-input form-file"
                accept="image/*"
                onChange={(e) => setMainImage(e.target.files?.[0] || null)}
                required
              />
              {mainImage && (
                <div className="form-file-preview">
                  <img src={URL.createObjectURL(mainImage)} alt="Preview" />
                  <span>{mainImage.name}</span>
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="project-additional-images">
                Additional Images
              </label>
              <input
                id="project-additional-images"
                type="file"
                className="form-input form-file"
                accept="image/*"
                multiple
                onChange={(e) =>
                  setAdditionalImages(e.target.files ? Array.from(e.target.files) : [])
                }
              />
              {additionalImages.length > 0 && (
                <p className="form-file-count">
                  {additionalImages.length} file{additionalImages.length !== 1 ? 's' : ''} selected
                </p>
              )}
            </div>
          </>
        )}

        <div className="admin-form-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate('/admin/projects')}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            id="admin-project-submit"
          >
            {loading
              ? 'Saving...'
              : isEditing
                ? 'Update Project'
                : 'Create Project'}
          </button>
        </div>
      </form>
    </div>
  );
}
