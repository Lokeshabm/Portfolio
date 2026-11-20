import React, { useState } from 'react';
import SectionTitle from '../components/SectionTitle';
import Notification from '../components/Notification';
import { portfolioApi } from '../services/api';
import {
  Mail,
  MapPin,
  Send,
  Github,
  Linkedin,
  Phone,
  User,
  Tag,
  MessageSquare,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Clock
} from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [lastSubmittedData, setLastSubmittedData] = useState(null);

  // Form field validation
  const validate = () => {
    const newErrors = {};

    // 1. Full Name Validation
    if (!formData.name.trim()) {
      newErrors.name = 'Full Name is required.';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Full Name must be at least 2 characters.';
    }

    // 2. Email Address Validation
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email Address is required.';
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address (e.g. name@example.com).';
    }

    // 3. Subject Validation
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required.';
    } else if (formData.subject.trim().length < 2) {
      newErrors.subject = 'Subject must be at least 2 characters.';
    }

    // 4. Message Validation
    if (!formData.message.trim()) {
      newErrors.message = 'Message content cannot be empty.';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = `Message must be at least 10 characters (currently ${formData.message.trim().length}).`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prevent submission while in progress
    if (loading) return;

    if (!validate()) {
      setNotification({
        type: 'error',
        message: 'Please resolve the highlighted form errors before submitting.'
      });
      return;
    }

    // Duplicate submission prevention
    const currentPayload = JSON.stringify({
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      subject: formData.subject.trim(),
      message: formData.message.trim()
    });

    if (lastSubmittedData === currentPayload) {
      setNotification({
        type: 'error',
        message: 'You have already submitted this exact message. To send another note, please modify the content.'
      });
      return;
    }

    setLoading(true);
    setNotification(null);

    try {
      const response = await portfolioApi.submitContact(formData);

      if (response.success) {
        setNotification({
          type: 'success',
          message: response.message || 'Your message has been received successfully.'
        });
        setLastSubmittedData(currentPayload);
        // Clear the form after successful submission
        setFormData({ name: '', email: '', subject: '', message: '' });
        setErrors({});
      } else {
        setNotification({
          type: 'error',
          message: response.message || 'Failed to submit message. Please try again.'
        });
      }
    } catch (err) {
      setNotification({
        type: 'error',
        message: 'Network error: Could not communicate with the Java SE backend. Please ensure the backend is running.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper container">
      <SectionTitle
        badge="Get In Touch"
        title="Contact Me"
        subtitle="Have an opportunity, internship inquiry, or technical collaboration? Send a direct message below and I will respond promptly."
      />

      {/* Floating Notification Toast */}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      <div className="contact-layout">
        {/* Left Card: Verified Contact Channels */}
        <div className="glass-card contact-info-card animate-fade-in">
          <span className="badge-pill">Direct Channels</span>
          <h3 style={{ fontSize: '1.65rem', fontWeight: 800, margin: '0.8rem 0 0.4rem 0' }}>
            Let's Discuss <br />
            <span className="gradient-text">New Opportunities</span>
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '2rem' }}>
            I am actively looking for software developer roles, technical internships, and project collaborations. Feel free to connect directly.
          </p>

          <div className="contact-info-list" style={{ margin: '0 0 2rem 0' }}>
            {/* Full Name */}
            <div className="contact-info-item">
              <div className="contact-info-icon">
                <User size={20} />
              </div>
              <div>
                <p style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>Developer</p>
                <p style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  B M LOKESHA
                </p>
              </div>
            </div>

            {/* Email Address */}
            <div className="contact-info-item">
              <div className="contact-info-icon">
                <Mail size={20} />
              </div>
              <div>
                <p style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>Email Address</p>
                <a
                  href="mailto:lokeshbm2003@gmail.com"
                  style={{ fontSize: '0.98rem', fontWeight: 600, color: 'var(--accent-blue)' }}
                >
                  lokeshbm2003@gmail.com
                </a>
              </div>
            </div>

            {/* Phone Number */}
            <div className="contact-info-item">
              <div className="contact-info-icon">
                <Phone size={20} />
              </div>
              <div>
                <p style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>Phone / WhatsApp</p>
                <a
                  href="tel:9900181830"
                  style={{ fontSize: '0.98rem', fontWeight: 600, color: 'var(--accent-emerald)' }}
                >
                  +91 9900181830
                </a>
              </div>
            </div>

            {/* Location */}
            <div className="contact-info-item">
              <div className="contact-info-icon">
                <MapPin size={20} />
              </div>
              <div>
                <p style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>Location</p>
                <p style={{ fontSize: '0.98rem', fontWeight: 600 }}>
                  Ballari, Karnataka, India
                </p>
              </div>
            </div>
          </div>

          {/* Social Profiles */}
          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.5rem' }}>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}>
              Official Social Profiles
            </p>
            <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
              <a
                href="https://github.com/Lokeshabm"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary"
                style={{ padding: '0.6rem 1.2rem', fontSize: '0.88rem' }}
              >
                <Github size={16} />
                <span>GitHub</span>
              </a>
              <a
                href="https://www.linkedin.com/in/b-m-lokesha-613a54376"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary"
                style={{ padding: '0.6rem 1.2rem', fontSize: '0.88rem' }}
              >
                <Linkedin size={16} color="#0a66c2" />
                <span>LinkedIn</span>
              </a>
            </div>
          </div>
        </div>

        {/* Right Card: Modern Interactive Contact Form */}
        <div className="glass-card contact-form-card animate-fade-in">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap' }}>
            <h3 style={{ fontSize: '1.45rem', fontWeight: 700 }}>
              Send a Direct Message
            </h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', background: 'rgba(99, 102, 241, 0.1)', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
              Java SE API &bull; Port 8080
            </span>
          </div>

          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.8rem' }}>
            Fill in the details below. Your submission is received and validated by the Core Java HttpServer API.
          </p>

          {/* Inline Feedback Banner */}
          {notification && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.9rem 1.2rem',
                borderRadius: 'var(--radius-md)',
                marginBottom: '1.5rem',
                fontSize: '0.9rem',
                background: notification.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                border: notification.type === 'success' ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(239, 68, 68, 0.4)',
                color: notification.type === 'success' ? '#34d399' : '#f87171'
              }}
            >
              {notification.type === 'success' ? (
                <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
              ) : (
                <AlertCircle size={18} style={{ flexShrink: 0 }} />
              )}
              <span>{notification.message}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            {/* Field 1: Full Name */}
            <div className="form-group">
              <label htmlFor="name" className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <User size={15} color="var(--accent-blue)" />
                <span>Full Name *</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="e.g. B M LOKESHA"
                value={formData.name}
                onChange={handleChange}
                disabled={loading}
                className={`form-control ${errors.name ? 'form-control-error' : ''}`}
                style={errors.name ? { borderColor: '#ef4444', boxShadow: '0 0 0 2px rgba(239, 68, 68, 0.2)' } : {}}
              />
              {errors.name && <p className="form-error">{errors.name}</p>}
            </div>

            {/* Field 2: Email Address */}
            <div className="form-group">
              <label htmlFor="email" className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Mail size={15} color="var(--accent-purple)" />
                <span>Email Address *</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="e.g. example@gmail.com"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
                className={`form-control ${errors.email ? 'form-control-error' : ''}`}
                style={errors.email ? { borderColor: '#ef4444', boxShadow: '0 0 0 2px rgba(239, 68, 68, 0.2)' } : {}}
              />
              {errors.email && <p className="form-error">{errors.email}</p>}
            </div>

            {/* Field 3: Subject */}
            <div className="form-group">
              <label htmlFor="subject" className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Tag size={15} color="var(--accent-pink)" />
                <span>Subject *</span>
              </label>
              <input
                id="subject"
                name="subject"
                type="text"
                placeholder="e.g. Job Opportunity / Interview Inquiry"
                value={formData.subject}
                onChange={handleChange}
                disabled={loading}
                className={`form-control ${errors.subject ? 'form-control-error' : ''}`}
                style={errors.subject ? { borderColor: '#ef4444', boxShadow: '0 0 0 2px rgba(239, 68, 68, 0.2)' } : {}}
              />
              {errors.subject && <p className="form-error">{errors.subject}</p>}
            </div>

            {/* Field 4: Message */}
            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label htmlFor="message" className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', margin: 0 }}>
                  <MessageSquare size={15} color="var(--accent-emerald)" />
                  <span>Message *</span>
                </label>
                <span style={{ fontSize: '0.75rem', color: formData.message.trim().length >= 10 ? 'var(--accent-emerald)' : 'var(--text-muted)' }}>
                  {formData.message.trim().length} / 10 min chars
                </span>
              </div>
              <textarea
                id="message"
                name="message"
                rows="5"
                placeholder="Write your message details here (minimum 10 characters)..."
                value={formData.message}
                onChange={handleChange}
                disabled={loading}
                className={`form-control ${errors.message ? 'form-control-error' : ''}`}
                style={{
                  resize: 'vertical',
                  ...(errors.message ? { borderColor: '#ef4444', boxShadow: '0 0 0 2px rgba(239, 68, 68, 0.2)' } : {})
                }}
              />
              {errors.message && <p className="form-error">{errors.message}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '0.95rem',
                fontSize: '1rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.85 : 1
              }}
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Submitting to Java Backend...</span>
                </>
              ) : (
                <>
                  <Send size={18} />
                  <span>Send Message</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
