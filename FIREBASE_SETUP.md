# Firebase Configuration Guide for CivicPulse

This guide walks you through setting up a live Firebase project for CivicPulse.

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Create a project"**
3. Name it `civicpulse` (or your preferred name)
4. Enable Google Analytics (optional)
5. Click **"Create project"** and wait for initialization

## Step 2: Register a Web App

1. In Firebase Console, click the **Web icon** (</>)
2. Register app name: `civicpulse-web`
3. Copy the config object that appears (looks like below)
4. Paste into `.env` file in your project root:

```javascript
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=yourproject.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=yourproject
VITE_FIREBASE_STORAGE_BUCKET=yourproject.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

## Step 3: Enable Authentication

1. Go to **Build → Authentication**
2. Click **"Get started"**
3. Enable these sign-in methods:
   - **Email/Password** - for admin login
   - **Google** - for citizen sign-up

### For Google Sign-In:
1. Click **Google** in the providers list
2. Enable it
3. Add your project support email
4. Click **Save**

## Step 4: Create Firestore Database

1. Go to **Build → Firestore Database**
2. Click **"Create database"**
3. Choose **Start in production mode**
4. Select region closest to your users (e.g., `asia-south1` for India)
5. Click **"Enable"**

Once created, you'll have an empty database ready for the rules below.

## Step 5: Deploy Security Rules

1. In Firestore tab, click **"Rules"** (top menu)
2. Replace all content with contents of `firestore.rules` file in this project
3. Click **"Publish"**

The rules enforce:
- **Citizens** can read all issues, create their own, upvote/comment
- **Admins** can read/update/delete any issue and manage users
- **Authentication required** for all operations

## Step 6: Enable Storage (Optional - for Image Upload)

1. Go to **Build → Cloud Storage**
2. Click **"Get started"**
3. Accept default settings
4. Click **"Done"**

## Step 7: Configure Admin Role

### Option A: Using Custom Claims (Recommended for Production)

1. Install Firebase Admin SDK:
   ```bash
   npm install firebase-admin
   ```

2. Create a script `set-admin.js`:
   ```javascript
   const admin = require('firebase-admin');
   const serviceAccount = require('./serviceAccountKey.json');

   admin.initializeApp({
     credential: admin.credential.cert(serviceAccount)
   });

   const uid = process.argv[2];
   admin.auth().setCustomUserClaims(uid, { admin: true })
     .then(() => {
       console.log(`Admin claim set for user ${uid}`);
       process.exit(0);
     })
     .catch(err => {
       console.error(err);
       process.exit(1);
     });
   ```

3. Download service account key:
   - Go to **Project Settings → Service Accounts**
   - Click **"Generate new private key"**
   - Save as `serviceAccountKey.json`

4. Run to set admin:
   ```bash
   node set-admin.js USER_UID_HERE
   ```

### Option B: Using Email Allowlist (Simpler for Development)

1. In `.env`, add your admin email:
   ```
   VITE_ADMIN_EMAILS=youremail@gmail.com,another@admin.com
   ```

2. The app checks this list in `/admin-auth` page

## Step 8: Test Locally

1. Add your Firebase credentials to `.env`
2. Start the dev server:
   ```bash
   npm run dev
   ```

3. Visit `http://localhost:3000`
4. Sign up with Google
5. File a complaint at `/report`
6. View dashboard at `/dashboard`
7. For admin: go to `/admin-auth` and use your admin email

## Step 9: Verify Data Structure

After testing, check your Firestore:

**Collection: `users`**
```
{
  uid: "user123",
  name: "Citizen Name",
  email: "citizen@gmail.com",
  photoURL: "...",
  ward: "Ward 174",
  city: "Bengaluru",
  state: "Karnataka",
  karmaPoints: 150,
  streak: 5,
  reportedCount: 3
}
```

**Collection: `issues`**
```
{
  id: "issue-123456",
  title: "Pothole on Main Street",
  description: "Dangerous crater...",
  category: "Road Infrastructure",
  severity: "Critical",
  status: "Reported",
  address: "Main St, City",
  lat: 12.9716,
  lng: 77.5946,
  reporterUid: "user123",
  reporterName: "Citizen Name",
  reporterEmail: "citizen@gmail.com",
  votes: 42,
  comments: [
    {
      author: "Other Citizen",
      text: "This needs urgent fixing!",
      date: "2026-09-06T10:00:00Z"
    }
  ],
  createdAt: "2026-09-06T09:00:00Z",
  slaTime: "T+24h Left",
  karmaPoints: 150,
  ward: "Ward 174",
  city: "Bengaluru",
  state: "Karnataka"
}
```

## Step 10: Deploy to Production

### Option A: Firebase Hosting
```bash
npm run build
firebase deploy
```

### Option B: Google Cloud Run
```bash
npm run build
npm install -g @google-cloud/functions-framework
gcloud run deploy civicpulse --source . --runtime nodejs20
```

### Option C: Custom Server
Use the Express server in `server.ts`:
```bash
npm run dev  # Runs vite dev + tsx server.ts
```

## Troubleshooting

### "Firebase configuration is incomplete"
- Make sure all `VITE_FIREBASE_*` keys are filled in `.env`
- Restart the dev server after editing `.env`

### "Permission denied" errors
- Check Firestore rules are published
- Verify user is authenticated (`localStorage` should have token)
- For admin operations, ensure `VITE_ADMIN_EMAILS` includes your email

### "Gemini API not working"
- Add `GEMINI_API_KEY` to `.env`
- Server will show warning if missing but still works
- AI features show fallback message without it

## Security Best Practices

✅ **DO:**
- Keep API keys in `.env` (never in git)
- Use service account key only on server
- Enable Firestore rules before going live
- Rotate API keys regularly
- Use HTTPS in production

❌ **DON'T:**
- Commit `.env` to git
- Expose service account key
- Deploy with `localhost` auth domain
- Use test credentials in production

---

**Need help?** Check Firebase docs: https://firebase.google.com/docs
