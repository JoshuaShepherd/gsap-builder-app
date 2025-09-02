# GSAP Studio - Project Dependencies

## Overview
This is a Next.js 15 React application built with TypeScript, featuring GSAP animations and SVG path creation tools.

## Prerequisites
- Node.js 18+ 
- npm or yarn package manager

## Installation
```bash
npm install
# or
yarn install
```

## Core Dependencies

### Framework & Runtime
- **next**: ^15.4.4 - React framework for production
- **react**: ^18.3.1 - JavaScript library for building user interfaces
- **react-dom**: ^18.3.1 - React DOM rendering

### Animation Libraries
- **gsap**: ^3.13.0 - GreenSock Animation Platform (core library)
- **@gsap/react**: ^2.1.2 - GSAP React integration hooks
- **framer-motion**: ^12.23.12 - Motion library for React

### UI Component Libraries
- **@radix-ui/react-accordion**: ^1.2.8 - Accessible accordion component
- **@radix-ui/react-alert-dialog**: ^1.1.11 - Alert dialog primitives
- **@radix-ui/react-aspect-ratio**: ^1.1.4 - Aspect ratio container
- **@radix-ui/react-avatar**: ^1.1.7 - Avatar component
- **@radix-ui/react-checkbox**: ^1.2.3 - Checkbox input
- **@radix-ui/react-collapsible**: ^1.1.11 - Collapsible content
- **@radix-ui/react-dialog**: ^1.1.14 - Modal dialog primitives
- **@radix-ui/react-dropdown-menu**: ^2.1.15 - Dropdown menu component
- **@radix-ui/react-hover-card**: ^1.1.14 - Hover card component
- **@radix-ui/react-label**: ^2.1.7 - Form label component
- **@radix-ui/react-menubar**: ^1.1.12 - Menubar navigation
- **@radix-ui/react-navigation-menu**: ^1.2.10 - Navigation menu
- **@radix-ui/react-popover**: ^1.1.11 - Popover component
- **@radix-ui/react-progress**: ^1.1.4 - Progress bar
- **@radix-ui/react-scroll-area**: ^1.2.6 - Custom scrollable area
- **@radix-ui/react-select**: ^2.2.2 - Select dropdown
- **@radix-ui/react-separator**: ^1.1.7 - Visual separator
- **@radix-ui/react-slider**: ^1.3.2 - Range slider input
- **@radix-ui/react-slot**: ^1.2.3 - Slot component utility
- **@radix-ui/react-switch**: ^1.2.5 - Toggle switch
- **@radix-ui/react-tabs**: ^1.1.9 - Tab navigation
- **@radix-ui/react-tooltip**: ^1.2.7 - Tooltip component

### Icons & Graphics
- **lucide-react**: ^0.503.0 - Beautiful & consistent icon toolkit
- **@tabler/icons-react**: ^3.34.1 - Additional icon set

### Data Visualization
- **d3**: ^7.9.0 - Data-driven document manipulation
- **@types/d3**: ^7.4.3 - TypeScript definitions for D3
- **recharts**: ^2.15.3 - React charting library
- **cobe**: ^0.6.4 - WebGL globe visualization
- **dotted-map**: ^2.2.3 - Dotted world map visualization

### Carousel & Interactive Components
- **embla-carousel-react**: ^8.6.0 - Carousel component library
- **vaul**: ^1.1.2 - Drawer/sheet component

### Styling & CSS
- **tailwindcss**: ^3.4.17 - Utility-first CSS framework
- **tailwindcss-animate**: ^1.0.7 - Animation utilities for Tailwind
- **tailwind-merge**: ^3.3.1 - Utility for merging Tailwind classes
- **class-variance-authority**: ^0.7.1 - Component variant utility
- **clsx**: ^2.1.1 - Utility for constructing className strings
- **autoprefixer**: ^10.4.21 - PostCSS plugin for vendor prefixes
- **postcss**: ^8.5.6 - CSS transformation tool

### Tailwind CSS Plugins
- **@tailwindcss/aspect-ratio**: ^0.4.2 - Aspect ratio utilities
- **@tailwindcss/forms**: ^0.5.10 - Form styling utilities
- **@tailwindcss/typography**: ^0.5.16 - Typography plugin

### Forms & User Input
- **react-hook-form**: ^7.62.0 - Performant forms library
- **cmdk**: ^1.1.1 - Command menu component

### Notifications & Themes
- **sonner**: ^2.0.7 - Toast notification system
- **next-themes**: ^0.4.6 - Theme switching for Next.js

### Content & Documentation
- **@mdx-js/loader**: ^3.1.0 - MDX webpack loader
- **@mdx-js/react**: ^3.1.0 - MDX React integration
- **@next/mdx**: ^15.4.6 - Next.js MDX support

### Utilities
- **qss**: ^3.0.0 - Query string parsing utility

## Development Dependencies

### TypeScript & Type Definitions
- **typescript**: ^5.0.0 - TypeScript compiler
- **@types/node**: ^24.1.0 - Node.js type definitions
- **@types/react**: ^18.0.0 - React type definitions
- **@types/react-dom**: ^18.0.0 - React DOM type definitions

### Linting & Code Quality
- **eslint**: ^8.0.0 - JavaScript/TypeScript linter
- **eslint-config-next**: ^14.0.0 - ESLint config for Next.js

## Key Features Enabled by Dependencies

### Animation Features
- **GSAP Timeline Builder**: Complete animation sequencing with gsap + @gsap/react
- **SVG Path Drawing**: Interactive path creation with real-time GSAP animations
- **Motion Effects**: Enhanced UI animations with framer-motion

### UI Components
- **Comprehensive Component Library**: 20+ Radix UI components for accessibility
- **Toast Notifications**: Real-time feedback with sonner
- **Form Handling**: Robust form management with react-hook-form

### Data Visualization
- **Interactive Charts**: Analytics and data display with recharts + d3
- **3D Globe**: Geographic visualization with cobe
- **World Maps**: Location-based displays with dotted-map

### Developer Experience
- **Type Safety**: Full TypeScript coverage with comprehensive type definitions
- **Code Quality**: ESLint configuration optimized for Next.js
- **Modern CSS**: Tailwind CSS with animations and responsive design

## Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd gsap-builder-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   npm start
   ```

## Browser Requirements
- Modern browsers supporting ES2020+
- WebGL support recommended for 3D visualizations
- SVG support for path drawing features

## Notes
- This project uses Next.js 15 with the App Router
- GSAP professional features may require a license for commercial use
- All Radix UI components are unstyled and customized with Tailwind CSS
