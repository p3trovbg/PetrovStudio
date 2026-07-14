import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer" id="site-footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <span className="logo-accent">Работилница</span> Петров
            </Link>
            <p className="footer-tagline">
              Индивидуални интериорни решения и мебели по поръчка в обл. Сливен. Извън областта работим по договаряне. От идеята до монтажа - качество и стил за вашия дом.
            </p>
          </div>

          <div className="footer-links-group">
            <h4 className="footer-heading">Навигация</h4>
            <ul className="footer-links">
              <li><Link to="/">Начало</Link></li>
              <li><Link to="/projects">Проекти</Link></li>
              <li><Link to="/about">За нас</Link></li>
            </ul>
          </div>

          <div className="footer-links-group">
            <h4 className="footer-heading">Контакти</h4>
            <ul className="footer-links">
              <li><a href="mailto:hello@petrovstudio.com">Имейл</a></li>
              <li><a href="https://github.com" target="_blank" rel="noopener noreferrer">GitHub</a></li>
              <li><a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {currentYear} PetrovStudio. Всички права запазени.</p>
        </div>
      </div>
    </footer>
  );
}
