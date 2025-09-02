'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { 
  Zap, 
  Paintbrush, 
  Home,
  Github,
  ExternalLink,
  Map,
  Pen
} from 'lucide-react'

export function MainNavigation() {
  const pathname = usePathname()

  const navItems = [
    {
      href: '/',
      label: 'Animation Builder',
      icon: Zap,
      description: 'Build GSAP animations'
    },
    {
      href: '/svg-path-maker',
      label: 'SVG Path Maker',
      icon: Paintbrush,
      description: 'Draw SVG paths'
    },
    {
      href: '/simple-svg',
      label: 'Simple SVG',
      icon: Pen,
      description: 'Clean SVG builder'
    },
    {
      href: '/trailguide-map',
      label: 'TrailGuide Map',
      icon: Map,
      description: 'Vector-first map builder'
    }
  ]

  return (
    <nav className="border-b bg-white/90 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 font-bold text-xl">
            <div className="p-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg">
              <Home className="h-5 w-5 text-white" />
            </div>
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              GSAP Studio
            </span>
          </Link>

          {/* Navigation Items */}
          <div className="flex items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className={`flex items-center gap-2 ${
                      isActive 
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white' 
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{item.label}</span>
                  </Button>
                </Link>
              )
            })}
            
            {/* GitHub Link */}
            <Button 
              variant="outline" 
              size="sm"
              asChild
              className="ml-4"
            >
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-1"
              >
                <Github className="h-4 w-4" />
                <span className="hidden sm:inline">GitHub</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
