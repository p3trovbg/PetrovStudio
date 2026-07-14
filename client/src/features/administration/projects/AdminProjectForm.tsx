import { useState, useEffect, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getProjectById, createProject, updateProject, deleteProjectImage } from '../../projects/projectsApi';
import { getAllCategories } from '../../categories/categoriesApi';
import type { CategoryOutput } from '../../categories/types';
import LoadingSpinner from '../../../shared/components/LoadingSpinner';
import './AdminProjectForm.css';
import type { ImageOutput } from '../../projects/types';

export default function AdminProjectForm() {
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState<number>(0);
  const [mainImage, setMainImage] = useState<File | null>(null);
  const [additionalImages, setAdditionalImages] = useState<File[]>([]);
  const [existingMainImage, setExistingMainImage] = useState<string | null>(null);
  const [existingImages, setExistingImages] = useState<ImageOutput[]>([]);
  const [removedImageIds, setRemovedImageIds] = useState<string[]>([]);
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
          setExistingMainImage(project.mainImageUrl);
          setExistingImages(project.additionalImageUrls);
        })
        .catch(() => setError('Грешка при зареждане на проекта'))
        .finally(() => setFetching(false));
    }
  }, [id, isEditing]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !description.trim() || !categoryId) {
      setError('Моля, попълнете всички задължителни полета');
      return;
    }

    if (!isEditing && !mainImage) {
      setError('Моля, изберете основно изображение');
      return;
    }

    setLoading(true);
    try {
      if (isEditing) {
        await updateProject(parseInt(id!, 10), {
          name,
          description,
          categoryId,
          mainImage: mainImage || null,
          images: additionalImages.length > 0 ? additionalImages : undefined,
          removedImageIds: removedImageIds.length > 0 ? removedImageIds : undefined
        });
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
      const message = err instanceof Error ? err.message : 'Грешка при записване на проекта';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

 const markImageForRemoval = (id: string) => {
  setRemovedImageIds(ids =>
    ids.includes(id) ? ids : [...ids, id]
  );

  setExistingImages(images =>
    images.filter(img => img.id !== id)
  );
};

  if (fetching) return <LoadingSpinner text="Зареждане на проекта..." />;

  return (
    <div className="page-enter" id="admin-project-form-page">
      <div className="admin-page-header">
        <h1 className="admin-page-title">
          {isEditing ? 'Редактиране на проект' : 'Създаване на проект'}
        </h1>
        <p className="admin-page-subtitle">
          {isEditing ? 'Обновяване на детайлите на проекта' : 'Добавяне на нов проект към вашето портфолио'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="admin-form glass-card" id="admin-project-form">
        {error && <div className="admin-form-error">{error}</div>}

        <div className="form-group">
          <label className="form-label" htmlFor="project-name">Име *</label>
          <input
            id="project-name"
            type="text"
            className="form-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Име на проекта"
            minLength={3}
            maxLength={100}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="project-description">Описание *</label>
          <textarea
            id="project-description"
            className="form-textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Опишете проекта..."
            minLength={5}
            maxLength={5000}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="project-category">Категория *</label>
          <select
            id="project-category"
            className="form-select"
            value={categoryId}
            onChange={(e) => setCategoryId(parseInt(e.target.value, 10))}
            required
          >
            <option value={0} disabled>Изберете категория</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="project-main-image">
            Основно изображение {isEditing ? '(Оставете празно, за да запазите текущото)' : '*'}
          </label>
          <input
            id="project-main-image"
            type="file"
            className="form-input form-file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0] ?? null;
              setMainImage(file);
            }}
            required={!isEditing}
          />
          <div className="form-file-preview">
            {mainImage ? (
              <img src={URL.createObjectURL(mainImage)} alt="Main preview" />
            ) : existingMainImage ? (
              <img src={existingMainImage} alt="Current main image" />
            ) : null}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="project-additional-images">
            Допълнителни изображения
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
            <div className="new-images">
              {additionalImages.map(file => (
                <img
                  key={file.name}
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                />
              ))}
            </div>
          )}
          {isEditing && existingImages.length > 0 && (
            <div className="existing-images">
              {existingImages.map(image => (
                <div key={image.id} className="existing-image-card">
                  <img src={image.url} alt="" />

                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={() => markImageForRemoval(image.id)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>


        <div className="admin-form-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate('/admin/projects')}
          >
            Отказ
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            id="admin-project-submit"
          >
            {loading
              ? 'Записване...'
              : isEditing
                ? 'Обнови проекта'
                : 'Създай проект'}
          </button>
        </div>
      </form>
    </div>
  );
}
