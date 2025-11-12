# 🔐 Handling Secrets for Vercel Deployment - Quick Summary

## The Problem

Your `key.json` contains sensitive Firebase credentials and should never be committed to GitHub. But Vercel needs these credentials to run your app.

## ✅ The Solution

### 1. **Update .gitignore** (Already Done ✓)

```ignore
node_modules/
key.json
.env
```

### 2. **Update server.js to Read from Environment Variables** (Already Done ✓)

Your `server.js` now supports:

- Reading from `FIREBASE_CREDENTIALS` environment variable (Vercel)
- Reading from individual `FIREBASE_*` variables (Alternative)
- Falling back to `key.json` locally (Development)

### 3. **Set Environment Variables on Vercel**

**Option A: Single Variable (Recommended)**

1. Copy entire contents of your `key.json`
2. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
3. Add new variable:
   - **Name:** `FIREBASE_CREDENTIALS`
   - **Value:** Paste entire key.json content
4. Also add:
   - **Name:** `SENDGRID_KEY`
   - **Value:** Your SendGrid API key

**Option B: Individual Variables**
Instead of one large JSON, break it down:

```
FIREBASE_PROJECT_ID=fooddonation-bdb33
FIREBASE_PRIVATE_KEY_ID=7faf...
FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nMIIE...\n-----END PRIVATE KEY-----
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@...
... (and others)
```

### 4. **Local Development**

- Keep `key.json` in your root directory (it's in `.gitignore`)
- Keep `.env` file with `SENDGRID_KEY`
- Run `npm start` - it will automatically use local `key.json`

---

## 📋 Quick Checklist

- [x] `.gitignore` updated with `node_modules/`, `key.json`, `.env`
- [x] `server.js` updated to read from environment variables
- [x] `.env.example` created with placeholder values
- [ ] **NEXT: Push to GitHub**
  ```bash
  git add .
  git commit -m "Add Vercel deployment support and security improvements"
  git push origin master
  ```
- [ ] **NEXT: Go to Vercel → Import Project from GitHub**
- [ ] **NEXT: Set Environment Variables on Vercel**
  - `FIREBASE_CREDENTIALS` = your key.json contents
  - `SENDGRID_KEY` = your API key
- [ ] **NEXT: Deploy and test!**

---

## 🚀 Deployment Steps

```bash
# 1. Commit all changes (secrets won't be included)
git add .
git commit -m "Prepare for Vercel deployment"
git push origin master

# 2. Go to vercel.com and import from GitHub
# 3. Set environment variables in Vercel dashboard
# 4. Deploy automatically!
```

---

## ⚠️ Important Security Notes

✅ DO:

- Keep `key.json` and `.env` in `.gitignore`
- Use Vercel's Environment Variables dashboard
- Rotate API keys regularly
- Use different keys for dev/prod

❌ DON'T:

- Commit secrets to GitHub
- Hardcode API keys in code
- Share API keys in issues
- Use same keys everywhere

---

## 🆘 Troubleshooting

| Issue                             | Solution                                             |
| --------------------------------- | ---------------------------------------------------- |
| "Cannot find module './key.json'" | Check `FIREBASE_CREDENTIALS` is set in Vercel        |
| "Firebase credentials not found"  | Verify env variable on Vercel, then redeploy         |
| "SendGrid key not working"        | Check API key is correct in Vercel dashboard         |
| "Email not sending"               | Check SendGrid API permissions & sender verification |

---

See **VERCEL_DEPLOYMENT.md** for detailed information.
