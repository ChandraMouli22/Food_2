# 🚀 Deploying to Vercel - Complete Guide

## Problem: Handling Sensitive Information (key.json & Firebase Credentials)

Your `key.json` contains Firebase credentials that should **never be committed** to version control. Here's how to properly deploy to Vercel.

---

## ✅ Step 1: Update Your server.js for Vercel

Modify `server.js` to read Firebase credentials from environment variables instead of from `key.json`:

```javascript
// OLD WAY (Don't use this on Vercel):
// var serviceAccount = require("./key.json");

// NEW WAY (Use this for Vercel):
require("dotenv").config();

let serviceAccount;

if (process.env.FIREBASE_CREDENTIALS) {
  // For Vercel: Use single environment variable with entire JSON
  serviceAccount = JSON.parse(process.env.FIREBASE_CREDENTIALS);
} else if (process.env.FIREBASE_PROJECT_ID) {
  // For local development: Use individual env variables
  serviceAccount = {
    type: "service_account",
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: process.env.FIREBASE_CERT_URL,
  };
} else {
  // Fallback for local development with key.json file
  try {
    serviceAccount = require("./key.json");
  } catch (err) {
    console.error("Firebase credentials not found!");
    process.exit(1);
  }
}

const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();
```

---

## 📋 Step 2: Set Environment Variables on Vercel

### **BEST METHOD: Use a Single Environment Variable** (Recommended ⭐)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings → Environment Variables**
4. Add a new variable named `FIREBASE_CREDENTIALS`

**To get the value:**

- Open your `key.json` file
- Copy ALL the content (the entire JSON object)
- Paste it directly as the value in Vercel

**Example:**

```
Name: FIREBASE_CREDENTIALS
Value: {"type":"service_account","project_id":"fooddonation-bdb33",...}
```

5. Also add `SENDGRID_KEY`:

```
Name: SENDGRID_KEY
Value: SG.your_actual_api_key_here
```

6. Click **Save** and redeploy your project

### **ALTERNATIVE METHOD: Individual Variables** (More verbose)

If you prefer, break down key.json into individual variables:

```
FIREBASE_PROJECT_ID=fooddonation-bdb33
FIREBASE_PRIVATE_KEY_ID=7faf4867fc0ac5e0ecbf541a6b5c00e33a249d30
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEv...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@fooddonation-bdb33.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=105837430876749686980
FIREBASE_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40fooddonation-bdb33.iam.gserviceaccount.com
SENDGRID_KEY=SG.your_api_key_here
```

---

## 📝 Step 3: .gitignore Configuration

Your `.gitignore` should include:

```ignore
# Environment variables
.env
.env.local
.env.*.local

# Sensitive files
key.json
*.key
*.pem

# Dependencies
node_modules/
package-lock.json
npm-debug.log*

# IDE
.vscode/
.idea/
.DS_Store
```

✅ This is already done in your project!

---

## 🔄 Step 4: Local Development Setup

For local development, keep using your `key.json`:

1. **Local `.env` file** (for SendGrid):

```env
SENDGRID_KEY=SG.your_key_here
```

2. **Keep `key.json`** in your root directory (it's already in `.gitignore`, so it won't be committed)

3. Your `server.js` will automatically use `key.json` locally if `FIREBASE_CREDENTIALS` env variable is not set

---

## ✨ Step 5: Create a vercel.json Configuration (Optional but Recommended)

Create a `vercel.json` file in your root directory:

```json
{
  "buildCommand": "npm install",
  "devCommand": "npm run dev",
  "env": {
    "NODE_ENV": "production"
  },
  "functions": {
    "server.js": {
      "runtime": "nodejs18.x",
      "memory": 1024
    }
  }
}
```

---

## 🚀 Step 6: Deploy to Vercel

### **Method 1: GitHub Integration (Recommended)**

1. Push your code to GitHub (with `.gitignore` properly set)
2. Go to [Vercel](https://vercel.com)
3. Click **Add New → Project**
4. Select your GitHub repository
5. Vercel will automatically detect it's a Node.js project
6. Add your environment variables (see Step 2)
7. Click **Deploy**

### **Method 2: Vercel CLI**

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# For production
vercel --prod
```

---

## 🔒 Security Best Practices

✅ **DO:**

- ✅ Add sensitive files to `.gitignore`
- ✅ Use Vercel's Environment Variables dashboard
- ✅ Never commit `.env`, `key.json`, or secrets
- ✅ Use unique keys for production
- ✅ Rotate API keys regularly

❌ **DON'T:**

- ❌ Commit `.env` or `key.json` to GitHub
- ❌ Share API keys in issues or pull requests
- ❌ Use the same keys for development and production
- ❌ Log sensitive information

---

## 🔍 Troubleshooting

### "Cannot find module './key.json'"

**Solution:** Make sure environment variables are set on Vercel. Check the updated `server.js` code above.

### "Firebase credentials not found"

**Solution:**

1. Verify `FIREBASE_CREDENTIALS` is set in Vercel Environment Variables
2. Restart the deployment: Go to Deployments → click on latest → **Redeploy**

### "SendGrid key not working"

**Solution:**

1. Check `SENDGRID_KEY` is correctly set in Vercel
2. Verify it's a valid API key from SendGrid dashboard

### "Email not sending on Vercel"

**Solution:**

1. Check SendGrid API key permissions
2. Verify sender email is verified in SendGrid
3. Check Vercel function logs: **Deployments → Functions**

---

## 📚 Useful Links

- [Vercel Environment Variables Docs](https://vercel.com/docs/concepts/projects/environment-variables)
- [Firebase Admin SDK Docs](https://firebase.google.com/docs/database/admin/start)
- [SendGrid API Docs](https://sendgrid.com/docs/)
- [Node.js on Vercel](https://vercel.com/docs/functions/nodejs)

---

## 🎯 Quick Checklist Before Deploying

- [ ] `.gitignore` includes `node_modules/`, `key.json`, `.env`
- [ ] `server.js` reads from environment variables
- [ ] `.env.example` file created with placeholder values
- [ ] GitHub repository created and code pushed
- [ ] Vercel environment variables set (`FIREBASE_CREDENTIALS` & `SENDGRID_KEY`)
- [ ] Tested locally: `npm start` works
- [ ] Deployed to Vercel and tested live

---

**Questions?** Check your Vercel project logs or Firebase console for debugging information.
