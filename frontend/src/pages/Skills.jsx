import React, { useState, useEffect } from 'react';
import SectionTitle from '../components/SectionTitle';
import SkillCard from '../components/SkillCard';
import { portfolioApi } from '../services/api';
import { Layers, CheckCircle } from 'lucide-react';

export default function Skills() {
  const [skills, setSkills] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    portfolioApi.getSkills()
      .then(data => setSkills(data || []))
      .catch(err => console.error("Error loading skills:", err))
      .finally(() => setLoading(false));
  }, []);

  const categories = ['All', ...new Set(skills.map(s => s.category))];

  const filteredSkills = selectedCategory === 'All'
    ? skills
    : skills.filter(s => s.category === selectedCategory);

  return (
    <div className="page-wrapper container">
      <SectionTitle
        badge="Technical Proficiencies"
        title="Skills &amp; Expertise"
        subtitle="A comprehensive overview of programming languages, frontend frameworks, backend architecture, and engineering tools."
      />

      {/* Filter Tabs */}
      <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '0.6rem', marginBottom: '3rem' }}>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`btn ${selectedCategory === cat ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '0.5rem 1.2rem', fontSize: '0.88rem' }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Skills Grid with Animated Progress Bars */}
      <div className="skills-grid">
        {filteredSkills.map((skillGroup, idx) => (
          <SkillCard key={idx} skillGroup={skillGroup} />
        ))}
      </div>

      {/* Highlights Banner */}
      <div className="glass-card" style={{ marginTop: '3.5rem', padding: '2rem 2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div className="category-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--accent-emerald)' }}>
            <Layers size={22} />
          </div>
          <div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Continuous Learning &amp; Clean Code</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Proficient in Agile software engineering practices.</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-purple)' }}>4+</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Languages</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-blue)' }}>2+</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Databases</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>100%</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Commitment</div>
          </div>
        </div>
      </div>
    </div>
  );
}
