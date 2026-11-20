import React, { useEffect } from 'react';
import { Github, ExternalLink, CheckCircle } from 'lucide-react';
import { trackProjectActivity } from '../services/tracker';

export default function ProjectCard({ project }) {
  const { id, title, category, description, technologies, features, githubUrl, liveDemoUrl } = project;

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
    <div className="glass-card project-card animate-fade-in">
      <div className="project-header">
        <span className="project-tag">{category}</span>
      </div>

      <h3 className="project-title">{title}</h3>
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
        {githubUrl && (
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleGithubClick}
            className="btn btn-secondary"
          >
            <Github size={16} />
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
          >
            <ExternalLink size={16} />
            <span>Live Demo</span>
          </a>
        )}
      </div>
    </div>
  );
}
