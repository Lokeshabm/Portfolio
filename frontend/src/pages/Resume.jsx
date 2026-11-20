import React, { useState } from 'react';
import SectionTitle from '../components/SectionTitle';
import { FileDown, ExternalLink, Printer, Mail, MapPin, Phone, Globe, Briefcase, GraduationCap, Code, Award, FileText, Linkedin } from 'lucide-react';

export default function Resume() {
  const [viewMode, setViewMode] = useState('pdf'); // 'pdf' or 'document'

  const resumePdfPath = '/resume/B_M_Lokesha_Resume.pdf';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="page-wrapper container">
      <SectionTitle
        badge="Curriculum Vitae"
        title="Official Resume"
        subtitle="Review my verified credentials, academic achievements, technical projects, and industry internship."
      />

      {/* Action Toolbar */}
      <div className="resume-toolbar">
        {/* Download Resume Button */}
        <a
          href={resumePdfPath}
          download="B_M_Lokesha_Resume.pdf"
          className="btn btn-primary"
          style={{ padding: '0.8rem 1.8rem' }}
        >
          <FileDown size={18} />
          <span>Download Resume (PDF)</span>
        </a>

        {/* Open Resume Button in New Tab */}
        <a
          href={resumePdfPath}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-secondary"
          style={{ padding: '0.8rem 1.8rem' }}
        >
          <ExternalLink size={18} />
          <span>Open Resume in New Tab</span>
        </a>

        {/* View Switcher: PDF Viewer vs Structured Document */}
        <div style={{ display: 'inline-flex', background: 'var(--bg-card)', padding: '4px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
          <button
            onClick={() => setViewMode('pdf')}
            className={`btn ${viewMode === 'pdf' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', boxShadow: 'none' }}
          >
            <FileText size={16} />
            <span>PDF Viewer</span>
          </button>
          <button
            onClick={() => setViewMode('document')}
            className={`btn ${viewMode === 'document' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', boxShadow: 'none' }}
          >
            <span>Document View</span>
          </button>
        </div>

        {/* Print Button */}
        <button
          onClick={handlePrint}
          className="btn btn-outline"
          style={{ padding: '0.8rem 1.4rem' }}
        >
          <Printer size={18} />
          <span>Print</span>
        </button>
      </div>

      {/* Main Resume Container Card */}
      <div className="glass-card resume-container-card animate-fade-in">
        {viewMode === 'pdf' ? (
          <div>
            <div className="resume-viewer-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <span className="badge-pill" style={{ margin: 0 }}>Verified PDF Document</span>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>B_M_Lokesha_Resume.pdf</span>
              </div>
              <a
                href={resumePdfPath}
                target="_blank"
                rel="noreferrer"
                style={{ fontSize: '0.88rem', color: 'var(--accent-blue)', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600 }}
              >
                <span>Fullscreen</span>
                <ExternalLink size={14} />
              </a>
            </div>

            {/* Embedded Live PDF Frame */}
            <iframe
              src={`${resumePdfPath}#toolbar=1&navpanes=0&scrollbar=1`}
              title="B M LOKESHA Actual Resume PDF"
              className="resume-pdf-frame"
            />
          </div>
        ) : (
          /* Attractive Document-Style Design */
          <div className="resume-fallback-preview" style={{ padding: '3.5rem' }}>
            {/* Header */}
            <div style={{ borderBottom: '2px solid var(--border-subtle)', paddingBottom: '2rem', marginBottom: '2.5rem' }}>
              <h1 style={{ fontSize: '2.4rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                B M <span className="gradient-text">LOKESHA</span>
              </h1>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', fontSize: '0.92rem', color: 'var(--text-secondary)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <MapPin size={15} color="var(--accent-blue)" />
                  Ballari, India
                </span>
                <a href="tel:9900181830" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-primary)' }}>
                  <Phone size={15} color="var(--accent-emerald)" />
                  9900181830
                </a>
                <a href="mailto:lokeshbm2003@gmail.com" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-primary)' }}>
                  <Mail size={15} color="var(--accent-pink)" />
                  lokeshbm2003@gmail.com
                </a>
                <a href="https://github.com/Lokeshabm" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-primary)' }}>
                  <Globe size={15} color="var(--accent-purple)" />
                  github.com/Lokeshabm
                </a>
                <a href="https://www.linkedin.com/in/b-m-lokesha-613a54376" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-primary)' }}>
                  <Linkedin size={15} color="#0a66c2" />
                  linkedin.com/in/b-m-lokesha-613a54376
                </a>
              </div>
            </div>

            {/* CAREER OBJECTIVE */}
            <div style={{ marginBottom: '2.2rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--accent-blue)', marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Award size={18} />
                Career Objective
              </h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.95rem' }}>
                Disciplined and detail-oriented Software Engineering student with a passion for building full-stack applications using a structured, test-driven development approach.
              </p>
            </div>

            {/* EDUCATION */}
            <div style={{ marginBottom: '2.2rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--accent-blue)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <GraduationCap size={18} />
                Education
              </h3>

              <div style={{ marginBottom: '1.2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700 }}>B.Tech — 2023 – Ongoing</h4>
                  <span style={{ fontSize: '0.9rem', color: 'var(--accent-emerald)', fontWeight: 700 }}>CGPA: 7.83</span>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>Kishkinda University, Ballari</p>
              </div>

              <div style={{ marginBottom: '1.2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Class XII (PUC) — 2021–2023</h4>
                  <span style={{ fontSize: '0.9rem', color: 'var(--accent-emerald)', fontWeight: 700 }}>73.83%</span>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>CC0008, GOVT EX MUNICIPAL PU COLLAGE, BALLARI</p>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Class X (SSLC) — 2021</h4>
                  <span style={{ fontSize: '0.9rem', color: 'var(--accent-emerald)', fontWeight: 700 }}>92.64%</span>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>MORARJI DESAI RESIDENTION SCHOOL-BC, METRIKI, SANDOOR, BALLARI</p>
              </div>
            </div>

            {/* TECHNICAL SKILLS */}
            <div style={{ marginBottom: '2.2rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--accent-blue)', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Code size={18} />
                Technical Skills
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.8rem', fontSize: '0.9rem' }}>
                <div><strong>Languages:</strong> <span style={{ color: 'var(--text-secondary)' }}>Java SE, C, Python</span></div>
                <div><strong>Backend:</strong> <span style={{ color: 'var(--text-secondary)' }}>Django</span></div>
                <div><strong>Frontend:</strong> <span style={{ color: 'var(--text-secondary)' }}>HTML, CSS</span></div>
                <div><strong>Databases:</strong> <span style={{ color: 'var(--text-secondary)' }}>MySQL databases</span></div>
                <div><strong>Cloud &amp; DevOps:</strong> <span style={{ color: 'var(--text-secondary)' }}>AWS, GitHub &amp; Git</span></div>
                <div><strong>Methodology:</strong> <span style={{ color: 'var(--text-secondary)' }}>DSA (Data Structures &amp; Algorithms)</span></div>
              </div>
            </div>

            {/* PROJECTS */}
            <div style={{ marginBottom: '2.2rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--accent-blue)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Briefcase size={18} />
                Projects
              </h3>

              <div style={{ marginBottom: '1.4rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap' }}>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Direct Marketing for Farmer</h4>
                  <span style={{ fontSize: '0.82rem', color: 'var(--accent-purple)', fontFamily: 'var(--font-mono)' }}>Python, Django, HTML, CSS, MySQL</span>
                </div>
                <ul style={{ listStyle: 'disc', paddingLeft: '1.2rem', marginTop: '0.4rem', color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
                  <li>Developed a web application to help farmers sell their agricultural products directly to consumers.</li>
                  <li>Created features for farmer registration, product listings, price updates, and customer orders.</li>
                  <li>Used Django for backend development and MySQL for storing farmer, product, and order details.</li>
                  <li>Designed a user-friendly interface for browsing products and managing orders.</li>
                </ul>
              </div>

              <div style={{ marginBottom: '1.4rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Expense Tracker Mobile App</h4>
                    <a
                      href="https://anti-blush.vercel.app/"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ fontSize: '0.78rem', color: 'var(--accent-blue)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontWeight: 600 }}
                    >
                      <span>Live Demo</span>
                      <ExternalLink size={12} />
                    </a>
                  </div>
                  <span style={{ fontSize: '0.82rem', color: 'var(--accent-purple)', fontFamily: 'var(--font-mono)' }}>Flutter, Dart, Firebase, SQLite</span>
                </div>
                <ul style={{ listStyle: 'disc', paddingLeft: '1.2rem', marginTop: '0.4rem', color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
                  <li>Developed a mobile application to track and manage daily income and expenses.</li>
                  <li>Implemented Firebase Authentication for secure user login and registration.</li>
                  <li>Integrated SQLite for local storage and management of financial transactions.</li>
                  <li>Used Provider for state management and FL Chart to display spending patterns through interactive charts.</li>
                  <li>Implemented transaction categorization and monthly financial reports.</li>
                  <li>Built and tested the Android application APK.</li>
                </ul>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 700 }}>AI Interview Preparation System</h4>
                    <a
                      href="https://ai-interview-preparation-system-pi.vercel.app/login/"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ fontSize: '0.78rem', color: 'var(--accent-blue)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontWeight: 600 }}
                    >
                      <span>Live Demo</span>
                      <ExternalLink size={12} />
                    </a>
                    <a
                      href="https://github.com/Lokeshabm/Ai_Interview_preperation_System.git"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ fontSize: '0.78rem', color: 'var(--accent-purple)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontWeight: 600 }}
                    >
                      <span>GitHub</span>
                      <ExternalLink size={12} />
                    </a>
                  </div>
                  <span style={{ fontSize: '0.82rem', color: 'var(--accent-purple)', fontFamily: 'var(--font-mono)' }}>Python, Django, HTML, CSS, JavaScript, SQLite</span>
                </div>
                <ul style={{ listStyle: 'disc', paddingLeft: '1.2rem', marginTop: '0.4rem', color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
                  <li>Developed a web-based application to help students prepare for technical and HR interviews.</li>
                  <li>Created a question bank containing 100+ interview questions across programming and technical subjects.</li>
                  <li>Implemented topic-wise question practice to improve technical knowledge and interview preparation.</li>
                  <li>Designed a user-friendly interface for easy navigation and interactive learning.</li>
                  <li>Used Django for backend development and SQLite for database management.</li>
                </ul>
              </div>
            </div>

            {/* INTERNSHIPS */}
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--accent-blue)', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Briefcase size={18} />
                Internships
              </h3>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap' }}>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700 }}>1. Mobile App Development Intern</h4>
                  <span style={{ fontSize: '0.85rem', color: 'var(--accent-emerald)' }}>20 July 2026 – 19 August 2026</span>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.4rem' }}>
                  Kinetrexa Software Private Limited, remote
                </p>
                <ul style={{ listStyle: 'disc', paddingLeft: '1.2rem', color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
                  <li>
                    Expense Tracker Project using AntiGravity ai tool. (
                    <a
                      href="https://anti-blush.vercel.app/"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: 'var(--accent-blue)', textDecoration: 'underline', fontWeight: 600 }}
                    >
                      Live Demo: anti-blush.vercel.app
                    </a>
                    )
                  </li>
                  <li>A task is completed with completion certificate achieved.</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
