import React, { useState, useEffect } from 'react';
import SectionTitle from '../components/SectionTitle';
import { portfolioApi } from '../services/api';
import { GraduationCap, Calendar, MapPin, Award, BookOpen } from 'lucide-react';

export default function Education() {
  const [educationList, setEducationList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    portfolioApi.getEducation()
      .then(data => setEducationList(data || []))
      .catch(err => console.error("Error loading education data:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page-wrapper container">
      <SectionTitle
        badge="Academic History"
        title="Education &amp; Credentials"
        subtitle="My formal educational path at Kishkinda University, foundational sciences, and key coursework."
      />

      <div className="timeline-container">
        {educationList.map((edu, idx) => (
          <div key={idx} className="glass-card timeline-card animate-fade-in">
            <div className="timeline-dot" />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.8rem' }}>
              <div>
                <span className="timeline-badge">{edu.score}</span>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.2rem' }}>
                  {edu.degree}
                </h3>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--accent-purple)' }}>
                  {edu.field}
                </h4>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.3rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  <Calendar size={14} />
                  {edu.duration}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  <MapPin size={14} />
                  {edu.location}
                </span>
              </div>
            </div>

            <p style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '1rem', marginBottom: '1rem' }}>
              {edu.institution}
            </p>

            {edu.highlights && edu.highlights.length > 0 && (
              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem', marginTop: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem' }}>
                  <BookOpen size={16} color="var(--accent-blue)" />
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Key Highlights &amp; Coursework
                  </span>
                </div>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {edu.highlights.map((h, i) => (
                    <li key={i} style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
                      <span style={{ color: 'var(--accent-purple)', fontWeight: 'bold' }}>&bull;</span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
