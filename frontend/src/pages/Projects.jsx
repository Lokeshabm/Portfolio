import React, { useState, useEffect } from 'react';
import SectionTitle from '../components/SectionTitle';
import ProjectCard from '../components/ProjectCard';
import { portfolioApi } from '../services/api';
import { Search, FolderGit2 } from 'lucide-react';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    portfolioApi.getProjects()
      .then(data => setProjects(data || []))
      .catch(err => console.error("Error loading projects:", err))
      .finally(() => setLoading(false));
  }, []);

  const filteredProjects = projects.filter(p => {
    const matchesFilter = filter === 'All' || p.category.toLowerCase().includes(filter.toLowerCase());
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.technologies.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="page-wrapper container">
      <SectionTitle
        badge="Real-World Software"
        title="Featured Projects"
        subtitle="Full-stack web applications, AI systems, and enterprise management tools built with clean architecture and user-friendly design."
      />

      {/* Search & Filter Toolbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '3rem' }}>
        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
          {['All', 'Web', 'Mobile', 'AI'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`btn ${filter === cat ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '0.5rem 1.2rem', fontSize: '0.88rem' }}
            >
              {cat}
            </button>
          ))}
        </div>

        <div style={{ position: 'relative', minWidth: '260px' }}>
          <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search projects by tech, title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-control"
            style={{ paddingLeft: '2.6rem', paddingRight: '1rem', borderRadius: 'var(--radius-full)' }}
          />
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length > 0 ? (
        <div className="projects-grid">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className="glass-card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <FolderGit2 size={48} style={{ color: 'var(--text-muted)', margin: '0 auto 1rem auto' }} />
          <h3>No matching projects found</h3>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Try refining your search keyword or clearing filters.</p>
        </div>
      )}
    </div>
  );
}
