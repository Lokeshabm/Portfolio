import React, { useState, useEffect } from 'react';
import SectionTitle from '../components/SectionTitle';
import { portfolioApi } from '../services/api';
import { GraduationCap, Target, Briefcase, Award, Code, CheckCircle2, Phone, Mail, MapPin, Github, Linkedin, FolderGit2, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function About() {
  const [profile, setProfile] = useState(null);
  const [internships, setInternships] = useState([]);

  useEffect(() => {
    portfolioApi.getProfile().then(data => setProfile(data));
    portfolioApi.getInternships().then(data => setInternships(data || []));
  }, []);

  return (
    <div className="page-wrapper container">
      <SectionTitle
        badge="Candidate Profile"
        title="About Me"
        subtitle="Disciplined and detail-oriented Software Engineering student with a passion for building full-stack applications."
      />

      {/* Profile Header Card with Uploaded Photo & Contact Highlights */}
      <div className="glass-card" style={{ padding: '2.5rem', marginBottom: '2.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '2.5rem', alignItems: 'center' }}>
          <div className="about-photo-frame" style={{ width: '220px', height: '260px' }}>
            <img
              src="/images/profile.png"
              alt="B M LOKESHA"
              className="about-photo-img"
            />
          </div>

          <div>
            <span className="badge-pill">B.Tech Software Engineering Student</span>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.4rem' }}>
              B M <span className="gradient-text">LOKESHA</span>
            </h2>
            <p style={{ fontSize: '1.05rem', color: 'var(--accent-purple)', fontWeight: 600, marginBottom: '1rem' }}>
              Aspiring Software Developer
            </p>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.4rem' }}>
              Disciplined and detail-oriented Software Engineering student with a passion for building full-stack applications using a structured, test-driven development approach. Currently pursuing B.Tech in Computer Science and Engineering at Kishkinda University, Ballari.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.2rem', fontSize: '0.9rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)' }}>
                <MapPin size={16} color="var(--accent-blue)" />
                Ballari, India
              </span>
              <a href="tel:9900181830" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-primary)' }}>
                <Phone size={16} color="var(--accent-emerald)" />
                +91 9900181830
              </a>
              <a href="mailto:lokeshbm2003@gmail.com" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-primary)' }}>
                <Mail size={16} color="var(--accent-pink)" />
                lokeshbm2003@gmail.com
              </a>
              <a href="https://github.com/Lokeshabm" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-primary)' }}>
                <Github size={16} color="var(--accent-purple)" />
                github.com/Lokeshabm
              </a>
              <a href="https://www.linkedin.com/in/b-m-lokesha-613a54376" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-primary)' }}>
                <Linkedin size={16} color="#0a66c2" />
                linkedin.com/in/b-m-lokesha-613a54376
              </a>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
        {/* Career Objective */}
        <div className="glass-card" style={{ padding: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.2rem' }}>
            <div className="category-icon">
              <Target size={22} />
            </div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 700 }}>Career Objective</h3>
          </div>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.98rem' }}>
            Disciplined and detail-oriented Software Engineering student with a passion for building full-stack applications using a structured, test-driven development approach.
          </p>
        </div>

        {/* Internship Experience */}
        <div className="glass-card" style={{ padding: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.2rem' }}>
            <div className="category-icon">
              <Briefcase size={22} />
            </div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 700 }}>Internship Experience</h3>
          </div>
          <div style={{ marginBottom: '0.5rem' }}>
            <span className="badge-pill" style={{ margin: '0 0 0.5rem 0', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent-emerald)' }}>
              20 July 2026 – 19 August 2026
            </span>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Mobile App Development Intern</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginBottom: '0.8rem' }}>
              <strong>Kinetrexa Software Private Limited</strong> (Remote)
            </p>
          </div>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              <CheckCircle2 size={16} color="var(--accent-emerald)" style={{ flexShrink: 0, marginTop: 2 }} />
              <div>
                <span>Expense Tracker Project development using AntiGravity ai tool.</span>
                <div style={{ marginTop: '0.35rem' }}>
                  <a
                    href="https://anti-blush.vercel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.35rem 0.8rem', fontSize: '0.78rem' }}
                  >
                    <ExternalLink size={13} />
                    <span>Live Demo (anti-blush.vercel.app)</span>
                  </a>
                </div>
              </div>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              <CheckCircle2 size={16} color="var(--accent-emerald)" style={{ flexShrink: 0, marginTop: 2 }} />
              <span>Successfully completed assigned milestones and achieved formal completion certificate.</span>
            </li>
          </ul>
        </div>

        {/* Education Credentials */}
        <div className="glass-card" style={{ padding: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.2rem' }}>
            <div className="category-icon">
              <GraduationCap size={22} />
            </div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 700 }}>Education</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>B.Tech — CSE (2023 – Ongoing)</h4>
                <span style={{ fontSize: '0.85rem', color: 'var(--accent-emerald)', fontWeight: 700 }}>CGPA: 7.83</span>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>Kishkinda University, Ballari</p>
            </div>

            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.8rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>Class XII (PUC) — 2021–2023</h4>
                <span style={{ fontSize: '0.85rem', color: 'var(--accent-emerald)', fontWeight: 700 }}>73.83%</span>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>CC0008, GOVT EX MUNICIPAL PU COLLAGE, BALLARI</p>
            </div>

            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.8rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>Class X (SSLC) — 2021</h4>
                <span style={{ fontSize: '0.85rem', color: 'var(--accent-emerald)', fontWeight: 700 }}>92.64%</span>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>MORARJI DESAI RESIDENTION SCHOOL-BC, METRIKI, SANDOOR, BALLARI</p>
            </div>
          </div>
        </div>

        {/* Technical Skills & Methodology */}
        <div className="glass-card" style={{ padding: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.2rem' }}>
            <div className="category-icon">
              <Code size={22} />
            </div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 700 }}>Technical Skills</h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.8rem', fontSize: '0.9rem' }}>
            <div>
              <strong style={{ color: 'var(--text-primary)' }}>Languages:</strong>{' '}
              <span style={{ color: 'var(--text-secondary)' }}>Java SE, C, Python</span>
            </div>
            <div>
              <strong style={{ color: 'var(--text-primary)' }}>Backend:</strong>{' '}
              <span style={{ color: 'var(--text-secondary)' }}>Django, Java SE HttpServer</span>
            </div>
            <div>
              <strong style={{ color: 'var(--text-primary)' }}>Frontend:</strong>{' '}
              <span style={{ color: 'var(--text-secondary)' }}>HTML, CSS, React.js</span>
            </div>
            <div>
              <strong style={{ color: 'var(--text-primary)' }}>Databases:</strong>{' '}
              <span style={{ color: 'var(--text-secondary)' }}>MySQL databases, SQLite</span>
            </div>
            <div>
              <strong style={{ color: 'var(--text-primary)' }}>Cloud &amp; DevOps:</strong>{' '}
              <span style={{ color: 'var(--text-secondary)' }}>AWS, GitHub &amp; Git</span>
            </div>
            <div>
              <strong style={{ color: 'var(--text-primary)' }}>Methodology:</strong>{' '}
              <span style={{ color: 'var(--accent-purple)', fontWeight: 600 }}>Data Structures &amp; Algorithms (DSA)</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: '3.5rem', display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <Link to="/projects" className="btn btn-secondary">
          <FolderGit2 size={18} />
          <span>View Detailed Projects</span>
        </Link>
        <Link to="/contact" className="btn btn-primary">
          <Mail size={18} />
          <span>Get In Touch</span>
        </Link>
      </div>
    </div>
  );
}
