import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileDown, FolderGit2, Mail, ArrowRight, Linkedin } from 'lucide-react';
import { portfolioApi } from '../services/api';
import ProjectCard from '../components/ProjectCard';

export default function Home() {
  const [profile, setProfile] = useState(null);
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [profData, projData] = await Promise.all([
          portfolioApi.getProfile(),
          portfolioApi.getProjects()
        ]);
        setProfile(profData);
        setFeaturedProjects(projData ? projData.slice(0, 2) : []);
      } catch (err) {
        console.error("Error loading home page data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="page-wrapper container">
      {/* Hero Section */}
      <section className="hero-wrapper">
        {/* Left Side: Professional Profile Introduction */}
        <div className="hero-content animate-fade-in">
          <span className="badge-pill">
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
            Open for Opportunities &bull; Software Developer
          </span>

          <h1>
            Hi, I'm <br />
            <span className="gradient-text">B M LOKESHA</span>
          </h1>

          <p className="hero-subtitle">
            Aspiring Software Developer
          </p>

          <p className="hero-description">
            Disciplined and detail-oriented Software Engineering student with a passion for building full-stack applications using a structured, test-driven development approach.
          </p>

          <div className="hero-cta-group">
            <Link to="/projects" className="btn btn-secondary">
              <FolderGit2 size={18} />
              <span>View My Projects</span>
            </Link>

            <a
              href="/resume/B_M_Lokesha_Resume.pdf"
              download="B_M_Lokesha_Resume.pdf"
              className="btn btn-primary"
            >
              <FileDown size={18} />
              <span>Download Resume</span>
            </a>

            <a
              href="https://www.linkedin.com/in/b-m-lokesha-613a54376"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline"
            >
              <Linkedin size={18} color="#0a66c2" />
              <span>LinkedIn</span>
            </a>

            <Link to="/contact" className="btn btn-outline">
              <Mail size={18} />
              <span>Contact Me</span>
            </Link>
          </div>

          <div className="hero-stats">
            <div className="stat-item">
              <h3>7.83</h3>
              <p>B.Tech CGPA</p>
            </div>
            <div className="stat-item">
              <h3>3+</h3>
              <p>Core Projects</p>
            </div>
            <div className="stat-item">
              <h3>1</h3>
              <p>Internship</p>
            </div>
          </div>
        </div>

        {/* Right Side: Professional Photo with Blue Glow and Subtle Floating Animation */}
        <div className="hero-visual animate-fade-in">
          <div className="profile-photo-wrapper animate-float">
            {/* Subtle blue gradient aura background */}
            <div className="profile-photo-aura" />

            {/* Profile Photo Frame */}
            <div className="profile-photo-frame">
              <img
                src="/images/profile.png"
                alt="B M LOKESHA - Aspiring Software Developer"
                className="profile-photo-img"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects Highlight */}
      <section style={{ marginTop: '5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span className="badge-pill">Portfolio Highlights</span>
            <h2 className="section-title" style={{ textAlign: 'left', marginBottom: 0 }}>
              Featured <span className="gradient-text">Projects</span>
            </h2>
          </div>
          <Link to="/projects" className="btn btn-secondary" style={{ padding: '0.6rem 1.2rem' }}>
            <span>Explore All Projects</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="projects-grid">
          {featuredProjects.map(proj => (
            <ProjectCard key={proj.id} project={proj} />
          ))}
        </div>
      </section>
    </div>
  );
}
