SYSTEM_CORE_V3.0
A high-performance, real-time system monitoring dashboard built to provide live insights into server health, event logging, and system activity.

🚀 Overview
SYSTEM_CORE_V3.0 is a full-stack web application designed for real-time monitoring. It enables administrators to track system logs, verify server health, and trigger manual system health checks. The platform is fully secured with token-based authentication and persistent cloud-based data storage.

🛠️ Tech Stack
Frontend: React (Context API, Hooks, responsive CSS)

Backend: Node.js, Express

Database: MongoDB (Atlas)

Real-time: Server-Sent Events (SSE)

Security: JWT (JSON Web Tokens), bcryptjs

Deployment: Render

🔑 Key Features
Real-Time Monitoring: Live updates for heartbeat and system events.

Secured Authentication: JWT-based login and registration to ensure only authorized users access the logs.

Persistent Logging: All system events are stored securely in MongoDB.

Manual Health Checks: PING functionality to trigger and record manual system diagnostics.

Theme Customization: Seamless toggling between Dark and Light modes.

📋 Installation & Setup
Clone the repository:

Bash
git clone https://github.com/Shubhm8971/my-fullstack-app.git
Install dependencies:

Bash
npm install
Set up Environment Variables:
Create a .env file in the root directory and add:

Plaintext
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_random_key
PORT=3001
Run the Application:

Bash
npm run dev
🔐 Security
The application implements password hashing using bcryptjs and route protection via JWT. All sensitive API endpoints require a Bearer token in the Authorization header to prevent unauthorized access.

📈 Deployment
Deployed on Render with automated CI/CD pipelines ensuring seamless production updates.
