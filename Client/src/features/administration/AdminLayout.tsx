import { Navigate, NavLink, Outlet } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import './AdminLayout.css';

export default function AdminLayout() {
  const { isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  const handleLogout = () => {
    logout();
    window.location.href = '/admin/login';
  };

  return (
    <div className="admin-layout" id="admin-layout">
      <aside className="admin-sidebar" id="admin-sidebar">
        <div className="admin-sidebar-header">
          <span className="admin-logo">
            <span className="logo-accent">P</span>S Admin
          </span>
        </div>

        <nav className="admin-nav">
          <NavLink to="/admin" end className="admin-nav-link" id="admin-nav-dashboard">
            <span className="admin-nav-icon">📊</span>
            Dashboard
          </NavLink>
          <NavLink to="/admin/projects" className="admin-nav-link" id="admin-nav-projects">
            <span className="admin-nav-icon">📁</span>
            Projects
          </NavLink>
          <NavLink to="/admin/categories" className="admin-nav-link" id="admin-nav-categories">
            <span className="admin-nav-icon">🏷️</span>
            Categories
          </NavLink>
        </nav>

        <div className="admin-sidebar-footer">
          <a href="/" className="admin-nav-link" id="admin-nav-site">
            <span className="admin-nav-icon">🌐</span>
            View Site
          </a>
          <button onClick={handleLogout} className="admin-nav-link admin-logout" id="admin-logout">
            <span className="admin-nav-icon">🚪</span>
            Logout
          </button>
        </div>
      </aside>

      <main className="admin-main" id="admin-main">
        <Outlet />
      </main>
    </div>
  );
}
