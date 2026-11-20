import React from 'react';
import { Code, Layout, Server, Database, Wrench, GitBranch, Cpu } from 'lucide-react';

const iconMap = {
  code: Code,
  layout: Layout,
  server: Server,
  database: Database,
  tool: Wrench,
  methodology: GitBranch,
  cpu: Cpu
};

export default function SkillCard({ skillGroup }) {
  const { category, icon, items } = skillGroup;
  const IconComponent = iconMap[icon] || Code;

  return (
    <div className="glass-card skill-category-card animate-fade-in">
      <div className="category-header">
        <div className="category-icon">
          <IconComponent size={22} />
        </div>
        <h3>{category}</h3>
      </div>

      <div className="skill-items-list">
        {items.map((skill, idx) => (
          <div key={idx} className="skill-item">
            <div className="skill-item-info">
              <span className="skill-name">{skill.name}</span>
              <div className="skill-meta">
                <span className="skill-exp-tag">{skill.experience}</span>
                <span className="skill-percentage">{skill.level}%</span>
              </div>
            </div>
            <div className="skill-track">
              <div
                className="skill-progress"
                style={{ width: `${skill.level}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
