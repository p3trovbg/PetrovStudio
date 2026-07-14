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
          <h1 className="admin-page-title">Категории</h1>
          <p className="admin-page-subtitle">Организирайте вашите проекти</p>
        </div>
      </div>

      <div className="admin-toolbar">
        <span className="admin-count">
          {categories.length} ${categories.length === 1 ? 'категория' : 'категории'}
        </span>
        <Link to="/admin/categories/create" className="btn btn-primary" id="admin-create-category">
          + Нова категория
        </Link>
      </div>

      {loading ? (
        <LoadingSpinner text="Зареждане на категориите..." />
      ) : categories.length > 0 ? (
        <div className="table-container">
          <table className="table" id="admin-categories-table">
            <thead>
              <tr>
                <th>Име</th>
                <th>Описание</th>
                <th>Действия</th>
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
                        Редактиране
                      </Link>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => setDeleteTarget(cat)}
                        id={`admin-delete-category-${cat.id}`}
                      >
                        Изтриване
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
          <p>Все още няма категории.</p>
          <Link to="/admin/categories/create" className="btn btn-primary">
            Създайте първата си категория
          </Link>
        </div>
      )}

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Изтриване на категория"
        message={`Сигурни ли сте, че искате да изтриете "${deleteTarget?.name}"? Проектите в тази категория може да бъдат засегнати.`}
        confirmLabel="Изтриване"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        variant="danger"
      />
    </div>
  );
}
