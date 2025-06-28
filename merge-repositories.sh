#!/bin/bash

# Portfolio Repository Merger Script
# This script merges portfolio-lovable into portfolio while preserving git history

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
MAIN_REPO_PATH=$(pwd)
LOVABLE_REPO_PATH="../portfolio-lovable"  # Adjust path as needed
BACKUP_DIR="backup-$(date +%Y%m%d-%H%M%S)"

echo -e "${BLUE}🚀 Starting Portfolio Repository Merger${NC}"
echo "=================================================="

# Step 1: Create backup
echo -e "\n${YELLOW}📦 Creating backup...${NC}"
cp -r . "../${BACKUP_DIR}"
echo -e "${GREEN}✅ Backup created at ../${BACKUP_DIR}${NC}"

# Step 2: Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -d "src" ]; then
    echo -e "${RED}❌ Error: This doesn't appear to be the portfolio directory${NC}"
    exit 1
fi

# Step 3: Check if lovable repo exists
if [ ! -d "$LOVABLE_REPO_PATH" ]; then
    echo -e "${RED}❌ Error: portfolio-lovable not found at $LOVABLE_REPO_PATH${NC}"
    echo "Please adjust LOVABLE_REPO_PATH in this script"
    exit 1
fi

# Step 4: Create monorepo structure
echo -e "\n${YELLOW}🏗️  Creating monorepo structure...${NC}"
mkdir -p apps/nextjs-portfolio apps/vite-portfolio packages/shared

# Step 5: Move current Next.js portfolio to apps/nextjs-portfolio
echo -e "\n${YELLOW}📁 Moving Next.js portfolio files...${NC}"
for item in src public docs next.config.ts next-i18next.config.js postcss.config.mjs eslint.config.mjs tsconfig.json package.json; do
    if [ -e "$item" ]; then
        mv "$item" apps/nextjs-portfolio/
        echo "  ✓ Moved $item"
    fi
done

# Step 6: Add lovable repo as remote and fetch
echo -e "\n${YELLOW}🔗 Adding portfolio-lovable as remote...${NC}"
git remote add lovable "$LOVABLE_REPO_PATH" 2>/dev/null || true
git fetch lovable

# Step 7: Merge lovable repo preserving history
echo -e "\n${YELLOW}🔀 Merging portfolio-lovable with history preservation...${NC}"
git merge lovable/main --allow-unrelated-histories --no-commit --strategy=ours

# Step 8: Copy lovable files to apps/vite-portfolio
echo -e "\n${YELLOW}📋 Copying Vite portfolio files...${NC}"
if [ -d "$LOVABLE_REPO_PATH" ]; then
    cp -r "$LOVABLE_REPO_PATH"/* apps/vite-portfolio/ 2>/dev/null || true
    cp -r "$LOVABLE_REPO_PATH"/.[^.]* apps/vite-portfolio/ 2>/dev/null || true
fi

# Step 9: Create root package.json for monorepo
echo -e "\n${YELLOW}📝 Creating root package.json for monorepo...${NC}"
cat > package.json << 'EOF'
{
  "name": "portfolio-monorepo",
  "version": "1.0.0",
  "description": "Multi-version portfolio monorepo",
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "scripts": {
    "dev:nextjs": "cd apps/nextjs-portfolio && npm run dev",
    "dev:vite": "cd apps/vite-portfolio && npm run dev",
    "build:nextjs": "cd apps/nextjs-portfolio && npm run build",
    "build:vite": "cd apps/vite-portfolio && npm run build",
    "build:all": "npm run build:nextjs && npm run build:vite",
    "lint": "npm run lint --workspaces",
    "type-check": "npm run type-check --workspaces",
    "clean": "rm -rf apps/*/node_modules apps/*/.next apps/*/dist node_modules"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "typescript": "^5.0.0"
  },
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=8.0.0"
  }
}
EOF

# Step 10: Create shared packages structure
echo -e "\n${YELLOW}📦 Setting up shared packages...${NC}"

# Shared types
mkdir -p packages/shared-types/src
cat > packages/shared-types/package.json << 'EOF'
{
  "name": "@portfolio/shared-types",
  "version": "1.0.0",
  "description": "Shared TypeScript types for portfolio applications",
  "main": "src/index.ts",
  "types": "src/index.ts",
  "scripts": {
    "type-check": "tsc --noEmit"
  },
  "devDependencies": {
    "typescript": "^5.0.0"
  }
}
EOF

cat > packages/shared-types/src/index.ts << 'EOF'
// Shared types across portfolio versions
export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  imageUrl?: string;
  githubUrl?: string;
  liveUrl?: string;
  keyAchievements?: string[];
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  duration: string;
  description: string[];
  technologies?: string[];
}

export interface Skill {
  name: string;
  level: 'Master' | 'Expert' | 'Advanced' | 'Intermediate' | 'Beginner';
  category: string;
}

export interface ContactInfo {
  email: string;
  linkedin?: string;
  github?: string;
  website?: string;
}

export type PortfolioVersion = 'nextjs' | 'vite' | 'classic';
EOF

# Shared data
mkdir -p packages/shared-data/src
cat > packages/shared-data/package.json << 'EOF'
{
  "name": "@portfolio/shared-data",
  "version": "1.0.0",
  "description": "Shared data for portfolio applications",
  "main": "src/index.ts",
  "types": "src/index.ts",
  "dependencies": {
    "@portfolio/shared-types": "*"
  },
  "devDependencies": {
    "typescript": "^5.0.0"
  }
}
EOF

cat > packages/shared-data/src/index.ts << 'EOF'
import { Project, Experience, Skill, ContactInfo } from '@portfolio/shared-types';

// This file can be populated with your actual data
export const projects: Project[] = [];
export const experiences: Experience[] = [];
export const skills: Skill[] = [];
export const contactInfo: ContactInfo = {
  email: '',
};

// Export all data
export * from '@portfolio/shared-types';
EOF

# Step 11: Create workspace configuration files
echo -e "\n${YELLOW}⚙️  Creating workspace configuration...${NC}"

# Root tsconfig.json
cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@portfolio/*": ["packages/*/src"]
    }
  },
  "references": [
    {
      "path": "./apps/nextjs-portfolio"
    },
    {
      "path": "./apps/vite-portfolio"
    },
    {
      "path": "./packages/shared-types"
    },
    {
      "path": "./packages/shared-data"
    }
  ]
}
EOF

# Create README for the merged repo
cat > README.md << 'EOF'
# Portfolio Monorepo

This repository contains multiple versions of my portfolio website, managed as a monorepo.

## Structure

- `apps/nextjs-portfolio/` - Next.js version with internationalization
- `apps/vite-portfolio/` - React + Vite version with modern UI components
- `packages/shared-types/` - Shared TypeScript types
- `packages/shared-data/` - Shared data and content

## Development

```bash
# Install dependencies for all workspaces
npm install

# Run Next.js version
npm run dev:nextjs

# Run Vite version
npm run dev:vite

# Build all applications
npm run build:all

# Clean all node_modules and build artifacts
npm run clean
```

## Deployment

Each application can be deployed independently:

- Next.js version: Optimized for Vercel deployment
- Vite version: Can be deployed to any static hosting service

## Version Switching

Each portfolio version is self-contained but shares common data and types through the shared packages.
EOF

# Step 12: Commit the changes
echo -e "\n${YELLOW}💾 Committing changes...${NC}"
git add .
git commit -m "feat: merge portfolio-lovable into monorepo structure

- Create monorepo with apps/nextjs-portfolio and apps/vite-portfolio
- Add shared packages for types and data
- Set up workspace configuration
- Preserve git history from both repositories"

# Step 13: Clean up
git remote remove lovable

echo -e "\n${GREEN}🎉 Repository merger completed successfully!${NC}"
echo "=================================================="
echo -e "${BLUE}Next steps:${NC}"
echo "1. Review the merged structure"
echo "2. Run 'cd apps/nextjs-portfolio && npm install'"
echo "3. Run 'cd apps/vite-portfolio && npm install'"
echo "4. Test both applications"
echo "5. Update any broken imports or dependencies"
echo -e "\n${YELLOW}⚠️  Don't forget to test both applications before removing the backup!${NC}"
echo -e "Backup location: ${GREEN}../${BACKUP_DIR}${NC}" 