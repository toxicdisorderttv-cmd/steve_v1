# Steve Beal Tribute Site — Setup Guide

This guide walks through every external step to get the site live.
No developer experience needed — just follow each step in order.

---

## Step 1 — Create a Supabase Account (free)

Supabase is the database that stores photos and memories.

1. Go to **supabase.com** and click **Start your project**
2. Sign in with GitHub or create an email account
3. Click **New project**
4. Name it `steve-beal` (or anything you like)
5. Choose **United States** as the region
6. Set a database password (save it somewhere — you won't need it often)
7. Wait ~2 minutes for the project to spin up

---

## Step 2 — Set Up the Database

1. In your Supabase project, click **SQL Editor** in the left sidebar
2. Click **New query**
3. Open the file `supabase-setup.sql` from this project folder
4. Copy everything in that file and paste it into the SQL editor
5. Click **Run**
6. You should see "Success. No rows returned." — that means it worked

---

## Step 3 — Create the Photo Storage Bucket

1. In Supabase, click **Storage** in the left sidebar
2. Click **New bucket**
3. Name it exactly: `photos`
4. Check **Public bucket** (so photos are viewable on the site)
5. Click **Save**

---

## Step 4 — Get Your Supabase Keys

1. In Supabase, click **Project Settings** (gear icon, bottom left)
2. Click **API**
3. You'll see:
   - **Project URL** → copy this (looks like `https://xxxx.supabase.co`)
   - **anon / public key** → copy this
   - **service_role key** → copy this (click the eye icon to reveal it — keep this secret)

---

## Step 5 — Create a Vercel Account (free)

Vercel hosts the website.

1. Go to **vercel.com** and click **Sign Up**
2. Sign in with GitHub (easiest) or create an account
3. You're in — you'll deploy from here in a moment

---

## Step 6 — Push the Code to GitHub

(Vercel deploys directly from GitHub.)

1. Go to **github.com** and create a free account if you don't have one
2. Click the **+** icon → **New repository**
3. Name it `steve-beal-tribute`, set it to Private, click **Create repository**
4. Open Terminal on your Mac and run these commands one at a time:

```bash
cd ~/Desktop/steve_v1
git add .
git commit -m "Initial site"
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/steve-beal-tribute.git
git push -u origin main
```

Replace `YOUR_GITHUB_USERNAME` with your actual GitHub username.

---

## Step 7 — Deploy to Vercel

1. In Vercel, click **Add New → Project**
2. Find your `steve-beal-tribute` repo and click **Import**
3. Leave all settings as-is — Vercel detects Next.js automatically
4. **Before clicking Deploy**, click **Environment Variables** and add these one at a time:

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase Project URL from Step 4 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your anon/public key from Step 4 |
| `SUPABASE_SERVICE_ROLE_KEY` | Your service_role key from Step 4 |
| `ADMIN_PASSWORD` | `codex` |
| `NEXT_PUBLIC_SITE_URL` | Leave blank for now — fill in after first deploy |

5. Click **Deploy**
6. Wait ~2 minutes — Vercel will give you a URL like `steve-beal-tribute.vercel.app`
7. Go back to Environment Variables in Vercel and set `NEXT_PUBLIC_SITE_URL` to that URL
8. Redeploy once more (Deployments → ... → Redeploy)

---

## Step 8 — Test the Site

Visit your Vercel URL and check:

- [ ] Home page loads with Steve's name and bio
- [ ] "Stories & Photographs" shows the placeholder memory
- [ ] "Add a Memory" form works — try submitting something
- [ ] Go to `/admin` — log in with password `codex` — you should see the pending submission
- [ ] Approve it and verify it appears on the Stories page

---

## Step 9 — Add a Hero Photo (when ready)

When you have a good photo of Steve:

1. Name the file `hero.jpg` and place it in the `public/images/` folder in this project
2. Open `app/page.tsx` and replace the placeholder `<div>` block with:

```tsx
<Image
  src="/images/hero.jpg"
  alt="Steve Beal"
  fill
  style={{ objectFit: 'cover', objectPosition: 'top' }}
  priority
/>
```

3. Commit and push — Vercel redeploys automatically

---

## Step 10 — Connect a Custom Domain (optional, when ready)

1. Buy a domain from Namecheap, Google Domains, or GoDaddy (e.g. `stevebeal.com`)
2. In Vercel, go to your project → **Settings → Domains**
3. Type in your domain and click **Add**
4. Vercel will show you DNS records — go to your domain registrar and add them
5. Wait up to 24 hours for DNS to propagate — then your site is live at your custom domain

---

## Admin Page

The admin page is at `/admin` — it is not linked anywhere in the navigation.
To access it, go to: `https://your-site.vercel.app/admin`
Password: `codex`

From there you can Approve or Reject any submitted memory.
Approved memories appear immediately on the Stories & Photographs page.

---

## Questions?

Bring any issues back to Claude Code and share the error message — we can debug together.
