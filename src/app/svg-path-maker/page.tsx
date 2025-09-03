'use client'

import React, { useState, useRef, useCallback, useEffect } from 'react'
import { gsap } from 'gsap'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'
import { useGSAP } from '@gsap/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { 
  Paintbrush, 
  Copy, 
  Download, 
  RotateCcw, 
  Play, 
  Square, 
  Palette,
  Settings,
  Code2,
  Zap,
  Mouse,
  Eye
} from 'lucide-react'

// Register GSAP plugins
gsap.registerPlugin(MotionPathPlugin, useGSAP)

interface Point {
  x: number
  y: number
}

interface Trail {
  id: string
  points: Point[]
  pathData: string
  style: {
    stroke: string
    strokeWidth: number
    fill: string
    strokeDasharray: string
    strokeLinecap: 'butt' | 'round' | 'square'
    strokeLinejoin: 'miter' | 'round' | 'bevel'
  }
}

interface PathStyle {
  name: string
  stroke: string
  strokeWidth: number
  fill: string
  strokeDasharray: string
  strokeLinecap: 'butt' | 'round' | 'square'
  strokeLinejoin: 'miter' | 'round' | 'bevel'
}

const PRESET_STYLES: PathStyle[] = [
  {
    name: 'Smooth Line',
    stroke: '#3b82f6',
    strokeWidth: 3,
    fill: 'none',
    strokeDasharray: '',
    strokeLinecap: 'round',
    strokeLinejoin: 'round'
  },
  {
    name: 'Dashed Line',
    stroke: '#ef4444',
    strokeWidth: 2,
    fill: 'none',
    strokeDasharray: '5,5',
    strokeLinecap: 'round',
    strokeLinejoin: 'round'
  },
  {
    name: 'Dotted Path',
    stroke: '#10b981',
    strokeWidth: 4,
    fill: 'none',
    strokeDasharray: '2,8',
    strokeLinecap: 'round',
    strokeLinejoin: 'round'
  },
  {
    name: 'Thick Brush',
    stroke: '#8b5cf6',
    strokeWidth: 8,
    fill: 'none',
    strokeDasharray: '',
    strokeLinecap: 'round',
    strokeLinejoin: 'round'
  },
  {
    name: 'Neon Glow',
    stroke: '#06b6d4',
    strokeWidth: 3,
    fill: 'none',
    strokeDasharray: '',
    strokeLinecap: 'round',
    strokeLinejoin: 'round'
  },
  {
    name: 'Artistic Stroke',
    stroke: '#f59e0b',
    strokeWidth: 6,
    fill: 'none',
    strokeDasharray: '15,5,5,5',
    strokeLinecap: 'round',
    strokeLinejoin: 'round'
  }
]

const COLORS = [
  '#3b82f6', '#ef4444', '#10b981', '#8b5cf6', '#f59e0b', '#06b6d4',
  '#ec4899', '#84cc16', '#f97316', '#6366f1', '#14b8a6', '#f43f5e'
]

export default function SVGPathMaker() {
  const canvasRef = useRef<SVGSVGElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [trails, setTrails] = useState<Trail[]>([])
  const [currentTrail, setCurrentTrail] = useState<Point[]>([])
  const [selectedStyle, setSelectedStyle] = useState<PathStyle>(PRESET_STYLES[0])
  const [customStyle, setCustomStyle] = useState<PathStyle>(PRESET_STYLES[0])
  const [animationSpeed, setAnimationSpeed] = useState(2)
  const [showPreview, setShowPreview] = useState(false)
  const [canvasHeight, setCanvasHeight] = useState(500)
  const [canvasWidth, setCanvasWidth] = useState(1200)

  // Convert points to SVG path data
  const pointsToPath = useCallback((points: Point[]): string => {
    if (points.length < 2) return ''
    
    let path = `M ${points[0].x} ${points[0].y}`
    
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1]
      const curr = points[i]
      const next = points[i + 1]
      
      if (i === 1) {
        path += ` L ${curr.x} ${curr.y}`
      } else if (next) {
        // Smooth curve using quadratic bezier
        const cpx = prev.x + (curr.x - prev.x) * 0.5
        const cpy = prev.y + (curr.y - prev.y) * 0.5
        path += ` Q ${cpx} ${cpy} ${curr.x} ${curr.y}`
      } else {
        path += ` L ${curr.x} ${curr.y}`
      }
    }
    
    return path
  }, [])

  // Handle mouse events for drawing
  const handleMouseDown = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    if (!canvasRef.current) return
    
    const rect = canvasRef.current.getBoundingClientRect()
    const svgPoint = {
      x: Math.round(((e.clientX - rect.left) / rect.width) * canvasWidth),
      y: Math.round(((e.clientY - rect.top) / rect.height) * canvasHeight)
    }
    
    setIsDrawing(true)
    setCurrentTrail([svgPoint])
  }, [canvasWidth, canvasHeight])

  const handleMouseMove = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    if (!isDrawing || !canvasRef.current) return
    
    const rect = canvasRef.current.getBoundingClientRect()
    const svgPoint = {
      x: Math.round(((e.clientX - rect.left) / rect.width) * canvasWidth),
      y: Math.round(((e.clientY - rect.top) / rect.height) * canvasHeight)
    }
    
    setCurrentTrail(prev => [...prev, svgPoint])
  }, [isDrawing, canvasWidth, canvasHeight])

  const handleMouseUp = useCallback(() => {
    if (!isDrawing || currentTrail.length < 2) {
      setIsDrawing(false)
      setCurrentTrail([])
      return
    }
    
    const pathData = pointsToPath(currentTrail)
    const newTrail: Trail = {
      id: `trail-${Date.now()}`,
      points: currentTrail,
      pathData,
      style: { ...customStyle }
    }
    
    setTrails(prev => [...prev, newTrail])
    setCurrentTrail([])
    setIsDrawing(false)
    
    toast.success('Path created!', {
      description: `Added new path with ${currentTrail.length} points`
    })
  }, [isDrawing, currentTrail, pointsToPath, customStyle])

  // Generate complete SVG code
  const generateSVGCode = useCallback(() => {
    if (trails.length === 0) return ''
    
    const svgContent = trails.map((trail, index) => {
      const styleProps = [
        `stroke="${trail.style.stroke}"`,
        `stroke-width="${trail.style.strokeWidth}"`,
        `fill="${trail.style.fill}"`,
        trail.style.strokeDasharray && `stroke-dasharray="${trail.style.strokeDasharray}"`,
        `stroke-linecap="${trail.style.strokeLinecap}"`,
        `stroke-linejoin="${trail.style.strokeLinejoin}"`
      ].filter(Boolean).join(' ')
      
      return `  <path id="path-${index}" d="${trail.pathData}" ${styleProps} />`
    }).join('\n')
    
    return `<svg width="${canvasWidth}" height="${canvasHeight}" viewBox="0 0 ${canvasWidth} ${canvasHeight}" xmlns="http://www.w3.org/2000/svg">
${svgContent}
</svg>`
  }, [trails, canvasWidth, canvasHeight])

  // Generate path coordinates info
  const generatePathInfo = useCallback(() => {
    if (trails.length === 0) return ''
    
    return trails.map((trail, index) => {
      const pointCount = trail.points.length
      const startPoint = trail.points[0]
      const endPoint = trail.points[pointCount - 1]
      const pathLength = Math.round(trail.pathData.length)
      
      return `Path ${index + 1}:
  • ${pointCount} points
  • Start: (${startPoint.x}, ${startPoint.y})
  • End: (${endPoint.x}, ${endPoint.y})
  • Path data length: ${pathLength} characters
  • Style: ${trail.style.stroke}, ${trail.style.strokeWidth}px`
    }).join('\n\n')
  }, [trails])

  // Generate GSAP animation code
  const generateGSAPCode = useCallback(() => {
    if (trails.length === 0) return ''
    
    const animations = trails.map((trail, index) => {
      return `// Animate path ${index + 1}
gsap.fromTo("#path-${index}", 
  { 
    drawSVG: "0%" 
  },
  { 
    drawSVG: "100%", 
    duration: ${animationSpeed}, 
    ease: "power2.out",
    delay: ${index * 0.3}
  }
)`
    }).join('\n\n')
    
    return `// GSAP SVG Path Animation
// Make sure to include: gsap.registerPlugin(DrawSVGPlugin)

${animations}

// Alternative: Animate all paths together
gsap.fromTo(".animated-path", 
  { drawSVG: "0%" },
  { 
    drawSVG: "100%", 
    duration: ${animationSpeed}, 
    ease: "power2.out",
    stagger: 0.3 
  }
)`
  }, [trails, animationSpeed])

  // Animate path drawing
  const animatePaths = useCallback(() => {
    if (trails.length === 0) return
    
    setShowPreview(true)
    
    // Reset all paths
    trails.forEach((_, index) => {
      const path = document.querySelector(`#preview-path-${index}`)
      if (path) {
        gsap.set(path, { strokeDasharray: 1000, strokeDashoffset: 1000 })
      }
    })
    
    // Animate each path
    trails.forEach((_, index) => {
      gsap.to(`#preview-path-${index}`, {
        strokeDashoffset: 0,
        duration: animationSpeed,
        ease: "power2.out",
        delay: index * 0.3
      })
    })
    
    toast.success('Animation started!', {
      description: `Animating ${trails.length} paths`
    })
  }, [trails, animationSpeed])

  // Clear all paths
  const clearPaths = useCallback(() => {
    setTrails([])
    setCurrentTrail([])
    setIsDrawing(false)
    setShowPreview(false)
    toast.success('Canvas cleared!')
  }, [])

  // Copy code to clipboard
  const copyToClipboard = useCallback((text: string, type: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success(`${type} copied!`, {
        description: 'Code copied to clipboard'
      })
    })
  }, [])

  // Download code as file
  const downloadCode = useCallback((code: string, filename: string) => {
    const blob = new Blob([code], { type: 'text/plain' })
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

  const svgCode = generateSVGCode()
  const gsapCode = generateGSAPCode()
  const pathInfo = generatePathInfo()

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="container mx-auto p-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Paintbrush className="h-10 w-10 text-indigo-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              SVG Path Maker
            </h1>
            <Zap className="h-10 w-10 text-purple-600" />
          </div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Draw trails on the canvas to create SVG paths with GSAP animations. 
            Customize styles, generate code, and export your creations.
          </p>
          <div className="flex items-center justify-center gap-4 mt-4">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Mouse className="h-3 w-3" />
              {trails.length} paths created
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              Interactive preview
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Drawing Canvas */}
          <div className="xl:col-span-2 space-y-6">
            {/* Canvas Dimensions */}
            <Card className="shadow-lg border-0 bg-blue-50/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-blue-900">
                  <Settings className="h-5 w-5 text-blue-600" />
                  Canvas Dimensions
                </CardTitle>
                <CardDescription>
                  Set your canvas size before drawing. Clear all paths to change dimensions.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium mb-2 block text-blue-800">
                      Width (px)
                    </label>
                    <Input
                      type="number"
                      value={canvasWidth}
                      onChange={(e) => {
                        const value = parseInt(e.target.value) || 800
                        if (value >= 800 && value <= 2400) {
                          setCanvasWidth(value)
                        }
                      }}
                      min={800}
                      max={2400}
                      step={100}
                      disabled={trails.length > 0}
                      className="bg-white"
                    />
                    <p className="text-xs text-blue-600 mt-1">Range: 800-2400px</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block text-blue-800">
                      Height (px)
                    </label>
                    <Input
                      type="number"
                      value={canvasHeight}
                      onChange={(e) => {
                        const value = parseInt(e.target.value) || 300
                        if (value >= 300 && value <= 1200) {
                          setCanvasHeight(value)
                        }
                      }}
                      min={300}
                      max={1200}
                      step={50}
                      disabled={trails.length > 0}
                      className="bg-white"
                    />
                    <p className="text-xs text-blue-600 mt-1">Range: 300-1200px</p>
                  </div>
                </div>
                {trails.length > 0 && (
                  <div className="mt-4 p-3 bg-blue-100 rounded-lg">
                    <p className="text-sm text-blue-800 flex items-center gap-2">
                      <Square className="h-4 w-4" />
                      Clear all paths to adjust canvas dimensions
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Paintbrush className="h-5 w-5 text-indigo-600" />
                  Drawing Canvas
                </CardTitle>
                <CardDescription>
                  Click and drag to draw paths. Each stroke creates a new SVG path.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <svg
                    ref={canvasRef}
                    width="100%"
                    height={canvasHeight}
                    viewBox={`0 0 ${canvasWidth} ${canvasHeight}`}
                    className="border-2 border-dashed border-gray-300 rounded-lg bg-white cursor-crosshair"
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                  >
                    {/* Grid pattern */}
                    <defs>
                      <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f0f0f0" strokeWidth="1"/>
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                    
                    {/* Completed trails */}
                    {trails.map(trail => (
                      <path
                        key={trail.id}
                        d={trail.pathData}
                        stroke={trail.style.stroke}
                        strokeWidth={trail.style.strokeWidth}
                        fill={trail.style.fill}
                        strokeDasharray={trail.style.strokeDasharray}
                        strokeLinecap={trail.style.strokeLinecap}
                        strokeLinejoin={trail.style.strokeLinejoin}
                        className="drop-shadow-sm"
                      />
                    ))}
                    
                    {/* Current drawing trail */}
                    {currentTrail.length > 1 && (
                      <path
                        d={pointsToPath(currentTrail)}
                        stroke={customStyle.stroke}
                        strokeWidth={customStyle.strokeWidth}
                        fill={customStyle.fill}
                        strokeDasharray={customStyle.strokeDasharray}
                        strokeLinecap={customStyle.strokeLinecap}
                        strokeLinejoin={customStyle.strokeLinejoin}
                        opacity="0.7"
                      />
                    )}
                  </svg>
                  
                  {/* Drawing instructions */}
                  {trails.length === 0 && !isDrawing && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="text-center text-gray-400">
                        <Mouse className="h-12 w-12 mx-auto mb-2" />
                        <p className="text-lg font-medium">Click and drag to draw paths</p>
                        <p className="text-sm">Each stroke creates a new SVG path</p>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-between items-center mt-4">
                  <div className="flex gap-2">
                    <Button
                      onClick={animatePaths}
                      disabled={trails.length === 0}
                      className="flex items-center gap-2"
                    >
                      <Play className="h-4 w-4" />
                      Preview Animation
                    </Button>
                    <Button
                      variant="outline"
                      onClick={clearPaths}
                      disabled={trails.length === 0}
                      className="flex items-center gap-2"
                    >
                      <RotateCcw className="h-4 w-4" />
                      Clear All
                    </Button>
                  </div>
                  
                  <div className="text-sm text-gray-500">
                    Canvas: {canvasWidth}×{canvasHeight}px • {trails.length} paths
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Animation Preview */}
            {showPreview && (
              <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Eye className="h-5 w-5 text-purple-600" />
                    Animation Preview
                  </CardTitle>
                  <CardDescription>
                    Watch your paths animate with GSAP draw effects.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <svg
                    width="100%"
                    height={Math.min(400, canvasHeight)}
                    viewBox={`0 0 ${canvasWidth} ${canvasHeight}`}
                    className="border rounded-lg bg-gray-900"
                  >
                    {trails.map((trail, index) => (
                      <path
                        key={`preview-${trail.id}`}
                        id={`preview-path-${index}`}
                        d={trail.pathData}
                        stroke={trail.style.stroke}
                        strokeWidth={trail.style.strokeWidth}
                        fill={trail.style.fill}
                        strokeDasharray="1000"
                        strokeDashoffset="1000"
                        strokeLinecap={trail.style.strokeLinecap}
                        strokeLinejoin={trail.style.strokeLinejoin}
                        className="drop-shadow-lg"
                        style={{
                          filter: 'drop-shadow(0 0 8px currentColor)'
                        }}
                      />
                    ))}
                  </svg>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Style Controls & Code Output */}
          <div className="space-y-6">
            {/* Style Controls */}
            <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Palette className="h-5 w-5 text-purple-600" />
                  Path Styles
                </CardTitle>
                <CardDescription>
                  Customize the appearance of your SVG paths.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Preset Styles */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Preset Styles</label>
                  <Select
                    value={selectedStyle.name}
                    onValueChange={(value) => {
                      const style = PRESET_STYLES.find(s => s.name === value)
                      if (style) {
                        setSelectedStyle(style)
                        setCustomStyle(style)
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PRESET_STYLES.map(style => (
                        <SelectItem key={style.name} value={style.name}>
                          {style.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                {/* Color Picker */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Stroke Color</label>
                  <div className="grid grid-cols-6 gap-2">
                    {COLORS.map(color => (
                      <button
                        key={color}
                        onClick={() => setCustomStyle(prev => ({ ...prev, stroke: color }))}
                        className={`w-8 h-8 rounded-full border-2 transition-all ${
                          customStyle.stroke === color ? 'border-gray-900 scale-110' : 'border-gray-300'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                {/* Stroke Width */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Stroke Width: {customStyle.strokeWidth}px
                  </label>
                  <Slider
                    value={[customStyle.strokeWidth]}
                    onValueChange={([value]) => setCustomStyle(prev => ({ ...prev, strokeWidth: value }))}
                    min={1}
                    max={20}
                    step={1}
                    className="w-full"
                  />
                </div>

                {/* Line Cap */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Line Cap</label>
                  <Select
                    value={customStyle.strokeLinecap}
                    onValueChange={(value: 'butt' | 'round' | 'square') => 
                      setCustomStyle(prev => ({ ...prev, strokeLinecap: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="round">Round</SelectItem>
                      <SelectItem value="square">Square</SelectItem>
                      <SelectItem value="butt">Butt</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Animation Speed */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Animation Speed: {animationSpeed}s
                  </label>
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

            {/* Code Output */}
            <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Code2 className="h-5 w-5 text-indigo-600" />
                  Generated Code
                </CardTitle>
                <CardDescription>
                  Copy or download your SVG and GSAP animation code.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="svg" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="svg">SVG Code</TabsTrigger>
                    <TabsTrigger value="gsap">GSAP Animation</TabsTrigger>
                    <TabsTrigger value="info">Path Info</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="svg" className="space-y-3">
                    <pre className="bg-gray-900 text-green-400 p-3 rounded text-xs overflow-auto max-h-64 border">
                      <code>{svgCode || '// Draw some paths to generate SVG code!'}</code>
                    </pre>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => copyToClipboard(svgCode, 'SVG Code')}
                        disabled={!svgCode}
                        className="flex items-center gap-1"
                      >
                        <Copy className="h-3 w-3" />
                        Copy
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => downloadCode(svgCode, 'paths.svg')}
                        disabled={!svgCode}
                        className="flex items-center gap-1"
                      >
                        <Download className="h-3 w-3" />
                        Download
                      </Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="gsap" className="space-y-3">
                    <pre className="bg-gray-900 text-green-400 p-3 rounded text-xs overflow-auto max-h-64 border">
                      <code>{gsapCode || '// Draw some paths to generate GSAP code!'}</code>
                    </pre>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => copyToClipboard(gsapCode, 'GSAP Code')}
                        disabled={!gsapCode}
                        className="flex items-center gap-1"
                      >
                        <Copy className="h-3 w-3" />
                        Copy
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => downloadCode(gsapCode, 'gsap-animation.js')}
                        disabled={!gsapCode}
                        className="flex items-center gap-1"
                      >
                        <Download className="h-3 w-3" />
                        Download
                      </Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="info" className="space-y-3">
                    <pre className="bg-gray-100 text-gray-800 p-3 rounded text-sm overflow-auto max-h-64 border">
                      <code>{pathInfo || '// Draw some paths to see coordinate information!'}</code>
                    </pre>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => copyToClipboard(pathInfo, 'Path Info')}
                        disabled={!pathInfo}
                        className="flex items-center gap-1"
                      >
                        <Copy className="h-3 w-3" />
                        Copy
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => downloadCode(pathInfo, 'path-info.txt')}
                        disabled={!pathInfo}
                        className="flex items-center gap-1"
                      >
                        <Download className="h-3 w-3" />
                        Download
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
