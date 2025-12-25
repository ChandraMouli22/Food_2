🌍 Food Donation Platform – Node.js + Firebase

A cloud-based web application that connects food donors with charitable organizations to help reduce food waste and support hunger relief.
Built using Node.js, Express.js, and Firestore, the platform enables users to donate food, track donations, receive notifications, and reset passwords securely.

🧭 Overview

This platform serves as a bridge between individuals or businesses with surplus food and nonprofit organizations that distribute food to the needy.
It provides authentication, donation management, history tracking, email notifications, and maps-based location visibility.

✨ Key Features

👤 Donor Features

Register & Login
View list of registered organizations
Donate food / groceries
Track donation history
View personal profile and stats
Receive email + in-app notifications
Reset forgotten password via email link

🏢 Organization Features

Register & Login
View incoming donation requests
Accept or Collect donations
Track donation history
View donor location (Google Maps integration
Receive email & dashboard notifications
Manage organization profile

🎨 UI / UX Improvements (v2.0)

Fully redesigned modern interface
Complete mobile responsiveness
Smooth animations and performance improvements
Improved accessibility (WCAG compliant)
Better input validation & error handling
See full redesign details → /UI_UX_IMPROVEMENTS.md

🛠️ Tech Stack
Backend
Node.js – Runtime
Express.js – Web framework
Firebase Firestore – NoSQL cloud database
password-hash – Password hashing
Express-session – Authentication/session management

Frontend
EJS (Embedded JavaScript Templates)
CSS, JavaScript
Static assets served via /public

Services
SendGrid – Email service
Firebase Admin SDK – Database access
Google Maps Embed – Location rendering



🔐 Authentication & Security
Feature	Status
Password hashing	✔ password-hash library
Session-based login	✔ Express-session
Password strength check	✔ 8+ chars, letters, number, special
Email reset link	✔ SendGrid
Firebase rules	Firestore security rules recommended
📧 Email Notifications (SendGrid)

Email alerts are automatically sent for:

New donation received → Organization
Donation accepted → Donor
Donation collected → Donor
Password reset link → User email

🚀 Installation & Setup
📥 1️⃣ Clone Repository
git clone https://github.com/ChandraMouli22/Food-Donation-Platform.git
cd Food-Donation-Platform

📦 2️⃣ Install Dependencies
npm install

🔐 3️⃣ Configure Environment Variables

Create a .env file:

SENDGRID_KEY=your_sendgrid_api_key 
FIREBASE_CREDENTIALS='{"type":"service_account","project_id":"..."}'
SESSION_SECRET=food-donation-secret
BASE_URL=http://localhost:3000


⚠️ Never commit .env or key.json to GitHub

🔑 4️⃣ Local Firebase Credential File (only for local testing)

Place key.json (service account) in the project root.

🏃 Run Application
Development Mode
npm run dev

Production Mode
npm start


App runs on → http://localhost:3000

🌐 Deployment
🚀 Deploy to Vercel (Recommended)

1️⃣ Push project to GitHub
2️⃣ Go to → https://vercel.com

3️⃣ Import repository
4️⃣ Add environment variables
5️⃣ Deploy 🎉

Required Environment Variables on Vercel
SENDGRID_KEY
FIREBASE_CREDENTIALS
BASE_URL=https://yourdeployedurl.com



🧪 Testing & Troubleshooting
Issue	Fix
Server not starting	Check .env & Firebase key
Styles not loading	Ensure /public/css is deployed
Emails not delivered	Verify SendGrid key & quota
Password reset not working	Confirm BASE_URL & SendGrid DNS
🧑‍💻 Contribution Guide
git checkout -b feature/myFeature
git commit -m "Add new feature"
git push origin feature/myFeature


Open a Pull Request → 🚀

📜 License

MIT License – open for learning, research & enhancements.

👤 Author

Chandra Mouli
GitHub: https://github.com/ChandraMouli22


📅 Last Updated: December 2025

🎯 Final Note

This project aims to promote sustainability and community support by making food-sharing simple, transparent, and digital.
