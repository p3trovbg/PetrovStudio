import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllCategories, deleteCategory } from '../../categories/categoriesApi';
import type { CategoryOutput } from '../../categories/types';
import ConfirmDialog from '../../../shared/components/ConfirmDialog';
import LoadingSpinner from '../../../shared/components/LoadingSpinner';
import './AdminCategoriesPage.css';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<CategoryOutput[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<CategoryOutput | null>(null);

  const fetchCategories = () => {
    setLoading(true);
    getAllCategories()
      .then(setCategories)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteCategory(deleteTarget.id);
      setDeleteTarget(null);
      fetchCategories();
    } catch (err) {
      console.error('Failed to delete category:', err);
    }
  };

  return (
    <div className="page-enter" id="admin-categories-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Categories</h1>
          <p className="admin-page-subtitle">Organize your projects</p>
        </div>
      </div>

      <div className="admin-toolbar">
        <span className="admin-count">
          {categories.length} categor{categories.length !== 1 ? 'ies' : 'y'}
        </span>
        <Link to="/admin/categories/create" className="btn btn-primary" id="admin-create-category">
          + New Category
        </Link>
      </div>

      {loading ? (
        <LoadingSpinner text="Loading categories..." />
      ) : categories.length > 0 ? (
        <div className="table-container">
          <table className="table" id="admin-categories-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id}>
                  <td>
                    <span className="admin-category-name">{cat.name}</span>
                  </td>
                  <td>
                    <span className="admin-category-desc">
                      {cat.description || '—'}
                    </span>
                  </td>
                  <td>
                    <div className="table-actions">
                      <Link
                        to={`/admin/categories/${cat.id}/edit`}
                        className="btn btn-secondary btn-sm"
                        id={`admin-edit-category-${cat.id}`}
                      >
                        Edit
                      </Link>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => setDeleteTarget(cat)}
                        id={`admin-delete-category-${cat.id}`}
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
      ) : (
        <div className="admin-empty glass-card">
          <p>No categories yet.</p>
          <Link to="/admin/categories/create" className="btn btn-primary">
            Create Your First Category
          </Link>
        </div>
      )}

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete Category"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? Projects in this category may be affected.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        variant="danger"
      />
    </div>
  );
}
