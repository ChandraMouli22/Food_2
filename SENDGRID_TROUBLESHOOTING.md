# 🔧 SendGrid Email Issues - Troubleshooting Guide

## Error: `ERR_INVALID_CHAR` in Authorization Header

### What This Error Means

```
Error in /donat_grocery_submit: TypeError [ERR_INVALID_CHAR]:
Invalid character in header content ["Authorization"]
```

This error occurs when the SendGrid API key contains **invalid characters** or **whitespace/newlines** that make it incompatible with HTTP headers.

---

## 🔍 Root Causes

### 1. **Whitespace or Newlines in SENDGRID_KEY**

The most common cause is extra whitespace or newlines in your API key.

**Example of BAD .env:**

```env
SENDGRID_KEY=SG.xyz123...

```

Notice the extra newline at the end!

**Example of GOOD .env:**

```env
SENDGRID_KEY=SG.xyz123...
```

### 2. **Invalid API Key Format**

SendGrid keys should always start with `SG.`

**Invalid:**

```
SENDGRID_KEY=xyz123...  ← Missing SG. prefix
```

**Valid:**

```
SENDGRID_KEY=SG.YOUR_API_KEY_HERE
```

### 3. **Special Characters in .env**

If copying from a source with special formatting, characters might get corrupted.

---

## ✅ Fixes

### Fix #1: Clean Your .env File

**Step 1:** Open `.env` file

```bash
nano /home/matrix/Downloads/Food-Donation-master/.env
```

**Step 2:** Check the SENDGRID_KEY line

- Remove any leading/trailing whitespace
- Remove any extra newlines
- Ensure it starts with `SG.`

**Step 3:** File should look like:

```env
SENDGRID_KEY=SG.YOUR_API_KEY_HERE
```

**Step 4:** Save and exit (Ctrl+X, then Y, then Enter)

### Fix #2: Verify Your API Key

**Go to SendGrid Dashboard:**

1. Visit [app.sendgrid.com](https://app.sendgrid.com)
2. Click **Settings → API Keys**
3. Find your API key
4. **Copy the full key** including the `SG.` prefix

**Example of what to copy:**

```
SG.YOUR_API_KEY_HERE
```

### Fix #3: Update .env File Properly

**Option A: Using nano**

```bash
nano ~/.env  # or your project's .env file
```

Clear the SENDGRID_KEY line and paste the key carefully.

**Option B: Using echo (one-liner)**

```bash
echo "SENDGRID_KEY=SG.YOUR_API_KEY_HERE" > .env.tmp && mv .env.tmp .env
```

---

## 🔐 For Vercel Deployment

When setting environment variables on Vercel, **do NOT include quotes**:

**Vercel Dashboard → Settings → Environment Variables:**

| Name         | Value                     |
| ------------ | ------------------------- |
| SENDGRID_KEY | SG.YOUR_API_KEY_HERE      |

❌ **WRONG:**

```
SENDGRID_KEY="SG.xyz..."  ← Quotes will cause error!
```

✅ **CORRECT:**

```
SENDGRID_KEY=SG.xyz...
```

---

## 🧪 Testing Your Fix

### Local Testing

1. Restart your server:

   ```bash
   npm start
   ```

2. Try making a donation

3. Check the logs for:

   ```
   ✅ SendGrid API key loaded successfully
   ```

   Or if there's still an issue:

   ```
   ⚠️  SENDGRID_KEY does not appear to be valid
   ```

### Vercel Testing

1. Add environment variable to Vercel
2. Redeploy: **Deployments → click latest → Redeploy**
3. Check logs: **Deployments → click latest → Logs**

---

## ℹ️ Important Notes (After Our Fix)

### What We Changed

Your `server.js` now has **improved error handling**:

✅ **Sanitizes the API key** (removes whitespace/newlines)
✅ **Validates the key format** (checks for `SG.` prefix)
✅ **Non-blocking errors** (email failure won't crash the app)
✅ **Better logging** (shows which step failed)

### Email is Now Optional

If email fails:

- ❌ Email won't be sent
- ✅ Donation will still be recorded
- ✅ Notification will still appear in-app
- ✅ User won't see an error

This makes the app more resilient!

---

## 📋 Checklist

- [ ] Check `.env` file for extra whitespace
- [ ] Verify SendGrid API key starts with `SG.`
- [ ] Test locally with `npm start`
- [ ] Make a test donation
- [ ] Check logs for `✅ Email sent` or warnings
- [ ] If on Vercel, set env vars without quotes
- [ ] Redeploy on Vercel if needed
- [ ] Test donation on Vercel

---

## 🆘 Still Having Issues?

### Check These:

1. **Is SendGrid key valid?**

   ```bash
   # You should see it logged (without the full key for security)
   npm start | grep "SendGrid"
   ```

2. **Is there extra whitespace?**

   ```bash
   # Check file size - should be ~90 bytes
   wc -c .env
   ```

3. **Is the key from the right SendGrid account?**

   - Log in to SendGrid
   - Verify you're in the correct workspace
   - Get API key from that account

4. **Are you using the key on multiple accounts?**
   - One API key per SendGrid account
   - Don't share keys between projects

---

## 🔑 How to Generate a New API Key

If your current key is compromised or not working:

1. Go to **SendGrid Dashboard**
2. **Settings → API Keys**
3. Click **Create API Key**
4. Give it a name (e.g., "Food Donation App")
5. Set permissions: **Mail Send**
6. Copy the key immediately (it won't show again!)
7. Update `.env` and Vercel with the new key
8. Delete the old key from SendGrid

---

## 💡 Pro Tips

✅ **Use a `.env.local`** for local development (also add to `.gitignore`)
✅ **Rotate API keys** quarterly for security
✅ **Use different keys** for dev/prod
✅ **Monitor SendGrid logs** for failed sends
✅ **Add SendGrid webhook** for delivery confirmations

---

**Need more help?** Check the SendGrid documentation or contact their support at support@sendgrid.com
