# Software Engineering Portfolio

A modern, responsive software engineering portfolio built with Next.js, TypeScript, and Tailwind CSS.

Prompt used for initializing the project:  
*Create a website for me where I can show my portfolio as a software engineer and I can also share the applications I've built. Make it a single-page application using Next.js, and make it interactive with beautiful animations, it should be immersive, and professional. Make it responsive and also apply the best UX practices. Make this website server-side rendered, and make it static rendered as much as you can. Use tailwind CSS for the styling. It should not have authentication or registration fields at first but later on, if either of the applications requires (saving sessions, storing data, ...) then make Google, Facebook, Stackoverflow, .. and other popular 3rd party authentications/ registration available.*

## Features

- Responsive design with Tailwind CSS
- Type-safe development with TypeScript
- Modern UI components using Radix UI
- Light/dark mode using next-themes
- Section-based portfolio layout
- Contact form

## Tech Stack

- **Framework**: Next.js
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Form Handling**: React Hook Form with Zod validation
- **Deployment**: TBD

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/portfolio.git
   cd portfolio
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:

   ```bash
   cp .env.example .env.local
   ```

4. Start the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
portfolio/
├── app/               # Next.js app directory
├── components/        # React components
│   ├── sections/      # Portfolio sections
│   └── ui/            # UI components
├── hooks/             # Custom React hooks
├── lib/               # Utility functions
├── public/            # Static assets
└── styles/            # Global styles
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
