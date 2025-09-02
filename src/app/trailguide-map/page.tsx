'use client'

import React, { useState, useRef, useCallback, useEffect } from 'react'
import { gsap } from 'gsap'
// Note: DrawSVGPlugin is a premium GSAP plugin - using stroke-dasharray/offset instead
import { useGSAP } from '@gsap/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { MapSymbols } from '@/components/ui/map-symbols'
import { 
  Map, 
  Layers, 
  Navigation, 
  Palette,
  Settings,
  Code2,
  Play,
  Download,
  Copy,
  Eye,
  EyeOff,
  Mountain,
  Trees,
  MapPin,
  Route,
  Compass,
  RotateCcw
} from 'lucide-react'

// Register GSAP plugins
gsap.registerPlugin(useGSAP)

interface MapElement {
  id: string
  type: 'region' | 'waypoint' | 'landmark' | 'trail' | 'label' | 'hud'
  symbolId?: string
  position: { x: number; y: number }
  properties: Record<string, any>
  visible: boolean
  animatable: boolean
}

interface MapTheme {
  name: string
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    text: string
    trail: string
    waypoint: string
    landmark: string
  }
  audience: string
}

const MAP_THEMES: MapTheme[] = [
  {
    name: 'Professional',
    audience: 'Business Leaders',
    colors: {
      primary: '#1e40af',
      secondary: '#64748b',
      accent: '#3b82f6',
      background: '#f8fafc',
      text: '#1e293b',
      trail: '#2563eb',
      waypoint: '#0ea5e9',
      landmark: '#6b7280'
    }
  },
  {
    name: 'Educational',
    audience: 'Teachers & Students',
    colors: {
      primary: '#059669',
      secondary: '#78716c',
      accent: '#10b981',
      background: '#f0fdf4',
      text: '#14532d',
      trail: '#16a34a',
      waypoint: '#22c55e',
      landmark: '#84cc16'
    }
  },
  {
    name: 'Community',
    audience: 'Nonprofit Leaders',
    colors: {
      primary: '#7c3aed',
      secondary: '#a1a1aa',
      accent: '#8b5cf6',
      background: '#faf5ff',
      text: '#581c87',
      trail: '#9333ea',
      waypoint: '#a855f7',
      landmark: '#c084fc'
    }
  },
  {
    name: 'Creative',
    audience: 'Artists & Designers',
    colors: {
      primary: '#dc2626',
      secondary: '#f59e0b',
      accent: '#ef4444',
      background: '#fef2f2',
      text: '#7f1d1d',
      trail: '#f97316',
      waypoint: '#fb923c',
      landmark: '#fbbf24'
    }
  }
]

const VIEWPORT_SIZES = [
  { name: 'Desktop', width: 1440, height: 900, icon: '🖥️' },
  { name: 'Tablet Portrait', width: 834, height: 1194, icon: '📱' },
  { name: 'Mobile', width: 390, height: 844, icon: '📱' }
]

const SYMBOL_CATEGORIES = {
  waypoints: [
    { id: 'waypoint-milestone', name: 'Milestone', icon: '🎯' },
    { id: 'waypoint-checkpoint', name: 'Checkpoint', icon: '◆' },
    { id: 'waypoint-destination', name: 'Destination', icon: '⭐' }
  ],
  landmarks: [
    { id: 'landmark-mountain', name: 'Mountain', icon: '⛰️' },
    { id: 'landmark-tree', name: 'Tree', icon: '🌳' },
    { id: 'landmark-river', name: 'River', icon: '🏞️' },
    { id: 'landmark-signpost', name: 'Signpost', icon: '🪧' }
  ],
  hud: [
    { id: 'hud-compass', name: 'Compass', icon: '🧭' },
    { id: 'cta-marker', name: 'CTA Marker', icon: '💫' }
  ]
}

export default function TrailGuideMapBuilder() {
  const mapRef = useRef<SVGSVGElement>(null)
  const [selectedViewport, setSelectedViewport] = useState(VIEWPORT_SIZES[0])
  const [selectedTheme, setSelectedTheme] = useState(MAP_THEMES[0])
  const [elements, setElements] = useState<MapElement[]>([
    // Add some default elements to show the functionality
    {
      id: 'demo-milestone-1',
      type: 'waypoint',
      symbolId: 'waypoint-milestone',
      position: { x: 200, y: 300 },
      properties: { theme: 'Professional', scale: 1, rotation: 0 },
      visible: true,
      animatable: true
    },
    {
      id: 'demo-checkpoint-1',
      type: 'waypoint',
      symbolId: 'waypoint-checkpoint',
      position: { x: 400, y: 250 },
      properties: { theme: 'Professional', scale: 1, rotation: 0 },
      visible: true,
      animatable: true
    },
    {
      id: 'demo-tree-1',
      type: 'landmark',
      symbolId: 'landmark-tree',
      position: { x: 300, y: 400 },
      properties: { theme: 'Professional', scale: 1, rotation: 0 },
      visible: true,
      animatable: true
    },
    {
      id: 'demo-mountain-1',
      type: 'landmark',
      symbolId: 'landmark-mountain',
      position: { x: 600, y: 150 },
      properties: { theme: 'Professional', scale: 1, rotation: 0 },
      visible: true,
      animatable: true
    }
  ])
  const [selectedTool, setSelectedTool] = useState<string>('waypoint-milestone')
  const [showGrid, setShowGrid] = useState(true)
  const [showPreview, setShowPreview] = useState(false)
  const [animationSpeed, setAnimationSpeed] = useState(2)
  const [reducedMotion, setReducedMotion] = useState(false)

  // Add element to map
  const addElement = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    if (!mapRef.current) return
    
    const rect = mapRef.current.getBoundingClientRect()
    const x = Math.round(((e.clientX - rect.left) / rect.width) * selectedViewport.width)
    const y = Math.round(((e.clientY - rect.top) / rect.height) * selectedViewport.height)
    
    const newElement: MapElement = {
      id: `element-${Date.now()}`,
      type: selectedTool.startsWith('waypoint') ? 'waypoint' : 
            selectedTool.startsWith('landmark') ? 'landmark' : 'hud',
      symbolId: selectedTool,
      position: { x, y },
      properties: {
        theme: selectedTheme.name,
        scale: 1,
        rotation: 0
      },
      visible: true,
      animatable: true
    }
    
    setElements(prev => [...prev, newElement])
    
    toast.success('Element added!', {
      description: `Added ${selectedTool} at (${x}, ${y})`
    })
  }, [selectedTool, selectedViewport, selectedTheme])

  // Generate complete map SVG
  const generateMapSVG = useCallback(() => {
    const { width, height } = selectedViewport
    const theme = selectedTheme.colors
    
    // Map elements
    const mapElements = elements
      .filter(el => el.visible)
      .map(element => {
        const { x, y } = element.position
        const { scale = 1, rotation = 0 } = element.properties
        const transform = `translate(${x}, ${y}) scale(${scale}) rotate(${rotation})`
        
        return `  <use href="#${element.symbolId}" 
                   transform="${transform}" 
                   class="${element.type} ${element.animatable ? 'animated' : ''}"
                   id="${element.id}" />`
      }).join('\n')
    
    return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" 
             xmlns="http://www.w3.org/2000/svg" 
             preserveAspectRatio="xMidYMid meet"
             style="--theme-primary: ${theme.primary}; --theme-secondary: ${theme.secondary}; --theme-trail: ${theme.trail};">
  <defs>
    <!-- Include symbol definitions here -->
    <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="${theme.secondary}" stroke-width="0.5" opacity="0.3"/>
    </pattern>
  </defs>
  
  <!-- Background -->
  <rect width="100%" height="100%" fill="${theme.background}"/>
  ${showGrid ? '<rect width="100%" height="100%" fill="url(#grid)"/>' : ''}
  
  <!-- Base Region -->
  <path d="M100 200 Q300 150 500 200 Q700 250 600 400 Q400 450 200 400 Q50 350 100 200 Z" 
        fill="${theme.background}" stroke="${theme.secondary}" stroke-width="1" opacity="0.8"/>
  
  <!-- Sample Trail -->
  <path d="M150 250 Q300 200 450 250 Q600 300 750 250" 
        stroke="${theme.trail}" stroke-width="3" fill="none" stroke-linecap="round"
        id="sample-trail"/>
  
  <!-- Elements -->
  <g class="elements-layer">
${mapElements}
  </g>
  
  <!-- Labels -->
  <text x="150" y="280" fill="${theme.text}" font-size="14">Sample Trail</text>
  
  <!-- Compass -->
  <use href="#hud-compass" transform="translate(50, 50)"/>
</svg>`
  }, [selectedViewport, selectedTheme, elements, showGrid])

  // Generate GSAP animation code
  const generateAnimationCode = useCallback(() => {
    const motionSafeWrapper = reducedMotion ? 
      '// Reduced motion version\nif (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {\n' : ''
    const motionSafeClose = reducedMotion ? '\n}' : ''
    
    const trailAnimations = `// Trail drawing animation
gsap.fromTo("#sample-trail", 
  { strokeDashoffset: 1000 },
  { 
    strokeDashoffset: 0, 
    duration: ${animationSpeed}, 
    ease: "power2.out" 
  }
)`
    
    const elementAnimations = elements
      .filter(el => el.animatable && el.visible)
      .map((el, index) => {
        return `gsap.fromTo("#${el.id}", 
  { scale: 0, opacity: 0 },
  { 
    scale: ${el.properties.scale || 1}, 
    opacity: 1, 
    duration: 0.6, 
    ease: "back.out(1.7)",
    delay: ${index * 0.1}
  }
)`
      }).join('\n\n')
    
    return `${motionSafeWrapper}// TrailGuide Map Animation
// Using stroke-dasharray/offset for trail drawing

${trailAnimations}

${elementAnimations ? '// Element animations\n' + elementAnimations : ''}
${motionSafeClose}

// Accessibility: Respect user preferences
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
if (prefersReducedMotion.matches) {
  gsap.set(".animated", { duration: 0.1 });
}`
  }, [elements, animationSpeed, reducedMotion])

  // Animate map preview
  const animateMap = useCallback(() => {
    if (!mapRef.current) return
    
    setShowPreview(true)
    
    // Reset all animations
    gsap.set('#sample-trail', { strokeDashoffset: 1000 })
    gsap.set('.animated', { scale: 0, opacity: 0 })
    
    // Create timeline
    const tl = gsap.timeline()
    
    // Animate trail first
    tl.to('#sample-trail', {
      strokeDashoffset: 0,
      duration: animationSpeed,
      ease: "power2.out"
    })
    
    // Then animate elements
    elements
      .filter(el => el.animatable && el.visible)
      .forEach((el, index) => {
        tl.to(`#${el.id}`, {
          scale: el.properties.scale || 1,
          opacity: 1,
          duration: 0.6,
          ease: "back.out(1.7)"
        }, index * 0.1 - 0.3)
      })
    
    toast.success('Map animation started!', {
      description: `Animating trail and ${elements.filter(el => el.visible).length} elements`
    })
  }, [elements, animationSpeed])

  // Copy code to clipboard
  const copyCode = useCallback((code: string, type: string) => {
    navigator.clipboard.writeText(code).then(() => {
      toast.success(`${type} copied!`, {
        description: 'Code copied to clipboard'
      })
    })
  }, [])

  // Download code as file
  const downloadFile = useCallback((content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
    
    toast.success('File downloaded!', {
      description: `Downloaded ${filename}`
    })
  }, [])

  // Clear all elements
  const clearElements = useCallback(() => {
    setElements([])
    toast.success('All elements cleared!', {
      description: 'Canvas has been reset'
    })
  }, [])

  const mapSVG = generateMapSVG()
  const animationCode = generateAnimationCode()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto p-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Map className="h-10 w-10 text-blue-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              TrailGuide Map Builder
            </h1>
            <Navigation className="h-10 w-10 text-indigo-600" />
          </div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Vector-first, systematic SVG map creation with comprehensive theming and animation controls.
            Build scalable, accessible navigation maps for any audience.
          </p>
          <div className="flex items-center justify-center gap-4 mt-4">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Layers className="h-3 w-3" />
              {elements.filter(el => el.visible).length} elements
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Palette className="h-3 w-3" />
              {selectedTheme.name} theme
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              {selectedViewport.name}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Map Canvas */}
          <div className="xl:col-span-3 space-y-6">
            <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-3">
                      <Map className="h-5 w-5 text-blue-600" />
                      Map Canvas - {selectedViewport.name}
                    </CardTitle>
                    <CardDescription>
                      Click to place {selectedTool.replace('-', ' ')} elements on your map.
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={animateMap}
                      disabled={elements.length === 0}
                      className="flex items-center gap-2"
                    >
                      <Play className="h-4 w-4" />
                      Preview
                    </Button>
                    <Button
                      onClick={clearElements}
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <RotateCcw className="h-4 w-4" />
                      Clear
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="relative border-2 border-dashed border-gray-300 rounded-lg overflow-hidden bg-white">
                  <svg
                    ref={mapRef}
                    width="100%"
                    height="600"
                    viewBox={`0 0 ${selectedViewport.width} ${selectedViewport.height}`}
                    className="cursor-crosshair trailguide-map"
                    onClick={addElement}
                    style={{ 
                      aspectRatio: `${selectedViewport.width} / ${selectedViewport.height}`,
                      backgroundColor: selectedTheme.colors.background,
                      '--theme-primary': selectedTheme.colors.primary,
                      '--theme-secondary': selectedTheme.colors.secondary,
                      '--theme-accent': selectedTheme.colors.accent,
                      '--theme-background': selectedTheme.colors.background,
                      '--theme-text': selectedTheme.colors.text,
                      '--theme-trail': selectedTheme.colors.trail,
                      '--theme-waypoint': selectedTheme.colors.waypoint,
                      '--theme-landmark': selectedTheme.colors.landmark,
                    } as React.CSSProperties}
                  >
                    {/* Symbol Definitions */}
                    <defs>
                      {/* Grid pattern */}
                      <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                        <path d="M 20 0 L 0 0 0 20" fill="none" stroke={selectedTheme.colors.secondary} strokeWidth="0.5" opacity="0.3"/>
                      </pattern>
                      
                      {/* Region patterns */}
                      <pattern id="region-texture" patternUnits="userSpaceOnUse" width="40" height="40">
                        <circle cx="20" cy="20" r="1" fill={selectedTheme.colors.secondary} opacity="0.1"/>
                      </pattern>

                      {/* Waypoint Symbols */}
                      <symbol id="waypoint-milestone" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="8" fill={selectedTheme.colors.waypoint} stroke={selectedTheme.colors.primary} strokeWidth="2"/>
                        <circle cx="12" cy="12" r="3" fill="#ffffff"/>
                        <title>Milestone Waypoint</title>
                      </symbol>
                      
                      <symbol id="waypoint-checkpoint" viewBox="0 0 24 24">
                        <polygon points="12,2 22,12 12,22 2,12" fill="#10b981" stroke="#047857" strokeWidth="2"/>
                        <circle cx="12" cy="12" r="4" fill="#ffffff"/>
                        <title>Checkpoint Waypoint</title>
                      </symbol>
                      
                      <symbol id="waypoint-destination" viewBox="0 0 24 24">
                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" 
                              fill="#f59e0b" stroke="#d97706" strokeWidth="2"/>
                        <title>Destination Waypoint</title>
                      </symbol>

                      {/* Landmark Symbols */}
                      <symbol id="landmark-mountain" viewBox="0 0 40 40">
                        <path d="M5 35 L15 15 L20 20 L25 10 L35 35 Z" 
                              fill="#6b7280" stroke="#374151" strokeWidth="1.5"/>
                        <path d="M15 15 L20 20 L25 10" fill="#9ca3af" opacity="0.7"/>
                        <title>Mountain Landmark</title>
                      </symbol>
                      
                      <symbol id="landmark-tree" viewBox="0 0 24 24">
                        <rect x="11" y="16" width="2" height="6" fill="#8b5cf6"/>
                        <circle cx="12" cy="12" r="6" fill="#10b981"/>
                        <circle cx="12" cy="12" r="4" fill="#34d399" opacity="0.8"/>
                        <title>Tree Landmark</title>
                      </symbol>
                      
                      <symbol id="landmark-river" viewBox="0 0 60 20">
                        <path d="M0 10 Q15 5 30 10 T60 10" 
                              stroke="#06b6d4" strokeWidth="3" fill="none" opacity="0.8"/>
                        <path d="M0 12 Q15 7 30 12 T60 12" 
                              stroke="#67e8f9" strokeWidth="1.5" fill="none" opacity="0.6"/>
                        <title>River Landmark</title>
                      </symbol>
                      
                      <symbol id="landmark-signpost" viewBox="0 0 24 24">
                        <rect x="11.5" y="4" width="1" height="16" fill="#8b5cf6"/>
                        <rect x="6" y="8" width="12" height="3" rx="1.5" fill="#f3f4f6" stroke="#6b7280"/>
                        <rect x="4" y="13" width="8" height="3" rx="1.5" fill="#f3f4f6" stroke="#6b7280"/>
                        <title>Signpost Landmark</title>
                      </symbol>

                      {/* HUD Elements */}
                      <symbol id="hud-compass" viewBox="0 0 48 48">
                        <circle cx="24" cy="24" r="20" fill="#ffffff" stroke="#6b7280" strokeWidth="2" opacity="0.9"/>
                        <path d="M24 8 L28 20 L24 18 L20 20 Z" fill="#ef4444"/>
                        <path d="M24 40 L20 28 L24 30 L28 28 Z" fill="#6b7280"/>
                        <text x="24" y="12" textAnchor="middle" fontSize="6" fill="#374151">N</text>
                        <title>Navigation Compass</title>
                      </symbol>
                      
                      <symbol id="cta-marker" viewBox="0 0 32 32">
                        <circle cx="16" cy="16" r="14" fill="#8b5cf6" stroke="#7c3aed" strokeWidth="2"/>
                        <circle cx="16" cy="16" r="6" fill="#ffffff"/>
                        <title>Call to Action</title>
                      </symbol>
                    </defs>

                    {/* Background */}
                    <rect width="100%" height="100%" fill={selectedTheme.colors.background}/>
                    {showGrid && <rect width="100%" height="100%" fill="url(#grid)"/>}
                    
                    {/* Base Regions Layer */}
                    <g className="regions-layer">
                      <path 
                        d="M100 200 Q300 150 500 200 Q700 250 600 400 Q400 450 200 400 Q50 350 100 200 Z" 
                        fill="url(#region-texture)"
                        stroke={selectedTheme.colors.secondary} 
                        strokeWidth="1" 
                        opacity="0.8"
                      />
                    </g>
                    
                    {/* Trails Layer */}
                    <g className="trails-layer">
                      <path 
                        d="M150 250 Q300 200 450 250 Q600 300 750 250" 
                        stroke={selectedTheme.colors.trail} 
                        strokeWidth="3" 
                        fill="none" 
                        strokeLinecap="round"
                        strokeDasharray="1000"
                        strokeDashoffset="1000"
                        id="sample-trail"
                      />
                    </g>
                    
                    {/* Elements Layer */}
                    <g className="elements-layer">
                      {elements.filter(el => el.visible).map(element => {
                        const { x, y } = element.position
                        const { scale = 1, rotation = 0 } = element.properties
                        return (
                          <use
                            key={element.id}
                            href={`#${element.symbolId}`}
                            transform={`translate(${x}, ${y}) scale(${scale}) rotate(${rotation})`}
                            className={`${element.type} ${element.animatable ? 'animated' : ''}`}
                            id={element.id}
                            style={{ cursor: 'pointer' }}
                          />
                        )
                      })}
                    </g>
                    
                    {/* Labels Layer */}
                    <g className="labels-layer">
                      <text x="150" y="280" fill={selectedTheme.colors.text} fontSize="14" fontFamily="Inter, system-ui, sans-serif">
                        Sample Trail
                      </text>
                    </g>
                    
                    {/* HUD Layer */}
                    <g className="hud-layer">
                      <use href="#hud-compass" transform="translate(50, 50)" className="hud"/>
                    </g>
                  </svg>
                </div>
                
                <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
                  <span>Canvas: {selectedViewport.width}×{selectedViewport.height}px</span>
                  <span>{elements.filter(el => el.visible).length} visible elements</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Controls Panel */}
          <div className="space-y-6">
            {/* Viewport & Theme */}
            <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Settings className="h-5 w-5 text-indigo-600" />
                  Map Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Viewport Size</Label>
                  <Select
                    value={selectedViewport.name}
                    onValueChange={(value) => {
                      const viewport = VIEWPORT_SIZES.find(v => v.name === value)
                      if (viewport) setSelectedViewport(viewport)
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {VIEWPORT_SIZES.map(size => (
                        <SelectItem key={size.name} value={size.name}>
                          {size.icon} {size.name} ({size.width}×{size.height})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium">Theme</Label>
                  <Select
                    value={selectedTheme.name}
                    onValueChange={(value) => {
                      const theme = MAP_THEMES.find(t => t.name === value)
                      if (theme) setSelectedTheme(theme)
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {MAP_THEMES.map(theme => (
                        <SelectItem key={theme.name} value={theme.name}>
                          {theme.name} - {theme.audience}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Show Grid</Label>
                  <Switch
                    checked={showGrid}
                    onCheckedChange={setShowGrid}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Reduced Motion</Label>
                  <Switch
                    checked={reducedMotion}
                    onCheckedChange={setReducedMotion}
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium">
                    Animation Speed: {animationSpeed}s
                  </Label>
                  <Slider
                    value={[animationSpeed]}
                    onValueChange={([value]) => setAnimationSpeed(value)}
                    min={0.5}
                    max={5}
                    step={0.1}
                    className="w-full"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Tool Selection */}
            <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Mountain className="h-5 w-5 text-green-600" />
                  Element Tools
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(SYMBOL_CATEGORIES).map(([category, symbols]) => (
                  <div key={category}>
                    <Label className="text-sm font-medium capitalize mb-2 block">
                      {category}
                    </Label>
                    <div className="grid grid-cols-1 gap-2">
                      {symbols.map(symbol => (
                        <Button
                          key={symbol.id}
                          variant={selectedTool === symbol.id ? "default" : "outline"}
                          onClick={() => setSelectedTool(symbol.id)}
                          className="flex items-center gap-2 justify-start"
                          size="sm"
                        >
                          <span>{symbol.icon}</span>
                          {symbol.name}
                        </Button>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Export */}
            <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Code2 className="h-5 w-5 text-purple-600" />
                  Export
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <Button
                    onClick={() => copyCode(mapSVG, 'SVG Map')}
                    className="w-full flex items-center gap-2"
                    size="sm"
                  >
                    <Copy className="h-3 w-3" />
                    Copy SVG
                  </Button>
                  <Button
                    onClick={() => copyCode(animationCode, 'Animation Code')}
                    className="w-full flex items-center gap-2"
                    size="sm"
                    variant="outline"
                  >
                    <Copy className="h-3 w-3" />
                    Copy GSAP
                  </Button>
                  <Button
                    onClick={() => downloadFile(mapSVG, 'trailguide-map.svg')}
                    className="w-full flex items-center gap-2"
                    size="sm"
                    variant="outline"
                  >
                    <Download className="h-3 w-3" />
                    Download SVG
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
