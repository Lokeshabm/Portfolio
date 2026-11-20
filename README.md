# B M LOKESHA - Personal Portfolio Website
### Modern Full-Stack Portfolio built with React.js & Pure Java SE

A personal developer portfolio application created for **B M LOKESHA** (Aspiring Software Developer, B.Tech CSE, Kishkinda University, Ballari).

- **Frontend:** React.js (Vite, React Router v6, Lucide Icons, Pure CSS3 with Glassmorphism & Theme Toggle)
- **Backend:** Pure Java SE REST API using `com.sun.net.httpserver.HttpServer` (Strictly **Zero** Spring Framework dependencies)
- **Database:** MySQL RDBMS integration via JDBC (with automatic fallback to JSON file/memory storage)
- **API Communication:** Fetch API with Full Cross-Origin Resource Sharing (CORS) support

---

## 1. Project Directory Structure

```
portfolio/
├── .vscode/
│   └── tasks.json                     # VS Code one-click tasks for running both servers
│
├── backend/
│   ├── src/
│   │   └── main/
│   │       └── java/
│   │           └── com/
│   │               └── lokesha/
│   │                   └── portfolio/
│   │                       ├── Main.java                        # Backend entry point
│   │                       ├── server/
│   │                       │   ├── PortfolioHttpServer.java    # JDK HttpServer setup (port 8080)
│   │                       │   └── CorsHandler.java            # CORS & OPTIONS preflight handler
│   │                       ├── controller/
│   │                       │   ├── ProfileController.java      # GET /api/profile
│   │                       │   ├── ProjectController.java      # GET /api/projects
│   │                       │   ├── SkillController.java        # GET /api/skills
│   │                       │   ├── EducationController.java    # GET /api/education
│   │                       │   └── ContactController.java      # POST & GET /api/contact
│   │                       ├── model/
│   │                       │   ├── Profile.java
│   │                       │   ├── Project.java
│   │                       │   ├── Skill.java
│   │                       │   ├── Education.java
│   │                       │   ├── ContactMessage.java
│   │                       │   └── ApiResponse.java
│   │                       ├── service/
│   │                       │   ├── PortfolioService.java       # Profile, project, and skill data
│   │                       │   └── ContactService.java         # Form validation & submission logic
│   │                       ├── database/
│   │                       │   ├── DatabaseConnection.java     # JDBC connection manager
│   │                       │   └── ContactDao.java             # MySQL / JSON file persistence
│   │                       └── util/
│   │                           ├── JsonUtil.java               # Pure Java SE JSON serializer & parser
│   │                           └── HttpUtils.java              # Request & Response helpers
│   ├── data/
│   │   └── messages.json              # Local fallback message persistence
│   ├── schema.sql                     # MySQL database & table creation script
│   ├── run-backend.bat                # Windows Batch launcher
│   ├── run-backend.ps1                # PowerShell launcher
│   └── README.md                      # Backend documentation
│
└── frontend/
    ├── public/
    │   ├── resume.pdf                 # Downloadable resume document
    │   └── favicon.svg                # Modern monogram favicon
    ├── src/
    │   ├── assets/
    │   │   └── avatar.svg             # Stylized developer avatar
    │   ├── components/
    │   │   ├── Navbar.jsx             # Responsive glassmorphism header & mobile drawer
    │   │   ├── Footer.jsx             # Social links, credentials & credits
    │   │   ├── ThemeToggle.jsx        # Dark/Light mode switch (persisted in localStorage)
    │   │   ├── ProjectCard.jsx        # Glassmorphic project showcase card
    │   │   ├── SkillCard.jsx          # Category card with animated progress bars
    │   │   ├── SectionTitle.jsx       # Standardized section headings
    │   │   └── Notification.jsx       # Interactive toast alert for form feedback
    │   ├── pages/
    │   │   ├── Home.jsx               # Hero, highlights, stats, and CTAs
    │   │   ├── About.jsx              # Bio, career objective, education, languages
    │   │   ├── Skills.jsx             # Filterable skills with progress bars
    │   │   ├── Projects.jsx           # Searchable portfolio projects (Farmer Market, AI Interview, etc.)
    │   │   ├── Education.jsx          # Academic timeline (Kishkinda University, CGPA 8.04)
    │   │   ├── Resume.jsx             # Interactive digital resume & PDF download
    │   │   └── Contact.jsx            # Validated contact form connected to Java API
    │   ├── services/
    │   │   └── api.js                 # Centralized Fetch API client with offline fallback
    │   ├── styles/
    │   │   ├── variables.css          # Design tokens, gradients, theme colors
    │   │   ├── index.css              # Reset, typography, background glow, scrollbars
    │   │   ├── components.css         # Cards, buttons, navbar, forms, progress meters
    │   │   └── responsive.css         # Tablet and mobile breakpoints
    │   ├── App.jsx                    # React router setup and scroll restoration
    │   └── main.jsx                   # React DOM render entry point
    ├── index.html                     # HTML5 template with Google Fonts
    ├── package.json                   # Dependencies: React 18, React Router, Lucide Icons
    └── vite.config.js                 # Vite bundler configuration & API proxy
```

---

## 2. Software Prerequisites

Make sure the following tools are installed on your machine:
1. **Java Development Kit (JDK 17 or higher)**:
   - Verify by opening terminal: `javac -version` and `java -version`
2. **Node.js (v18.0.0 or higher)**:
   - Verify: `node -v` and `npm -v`
3. **Visual Studio Code**:
   - Recommended extensions:
     - *Extension Pack for Java* (Microsoft)
     - *ES7+ React/Redux/React-Native snippets*
     - *Prettier - Code formatter*
4. **MySQL Database (Optional)**:
   - If running, execute `backend/schema.sql`. If MySQL is not running, the backend automatically uses `backend/data/messages.json`.

---

## 3. How to Run Frontend and Backend

### Option A: Running Inside VS Code (Recommended)

1. Open the `portfolio` folder in VS Code:
   ```powershell
   code portfolio
   ```
2. Press **Ctrl + `** (or **Terminal > New Terminal**).
3. Split the terminal into two panels (click the split terminal icon `|\|`).
4. In **Terminal 1 (Backend)**:
   ```powershell
   cd backend
   .\run-backend.ps1
   ```
5. In **Terminal 2 (Frontend)**:
   ```powershell
   cd frontend
   npm run dev
   ```
6. Open your browser and navigate to:
   - **Frontend Application:** `http://localhost:5173`
   - **Backend API Server:** `http://localhost:8080/api/profile`

---

### Option B: Running via Pre-configured Scripts

#### 1. Start the Java Backend
Open Command Prompt or PowerShell:
```powershell
cd portfolio\backend
.\run-backend.ps1
```
*(Or on standard Command Prompt: `run-backend.bat`)*

You will see:
```text
==========================================================
  B M LOKESHA Portfolio Backend - Java SE HttpServer
==========================================================
  [OK] Server running on:  http://localhost:8080
  [OK] API Profile:        http://localhost:8080/api/profile
  [OK] API Projects:       http://localhost:8080/api/projects
  [OK] API Skills:         http://localhost:8080/api/skills
  [OK] API Education:      http://localhost:8080/api/education
  [OK] API Contact:        http://localhost:8080/api/contact [POST]
  [OK] CORS Enabled:       * (All origins allowed)
==========================================================
```

#### 2. Start the React Frontend
Open another terminal:
```powershell
cd portfolio\frontend
npm install
npm run dev
```

---

## 4. REST API Endpoints (Pure Java SE)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/profile` | Developer details (Name, Bio, Education, CGPA, Languages, Links) |
| `GET` | `/api/projects` | Project catalog with tech stack, descriptions, GitHub & live URLs |
| `GET` | `/api/skills` | Skill categories (Programming, Frontend, Backend, DB, Tools) & levels |
| `GET` | `/api/education` | Academic background at Kishkinda University (CGPA 8.04) and PUC |
| `POST` | `/api/contact` | Submits contact messages with validation & storage |
| `OPTIONS` | `/api/*` | Automatic CORS preflight response (HTTP 204) |

### Sample Contact POST Request (using curl or Postman)
```bash
curl -X POST http://localhost:8080/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Recruiter Name",
    "email": "recruiter@company.com",
    "subject": "Interview Invitation",
    "message": "Hi Lokesha, we were impressed by your portfolio and would like to invite you for an interview."
  }'
```

---

## 5. Connecting React with Java APIs

The frontend connects to the backend through `frontend/src/services/api.js` using the native browser **Fetch API**:

```javascript
// Example: Submitting contact message to Java SE backend
const response = await fetch('http://localhost:8080/api/contact', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  mode: 'cors',
  body: JSON.stringify(formData)
});
const data = await response.json();
```

---

## 6. Testing & Verification Checklist

- [x] **Pure Java SE Compliance**: Zero Spring Boot / Spring MVC dependencies used. Pure `com.sun.net.httpserver.HttpServer`.
- [x] **Java Compilation**: Compiles with standard `javac` without errors.
- [x] **React Production Build**: `npm run build` succeeds cleanly with Vite.
- [x] **CORS Pre-flight**: Responds with `Access-Control-Allow-Origin: *` and 204 to preflight `OPTIONS` requests.
- [x] **Data Persistence**: Contact messages save to MySQL if running, or gracefully persist to `backend/data/messages.json`.
- [x] **Personal Details**: B M LOKESHA, Kishkinda University, CGPA 8.04, Kannada & English.
- [x] **All 3 Specified Projects**:
  1. Direct Marketing for Farmer (Python, Django, MySQL, HTML, CSS)
  2. Expense Tracker Mobile App (Flutter, Dart, Firebase, SQLite - **Live Demo**: [https://anti-blush.vercel.app/](https://anti-blush.vercel.app/))
  3. AI Interview Preparation System (Python, Django, SQLite, HTML, CSS, JavaScript - **GitHub**: [https://github.com/Lokeshabm/Ai_Interview_preperation_System.git](https://github.com/Lokeshabm/Ai_Interview_preperation_System.git) - **Live Demo**: [https://ai-interview-preparation-system-pi.vercel.app/login/](https://ai-interview-preparation-system-pi.vercel.app/login/))
- [x] **Theme Switcher**: Smooth toggling between Dark Navy and Modern Light themes with preference saved in `localStorage`.
- [x] **Downloadable Resume**: Direct one-click download for `B_M_LOKESHA_Resume.pdf`.
- [x] **Mobile Responsiveness**: Clean hamburger drawer navigation on mobile and tablet viewports.
