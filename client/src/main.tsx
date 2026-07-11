import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Global Styles
import './index.css';

// Layouts
import Layout from './shared/components/Layout';
import AdminLayout from './features/administration/AdminLayout';

// Public Pages
import HomePage from './features/home/HomePage';
import AboutPage from './features/about/AboutPage';
import ProjectsPage from './features/projects/ProjectsPage';
import ProjectDetailsPage from './features/projects/ProjectDetailsPage';

// Admin Pages
import LoginPage from './features/administration/LoginPage';
import DashboardPage from './features/administration/DashboardPage';
import AdminProjectsPage from './features/administration/projects/AdminProjectsPage';
import AdminProjectForm from './features/administration/projects/AdminProjectForm';
import AdminCategoriesPage from './features/administration/categories/AdminCategoriesPage';
import AdminCategoryForm from './features/administration/categories/AdminCategoryForm';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="projects/:id" element={<ProjectDetailsPage />} />
        </Route>

        {/* Admin Login (No Layout) */}
        <Route path="/admin/login" element={<LoginPage />} />

        {/* Protected Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<DashboardPage />} />
          
          <Route path="projects" element={<AdminProjectsPage />} />
          <Route path="projects/create" element={<AdminProjectForm />} />
          <Route path="projects/:id/edit" element={<AdminProjectForm />} />

          <Route path="categories" element={<AdminCategoriesPage />} />
          <Route path="categories/create" element={<AdminCategoryForm />} />
          <Route path="categories/:id/edit" element={<AdminCategoryForm />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
