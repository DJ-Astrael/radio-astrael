# Radio Astraël

A new, independent radio site and secure Supabase-backed Studio for `DJ-Astrael/radio-astrael`.

## What is included

- `index.html`, `styles.css`, `app.js`: public radio and playlist.
- `admin.html`, `admin.css`, `admin.js`: private Studio at `/admin.html`.
- `supabase/schema.sql`: database tables, row-level security (RLS), and Storage bucket policies.
- `config.js`: **public** browser connection placeholders (not filled yet).

The Studio lets approved administrators add mixes individually by **Mixcloud URL** or by uploading an **MP3** that they have rights to distribute, plus a cover image or HTTPS cover URL. They can set playback order, publish/unpublish, or delete tracks. Public visitors only receive published entries from the database. The design and text are in English.

**Important distinction:** Mixcloud streams play through the official embedded widget. MP3s stream through the browser audio player using public Supabase Storage URLs. Browser autoplay with sound is not guaranteed. The public website tries continuous playback on track-end events, but it is an on-demand listening site, **not a synchronized 24/7 broadcast server**. Access to uploaded file URLs is public even for draft tracks; do not upload private material.

## A. Set up your own Supabase project

1. Sign in at https://supabase.com/dashboard and create a **NEW** project named `Radio Astraël`. You may choose a European region. **Do not reuse Artemius Radio's project or credentials**.
2. In **SQL Editor**, open `supabase/schema.sql` from this repository, paste its contents, and **Run** once. This creates `public.radio_admins`, `public.radio_tracks`, the `astrael-audio` and `astrael-covers` buckets, and admin-only write policies. The SQL is intended for an empty new radio project. Review the script before running; do not rerun against existing tables.
3. In **Authentication → Users**, create the admin user with your own email/password. If Supabase sends an invitation, complete it. Never share the password in chat.
4. Copy the admin user's **UUID** from Authentication → Users. In Supabase **SQL Editor**, run:
   ```sql
   insert into public.radio_admins (user_id)
   values ('PASTE-THE-ADMIN-USER-UUID-HERE');
   ```
   Replace the placeholder with the exact UUID. This grants Studio rights to that Supabase account only.

## B. Connect the website

1. In the NEW project's **Project Settings → API Keys / Data API**, copy its **Project URL** (example: `https://example.supabase.co`) and **publishable / anon public key**.
2. Edit `config.js` in this repository, filling ONLY `supabaseUrl` and `publishableKey`. These client keys are deliberately public and safe for browser use *with RLS in place*. Never use a `service_role` key, secret key, or database password in the repository.
3. In **Authentication → URL Configuration**, set Site URL to `https://dj-astrael.github.io/radio-astrael/`, and add `https://dj-astrael.github.io/radio-astrael/**` to Redirect URLs if using email invitations or password recovery.
4. Deploy as described below, then visit `https://dj-astrael.github.io/radio-astrael/admin.html` to sign in.

## C. Publish with GitHub Pages

From the repository's **Settings → Pages**, set **Source: Deploy from a branch**, **Branch: main**, **Folder: /(root)**, then save. The expected public website URL is:

https://dj-astrael.github.io/radio-astrael/

The site may take a few minutes to appear after enabling Pages. Do not assume it is live before GitHub reports a successful Pages deployment.

## D. Add your first mix

In the Studio, enter the title and artist, choose `Mixcloud Link`, paste the full Mixcloud upload URL (not just your profile URL), optionally provide its HTTPS cover image URL or upload a cover, set Playback Order to `1`, and check **Publish immediately**. Press **Add Mix**.

To use an MP3 instead, select `Upload MP3` and choose a valid MP3 up to **50 MB**, with optional JPG/PNG/WebP cover up to **8 MB**. Large DJ sets will often exceed these per-file limits, and Supabase's plan and project upload restrictions also apply. **For full-length Mixcloud sets, use the Mixcloud option.**

For **The Last Transmission** as the first mix, add it with order `1`, and give subsequent mixes order `2`, `3`, etc. Play order is ascending numeric.

## Security and platform limitations

- Public database visitors can query only rows where `is_published=true`; all inserts, updates and deletions require a session authorized via `radio_admins` and RLS.
- Public Storage buckets allow visitors to access uploaded audio and covers through their URLs, including uploaded files whose track metadata is still a draft. This is intentional for the simple public-player architecture.
- Only authorize distribution of sound recordings you control or for which you have necessary permissions.
- Supabase free-tier limitations on bandwidth, storage, file size and inactivity may affect usage.
- Mixcloud decides playback behavior, embed support and listener statistics; this site cannot guarantee autoplay before the first click or force Mixcloud to count plays.
- Do not share Supabase secrets with anyone in chat.

## References

The public code of Artemius Radio (https://github.com/Artemiusdyso/artemius-radio) was consulted to understand the broad architecture. Radio Astraël uses **its own** code, database names, branding and Supabase project.
