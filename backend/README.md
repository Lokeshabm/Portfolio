# Java SE Portfolio Backend API (B M LOKESHA)
### Featuring Real-Time Gmail SMTP Email Integration (Jakarta Mail)

A high-performance REST API server built exclusively with **Core Java SE** (`com.sun.net.httpserver.HttpServer`) and **Jakarta Mail** for real-time contact form email delivery directly to Gmail.

---

## 1. Features
- **Pure Java SE with JDK HttpServer**: No Spring Boot, Spring MVC, or heavyweight web frameworks.
- **Real-Time Gmail SMTP Integration**:
  - Connects to `smtp.gmail.com:587` with **STARTTLS** and authentication.
  - Automatically formats visitor name, email, subject, and message.
  - Sets `Reply-To` to the visitor's verified email address so you can reply directly with one click!
  - Sends direct email notifications to **`lokeshbm2003@gmail.com`**.
- **Anti-Spam & Security**:
  - Email header injection prevention (strips carriage returns & newlines).
  - Rate limiting (maximum 5 requests per 10-minute window per client IP).
  - Credentials stored strictly in environment variables or `.env` (ignored by Git).
- **Dual Persistence**:
  - Saves all received submissions to MySQL (if running) and local audit file `data/messages.json`.

---

## 2. Setting Up Real-Time Gmail SMTP Delivery

To send real emails to your Gmail account, Google requires a **16-character App Password** (not your regular Gmail login password).

### Step 1: Generate a Google App Password
1. Go to your Google Account: [https://myaccount.google.com/](https://myaccount.google.com/)
2. In the left navigation, click **Security**.
3. Under *"How you sign in to Google"*, ensure **2-Step Verification** is turned **ON**.
4. In the search bar at the top, type **"App passwords"** (or go to [https://myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)).
5. Under *"App name"*, enter **"Portfolio Contact Form"** and click **Create**.
6. Google will display a **16-character password** (e.g., `abcd efgh ijkl mnop`). Copy this password.

---

### Step 2: Configure Environment Variables

#### Option A: Using the `.env` file (Easiest)
Create a `.env` file inside `portfolio/backend/.env` (or copy `.env.example` to `.env`):

```properties
GMAIL_USERNAME=your_gmail_address@gmail.com
GMAIL_APP_PASSWORD=abcdefghijklmnop
RECEIVER_EMAIL=lokeshbm2003@gmail.com

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
```

> **Note:** The `.env` file is already added to `.gitignore` so your secrets will never be uploaded to GitHub.

#### Option B: In Windows PowerShell
```powershell
$env:GMAIL_USERNAME="your_gmail_address@gmail.com"
$env:GMAIL_APP_PASSWORD="abcdefghijklmnop"
$env:RECEIVER_EMAIL="lokeshbm2003@gmail.com"
```

#### Option C: In Windows Command Prompt (cmd)
```cmd
set GMAIL_USERNAME=your_gmail_address@gmail.com
set GMAIL_APP_PASSWORD=abcdefghijklmnop
set RECEIVER_EMAIL=lokeshbm2003@gmail.com
```

#### Option D: Permanently in Windows System Settings
1. Press `Win + R`, type `sysdm.cpl` and press Enter.
2. Go to the **Advanced** tab -> click **Environment Variables**.
3. Under **User variables**, click **New**:
   - Variable name: `GMAIL_USERNAME`, Variable value: `your_gmail_address@gmail.com`
   - Variable name: `GMAIL_APP_PASSWORD`, Variable value: `abcdefghijklmnop`
   - Variable name: `RECEIVER_EMAIL`, Variable value: `lokeshbm2003@gmail.com`

---

## 3. How to Compile & Run the Backend

All required Jakarta Mail libraries are pre-installed in `portfolio/backend/lib/`:
- `jakarta.mail-api-2.1.3.jar`
- `angus-mail-2.0.3.jar`
- `jakarta.activation-api-2.1.3.jar`
- `angus-activation-2.0.2.jar`

### Run via PowerShell:
```powershell
cd portfolio\backend
.\run-backend.ps1
```

### Run via Command Prompt:
```cmd
cd portfolio\backend
run-backend.bat
```

### Manual Compilation:
```powershell
cd portfolio\backend
javac -cp "lib/*" -d bin (Get-ChildItem -Recurse -Filter *.java src\main\java).FullName
java -cp "bin;lib/*" com.lokesha.portfolio.Main
```

Server runs on: **`http://localhost:8080`**

---

## 4. Testing Real Email Delivery

### Using curl:
```bash
curl -X POST http://localhost:8080/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Recruiter Name",
    "email": "recruiter@example.com",
    "subject": "Software Developer Role",
    "message": "Hello Lokesha, we reviewed your portfolio and would like to interview you."
  }'
```

### Expected Success Response:
```json
{
  "success": true,
  "message": "Your message has been sent successfully. I have received your email and will get back to you shortly."
}
```

Check your inbox at **`lokeshbm2003@gmail.com`** — the email will be delivered within 2-3 seconds with the full message content and reply-to set directly to the recruiter!
