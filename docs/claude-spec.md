# Professional Portfolio Website Plan for Bence Szabó

## Overview

This document outlines a comprehensive plan for building a professional portfolio website that showcases your 7+ years of experience as a full-stack software engineer specializing in scalable systems and problem-solving.

## 1. Technical Implementation

### Domain & Hosting

#### Domain Name Options

- **benceszabo.dev** (recommended)
- **bence-szabo.dev**
- **szabobence.dev**

#### Hosting Options

- **Vercel** (optimal for Next.js)
- **Netlify** (good alternative)
- **GitHub Pages** (budget option)

### Tech Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Internationalization**: next-i18next
- **Code Quality**: ESLint, Prettier
- **Optional Enhancements**: Framer Motion for animations

### Project Structure

```
portfolio/
├── public/
│   ├── images/
│   │   ├── projects/
│   │   ├── profile.jpg
│   │   └── favicon.ico
│   └── locales/
│       ├── en/
│       │   ├── common.json
│       │   ├── home.json
│       │   └── projects.json
│       └── hu/
│           ├── common.json
│           ├── home.json
│           └── projects.json
├── src/
│   ├── app/
│   │   ├── [locale]/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── projects/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx
│   │   │   └── experience/
│   │   │       └── page.tsx
│   │   ├── api/
│   │   │   └── contact/
│   │   │       └── route.ts
│   │   └── globals.css
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── LanguageSwitcher.tsx
│   │   ├── sections/
│   │   │   ├── About.tsx
│   │   │   ├── Hero.tsx
│   │   │   ├── Skills.tsx
│   │   │   ├── Projects.tsx
│   │   │   ├── Experience.tsx
│   │   │   └── Contact.tsx
│   │   └── ui/
│   │       ├── Button.tsx
│   │       ├── Card.tsx
│   │       └── ProjectCard.tsx
│   ├── lib/
│   │   ├── i18n.ts
│   │   └── projects.ts
│   ├── types/
│   │   ├── project.ts
│   │   └── experience.ts
│   └── data/
│       ├── projects.ts
│       └── experiences.ts
├── tailwind.config.js
├── next.config.js
└── tsconfig.json
```

## 2. Content Organization & Key Features

### Homepage / Hero Section

- **Professional header** with your name prominently displayed
- **Animated typing effect** showcasing multiple roles: "Full-Stack Developer", "Problem Solver", "Tech Lead", "System Architect"
- **Professional photo** with subtle design elements
- **Clear call-to-action buttons** to view projects and contact you
- **Brief introduction** highlighting your 7+ years of experience

### About Section

#### Who I Am

- Background story starting with your education at Budapest University of Technology and Economics
- Journey through different roles (Full Stack Developer, Data Analyst, Tech Lead)
- Personal motivation and passion for problem-solving and mentoring

#### My Approach

- Optimization-Driven Development: Focus on performance from the start
- Data-Informed Solutions: Using your data analysis background
- Architectural Thinking: Designing systems with scalability in mind

### Skills Section

Visually engaging presentation of your technical skills, organized into categories:

#### Frontend Development

- TypeScript (Master)
- JavaScript (Master)
- React (Expert)
- HTML5/CSS3 (Expert)
- UI/UX (Advanced)

#### Backend Development

- Node.js (Master)
- PostgreSQL (Expert)
- Redis (Expert)
- MQTT (Expert)
- API Design (Master)

#### DevOps & Architecture

- Microservices (Expert)
- CI/CD (Expert)
- System Design (Expert)
- Database Scaling (Expert)
- Testing (Expert)

#### Data & Analytics

- Data Analysis (Expert)
- Google Analytics (Expert)
- Data Visualization (Advanced)
- Machine Learning (Intermediate)
- Web Scraping (Expert)

#### Additional Technologies

- Tag cloud of additional skills and tools: Jest, Git, GitHub, Docker, GraphDB, MongoDB, Python, Tailwind CSS, Next.js, AWS, REST API, Agile/Scrum, etc.

### Projects Section

Showcase of 5-6 key projects with:

1. **Nanoservices Engine & Editor**

   - Description: Designed and built a nanoservice engine enabling downtime-free feature creation
   - Technologies: Node.js, TypeScript, Redis, MQTT, Docker
   - Key achievements:
     - Reduced system downtime by 50%
     - Enabled feature creation without service interruption
     - Simplified deployment and rollback processes
     - Created visual editor for service configuration

2. **Redis Clustering & Performance Optimization**

   - Description: Led migration from PostgreSQL to Redis for high-traffic services
   - Technologies: Redis, Node.js, TypeScript, Performance Optimization, Database Design
   - Key achievements:
     - Improved response time by 40%
     - Enhanced fault tolerance and system resilience
     - Implemented efficient caching strategies
     - Created automated failover mechanisms

3. **MQTT Load Balancing System**

   - Description: Developed sophisticated MQTT load balancing system
   - Technologies: MQTT, Node.js, TypeScript, Load Balancing, Microservices
   - Key achievements:
     - Reduced codebase by 30%
     - Improved deployment speed by 40%
     - Enhanced multi-tenancy support
     - Created self-healing connection management

4. **Transaction Management System**

   - Description: Built robust transaction-based operation system for financial operations
   - Technologies: Node.js, TypeScript, PostgreSQL, Redis, API Design
   - Key achievements:
     - Reduced transaction conflicts by 85%
     - Implemented real-time balance tracking
     - Created audit trail for all operations
     - Developed automated reconciliation tools

5. **Automated Testing Framework**
   - Description: Created comprehensive testing framework
   - Technologies: Jest, TypeScript, CI/CD, GitHub Actions, Test Automation
   - Key achievements:
     - Increased test coverage from 30% to 70%
     - Reduced regression bugs by 65%
     - Automated integration testing
     - Created test data generation tools

#### Project Detail Pages

- Comprehensive explanation of project challenges and solutions
- Technical architecture diagrams
- Problem-solving process
- Visual demos or screenshots
- Detailed technical stack information
- Links to GitHub/live demo when available

### Experience Section

Timeline-based presentation of your work experience:

#### beamLive (4 years 10 months)

- **Tech Lead** (January 2025 - Present)
- **Senior Software Engineer** (February 2022 - January 2025)
  - Designed and built APIs using Node.js and TypeScript
  - Developed nano-service engine and editor
  - Led migration from PostgreSQL and HTTP to Redis and MQTT
  - Implemented database replication/sharding and testing framework
- **Full Stack Software Developer & Product Owner** (August 2020 - January 2022)
  - Architected and shipped features for administrative platform
  - Initiated system redesign for performance and scalability
  - Improved code quality through component extraction

#### CodeBerry Programming School (3 years 3 months)

- **Software Developer** (October 2018 - August 2020)
  - Created web applications and websites
  - Revitalized online presence with redesigned landing pages
  - Implemented UX improvements and gamification features
- **Data Analyst** (June 2018 - August 2020)
  - Created data visualizations and configured Google Analytics
  - Extracted insights from diverse data sources
  - Analyzed ad campaigns and monitored AARRR metrics
- **Code Mentor** (September 2018 - March 2019)
  - Guided students in coding practices

#### Independent Contractor (2 years 1 month)

- Built custom websites, applications, and web scrapers
- Developed server-side applications and static sites
- Managed data analytics tasks

### Contact Section

Professional contact form with:

- Name, email, subject fields
- Message text area
- Clear submission button
- Social media links (LinkedIn, GitHub)
- Alternative contact information (email)
- Double opt-in for GDPR compliance (for EU regulations)

### Multilingual Support

- English and Hungarian language support
- Language-specific routing (`/en`, `/hu`)
- Default route (`/`) fallback to English
- Language selector widget
- Persistent language preference storage

## 3. Design Principles

### Visual Design

- **Clean, minimal aesthetic** with ample white space
- **Color scheme** based on professional blues and indigos with accent colors
- **Typography** using modern, readable fonts (system fonts for performance)
- **Consistent visual elements** throughout the site
- **Subtle animations** for interactive elements
- **Dark mode support** with system preference detection

### User Experience

- **Fast page loads** with optimized assets
- **Smooth transitions** between sections and pages
- **Intuitive navigation** with clear information hierarchy
- **Mobile-first responsive design** for all screen sizes
- **Progressive disclosure** of information (overview first, details on demand)
- **Accessibility compliance** with WCAG guidelines

## 4. Development Process

### Phase 1: Setup & Structure

1. Set up Next.js project with TypeScript and Tailwind CSS
2. Configure internationalization with next-i18next
3. Create basic layout components and routing structure
4. Set up ESLint and Prettier for code quality

### Phase 2: Core Content Development

1. Develop Hero and About sections
2. Create Skills section with visualization
3. Build Projects section with filtering capability
4. Implement Experience timeline
5. Develop Contact form with validation

### Phase 3: Multilingual Support

1. Extract text content to translation files
2. Implement language switcher
3. Set up language-specific routes
4. Test content in both languages

### Phase 4: Optimization & Polish

1. Optimize images and assets
2. Implement SEO best practices
3. Add subtle animations and transitions
4. Test performance and make improvements
5. Ensure cross-browser compatibility
6. Validate accessibility compliance

### Phase 5: Deployment & Analytics

1. Set up domain and hosting
2. Configure CI/CD pipeline
3. Implement Google Analytics
4. Test all features in production environment
5. Perform final quality assurance checks

## 5. SEO Strategy

- **Custom meta titles and descriptions** for all pages
- **Structured data markup** for better search engine understanding
- **Canonical URLs** to prevent duplicate content issues
- **Optimized image alt text** for all visual content
- **Semantic HTML structure** for better indexing
- **XML sitemap** for search engine crawling
- **Robots.txt** configuration for crawl control
- **Mobile optimization** for better mobile search rankings
- **Page speed optimization** for search ranking benefit

## 6. Measurement & Analytics

- Track portfolio performance with Google Analytics
- Monitor key metrics:
  - Site visits and traffic sources
  - Time spent on portfolio
  - Project view counts
  - Contact form submissions
  - Click-through rates to GitHub/LinkedIn
  - Bounce rates and exit pages

## 7. Future Expansion Options

- **Blog/Articles Section**: Sharing technical insights and tutorials
- **Case Studies**: Expanded project analyses with business impact
- **Testimonials**: Feedback from colleagues and clients
- **Interactive Demos**: Live code examples embedded in projects
- **Technical Talks/Videos**: Integration of presentations or technical talks
- **Automated Resume Download**: Current PDF resume generation
