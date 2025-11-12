# Food Donation Platform - Node.js

A modern, mobile-responsive web application built with Node.js that connects food donors with charitable organizations to reduce food waste and hunger.

## ✨ New Features (v2.0)

- 🎨 **Complete UI/UX Redesign** - Modern, professional interface
- 📱 **Fully Mobile Responsive** - Works perfectly on all devices
- 🚀 **Improved Performance** - Faster loading and smoother animations
- ♿ **Better Accessibility** - WCAG compliant design
- 🎯 **Enhanced User Experience** - Intuitive navigation and interactions

👉 See [UI_UX_IMPROVEMENTS.md](UI_UX_IMPROVEMENTS.md) for detailed information about the redesign.

## 🚀 Tech Stack

**Backend:**

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **Firebase Firestore** - NoSQL database
- **Socket.io** - Real-time communications

**Frontend:**

- **EJS** - Template engine
- **CSS/JavaScript** - Client-side functionality

**Services:**

- **SendGrid** - Email notifications
- **Firebase Admin SDK** - Database & Authentication

## 📋 Prerequisites

- Node.js v14+ installed
- npm (comes with Node.js)
- Firebase project with Firestore database
- SendGrid API key

## 🔧 Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/ChandraMouli22/Food-Donation-Platform.git
   cd Food-Donation-Platform
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the root directory:

   ```
   SENDGRID_KEY=your_sendgrid_api_key_here
   ```

4. **Add Firebase credentials:**
   Place your `key.json` (Firebase service account) in the root directory

## 🏃 Running the Application

### Development Mode (with auto-reload)

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

The application will start on `http://localhost:3000`

## 📁 Project Structure

```
Food-Donation-Platform/
├── server.js              # Main Express server
├── views/                 # EJS templates
│   ├── intro.ejs         # Landing page
│   ├── don_login.ejs     # Donor login
│   ├── don_register.ejs  # Donor registration
│   ├── don_home.ejs      # Donor dashboard
│   ├── don_profile.ejs   # Donor profile
│   ├── don_history.ejs   # Donation history
│   ├── org_login.ejs     # Organization login
│   ├── org_register.ejs  # Organization registration
│   ├── org_home.ejs      # Organization dashboard
│   ├── org_profile.ejs   # Organization profile
│   ├── org_history.ejs   # Donation history
│   ├── food_donate_form.ejs      # Food donation form
│   ├── grocery_donate_form.ejs   # Grocery donation form
│   ├── notifications.ejs         # Donor notifications
│   └── org_notifications.ejs     # Organization notifications
├── package.json           # Dependencies & scripts
├── key.json              # Firebase credentials
├── .env                  # Environment variables
└── public/               # Static files (CSS, JS, images)
```

## 🔐 Features

### For Donors:

- ✅ Register and login
- ✅ View organization listings
- ✅ Donate food or groceries
- ✅ Track donation history
- ✅ View profile and statistics
- ✅ Receive notifications
- ✅ Real-time updates via Socket.io

### For Organizations:

- ✅ Register and login
- ✅ View incoming donations
- ✅ Accept donations
- ✅ Mark donations as collected
- ✅ Track donation history
- ✅ View donor locations (map integration)
- ✅ Receive email notifications
- ✅ Manage organization profile

## 📊 Database Schema (Firestore)

### Collections:

- **Donors** - Donor profile information

  - Donation_History (subcollection)
  - Notifications (subcollection)

- **Organizations** - Organization profile information
  - Donation_History (subcollection)
  - Notifications (subcollection)

## 🔗 API Endpoints

### Authentication

- `GET /` - Home page
- `GET /signup` - Sign up selection
- `GET /donlogin` - Donor login
- `GET /orglogin` - Organization login
- `GET /donRegister` - Donor registration
- `GET /orgRegister` - Organization registration
- `POST /don_register_submit` - Submit donor registration
- `POST /org_register_submit` - Submit organization registration
- `POST /don_login_submit` - Submit donor login
- `POST /org_login_submit` - Submit organization login
- `GET /logout` - Logout

### Donor Routes

- `GET /don_home` - Donor dashboard
- `GET /don_profile` - Donor profile
- `GET /don_history` - Donor donation history
- `GET /donat_food` - Donation form (food)
- `POST /donat_food_submit` - Submit food donation
- `GET /donat_grocy` - Donation form (grocery)
- `POST /donat_grocery_submit` - Submit grocery donation
- `GET /notifications` - View notifications
- `POST /notifications/read/:id` - Mark notification as read

### Organization Routes

- `GET /org_home` - Organization dashboard
- `GET /org_profile` - Organization profile
- `GET /org_history` - Organization donation history
- `POST /donation_accept` - Accept a donation
- `POST /donation_collect` - Mark donation as collected
- `GET /org_notifications` - View notifications
- `POST /org_notifications/read/:id` - Mark notification as read

## 🔒 Security Features

- ✅ Password hashing with bcrypt
- ✅ Session management
- ✅ Email validation
- ✅ Password strength requirements (8+ chars, letters, numbers, special chars)
- ✅ Firebase authentication

## 📧 Email Notifications

The app sends email notifications for:

- New donation received (to organizations)
- Donation accepted (to donors)
- Donation collected (to donors)

Uses SendGrid for reliable email delivery.

## 🚀 Deployment

### Vercel (Recommended for Node.js) ⭐

1. Push your code to GitHub (with `.gitignore` properly configured)
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click **Add New → Project**
4. Select your GitHub repository
5. Set **Environment Variables:**
   - `FIREBASE_CREDENTIALS` = Your entire `key.json` content as a JSON string
   - `SENDGRID_KEY` = Your SendGrid API key
6. Click **Deploy**

**See [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) for detailed instructions on handling secrets**

### Heroku

1. Create `Procfile`:

   ```
   web: npm start
   ```

2. Set environment variables on Heroku:

   ```bash
   heroku config:set SENDGRID_KEY=your_key
   heroku config:set FIREBASE_CREDENTIALS='{"type":"service_account",...}'
   ```

3. Deploy:
   ```bash
   git push heroku master
   ```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## 📝 Environment Variables

```env
# SendGrid API Key for email notifications
SENDGRID_KEY=SG.xxxxxxxxxxxxxxxxxxxx
```

## 🐛 Troubleshooting

**Server won't start:**

- Check if port 3000 is available
- Verify Firebase credentials in `key.json`
- Check `.env` file has SENDGRID_KEY

**Database connection issues:**

- Verify Firebase project credentials
- Check network connectivity
- Ensure Firestore database is enabled

**Email not sending:**

- Verify SendGrid API key is correct
- Check SendGrid account quota
- Review email logs in SendGrid dashboard

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💼 Author

**ChandraMouli22** - [GitHub](https://github.com/ChandraMouli22)

## 🙏 Acknowledgments

- Express.js for the web framework
- Firebase for the database
- SendGrid for email services
- Socket.io for real-time communication

---

**Last Updated:** November 12, 2025

For issues or questions, please open a GitHub issue.
