import { Link } from 'react-router-dom';
import './DashboardPage.css';

export default function DashboardPage() {
  return (
    <div className="page-enter" id="admin-dashboard">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Dashboard</h1>
        <p className="admin-page-subtitle">Welcome to PetrovStudio administration</p>
      </div>

      <div className="dashboard-cards">
        <Link to="/admin/projects" className="dashboard-card glass-card" id="dashboard-projects">
          <div className="dashboard-card-icon">📁</div>
          <h3>Projects</h3>
          <p>Create, edit, and manage your portfolio projects</p>
          <span className="dashboard-card-action">Manage Projects →</span>
        </Link>

        <Link to="/admin/categories" className="dashboard-card glass-card" id="dashboard-categories">
          <div className="dashboard-card-icon">🏷️</div>
          <h3>Categories</h3>
          <p>Organize your projects with categories</p>
          <span className="dashboard-card-action">Manage Categories →</span>
        </Link>

        <a href="/" className="dashboard-card glass-card" id="dashboard-view-site">
          <div className="dashboard-card-icon">🌐</div>
          <h3>View Site</h3>
          <p>See how your portfolio looks to visitors</p>
          <span className="dashboard-card-action">Open Site →</span>
        </a>
      </div>
    </div>
  );
}
