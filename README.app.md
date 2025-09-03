# GSAP Builder App

A powerful Next.js application for creating and testing GSAP animations with a comprehensive visual interface. Build complex animation sequences, test them instantly, and export production-ready code.

## ✨ Features

- **Interactive Animation Builder**: Create GSAP animations with a visual interface
- **Nature Trails Journey**: Animated SVG trails with scroll-triggered animations
- **Simple SVG Builder**: Create and manipulate SVG elements with GSAP
- **Real-time Preview**: See animations as you build them
- **Code Export**: Generate production-ready GSAP code

## 🚀 Prerequisites

- **Node.js** 18+ (LTS recommended)
- **npm** 9+

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/JoshuaShepherd/gsap-builder-app.git
   cd gsap-builder-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables (optional)**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your values if needed
   ```

## 🛠️ Development

**Start the development server:**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗️ Build

**Build for production:**
```bash
npm run build
```

**Start production server:**
```bash
npm run start
```

**Lint the codebase:**
```bash
npm run lint
```

## 🌍 Environment Variables

Currently, this application doesn't require any environment variables for basic functionality. If you need to add any, use the `.env.example` template.

## 🎯 Pages

- **`/`** - Main GSAP Animation Builder
- **`/nature-trails`** - Interactive nature trails with animated SVG paths
- **`/simple-svg`** - Simple SVG creation tool

## 🧰 Tech Stack

- **Next.js 15** - React framework
- **GSAP 3.13** - Animation library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Radix UI** - UI components

## 📝 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 📄 License

Private project for development purposes.
