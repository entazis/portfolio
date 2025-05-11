# Professional Portfolio

A modern, responsive, and multilingual portfolio website built with Next.js 14, showcasing professional experience, skills, and projects. The portfolio features a clean, minimalist design with smooth animations and internationalization support.

## Features

- 🌐 **Multilingual Support**

  - Built-in internationalization (i18n) with English and Hungarian language support
  - Language-specific routing (e.g., `/en/about`, `/hu/about`)
  - Seamless language switching with persistent preferences

- 🎨 **Modern Design**

  - Responsive layout optimized for all devices
  - Smooth animations and transitions using Framer Motion
  - Dark mode support with system preference detection
  - Custom UI components with Tailwind CSS

- ⚡ **Performance Optimized**

  - Static Site Generation (SSG) for optimal performance
  - Optimized images and assets
  - Fast page loads and smooth navigation

- 🛠️ **Technical Stack**
  - Next.js 14 with App Router
  - TypeScript for type safety
  - Tailwind CSS for styling
  - Framer Motion for animations
  - i18next for internationalization
  - ESLint and Prettier for code quality

## Project Structure

```
portfolio/
├── app/                    # Next.js app directory
│   ├── [lang]/            # Language-specific routes
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   └── sections/         # Page sections
├── lib/                  # Utility functions
├── public/              # Static assets
│   └── locales/        # Translation files
└── styles/             # Global styles
```

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Building for Production

```bash
npm run build
```

## Contributing

Feel free to submit issues and enhancement requests!

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
