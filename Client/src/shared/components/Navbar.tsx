import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="navbar" id="main-navbar">
      <div className="container navbar-inner">
        <Link to="/" className="navbar-logo" id="navbar-logo">
          <span className="logo-accent">Petrov</span>Studio
        </Link>

        <button
          className="navbar-toggle"
          id="navbar-toggle"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle navigation"
        >
          <span className={`hamburger ${mobileOpen ? 'open' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>

        <ul className={`navbar-links ${mobileOpen ? 'active' : ''}`} id="navbar-links">
          <li>
            <NavLink to="/" end onClick={() => setMobileOpen(false)} id="nav-home">
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/projects" onClick={() => setMobileOpen(false)} id="nav-projects">
              Projects
            </NavLink>
          </li>
          <li>
            <NavLink to="/about" onClick={() => setMobileOpen(false)} id="nav-about">
              About
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
}
