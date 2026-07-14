import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getProjects } from './projectsApi';
import { getAllCategories } from '../categories/categoriesApi';
import type { ShortProjectOutput } from './types';
import type { CategoryOutput } from '../categories/types';
import type { PaginatedResult } from '../../shared/types/pagination';
import ProjectCard from './components/ProjectCard';
import CategoryBadge from '../categories/components/CategoryBadge';
import Pagination from '../../shared/components/Pagination';
import LoadingSpinner from '../../shared/components/LoadingSpinner';
import './ProjectsPage.css';

export default function ProjectsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [result, setResult] = useState<PaginatedResult<ShortProjectOutput> | null>(null);
  const [categories, setCategories] = useState<CategoryOutput[]>([]);
  const [loading, setLoading] = useState(true);

  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const selectedCategory = searchParams.get('category')
    ? parseInt(searchParams.get('category')!, 10)
    : null;

  useEffect(() => {
    getAllCategories().then(setCategories).catch(console.error);
  }, []);

  useEffect(() => {
    setLoading(true);
    getProjects({ page: currentPage, pageSize: 9, categoryId: selectedCategory })
      .then(setResult)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [currentPage, selectedCategory]);

  const handleCategoryFilter = (categoryId: number | null) => {
    const params: Record<string, string> = {};
    if (categoryId) params.category = categoryId.toString();
    params.page = '1';
    setSearchParams(params);
  };

  const handlePageChange = (page: number) => {
    const params: Record<string, string> = { page: page.toString() };
    if (selectedCategory) params.category = selectedCategory.toString();
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="page-enter" id="projects-page">
      <section className="projects-hero">
        <div className="container">
          <h1 className="section-title">Проекти</h1>
          <p className="section-subtitle">Разгледайте нашето портфолио от проекти</p>

          {categories.length > 0 && (
            <div className="projects-filters" id="category-filters">
              <CategoryBadge
                name="Всички"
                active={!selectedCategory}
                onClick={() => handleCategoryFilter(null)}
              />
              {categories.map((cat) => (
                <CategoryBadge
                  key={cat.id}
                  name={cat.name}
                  active={selectedCategory === cat.id}
                  onClick={() => handleCategoryFilter(cat.id)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="container">
        {loading ? (
          <LoadingSpinner text="Зареждане на проектите..." />
        ) : result && result.items.length > 0 ? (
          <>
            <div className="projects-grid" id="projects-grid">
              {result.items.map((project, index) => (
                <div
                  key={project.id}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.08}s` }}
                >
                  <ProjectCard project={project} />
                </div>
              ))}
            </div>

            <Pagination
              currentPage={result.pageNumber}
              totalPages={result.totalPages}
              onPageChange={handlePageChange}
            />
          </>
        ) : (
          <div className="projects-empty">
            <p>Няма намерени проекти.</p>
          </div>
        )}
      </section>
    </div>
  );
}
