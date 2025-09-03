# Apps Mini Index

This document tracks the deployment status of applications in this workspace.

## Deployed Apps

### GSAP Builder App
- **Repository**: https://github.com/JoshuaShepherd/gsap-builder-app
- **Framework**: Next.js 15.4.6
- **Package Manager**: npm
- **Node Version**: 20.19.2 (LTS)
- **Build Status**: ✅ Success (after fixing imports)
- **Dev Status**: ✅ Success (after fixing imports)
- **TypeScript**: ✅ No errors (fixed framer-motion imports)
- **Environment**: ✅ Configured (.env.example created)
- **README**: ✅ Updated with comprehensive setup instructions
- **Deployed**: ✅ September 3, 2025

### Issues Fixed
- Fixed incorrect `motion/react` imports → `framer-motion` across 5 components
- Added proper TypeScript types for drag event handlers
- Updated .gitignore to allow .env.example while protecting .env files
- Removed empty README.app.md file during cleanup

### Features
- GSAP animation tools and builders
- Interactive SVG path makers
- Trail guide mapping interface
- Responsive design with Tailwind CSS
- TypeScript support