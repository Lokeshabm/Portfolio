import React, { useState, useEffect, useCallback } from 'react';
import SectionTitle from '../components/SectionTitle';
import { portfolioApi } from '../services/api';
import {
  Users,
  Eye,
  Award,
  Calendar,
  Search,
  Filter,
  RefreshCw,
  ShieldCheck,
  Laptop,
  Smartphone,
  Tablet,
  Globe,
  Github,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Activity,
  Layers,
  Sparkles,
  BarChart3
} from 'lucide-react';

export default function VisitorAnalytics() {
  const [stats, setStats] = useState({
    totalVisitors: 0,
    totalProjectViews: 0,
    mostViewedProject: 'None',
    mostViewedProjectCount: 0,
    todayProjectViews: 0,
    mostViewedProjects: []
  });

  const [activities, setActivities] = useState([]);
  const [totalActivities, setTotalActivities] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [searchQuery, setSearchQuery] = useState('');
  const [projectFilter, setProjectFilter] = useState('all');
  const [actionFilter, setActionFilter] = useState('all');

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch summary metrics & project ranking
  const loadStats = useCallback(async () => {
    try {
      const data = await portfolioApi.getProjectStats();
      if (data) {
        setStats(data);
      }
    } catch (err) {
      console.error('[Analytics] Error loading stats:', err);
    }
  }, []);

  // Fetch paginated and filtered activity logs
  const loadActivities = useCallback(async () => {
    try {
      const res = await portfolioApi.getProjectActivities({
        search: searchQuery,
        project: projectFilter,
        action: actionFilter,
        page: currentPage,
        limit: pageSize
      });

      if (res && res.items) {
        setActivities(res.items);
        setTotalActivities(res.total || 0);
        setTotalPages(res.totalPages || 1);
      }
    } catch (err) {
      console.error('[Analytics] Error loading activities:', err);
    }
  }, [searchQuery, projectFilter, actionFilter, currentPage, pageSize]);

  // Initial load
  useEffect(() => {
    setLoading(true);
    Promise.all([loadStats(), loadActivities()]).finally(() => {
      setLoading(false);
    });
  }, [loadStats, loadActivities]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([loadStats(), loadActivities()]);
    setTimeout(() => setRefreshing(false), 500);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleProjectFilterChange = (e) => {
    setProjectFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleActionFilterChange = (e) => {
    setActionFilter(e.target.value);
    setCurrentPage(1);
  };

  // Helper for rendering action badge
  const renderActionBadge = (action) => {
    const act = (action || '').toLowerCase();
    if (act.includes('demo') || act.includes('live')) {
      return (
        <span className="badge-pill" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
          <ExternalLink size={12} style={{ marginRight: 4 }} />
          Live Demo Click
        </span>
      );
    }
    if (act.includes('github')) {
      return (
        <span className="badge-pill" style={{ background: 'rgba(168, 85, 247, 0.15)', color: '#c084fc', border: '1px solid rgba(168, 85, 247, 0.3)' }}>
          <Github size={12} style={{ marginRight: 4 }} />
          GitHub Click
        </span>
      );
    }
    if (act.includes('detail')) {
      return (
        <span className="badge-pill" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
          <Layers size={12} style={{ marginRight: 4 }} />
          View Details
        </span>
      );
    }
    return (
      <span className="badge-pill" style={{ background: 'rgba(148, 163, 184, 0.12)', color: 'var(--text-secondary)', border: '1px solid var(--border-subtle)' }}>
        <Eye size={12} style={{ marginRight: 4 }} />
        Card View
      </span>
    );
  };

  // Helper for rendering device icon
  const renderDeviceBadge = (device) => {
    const dev = (device || 'desktop').toLowerCase();
    if (dev.includes('mobile')) {
      return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)' }}>
          <Smartphone size={15} color="#38bdf8" />
          <span>Mobile</span>
        </span>
      );
    }
    if (dev.includes('tablet')) {
      return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)' }}>
          <Tablet size={15} color="#a855f7" />
          <span>Tablet</span>
        </span>
      );
    }
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)' }}>
        <Laptop size={15} color="#10b981" />
        <span>Desktop</span>
      </span>
    );
  };

  // Helper for rendering traffic source badge
  const renderSourceBadge = (source) => {
    const s = source || 'Direct';
    let color = '#38bdf8';
    if (s.toLowerCase().includes('linkedin')) color = '#0a66c2';
    else if (s.toLowerCase().includes('github')) color = '#c084fc';
    else if (s.toLowerCase().includes('google')) color = '#f59e0b';

    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
        <Globe size={14} color={color} />
        <span style={{ fontWeight: 500 }}>{s}</span>
      </span>
    );
  };

  return (
    <div className="page-wrapper container animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <SectionTitle
            badge="Portfolio Intelligence"
            title="Visitor & Project Analytics"
            subtitle="Real-time, privacy-first tracking of which projects visitors view, open, and explore."
          />
        </div>

        <button
          onClick={handleRefresh}
          className="btn btn-secondary"
          disabled={refreshing}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1.2rem', marginTop: '1rem' }}
        >
          <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
          <span>{refreshing ? 'Updating...' : 'Refresh Data'}</span>
        </button>
      </div>

      {/* Privacy Notice Card */}
      <div className="glass-card" style={{ padding: '1.2rem 1.6rem', marginBottom: '2.5rem', borderLeft: '4px solid var(--accent-emerald)', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <ShieldCheck size={26} color="var(--accent-emerald)" style={{ flexShrink: 0 }} />
        <div style={{ flex: 1, minWidth: '280px' }}>
          <h4 style={{ fontSize: '0.98rem', fontWeight: 700, margin: '0 0 0.2rem 0', color: 'var(--text-primary)' }}>
            Zero-PII Anonymous Analytics
          </h4>
          <p style={{ margin: 0, fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            Visitor privacy is fully protected. All project events are tagged with anonymous identifiers (<code style={{ background: 'var(--bg-card)', padding: '2px 6px', borderRadius: 4 }}>Visitor 001</code>, <code style={{ background: 'var(--bg-card)', padding: '2px 6px', borderRadius: 4 }}>Visitor 002</code>). No personal identity, cookies, or device fingerprinting are collected.
          </p>
        </div>
      </div>

      {/* 4 Summary KPI Cards */}
      <div className="analytics-kpi-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        {/* Card 1: Total Visitors */}
        <div className="glass-card kpi-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
            <span style={{ fontSize: '0.86rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Total Visitors
            </span>
            <div className="kpi-icon-badge" style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8' }}>
              <Users size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.2rem' }}>
            {stats.totalVisitors}
          </div>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            Unique anonymous sessions
          </span>
        </div>

        {/* Card 2: Total Project Views */}
        <div className="glass-card kpi-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
            <span style={{ fontSize: '0.86rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Total Project Views
            </span>
            <div className="kpi-icon-badge" style={{ background: 'rgba(168, 85, 247, 0.15)', color: '#c084fc' }}>
              <Eye size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.2rem' }}>
            {stats.totalProjectViews}
          </div>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            Cards, details &amp; demo opens
          </span>
        </div>

        {/* Card 3: Most Viewed Project */}
        <div className="glass-card kpi-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
            <span style={{ fontSize: '0.86rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Most Viewed Project
            </span>
            <div className="kpi-icon-badge" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}>
              <Award size={20} />
            </div>
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.2rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {stats.mostViewedProject || 'N/A'}
          </div>
          <span style={{ fontSize: '0.82rem', color: 'var(--accent-emerald)', fontWeight: 600 }}>
            {stats.mostViewedProjectCount || 0} total interactions
          </span>
        </div>

        {/* Card 4: Today's Project Views */}
        <div className="glass-card kpi-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
            <span style={{ fontSize: '0.86rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Today's Project Views
            </span>
            <div className="kpi-icon-badge" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
              <Calendar size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.2rem' }}>
            {stats.todayProjectViews}
          </div>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            Recorded since 00:00 UTC
          </span>
        </div>
      </div>

      {/* Section: Most Viewed Projects with Popularity Charts */}
      <section style={{ marginBottom: '3.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
          <BarChart3 size={22} color="var(--accent-blue)" />
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>
            Most Viewed Projects
          </h2>
        </div>

        {stats.mostViewedProjects && stats.mostViewedProjects.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {stats.mostViewedProjects.map((proj) => (
              <div key={proj.projectName} className="glass-card" style={{ padding: '1.8rem', position: 'relative', overflow: 'hidden' }}>
                {/* Ranking Pill */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <span className="badge-pill" style={{ margin: 0, fontWeight: 700, background: proj.rank === 1 ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 'rgba(255,255,255,0.08)', color: '#fff' }}>
                    #{proj.rank} Ranked
                  </span>
                  <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--accent-emerald)' }}>
                    {proj.percentage}% of traffic
                  </span>
                </div>

                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.8rem', color: 'var(--text-primary)' }}>
                  {proj.projectName}
                </h3>

                {/* Popularity Visual Progress Meter */}
                <div style={{ background: 'var(--bg-body)', height: 8, borderRadius: 4, overflow: 'hidden', marginBottom: '1.2rem' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${Math.min(100, Math.max(8, proj.percentage))}%`,
                      background: proj.rank === 1 ? 'linear-gradient(90deg, #38bdf8, #818cf8)' : 'linear-gradient(90deg, #818cf8, #c084fc)',
                      borderRadius: 4,
                      transition: 'width 0.8s ease'
                    }}
                  />
                </div>

                {/* Metric Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem', fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
                  <div style={{ background: 'var(--bg-card)', padding: '0.6rem 0.8rem', borderRadius: 'var(--radius-sm)' }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>Total Views</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>{proj.totalViews}</div>
                  </div>
                  <div style={{ background: 'var(--bg-card)', padding: '0.6rem 0.8rem', borderRadius: 'var(--radius-sm)' }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>Unique Visitors</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>{proj.uniqueVisitors}</div>
                  </div>
                  <div style={{ background: 'var(--bg-card)', padding: '0.6rem 0.8rem', borderRadius: 'var(--radius-sm)' }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>Today's Views</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>{proj.todayViews}</div>
                  </div>
                  <div style={{ background: 'var(--bg-card)', padding: '0.6rem 0.8rem', borderRadius: 'var(--radius-sm)' }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>Weekly Views</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-purple)' }}>{proj.weeklyViews}</div>
                  </div>
                </div>

                {/* Action Breakdown Badges */}
                <div style={{ marginTop: '1.2rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', gap: '0.5rem', flexWrap: 'wrap', fontSize: '0.76rem' }}>
                  <span title="Card Impressions" style={{ color: 'var(--text-muted)' }}>Cards: <strong>{proj.cardViews}</strong></span>
                  <span style={{ color: 'var(--border-subtle)' }}>•</span>
                  <span title="Details Expanded" style={{ color: 'var(--text-muted)' }}>Details: <strong>{proj.detailViews}</strong></span>
                  <span style={{ color: 'var(--border-subtle)' }}>•</span>
                  <span title="GitHub Link Clicks" style={{ color: 'var(--text-muted)' }}>GitHub: <strong>{proj.githubClicks}</strong></span>
                  <span style={{ color: 'var(--border-subtle)' }}>•</span>
                  <span title="Live Demo Opens" style={{ color: 'var(--text-muted)' }}>Demo: <strong>{proj.liveDemoClicks}</strong></span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-card" style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
            <Activity size={36} style={{ margin: '0 auto 0.8rem auto', opacity: 0.5 }} />
            <p>No project view data has been recorded yet. Browse projects to see analytics appear here.</p>
          </div>
        )}
      </section>

      {/* Section: Project Activity Real-Time Log Table */}
      <section style={{ marginBottom: '4rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Activity size={22} color="var(--accent-emerald)" />
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>
              Project Activity
            </h2>
          </div>

          <span style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
            Showing <strong>{activities.length}</strong> of <strong>{totalActivities}</strong> logged activities
          </span>
        </div>

        {/* Toolbar: Search & Dropdown Filters */}
        <div className="glass-card" style={{ padding: '1.2rem', marginBottom: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
          {/* Search Box */}
          <div style={{ position: 'relative', flex: '1 1 240px' }}>
            <Search size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search visitor, project, device..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="form-control"
              style={{ paddingLeft: '2.5rem', fontSize: '0.88rem' }}
            />
          </div>

          {/* Filter by Project */}
          <div style={{ flex: '1 1 180px' }}>
            <select
              value={projectFilter}
              onChange={handleProjectFilterChange}
              className="form-control"
              style={{ fontSize: '0.88rem' }}
            >
              <option value="all">All Projects</option>
              <option value="Direct Marketing for Farmer">Direct Marketing for Farmer</option>
              <option value="Expense Tracker Mobile App">Expense Tracker Mobile App</option>
              <option value="AI Interview Preparation System">AI Interview Preparation System</option>
            </select>
          </div>

          {/* Filter by Action */}
          <div style={{ flex: '1 1 160px' }}>
            <select
              value={actionFilter}
              onChange={handleActionFilterChange}
              className="form-control"
              style={{ fontSize: '0.88rem' }}
            >
              <option value="all">All Actions</option>
              <option value="card_view">Card View</option>
              <option value="view_details">View Details</option>
              <option value="github_click">GitHub Click</option>
              <option value="live_demo_click">Live Demo Click</option>
            </select>
          </div>
        </div>

        {/* Activity Table */}
        <div className="glass-card" style={{ padding: 0, overflowX: 'auto' }}>
          {loading ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
              <div className="animate-spin" style={{ width: 32, height: 32, border: '3px solid var(--border-subtle)', borderTopColor: 'var(--accent-blue)', borderRadius: '50%', margin: '0 auto 1rem auto' }} />
              <p>Loading project analytics...</p>
            </div>
          ) : activities.length > 0 ? (
            <table className="analytics-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)', background: 'rgba(255, 255, 255, 0.02)' }}>
                  <th style={{ padding: '1rem 1.4rem', fontWeight: 600, color: 'var(--text-muted)' }}>Visitor ID</th>
                  <th style={{ padding: '1rem 1.4rem', fontWeight: 600, color: 'var(--text-muted)' }}>Project</th>
                  <th style={{ padding: '1rem 1.4rem', fontWeight: 600, color: 'var(--text-muted)' }}>Action</th>
                  <th style={{ padding: '1rem 1.4rem', fontWeight: 600, color: 'var(--text-muted)' }}>Date &amp; Time</th>
                  <th style={{ padding: '1rem 1.4rem', fontWeight: 600, color: 'var(--text-muted)' }}>Device</th>
                  <th style={{ padding: '1rem 1.4rem', fontWeight: 600, color: 'var(--text-muted)' }}>Source</th>
                </tr>
              </thead>
              <tbody>
                {activities.map((act) => (
                  <tr key={act.id} style={{ borderBottom: '1px solid var(--border-subtle)', transition: 'background 0.2s ease' }}>
                    <td style={{ padding: '1rem 1.4rem', fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--accent-blue)' }}>
                      {act.visitorId}
                    </td>
                    <td style={{ padding: '1rem 1.4rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {act.projectName}
                    </td>
                    <td style={{ padding: '1rem 1.4rem' }}>
                      {renderActionBadge(act.action)}
                    </td>
                    <td style={{ padding: '1rem 1.4rem', color: 'var(--text-secondary)', fontSize: '0.86rem' }}>
                      <div>{act.activityDate}</div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>{act.activityTime}</div>
                    </td>
                    <td style={{ padding: '1rem 1.4rem' }}>
                      {renderDeviceBadge(act.deviceType)}
                    </td>
                    <td style={{ padding: '1rem 1.4rem' }}>
                      {renderSourceBadge(act.trafficSource)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div style={{ padding: '4rem 2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
              <Layers size={44} style={{ margin: '0 auto 1rem auto', color: 'var(--text-muted)' }} />
              <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: '0.4rem' }}>No activity records found</h3>
              <p style={{ fontSize: '0.9rem', maxWidth: '420px', margin: '0 auto' }}>
                {searchQuery || projectFilter !== 'all' || actionFilter !== 'all'
                  ? 'No matching project events match your current filter criteria. Try clearing search or changing filters.'
                  : 'Start exploring project cards, clicking GitHub links, or opening Live Demos to record activities.'}
              </p>
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.4rem', borderTop: '1px solid var(--border-subtle)', flexWrap: 'wrap', gap: '0.8rem' }}>
              <span style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
                Page {currentPage} of {totalPages}
              </span>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="btn btn-secondary"
                  style={{ padding: '0.4rem 0.8rem', fontSize: '0.84rem' }}
                >
                  <ChevronLeft size={16} />
                  <span>Prev</span>
                </button>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage >= totalPages}
                  className="btn btn-secondary"
                  style={{ padding: '0.4rem 0.8rem', fontSize: '0.84rem' }}
                >
                  <span>Next</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
