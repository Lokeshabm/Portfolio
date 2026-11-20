import React from 'react';

export default function SectionTitle({ badge, title, subtitle }) {
  return (
    <div className="section-header animate-fade-in">
      {badge && <span className="badge-pill">{badge}</span>}
      <h2 className="section-title">
        <span className="gradient-text">{title}</span>
      </h2>
      {subtitle && <p className="section-subtitle">{subtitle}</p>}
    </div>
  );
}
