# Client Assets & Information Checklist — Capture Art Studio

Use this checklist to collect everything needed to fully customize and launch the website. Copy the checklist into an email or a project management task and attach assets as requested.

---

1) Branding & Visuals
  - [ ] Primary brand color (HSL or HEX). Example: `45 100% 51%` or `#ffb703`
  - [ ] Secondary brand color (HSL or HEX).
  - [ ] Logo files (SVG preferred). Provide: primary logo, square icon, and transparent PNGs in high-res.
  - [ ] Brand icon or favicon (ICO or 32x32 PNG).
  - [ ] Preferred fonts (Google Fonts names or font files).
  - [ ] Any other brand illustrations or pattern assets.

2) Microcopy & Content
  - [ ] Site title and short tagline (1 sentence).
  - [ ] Hero headline and subheadline for Home page.
  - [ ] About page copy (200–500 words) and team bios (name, role, short bio, optional headshot).
  - [ ] Footer/Legal copy: business name, registered address, privacy policy, terms of service (if available).

3) Services & Pricing
  - [ ] Complete list of services (title + one-paragraph description each).
  - [ ] Features/bullets for each service (3–6 bullets).
  - [ ] Starting price or price range (text like `From Rs 2,500`).
  - [ ] Any packaged pricing tiers (if available) and deposit/cancellation policy.

4) Portfolio Assets
  - [ ] For each portfolio item: title, category (wedding/event/corporate/portrait/commercial/other), short description, date (optional), and images.
  - [ ] Image requirements: supply high-resolution images (at least 2000px shortest edge) and indicate crop preferences. Preferred aspect: square (site uses `aspect-square`).
  - [ ] If video content, provide video URL (YouTube/Vimeo) or direct MP4 URL.
  - [ ] Indicate whether you want us to upload images via Admin UI or provide public URLs.

5) Contact & Booking
  - [ ] Contact phone number (international format, no + sign) for WhatsApp quick link.
  - [ ] Public business email.
  - [ ] Physical address to show on Contact page (optional).
  - [ ] Preferred booking options (which services should appear in Booking dropdowns).
  - [ ] Notification preference when booking form is submitted (WhatsApp link, email, Slack, webhook).

6) Integrations & Access
  - [ ] Supabase project URL (VITE_SUPABASE_URL) and publishable key (VITE_SUPABASE_PUBLISHABLE_KEY) for client-side setup.
  - [ ] Supabase admin/service role key (send securely if we need server-side migration or seeding).
  - [ ] Hosting platform choice (Lovable, Vercel, Netlify, custom) and domain/DNS access info.
  - [ ] GitHub collaborator usernames or invite for editing code.
  - [ ] Admin user emails to add to the `admin_users` table.

7) Legal & Policies
  - [ ] Privacy policy text or link.
  - [ ] Terms of service text or link.
  - [ ] Any photography release forms or copyright notices to display.

8) Design & Behavior Preferences
  - [ ] Animation preference: Enable or disable UI animations and sparkles? (Recommend: enable, opt-in to reduced-motion)
  - [ ] Accessibility requirements (WCAG level or other constraints).
  - [ ] Preferred visual tone (e.g., bright & warm, dark & moody, minimalist).

9) Launch & Timeline
  - [ ] Target launch date.
  - [ ] Priority pages/content that must be ready for launch.
  - [ ] Any marketing or tracking IDs to add before launch (Google Analytics, GTM).

10) Optional (Helpful) — Marketing & SEO
  - [ ] Social media profile links (Instagram, Facebook, Twitter, LinkedIn).
  - [ ] Default social preview image (1200x630 recommended).
  - [ ] Short list of keywords/SEO meta description per page.

---

How to deliver assets
- Attach files to an email or share a Google Drive/Dropbox link.
- For secrets (Supabase service key), share via a secure channel (1Password, LastPass, or encrypted email). Do NOT email service keys in plaintext.

What I will do after receiving assets
- Wire in brand colors to `src/index.css` tokens.
- Replace the logo in `src/assets/` and update `src/components/Navigation.tsx`.
- Populate Services and Booking dropdowns from provided content.
- Bulk upload portfolio images via Admin UI if requested or add public URLs to the DB.
- Configure WhatsApp links and contact details in `src/pages/Booking.tsx` and `src/pages/Contact.tsx`.

If you'd like, I can convert this checklist into a polished PDF or upload a pre-filled Google Form. Tell me which format you prefer.
