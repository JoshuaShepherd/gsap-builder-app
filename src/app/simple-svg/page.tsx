'use client'

import React, { useState, useRef, useCallback } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { 
  Plus,
  Trash2,
  Copy,
  Download,
  Play,
  Square,
  Circle,
  Triangle,
  Type,
  MousePointer
} from 'lucide-react'

gsap.registerPlugin(useGSAP)

interface SVGElement {
  id: string
  type: 'rect' | 'circle' | 'path' | 'text'
  attributes: Record<string, any>
  content?: string
}

const CANVAS_WIDTH = 800
const CANVAS_HEIGHT = 600

export default function SimpleSVGBuilder() {
  const canvasRef = useRef<SVGSVGElement>(null)
  const [elements, setElements] = useState<SVGElement[]>([])
  const [selectedTool, setSelectedTool] = useState<'rect' | 'circle' | 'path' | 'text'>('rect')
  const [isDrawing, setIsDrawing] = useState(false)
  const [currentPath, setCurrentPath] = useState<string>('')
  const [pathPoints, setPathPoints] = useState<{x: number, y: number}[]>([])

  // Handle canvas clicks for placing elements
  const handleCanvasClick = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!canvasRef.current) return
    
    const rect = canvasRef.current.getBoundingClientRect()
    const x = Math.round(e.clientX - rect.left)
    const y = Math.round(e.clientY - rect.top)
    
    console.log('Canvas clicked at:', { x, y }, 'Tool:', selectedTool)
    
    if (selectedTool === 'path') {
      if (!isDrawing) {
        // Start new path
        setIsDrawing(true)
        setPathPoints([{ x, y }])
        setCurrentPath(`M ${x} ${y}`)
      } else {
        // Add point to current path
        const newPoints = [...pathPoints, { x, y }]
        setPathPoints(newPoints)
        setCurrentPath(prev => `${prev} L ${x} ${y}`)
      }
      return
    }

    // Create other elements
    let newElement: SVGElement
    
    switch (selectedTool) {
      case 'rect':
        newElement = {
          id: `rect-${Date.now()}`,
          type: 'rect',
          attributes: {
            x: x - 40,
            y: y - 30,
            width: 80,
            height: 60,
            fill: '#3b82f6',
            stroke: '#1e40af',
            strokeWidth: 2,
            rx: 4
          }
        }
        break
      case 'circle':
        newElement = {
          id: `circle-${Date.now()}`,
          type: 'circle',
          attributes: {
            cx: x,
            cy: y,
            r: 30,
            fill: '#10b981',
            stroke: '#047857',
            strokeWidth: 2
          }
        }
        break
      case 'text':
        newElement = {
          id: `text-${Date.now()}`,
          type: 'text',
          attributes: {
            x,
            y,
            fontSize: 24,
            fill: '#1f2937',
            fontFamily: 'Inter, sans-serif',
            fontWeight: '600'
          },
          content: 'Hello!'
        }
        break
      default:
        return
    }
    
    setElements(prev => {
      const newElements = [...prev, newElement]
      console.log('Adding element:', newElement, 'Total elements:', newElements.length)
      return newElements
    })
    
    // Animate the new element
    requestAnimationFrame(() => {
      const elementSelector = `#${newElement.id}`
      if (canvasRef.current?.querySelector(elementSelector)) {
        gsap.fromTo(elementSelector, 
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(1.7)' }
        )
      }
    })
    
    toast.success(`${selectedTool} added!`)
  }, [selectedTool, isDrawing, pathPoints])

  // Finish drawing path
  const finishPath = useCallback(() => {
    if (isDrawing && pathPoints.length > 1) {
      const newElement: SVGElement = {
        id: `path-${Date.now()}`,
        type: 'path',
        attributes: {
          d: currentPath,
          fill: 'none',
          stroke: '#ef4444',
          strokeWidth: 3,
          strokeLinecap: 'round',
          strokeLinejoin: 'round'
        }
      }
      
      setElements(prev => [...prev, newElement])
      toast.success('Path created!')
    }
    
    setIsDrawing(false)
    setCurrentPath('')
    setPathPoints([])
  }, [isDrawing, pathPoints, currentPath])

  // Delete element
  const deleteElement = useCallback((id: string) => {
    setElements(prev => prev.filter(el => el.id !== id))
    toast.success('Element deleted!')
  }, [])

  // Clear all
  const clearAll = useCallback(() => {
    setElements([])
    setIsDrawing(false)
    setCurrentPath('')
    setPathPoints([])
    toast.success('Canvas cleared!')
  }, [])

  // Generate SVG code
  const generateSVG = useCallback(() => {
    const elementMarkup = elements.map(element => {
      const attrs = Object.entries(element.attributes)
        .map(([key, value]) => `${key}="${value}"`)
        .join(' ')
      
      if (element.type === 'text') {
        return `  <text ${attrs}>${element.content || 'Text'}</text>`
      }
      
      return `  <${element.type} ${attrs} />`
    }).join('\n')

    return `<svg width="${CANVAS_WIDTH}" height="${CANVAS_HEIGHT}" viewBox="0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
${elementMarkup}
</svg>`
  }, [elements])

  // Copy to clipboard
  const copyToClipboard = useCallback(() => {
    const svgCode = generateSVG()
    navigator.clipboard.writeText(svgCode).then(() => {
      toast.success('SVG copied to clipboard!')
    })
  }, [generateSVG])

  // Download SVG
  const downloadSVG = useCallback(() => {
    const svgCode = generateSVG()
    const blob = new Blob([svgCode], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'drawing.svg'
    a.click()
    URL.revokeObjectURL(url)
    toast.success('SVG downloaded!')
  }, [generateSVG])

  // Animate elements
  const animateElements = useCallback(() => {
    if (elements.length === 0) return
    
    // Reset and animate all elements
    gsap.set('.svg-element', { scale: 0, opacity: 0 })
    gsap.to('.svg-element', {
      scale: 1,
      opacity: 1,
      duration: 0.5,
      ease: 'back.out(1.7)',
      stagger: 0.1
    })
    
    toast.success('Animation started!')
  }, [elements])

  const svgCode = generateSVG()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Simple SVG Builder</h1>
          <p className="text-gray-600">Click to place elements, draw paths, and export clean SVG code.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Canvas */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>Canvas ({CANVAS_WIDTH}×{CANVAS_HEIGHT})</CardTitle>
                <CardDescription>
                  <span className="font-medium text-blue-600">Selected: {selectedTool.toUpperCase()}</span>
                  <br />
                  {selectedTool === 'path' && isDrawing 
                    ? 'Click to add points, press Finish to complete path'
                    : `Click anywhere on the canvas to place a ${selectedTool}`
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative border-2 border-gray-300 rounded-lg bg-white overflow-hidden shadow-sm">
                  <svg
                    ref={canvasRef}
                    width="100%"
                    height="500"
                    viewBox={`0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}`}
                    className="cursor-crosshair hover:bg-gray-50 transition-colors"
                    onClick={handleCanvasClick}
                    style={{ aspectRatio: `${CANVAS_WIDTH} / ${CANVAS_HEIGHT}` }}
                  >
                    {/* Grid */}
                    <defs>
                      <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f3f4f6" strokeWidth="1"/>
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                    
                    {/* Elements */}
                    {elements.map(element => {
                      const props = { ...element.attributes, id: element.id }
                      
                      switch (element.type) {
                        case 'rect':
                          return <rect key={element.id} {...props} className="svg-element" />
                        case 'circle':
                          return <circle key={element.id} {...props} className="svg-element" />
                        case 'path':
                          return <path key={element.id} {...props} className="svg-element" />
                        case 'text':
                          return (
                            <text key={element.id} {...props} className="svg-element">
                              {element.content}
                            </text>
                          )
                        default:
                          return null
                      }
                    })}
                    
                    {/* Current path being drawn */}
                    {isDrawing && currentPath && (
                      <path
                        d={currentPath}
                        fill="none"
                        stroke="#ef4444"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeDasharray="5,5"
                        opacity="0.7"
                      />
                    )}
                  </svg>
                </div>
                
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-gray-500">
                    {elements.length} elements
                  </div>
                  
                  <div className="flex gap-2">
                    {isDrawing && (
                      <Button onClick={finishPath} size="sm">
                        Finish Path
                      </Button>
                    )}
                    <Button onClick={animateElements} variant="outline" size="sm" disabled={elements.length === 0}>
                      <Play className="h-4 w-4 mr-1" />
                      Animate
                    </Button>
                    <Button onClick={clearAll} variant="outline" size="sm" disabled={elements.length === 0}>
                      <Trash2 className="h-4 w-4 mr-1" />
                      Clear
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tools */}
          <div className="space-y-6">
            {/* Tools */}
            <Card>
              <CardHeader>
                <CardTitle>Tools</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={() => setSelectedTool('rect')}
                  variant={selectedTool === 'rect' ? 'default' : 'outline'}
                  className="w-full justify-start"
                >
                  <Square className="h-4 w-4 mr-2" />
                  Rectangle
                </Button>
                <Button
                  onClick={() => setSelectedTool('circle')}
                  variant={selectedTool === 'circle' ? 'default' : 'outline'}
                  className="w-full justify-start"
                >
                  <Circle className="h-4 w-4 mr-2" />
                  Circle
                </Button>
                <Button
                  onClick={() => setSelectedTool('path')}
                  variant={selectedTool === 'path' ? 'default' : 'outline'}
                  className="w-full justify-start"
                >
                  <MousePointer className="h-4 w-4 mr-2" />
                  Draw Path
                </Button>
                <Button
                  onClick={() => setSelectedTool('text')}
                  variant={selectedTool === 'text' ? 'default' : 'outline'}
                  className="w-full justify-start"
                >
                  <Type className="h-4 w-4 mr-2" />
                  Text
                </Button>
              </CardContent>
            </Card>

            {/* Elements List */}
            <Card>
              <CardHeader>
                <CardTitle>Elements</CardTitle>
              </CardHeader>
              <CardContent>
                {elements.length === 0 ? (
                  <p className="text-sm text-gray-500">No elements yet</p>
                ) : (
                  <div className="space-y-2">
                    {elements.map(element => (
                      <div key={element.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm font-medium capitalize">
                          {element.type} {element.id.split('-')[1]}
                        </span>
                        <Button
                          onClick={() => deleteElement(element.id)}
                          variant="ghost"
                          size="sm"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Export */}
            <Card>
              <CardHeader>
                <CardTitle>Export</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button onClick={copyToClipboard} className="w-full" disabled={elements.length === 0}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy SVG
                </Button>
                <Button onClick={downloadSVG} variant="outline" className="w-full" disabled={elements.length === 0}>
                  <Download className="h-4 w-4 mr-2" />
                  Download SVG
                </Button>
                
                {elements.length > 0 && (
                  <div className="mt-4">
                    <Label className="text-sm font-medium">Generated SVG:</Label>
                    <pre className="mt-1 p-2 bg-gray-100 rounded text-xs overflow-auto max-h-32">
                      <code>{svgCode}</code>
                    </pre>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
