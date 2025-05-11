# Bence Szabó – Professional Portfolio Website Plan

## 🌐 Domain & Hosting

- **Domain:** `benceszabo.dev` or `benceszabodeveloper.com`
- **Hosting:** Vercel (ideal for Next.js), integrated with GitHub

## 🛠 Technical Stack Setup

- **Framework:** Next.js 15 (App Router)
- **Languages:** TypeScript
- **Styling:** Tailwind CSS
- **Internationalization:** `next-i18next` with English (`/en`) and Hungarian (`/hu`)
- **Linting/Formatting:** ESLint + Prettier
- **Deployment:** Vercel (supports custom CI/CD via GitHub Actions)
- **Performance:** Static rendering, image optimization, bundle analysis

## 📄 Pages & Structure

| Route         | Section    | Features                                   |
| ------------- | ---------- | ------------------------------------------ |
| `/`           | Home       | Hero with your name, role, summary         |
| `/about`      | About      | Bio, core values from `core-values.txt`    |
| `/skills`     | Skills     | Languages, tools, tech tags                |
| `/projects`   | Projects   | Rich cards with visuals, metrics, links    |
| `/experience` | Experience | Timeline-style with job/project highlights |
| `/contact`    | Contact    | Email, LinkedIn, GitHub, contact form      |

## 🧑‍💼 About Section

- Use professional summary and experience highlights
- Include Core Values: **Openness, Balance, Growth, Fun, Wisdom**
- Friendly narrative tone with a short personal story

## 💼 Experience Section

- Derived from `experiences.txt`
  - beamLive: Tech Lead → Senior SE → Product Owner
  - CodeBerry: Developer, Mentor, Data Analyst
  - Freelance and Volunteering roles

## 🧠 Skills Section

- Auto-compiled from project and experience data:
  - **TypeScript, React, NestJS, Redis, MQTT, CI/CD, Microservices, etc.**

## 🚀 Projects Section

- Derived from `projects.txt`
- Use a grid of project cards:
  - Title, Date, Company
  - Goal, Role, Technologies, Challenges, Solutions, Metrics
  - GitHub Link + Screenshots or Demo (if available)

## ✍️ Blog (Optional)

- Tutorials, reflections, case studies, technical insights
- Helps SEO and builds personal brand

## 🎨 UI/UX Features

- **Tailwind CSS** for modern, responsive design
- **Language Switcher**: Flag icons and persistent preferences
- **SEO Optimizations**: Meta tags, alt texts, semantic structure
- **Responsiveness:** Mobile-first with optimized fonts/images
- **Optional Later:**
  - Framer Motion animations
  - Dark Mode toggle
  - Theming aligned to core values

## 🔗 GitHub Integration

- Direct links to project repositories
- Badges for stars/languages
- GitHub contributions calendar (optional)

## 📬 Contact Section

- Email, GitHub, LinkedIn
- Contact form (with validation)
- Optional: downloadable PDF resume

## 📅 Timeline & Milestones

1. **Week 1–2:** Stack setup, i18n routing, homepage
2. **Week 3:** About, Projects, Experience content pages
3. **Week 4:** Contact form, responsiveness, SEO
4. **Week 5:** Performance, accessibility, final polish
5. **Week 6:** Launch and promote
