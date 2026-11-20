/**
 * Portfolio API Service
 * Communicates with the Java SE REST API server via the standard Fetch API.
 * Includes fallback data matching B M LOKESHA's actual uploaded resume.
 */

const API_BASE_URL = 'http://localhost:8080/api';

// Accurate data matching B M LOKESHA's resume
const FALLBACK_DATA = {
  profile: {
    name: "B M LOKESHA",
    designation: "Aspiring Software Developer",
    bio: "Disciplined and detail-oriented Software Engineering student with a passion for building full-stack applications using a structured, test-driven development approach.",
    careerObjective: "Disciplined and detail-oriented Software Engineering student with a passion for building full-stack applications using a structured, test-driven development approach.",
    careerGoals: "To secure a challenging role as a Software Developer in a progressive organization where I can leverage my expertise in Java SE, Django, and React to deliver high-value solutions.",
    education: "B.Tech in Computer Science and Engineering",
    university: "Kishkinda University, Ballari",
    cgpa: 7.83,
    languages: ["Kannada", "English"],
    socialLinks: {
      github: "https://github.com/Lokeshabm",
      linkedin: "https://www.linkedin.com/in/b-m-lokesha-613a54376",
      email: "lokeshbm2003@gmail.com"
    },
    email: "lokeshbm2003@gmail.com",
    phone: "9900181830",
    location: "Ballari, Karnataka, India"
  },
  projects: [
    {
      id: 1,
      title: "Direct Marketing for Farmer",
      category: "Full Stack Web App",
      description: "Developed a web application to help farmers sell their agricultural products directly to consumers.",
      technologies: ["Python", "Django", "HTML", "CSS", "MySQL"],
      features: [
        "Created features for farmer registration, product listings, price updates, and customer orders.",
        "Used Django for backend development and MySQL for storing farmer, product, and order details.",
        "Designed a user-friendly interface for browsing products and managing orders."
      ],
      githubUrl: "https://github.com/Lokeshabm",
      liveDemoUrl: null,
      image: "/images/profile.png"
    },
    {
      id: 2,
      title: "Expense Tracker Mobile App",
      category: "Mobile & Cloud App",
      description: "Developed a mobile application to track and manage daily income and expenses.",
      technologies: ["Flutter", "Dart", "Firebase", "SQLite"],
      features: [
        "Implemented Firebase Authentication for secure user login and registration.",
        "Integrated SQLite for local storage and management of financial transactions.",
        "Used Provider for state management and FL Chart to display spending patterns through interactive charts.",
        "Implemented transaction categorization and monthly financial reports.",
        "Built and tested the Android application APK."
      ],
      githubUrl: "https://github.com/Lokeshabm/expense_Tracker.git",
      liveDemoUrl: "https://anti-blush.vercel.app/",
      image: "/images/profile.png"
    },
    {
      id: 3,
      title: "AI Interview Preparation System",
      category: "AI & Web Application",
      description: "Developed a web-based application to help students prepare for technical and HR interviews.",
      technologies: ["Python", "Django", "HTML", "CSS", "JavaScript", "SQLite"],
      features: [
        "Created a question bank containing 100+ interview questions across programming and technical subjects.",
        "Implemented topic-wise question practice to improve technical knowledge and interview preparation.",
        "Designed a user-friendly interface for easy navigation and interactive learning.",
        "Used Django for backend development and SQLite for database management."
      ],
      githubUrl: "https://github.com/Lokeshabm/Ai_Interview_preperation_System.git",
      liveDemoUrl: "https://ai-interview-preparation-system-pi.vercel.app/login/",
      image: "/images/profile.png"
    }
  ],
  skills: [
    {
      category: "Languages",
      icon: "code",
      items: [
        { name: "Java SE", level: 88, experience: "Advanced" },
        { name: "Python", level: 85, experience: "Proficient" },
        { name: "C", level: 80, experience: "Intermediate" }
      ]
    },
    {
      category: "Backend",
      icon: "server",
      items: [
        { name: "Django", level: 85, experience: "Proficient" },
        { name: "Java SE HttpServer", level: 86, experience: "Advanced" }
      ]
    },
    {
      category: "Frontend",
      icon: "layout",
      items: [
        { name: "HTML", level: 92, experience: "Expert" },
        { name: "CSS", level: 88, experience: "Advanced" },
        { name: "React.js", level: 84, experience: "Proficient" }
      ]
    },
    {
      category: "Databases",
      icon: "database",
      items: [
        { name: "MySQL databases", level: 85, experience: "Proficient" },
        { name: "SQLite", level: 82, experience: "Proficient" }
      ]
    },
    {
      category: "Cloud & DevOps",
      icon: "tool",
      items: [
        { name: "AWS", level: 75, experience: "Intermediate" },
        { name: "GitHub & Git", level: 88, experience: "Proficient" }
      ]
    },
    {
      category: "Methodology",
      icon: "methodology",
      items: [
        { name: "DSA (Data Structures & Algorithms)", level: 85, experience: "Proficient" }
      ]
    }
  ],
  education: [
    {
      degree: "Bachelor of Technology (B.Tech)",
      field: "Computer Science and Engineering",
      institution: "Kishkinda University",
      location: "Ballari, Karnataka",
      score: "CGPA: 7.83",
      duration: "2023 – Ongoing",
      highlights: [
        "Disciplined and detail-oriented Software Engineering student.",
        "Focus on full-stack web and mobile systems, data structures, and algorithms."
      ]
    },
    {
      degree: "Class XII (PUC)",
      field: "Pre-University Course",
      institution: "CC0008, GOVT EX MUNICIPAL PU COLLAGE, BALLARI",
      location: "Ballari, Karnataka",
      score: "73.83%",
      duration: "2021 – 2023",
      highlights: [
        "Core science foundation in Physics, Chemistry, and Mathematics."
      ]
    },
    {
      degree: "Class X (SSLC)",
      field: "Secondary School Leaving Certificate",
      institution: "MORARJI DESAI RESIDENTION SCHOOL-BC, METRIKI, SANDOOR, BALLARI",
      location: "Ballari, Karnataka",
      score: "92.64%",
      duration: "2021",
      highlights: [
        "Graduated with High Academic Distinction (92.64%)."
      ]
    }
  ],
  internships: [
    {
      role: "Mobile App Development Intern",
      company: "Kinetrexa Software Private Limited",
      mode: "Remote",
      duration: "20 July 2026 – 19 August 2026",
      details: [
        "Expense Tracker Project using AntiGravity ai tool.",
        "A task is completed with completion certificate achieved."
      ],
      liveDemoUrl: "https://anti-blush.vercel.app/"
    }
  ]
};

async function fetchWithFallback(endpoint, fallbackKey) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: { 'Accept': 'application/json' },
      mode: 'cors'
    });
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }
    return await response.json();
  } catch (err) {
    console.warn(`[API] Fetch error for ${endpoint}. Using cache.`);
    return FALLBACK_DATA[fallbackKey];
  }
}

export const portfolioApi = {
  getProfile: () => fetchWithFallback('/profile', 'profile'),
  getProjects: () => fetchWithFallback('/projects', 'projects'),
  getSkills: () => fetchWithFallback('/skills', 'skills'),
  getEducation: () => fetchWithFallback('/education', 'education'),
  getInternships: () => Promise.resolve(FALLBACK_DATA.internships),

  submitContact: async (formData) => {
    // Attempt primary URL, with fallback to proxy route if direct connection fails
    const urls = [
      'http://localhost:8080/api/contact',
      '/api/contact'
    ];

    let lastError = null;

    for (const url of urls) {
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(formData)
        });

        const rawText = await response.text();
        let data = {};
        try {
          data = JSON.parse(rawText);
        } catch (e) {
          data = { message: rawText || 'Server error occurred.' };
        }

        const isSuccess = response.ok && Boolean(data.success);
        return {
          success: isSuccess,
          message: data.message || (isSuccess ? 'Your message has been received successfully.' : 'Failed to submit form.'),
          data: data.data || null
        };
      } catch (err) {
        lastError = err;
      }
    }

    console.warn('[API] Contact submission failed on all endpoints:', lastError);
    return {
      success: false,
      message: 'Could not connect to Java SE backend server (http://localhost:8080). Please ensure the backend is started using run-backend.bat or run-backend.ps1.'
    };
  },

  // Project Analytics & Visitor Tracking Methods
  trackProjectActivity: async (activityPayload) => {
    const urls = ['http://localhost:8080/api/analytics/track', '/api/analytics/track'];
    for (const url of urls) {
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(activityPayload)
        });
        if (response.ok) {
          return await response.json();
        }
      } catch (err) {
        // try next endpoint
      }
    }
    return { success: false, message: 'Could not reach backend analytics.' };
  },

  getProjectStats: async () => {
    const urls = ['http://localhost:8080/api/analytics/project-stats', '/api/analytics/project-stats'];
    for (const url of urls) {
      try {
        const response = await fetch(url, { headers: { 'Accept': 'application/json' } });
        if (response.ok) {
          return await response.json();
        }
      } catch (err) {}
    }
    // Fallback stats
    return {
      totalVisitors: 0,
      totalProjectViews: 0,
      mostViewedProject: "Direct Marketing for Farmer",
      mostViewedProjectCount: 0,
      todayProjectViews: 0,
      mostViewedProjects: []
    };
  },

  getProjectActivities: async (params = {}) => {
    const searchParams = new URLSearchParams();
    if (params.search) searchParams.set('search', params.search);
    if (params.project && params.project !== 'all') searchParams.set('project', params.project);
    if (params.action && params.action !== 'all') searchParams.set('action', params.action);
    if (params.page) searchParams.set('page', params.page);
    if (params.limit) searchParams.set('limit', params.limit);

    const qs = searchParams.toString() ? `?${searchParams.toString()}` : '';
    const urls = [`http://localhost:8080/api/analytics/project-activity${qs}`, `/api/analytics/project-activity${qs}`];

    for (const url of urls) {
      try {
        const response = await fetch(url, { headers: { 'Accept': 'application/json' } });
        if (response.ok) {
          return await response.json();
        }
      } catch (err) {}
    }

    return {
      items: [],
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 0
    };
  },

  getMostViewedProjects: async () => {
    const urls = ['http://localhost:8080/api/analytics/most-viewed-projects', '/api/analytics/most-viewed-projects'];
    for (const url of urls) {
      try {
        const response = await fetch(url, { headers: { 'Accept': 'application/json' } });
        if (response.ok) {
          return await response.json();
        }
      } catch (err) {}
    }
    return [];
  }
};
