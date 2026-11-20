import React, { useState, useEffect } from 'react';
import { Github, ExternalLink, CheckCircle, Info, X, Layers, Code } from 'lucide-react';
import { trackProjectActivity } from '../services/tracker';

export default function ProjectCard({ project }) {
  const { id, title, category, description, technologies, features, githubUrl, liveDemoUrl } = project;
  const [detailsOpen, setDetailsOpen] = useState(false);

  // Automatically track card view on initial render (deduplicated in tracker)
  useEffect(() => {
    if (title) {
      trackProjectActivity({
        projectId: id || 0,
        projectName: title,
        action: 'card_view'
      });
    }
  }, [id, title]);

  const handleOpenDetails = () => {
    setDetailsOpen(true);
    trackProjectActivity({
      projectId: id || 0,
      projectName: title,
      action: 'view_details'
    });
  };

  const handleGithubClick = () => {
    trackProjectActivity({
      projectId: id || 0,
      projectName: title,
      action: 'github_click'
    });
  };

  const handleLiveDemoClick = () => {
    trackProjectActivity({
      projectId: id || 0,
      projectName: title,
      action: 'live_demo_click'
    });
  };

  return (
    <>
      <div className="glass-card project-card animate-fade-in">
        <div className="project-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="project-tag">{category}</span>
          <button
            onClick={handleOpenDetails}
            className="btn-icon"
            title="View Details"
            aria-label={`View details for ${title}`}
            style={{ width: 32, height: 32, padding: 0, border: '1px solid var(--border-subtle)' }}
          >
            <Info size={16} />
          </button>
        </div>

        <h3 className="project-title" onClick={handleOpenDetails} style={{ cursor: 'pointer' }}>
          {title}
        </h3>
        <p className="project-desc">{description}</p>

        {features && features.length > 0 && (
          <ul className="project-features">
            {features.slice(0, 3).map((feat, idx) => (
              <li key={idx}>
                <CheckCircle size={15} />
                <span>{feat}</span>
              </li>
            ))}
          </ul>
        )}

        {technologies && (
          <div className="tech-tags">
            {technologies.map((tech, idx) => (
              <span key={idx} className="tech-badge">{tech}</span>
            ))}
          </div>
        )}

        <div className="project-actions">
          <button
            onClick={handleOpenDetails}
            className="btn btn-secondary"
            style={{ flex: 1, padding: '0.65rem 0.8rem', fontSize: '0.84rem' }}
          >
            <Info size={15} />
            <span>Details</span>
          </button>

          {githubUrl && (
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleGithubClick}
              className="btn btn-secondary"
              style={{ flex: 1, padding: '0.65rem 0.8rem', fontSize: '0.84rem' }}
            >
              <Github size={15} />
              <span>GitHub</span>
            </a>
          )}

          {liveDemoUrl && (
            <a
              href={liveDemoUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleLiveDemoClick}
              className="btn btn-primary"
              style={{ flex: 1, padding: '0.65rem 0.8rem', fontSize: '0.84rem' }}
            >
              <ExternalLink size={15} />
              <span>Live Demo</span>
            </a>
          )}
        </div>
      </div>

      {/* Project Details Modal */}
      {detailsOpen && (
        <div className="project-modal-backdrop" onClick={() => setDetailsOpen(false)}>
          <div className="project-modal-content glass-card animate-fade-in" onClick={e => e.stopPropagation()}>
            <div className="project-modal-header">
              <div>
                <span className="project-tag">{category}</span>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginTop: '0.4rem', color: 'var(--text-primary)' }}>
                  {title}
                </h2>
              </div>
              <button
                onClick={() => setDetailsOpen(false)}
                className="btn-icon"
                aria-label="Close details modal"
                style={{ width: 36, height: 36 }}
              >
                <X size={20} />
              </button>
            </div>

            <div className="project-modal-body">
              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ fontSize: '0.95rem', color: 'var(--accent-blue)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>
                  Overview
                </h4>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.96rem' }}>
                  {description}
                </p>
              </div>

              {features && features.length > 0 && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ fontSize: '0.95rem', color: 'var(--accent-purple)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Layers size={16} />
                    Key Architecture &amp; Features
                  </h4>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: 0 }}>
                    {features.map((feat, idx) => (
                      <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                        <CheckCircle size={16} color="var(--accent-emerald)" style={{ flexShrink: 0, marginTop: 2 }} />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {technologies && technologies.length > 0 && (
                <div style={{ marginBottom: '1.8rem' }}>
                  <h4 style={{ fontSize: '0.95rem', color: 'var(--accent-emerald)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Code size={16} />
                    Technologies Used
                  </h4>
                  <div className="tech-tags">
                    {technologies.map((tech, idx) => (
                      <span key={idx} className="tech-badge" style={{ padding: '0.4rem 0.9rem', fontSize: '0.84rem' }}>
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="project-modal-actions" style={{ display: 'flex', gap: '0.8rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.2rem', flexWrap: 'wrap' }}>
                {githubUrl && (
                  <a
                    href={githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleGithubClick}
                    className="btn btn-secondary"
                    style={{ flex: 1, padding: '0.75rem 1.2rem' }}
                  >
                    <Github size={17} />
                    <span>View Repository</span>
                  </a>
                )}
                {liveDemoUrl && (
                  <a
                    href={liveDemoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleLiveDemoClick}
                    className="btn btn-primary"
                    style={{ flex: 1, padding: '0.75rem 1.2rem' }}
                  >
                    <ExternalLink size={17} />
                    <span>Open Live Demo</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
