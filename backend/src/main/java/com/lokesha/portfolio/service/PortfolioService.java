package com.lokesha.portfolio.service;

import com.lokesha.portfolio.model.*;

import java.util.*;

public class PortfolioService {

    private final Profile profile;
    private final List<Project> projects;
    private final List<Skill> skills;
    private final List<Education> educationList;

    public PortfolioService() {
        this.profile = initProfile();
        this.projects = initProjects();
        this.skills = initSkills();
        this.educationList = initEducation();
    }

    private Profile initProfile() {
        Map<String, String> socialLinks = new LinkedHashMap<>();
        socialLinks.put("github", "https://github.com/Lokeshabm");
        socialLinks.put("linkedin", "https://www.linkedin.com/in/b-m-lokesha-613a54376");
        socialLinks.put("email", "lokeshbm2003@gmail.com");

        return new Profile(
                "B M LOKESHA",
                "Aspiring Software Developer",
                "Disciplined and detail-oriented Software Engineering student with a passion for building full-stack applications using a structured, test-driven development approach.",
                "Disciplined and detail-oriented Software Engineering student with a passion for building full-stack applications using a structured, test-driven development approach.",
                "To secure a challenging role as a Software Developer in a progressive organization where I can leverage my expertise in Java SE, Django, and React to deliver high-value solutions.",
                "B.Tech in Computer Science and Engineering",
                "Kishkinda University, Ballari",
                7.83,
                Arrays.asList("Kannada", "English"),
                socialLinks,
                "lokeshbm2003@gmail.com",
                "Ballari, Karnataka, India"
        );
    }

    private List<Project> initProjects() {
        List<Project> list = new ArrayList<>();

        list.add(new Project(
                1,
                "Direct Marketing for Farmer",
                "Full Stack Web App",
                "Developed a web application to help farmers sell their agricultural products directly to consumers.",
                Arrays.asList("Python", "Django", "HTML", "CSS", "MySQL"),
                Arrays.asList(
                        "Created features for farmer registration, product listings, price updates, and customer orders.",
                        "Used Django for backend development and MySQL for storing farmer, product, and order details.",
                        "Designed a user-friendly interface for browsing products and managing orders."
                ),
                "https://github.com/Lokeshabm",
                "#",
                "/images/profile.png"
        ));

        list.add(new Project(
                2,
                "Expense Tracker Mobile App",
                "Mobile & Cloud App",
                "Developed a mobile application to track and manage daily income and expenses with real-time Firebase Authentication.",
                Arrays.asList("Flutter", "Dart", "Firebase", "SQLite", "FL Chart"),
                Arrays.asList(
                        "Implemented Firebase Authentication for secure user login and registration.",
                        "Integrated SQLite for local storage and management of financial transactions.",
                        "Used Provider for state management and FL Chart to display spending patterns through interactive charts.",
                        "Implemented transaction categorization, monthly financial reports, and APK deployment."
                ),
                "https://github.com/Lokeshabm/expense_Tracker.git",
                "https://anti-blush.vercel.app/",
                "/images/profile.png"
        ));

        list.add(new Project(
                3,
                "AI Interview Preparation System",
                "AI & Web Application",
                "Developed a web-based application to help students prepare for technical and HR interviews with comprehensive question banks.",
                Arrays.asList("Python", "Django", "HTML", "CSS", "JavaScript", "SQLite"),
                Arrays.asList(
                        "Created a question bank containing 100+ interview questions across programming and technical subjects.",
                        "Implemented topic-wise question practice to improve technical knowledge and interview preparation.",
                        "Designed a user-friendly interface for easy navigation and interactive learning.",
                        "Used Django for backend development and SQLite for database management."
                ),
                "https://github.com/Lokeshabm/Ai_Interview_preperation_System.git",
                "https://ai-interview-preparation-system-pi.vercel.app/login/",
                "/images/profile.png"
        ));

        return list;
    }

    private List<Skill> initSkills() {
        List<Skill> list = new ArrayList<>();

        list.add(new Skill("Languages", "code", Arrays.asList(
                new Skill.SkillItem("Java SE", 88, "Advanced"),
                new Skill.SkillItem("Python", 85, "Proficient"),
                new Skill.SkillItem("C", 80, "Intermediate")
        )));

        list.add(new Skill("Backend", "server", Arrays.asList(
                new Skill.SkillItem("Django", 85, "Proficient"),
                new Skill.SkillItem("Java SE HttpServer (REST API)", 86, "Advanced")
        )));

        list.add(new Skill("Frontend", "layout", Arrays.asList(
                new Skill.SkillItem("HTML", 92, "Expert"),
                new Skill.SkillItem("CSS", 88, "Advanced"),
                new Skill.SkillItem("React.js", 84, "Proficient")
        )));

        list.add(new Skill("Databases", "database", Arrays.asList(
                new Skill.SkillItem("MySQL databases", 85, "Proficient"),
                new Skill.SkillItem("SQLite", 82, "Proficient")
        )));

        list.add(new Skill("Cloud & DevOps", "tool", Arrays.asList(
                new Skill.SkillItem("AWS", 75, "Intermediate"),
                new Skill.SkillItem("GitHub & Git", 88, "Proficient")
        )));

        list.add(new Skill("Methodology", "methodology", Arrays.asList(
                new Skill.SkillItem("DSA (Data Structures & Algorithms)", 85, "Proficient")
        )));

        return list;
    }

    private List<Education> initEducation() {
        List<Education> list = new ArrayList<>();

        list.add(new Education(
                "Bachelor of Technology (B.Tech)",
                "Computer Science and Engineering",
                "Kishkinda University",
                "Ballari, Karnataka",
                "CGPA: 7.83",
                "2023 – Ongoing",
                Arrays.asList(
                        "Disciplined and detail-oriented Software Engineering student.",
                        "Focus on full-stack web and mobile systems, data structures, and algorithms."
                )
        ));

        list.add(new Education(
                "Class XII (PUC)",
                "Pre-University Course",
                "CC0008, GOVT EX MUNICIPAL PU COLLAGE, BALLARI",
                "Ballari, Karnataka",
                "Score: 73.83%",
                "2021 – 2023",
                Arrays.asList(
                        "Physics, Chemistry, Mathematics background."
                )
        ));

        list.add(new Education(
                "Class X (SSLC)",
                "Secondary School Leaving Certificate",
                "MORARJI DESAI RESIDENTION SCHOOL-BC, METRIKI, SANDOOR, BALLARI",
                "Ballari, Karnataka",
                "Score: 92.64%",
                "2021",
                Arrays.asList(
                        "Graduated with Distinction (92.64%)."
                )
        ));

        return list;
    }

    public Profile getProfile() { return profile; }
    public List<Project> getProjects() { return projects; }
    public List<Skill> getSkills() { return skills; }
    public List<Education> getEducationList() { return educationList; }
}
