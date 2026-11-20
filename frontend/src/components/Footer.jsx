import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Linkedin, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer-wrapper">
      <div className="container">
        <div className="footer-content">
          <div>
            <div className="brand-logo" style={{ marginBottom: '0.4rem' }}>
              <div className="brand-icon">L</div>
              <span>B M <span className="gradient-text">LOKESHA</span></span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Aspiring Software Developer | B.Tech CSE
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', flexWrap: 'wrap' }}>
            <Link
              to="/visitors"
              style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
            >
              <span>Visitor Analytics</span>
            </Link>

            <div className="footer-socials">
              <a
                href="https://github.com/Lokeshabm"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-icon"
                aria-label="GitHub Profile"
              >
                <Github size={18} />
              </a>
              <a
                href="https://www.linkedin.com/in/b-m-lokesha-613a54376"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-icon"
                aria-label="LinkedIn Profile - B M LOKESHA"
              >
                <Linkedin size={18} />
              </a>
              <a
                href="mailto:lokeshbm2003@gmail.com"
                className="btn-icon"
                aria-label="Send Email"
              >
                <Mail size={18} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
