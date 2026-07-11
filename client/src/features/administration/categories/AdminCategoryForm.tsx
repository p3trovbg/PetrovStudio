import { useState, useEffect, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getCategoryById, createCategory, updateCategory } from '../../categories/categoriesApi';
import LoadingSpinner from '../../../shared/components/LoadingSpinner';
import '../projects/AdminProjectForm.css';

export default function AdminCategoryForm() {
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditing);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEditing && id) {
      setFetching(true);
      getCategoryById(parseInt(id, 10))
        .then((cat) => {
          setName(cat.name);
          setDescription(cat.description || '');
        })
        .catch(() => setError('Failed to load category'))
        .finally(() => setFetching(false));
    }
  }, [id, isEditing]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Name is required');
      return;
    }

    setLoading(true);
    try {
      if (isEditing) {
        await updateCategory(parseInt(id!, 10), {
          name,
          description: description || undefined,
        });
      } else {
        await createCategory({
          name,
          description: description || undefined,
        });
      }
      navigate('/admin/categories');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to save category';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <LoadingSpinner text="Loading category..." />;

  return (
    <div className="page-enter" id="admin-category-form-page">
      <div className="admin-page-header">
        <h1 className="admin-page-title">
          {isEditing ? 'Edit Category' : 'Create Category'}
        </h1>
        <p className="admin-page-subtitle">
          {isEditing ? 'Update category details' : 'Add a new category'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="admin-form glass-card" id="admin-category-form">
        {error && <div className="admin-form-error">{error}</div>}

        <div className="form-group">
          <label className="form-label" htmlFor="category-name">Name *</label>
          <input
            id="category-name"
            type="text"
            className="form-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Category name"
            minLength={3}
            maxLength={200}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="category-description">Description</label>
          <textarea
            id="category-description"
            className="form-textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Optional description..."
            maxLength={1000}
          />
        </div>

        <div className="admin-form-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate('/admin/categories')}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            id="admin-category-submit"
          >
            {loading
              ? 'Saving...'
              : isEditing
                ? 'Update Category'
                : 'Create Category'}
          </button>
        </div>
      </form>
    </div>
  );
}
