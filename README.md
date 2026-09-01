# My Guardian Link - V4.5

A free job seeker platform connecting businesses with job seekers across South Africa.

## 🚀 Features

### For Job Seekers (index.html)
- **Free Profile Creation** - Create a professional profile in seconds
- **Job Search** - Find jobs by role, province, and town
- **CV Download** - Download profiles as PDF for sharing
- **Direct Applications** - Apply directly to employers
- **Portal Applications** - Guardian forwards CVs to employers (charged to employer)
- **POPIA Compliant** - Full privacy protection

### Community (community.html)
- **Job Advice** - Ask where to apply and get tips
- **Employer Reviews** - Share experiences with companies
- **Location-Based** - Filter by province and town
- **Moderated** - Admin monitors for quality

### Admin Dashboard (admin.html)
- **PIN Protected** (7777)
- **User Analytics** - Track seekers, views, downloads
- **Application Management** - Forward CVs to employers
- **Ad Management** - Track ad clicks and revenue
- **Location Insights** - See which towns need jobs most
- **User Control** - Delete/manage profiles

### Privacy & Compliance (privacy.html)
- **POPIA Act** - Protection of Personal Information Act 4 of 2013
- **ESA Act** - Employment Services Act 4 of 2014
- **No Fees** - Job seekers always free
- **Secure Storage** - Vercel infrastructure

## 📋 Project Structure

```
guardian-work/
├── index.html          # Main job seeker platform
├── admin.html          # Admin dashboard (PIN: 7777)
├── community.html      # Community timeline & advice
├── privacy.html        # Privacy policy & compliance
└── README.md          # This file
```

## 🛠️ Tech Stack

- **Frontend**: HTML5, Tailwind CSS, Vanilla JavaScript
- **Storage**: localStorage (browser-based)
- **PDF Generation**: jsPDF library
- **Hosting**: Vercel
- **Styling**: Tailwind CSS v3

## 🎨 Color Scheme

- Primary Green: `#075D3B`
- Gold Accent: `#F4A21A`
- Light Bg: `#F7F5F0`
- Dark Bg: `#0F1A14`

## 📊 Data Structure

### Profiles (gwl_profiles)
```javascript
{
  id: "timestamp",
  name: "Thabo M.",
  job: "Welder",
  town: "Secunda",
  province: "Mpumalanga",
  phone: "082 123 4567",
  exp: "5y",
  views: 0
}
```

### Insights (gwl_insights)
```javascript
{
  views: 45,
  downloads: 12,
  prints: 3,
  towns: { "Secunda": 15, "Witbank": 8 }
}
```

### Applications (gwl_apps)
```javascript
{
  id: "timestamp",
  seeker: "Thabo M.",
  job: "Welder",
  town: "Secunda",
  date: "2024-01-15 10:30:45"
}
```

### Community Posts (gwl_community)
```javascript
{
  text: "Question/review text",
  prov: "Mpumalanga",
  town: "Secunda",
  replies: ["Reply 1", "Reply 2"],
  stars: 5
}
```

### Ads (gwl_ads)
```javascript
{
  ad1: 42,  // Click count for Ad 1
  ad2: 18   // Click count for Ad 2
}
```

## 🔐 Admin Access

1. Navigate to `/admin.html`
2. Enter PIN: **7777**
3. View all analytics, manage users, and moderate content

## 🌍 Growth Mode

Currently in **FREE Growth Mode** until 20,000 active users:
- Job seekers: Always free
- Employers: Free during growth phase
- After growth: Premium features available

## 📞 Contact & Support

- **Email**: info@myguardianlink.co.za
- **Abuse Reports**: 0800 222 777
- **Compliance**: POPIA & ESA Act compliant

## ✨ Next Features to Add

- [ ] Backend API integration (Node.js/MongoDB)
- [ ] User authentication with email verification
- [ ] Employer portal and paid features
- [ ] SMS notifications
- [ ] Mobile app
- [ ] Real CV upload (not just PDF download)
- [ ] Video profiles
- [ ] Employer reviews system
- [ ] Job matching algorithm
- [ ] Analytics dashboard for employers

---

**V4.5** | Built for South Africa 🇿🇦 | POPIA & ESA Compliant
