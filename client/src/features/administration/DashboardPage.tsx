import { Link } from 'react-router-dom';
import './DashboardPage.css';

export default function DashboardPage() {
  return (
    <div className="page-enter" id="admin-dashboard">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Табло</h1>
        <p className="admin-page-subtitle">Добре дошли в администрацията на PetrovStudio</p>
      </div>

      <div className="dashboard-cards">
        <Link to="/admin/projects" className="dashboard-card glass-card" id="dashboard-projects">
          <div className="dashboard-card-icon">📁</div>
          <h3>Проекти</h3>
          <p>Създавайте, редактирайте и управлявайте вашите проекти в портфолиото</p>
          <span className="dashboard-card-action">Управление на проекти →</span>
        </Link>

        <Link to="/admin/categories" className="dashboard-card glass-card" id="dashboard-categories">
          <div className="dashboard-card-icon">🏷️</div>
          <h3>Категории</h3>
          <p>Организирайте вашите проекти в категории</p>
          <span className="dashboard-card-action">Управление на категории →</span>
        </Link>

        <a href="/" className="dashboard-card glass-card" id="dashboard-view-site">
          <div className="dashboard-card-icon">🌐</div>
          <h3>Към сайта</h3>
          <p>Вижте как изглежда портфолиото ви за посетители</p>
          <span className="dashboard-card-action">Отвори сайта →</span>
        </a>
      </div>
    </div>
  );
}
