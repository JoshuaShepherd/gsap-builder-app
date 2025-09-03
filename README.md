# GSAP Builder App

A comprehensive Next.js application for building animations and interactive components with GSAP (GreenSock Animation Platform).

## Features

- **Modern Stack**: Built with Next.js 15.4.6, React 18, and TypeScript
- **GSAP Integration**: Advanced animations with GSAP and MotionPath plugins
- **Styling**: Tailwind CSS with shadcn/ui components
- **Interactive Tools**: SVG path makers, trail guides, and animation builders
- **Responsive**: Mobile-first design approach
- **Multiple Demo Pages**: Nature trails, SVG tools, and interactive maps

## Getting Started

### Prerequisites

- Node.js 20 or later (LTS recommended)
- npm (comes with Node.js)

### Installation

1. Clone this repository:
```bash
git clone https://github.com/JoshuaShepherd/gsap-builder-app.git
cd gsap-builder-app
```

2. Install dependencies:
```bash
npm install
```

3. (Optional) Copy environment variables:
```bash
cp .env.example .env.local
# Edit .env.local with your values if needed
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Available Scripts

- `npm run dev` - Start development server (default: http://localhost:3000)
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Environment Variables

Copy `.env.example` to `.env.local` and configure:

- `NEXT_PUBLIC_APP_URL` - Your app URL (default: http://localhost:3000)
- Add other variables as needed for your specific setup

## Demo Pages

- **Home** (`/`) - Main landing page with app overview
- **Nature Trails** (`/nature-trails`) - Interactive trail animations
- **Simple SVG** (`/simple-svg`) - Basic SVG manipulation tools
- **SVG Path Maker** (`/svg-path-maker`) - Advanced SVG path creation
- **Trailguide Map** (`/trailguide-map`) - Interactive mapping interface

## Project Structure

```
src/
├── app/
│   ├── globals.css      # Global styles
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Main application page
├── components/
│   └── ui/              # shadcn/ui components
├── lib/
│   └── utils.ts         # Utility functions
└── hooks/               # Custom React hooks
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Deploy with zero configuration

### Other Platforms

This is a standard Next.js application and can be deployed to any platform that supports Node.js:

- Netlify
- Railway
- Render
- AWS Amplify
- Digital Ocean App Platform

## Customization

### Styling

The app uses Tailwind CSS with a custom configuration. You can modify:

- `tailwind.config.js` - Tailwind configuration
- `src/app/globals.css` - Global styles
- `components.json` - shadcn/ui configuration

### Components

All UI components are located in `src/components/ui/` and can be customized or replaced.

## Contributing

This is a standalone application. If you'd like to contribute to the original project, please visit the [trailguide-staging repository](https://github.com/JoshuaShepherd/trailguide-staging).

## License

This project is private and proprietary.

## Support

For questions or issues, please contact the development team.


## GSAP Features

This app includes GSAP (GreenSock Animation Platform) for high-performance animations:

- Timeline animations
- SVG morphing
- Scroll-triggered animations
- Interactive elements

### GSAP License

Note: This app uses GSAP. For production use, you may need a commercial license depending on your use case. Visit [greensock.com](https://greensock.com) for licensing information.
