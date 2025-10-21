# Portfolio Dark

A modern, dark-themed portfolio website built with React, TypeScript, and Tailwind CSS.

## Tech Stack

- **Framework**: React 18.3.1
- **Build Tool**: Vite 5.4.19
- **Language**: TypeScript 5.8.3
- **Styling**: Tailwind CSS 3.4.17
- **UI Components**: Radix UI with shadcn/ui
- **Routing**: React Router DOM 6.30.1
- **State Management**: TanStack Query 5.83.0
- **Forms**: React Hook Form 7.61.1 with Zod validation
- **Icons**: Lucide React

## Features

- 🎨 Dark theme with modern UI/UX
- 📱 Fully responsive design
- ♿ Accessible components (Radix UI primitives)
- 🎭 Smooth animations and transitions
- 📊 Interactive data visualizations with Recharts
- 🎯 Type-safe forms with validation
- 🚀 Optimized bundle with Vite

## Development

```bash
# Install dependencies
npm install

# Start development server (http://localhost:8080)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## Project Structure

```
src/
├── components/
│   ├── ui/           # Reusable UI components (shadcn/ui)
│   ├── Hero.tsx      # Hero section
│   ├── Experience.tsx # Work experience section
│   ├── Skills.tsx    # Skills showcase
│   ├── Projects.tsx  # Projects gallery
│   ├── Education.tsx # Education history
│   └── Contact.tsx   # Contact form
├── pages/
│   ├── Index.tsx     # Main portfolio page
│   └── NotFound.tsx  # 404 page
├── hooks/            # Custom React hooks
├── lib/              # Utility functions
├── assets/           # Static assets
├── App.tsx           # App root component
└── main.tsx          # App entry point
```

## Customization

- **Colors**: Edit `src/index.css` to customize the color scheme
- **Content**: Update component files in `src/components/`
- **Styling**: Modify `tailwind.config.ts` for theme customization
- **Routes**: Add new routes in `src/App.tsx`

## Build Output

The production build generates optimized static files in the `dist/` directory, ready for deployment to any static hosting service.
