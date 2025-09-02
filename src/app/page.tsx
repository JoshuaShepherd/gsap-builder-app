'use client'

import React, { useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { TextPlugin } from 'gsap/TextPlugin'
import { useGSAP } from '@gsap/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { GSAPBuilder } from '@/components/builders/GSAPBuilder'
import { StickyPlayButton } from '@/components/ui/sticky-play-button'
import { 
  Sparkles,
  Zap,
  Code,
  Play,
  Layers,
  Settings,
  BookOpen,
  ExternalLink
} from 'lucide-react'

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, TextPlugin, useGSAP)

interface AnimationConfig {
  id: string
  name: string
  type: 'to' | 'from' | 'fromTo' | 'timeline'
  target: string
  properties: { [key: string]: any }
  fromProperties?: { [key: string]: any }
  duration: number
  delay: number
  ease: string
  repeat: number
  yoyo: boolean
  stagger: number
  enabled: boolean
}

const DEMO_ANIMATIONS: AnimationConfig[] = [
  {
    id: 'demo1',
    name: 'Text Fade In',
    type: 'fromTo',
    target: '[data-id="text1"]',
    properties: { opacity: 1, y: 0 },
    fromProperties: { opacity: 0, y: 30 },
    duration: 1,
    delay: 0,
    ease: 'power2.out',
    repeat: 0,
    yoyo: false,
    stagger: 0,
    enabled: true
  },
  {
    id: 'demo2',
    name: 'Box Scale',
    type: 'to',
    target: '[data-type="box"]',
    properties: { scale: 1.2, rotation: 45 },
    duration: 0.8,
    delay: 0.5,
    ease: 'back.out(1.7)',
    repeat: 0,
    yoyo: false,
    stagger: 0.1,
    enabled: true
  },
  {
    id: 'demo3',
    name: 'Circle Bounce',
    type: 'to',
    target: '[data-type="circle"]',
    properties: { y: -50, scaleY: 0.8 },
    duration: 0.4,
    delay: 1,
    ease: 'bounce.out',
    repeat: 2,
    yoyo: true,
    stagger: 0.2,
    enabled: false
  }
]

export default function GSAPBuilderApp() {
  const [animations, setAnimations] = useState<AnimationConfig[]>(DEMO_ANIMATIONS)
  const [generatedCode, setGeneratedCode] = useState('')

  const handleAnimationsChange = (newAnimations: AnimationConfig[]) => {
    setAnimations(newAnimations)
  }

  const handleCodeGenerated = (code: string) => {
    setGeneratedCode(code)
  }

  const enabledCount = animations.filter(anim => anim.enabled).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50">
      
      <div className="container mx-auto p-8 max-w-7xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Zap className="h-12 w-12 text-purple-600" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              GSAP Animation Builder
            </h1>
            <Sparkles className="h-12 w-12 text-blue-600" />
          </div>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Create, test, and export professional GSAP animations with a comprehensive visual interface. 
            Build complex animation sequences, test them instantly, and export production-ready code.
          </p>
          <div className="flex items-center justify-center gap-4 mt-6">
            <div className="flex items-center gap-2 bg-white/70 px-4 py-2 rounded-full">
              <Play className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">{enabledCount} animations enabled</span>
            </div>
            <div className="flex items-center gap-2 bg-white/70 px-4 py-2 rounded-full">
              <Code className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">Export ready</span>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="mb-8 text-center">
          <div className="flex justify-center gap-4 flex-wrap">
            <a 
              href="/nature-trails"
              className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium shadow-lg"
            >
              🌲 Nature Trails Journey
            </a>
            <a 
              href="/simple-svg"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-lg"
            >
              ✏️ Simple SVG Builder
            </a>
          </div>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="builder" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8 bg-white/80 backdrop-blur-sm">
            <TabsTrigger value="builder" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Animation Builder
            </TabsTrigger>
            <TabsTrigger value="documentation" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Documentation
            </TabsTrigger>
            <TabsTrigger value="examples" className="flex items-center gap-2">
              <Layers className="h-4 w-4" />
              Examples
            </TabsTrigger>
            <TabsTrigger value="export" className="flex items-center gap-2">
              <Code className="h-4 w-4" />
              Export
            </TabsTrigger>
          </TabsList>

          <TabsContent value="builder" className="space-y-6">
            <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Settings className="h-6 w-6 text-purple-600" />
                  GSAP Animation Builder
                </CardTitle>
                <CardDescription>
                  Create and manage multiple GSAP animations with comprehensive controls and real-time preview.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <GSAPBuilder 
                  animations={animations}
                  onAnimationsChange={handleAnimationsChange}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documentation" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <BookOpen className="h-6 w-6 text-blue-600" />
                    Getting Started
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">1. Target Selectors</h4>
                    <p className="text-sm text-gray-600 mb-2">Use CSS selectors to target elements:</p>
                    <div className="bg-gray-100 p-2 rounded font-mono text-sm">
                      <div>[data-id="element1"] - Target by data-id</div>
                      <div>[data-type="box"] - Target by data-type</div>
                      <div>.my-class - Target by class</div>
                      <div>#my-id - Target by ID</div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">2. Animation Types</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li><strong>to:</strong> Animate to specified values</li>
                      <li><strong>from:</strong> Animate from specified values</li>
                      <li><strong>fromTo:</strong> Animate from one set of values to another</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Zap className="h-6 w-6 text-orange-600" />
                    Properties Guide
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Transform Properties</h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div><strong>x, y:</strong> Move elements (pixels)</div>
                      <div><strong>scale:</strong> Resize uniformly (1 = original)</div>
                      <div><strong>rotation:</strong> Rotate (degrees)</div>
                      <div><strong>skewX, skewY:</strong> Skew transformation</div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Style Properties</h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div><strong>opacity:</strong> Fade in/out (0-1)</div>
                      <div><strong>backgroundColor:</strong> Color changes</div>
                      <div><strong>borderRadius:</strong> Round corners</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Settings className="h-6 w-6 text-green-600" />
                    Advanced Features
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Easing Functions</h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div><strong>power2.out:</strong> Smooth deceleration</div>
                      <div><strong>back.out(1.7):</strong> Overshoot and settle</div>
                      <div><strong>elastic.out:</strong> Elastic bounce effect</div>
                      <div><strong>bounce.out:</strong> Bouncing effect</div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Timeline Features</h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div><strong>Delay:</strong> Wait before starting</div>
                      <div><strong>Stagger:</strong> Offset multiple elements</div>
                      <div><strong>Repeat:</strong> Loop animations</div>
                      <div><strong>Yoyo:</strong> Reverse on repeat</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <ExternalLink className="h-6 w-6 text-purple-600" />
                    Resources
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <a 
                      href="https://greensock.com/docs/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <ExternalLink className="h-4 w-4" />
                      GSAP Documentation
                    </a>
                    <a 
                      href="https://greensock.com/ease-visualizer/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Ease Visualizer
                    </a>
                    <a 
                      href="https://greensock.com/scrolltrigger/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <ExternalLink className="h-4 w-4" />
                      ScrollTrigger Guide
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="examples" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "Fade In Sequence",
                  description: "Elements fade in one after another",
                  preset: () => setAnimations([
                    {
                      id: 'fade1', name: 'Fade In Text', type: 'fromTo' as const, target: '[data-id="text1"]',
                      properties: { opacity: 1, y: 0 }, fromProperties: { opacity: 0, y: 20 },
                      duration: 0.8, delay: 0, ease: 'power2.out', repeat: 0, yoyo: false, stagger: 0, enabled: true
                    },
                    {
                      id: 'fade2', name: 'Fade In Boxes', type: 'fromTo' as const, target: '[data-type="box"]',
                      properties: { opacity: 1, scale: 1 }, fromProperties: { opacity: 0, scale: 0.8 },
                      duration: 0.6, delay: 0.3, ease: 'power2.out', repeat: 0, yoyo: false, stagger: 0.1, enabled: true
                    }
                  ])
                },
                {
                  title: "Bounce Animation",
                  description: "Elements bounce with elastic effect",
                  preset: () => setAnimations([
                    {
                      id: 'bounce1', name: 'Bounce In', type: 'fromTo' as const, target: '[data-type="circle"]',
                      properties: { scale: 1, y: 0 }, fromProperties: { scale: 0, y: -50 },
                      duration: 0.8, delay: 0, ease: 'bounce.out', repeat: 0, yoyo: false, stagger: 0.2, enabled: true
                    }
                  ])
                },
                {
                  title: "Rotation Showcase",
                  description: "Spinning elements with different speeds",
                  preset: () => setAnimations([
                    {
                      id: 'rotate1', name: 'Rotate Boxes', type: 'to' as const, target: '[data-type="box"]',
                      properties: { rotation: 360, scale: 1.1 }, duration: 2, delay: 0, ease: 'power1.inOut',
                      repeat: -1, yoyo: false, stagger: 0.3, enabled: true
                    }
                  ])
                },
                {
                  title: "Scale Pulse",
                  description: "Pulsing scale animation",
                  preset: () => setAnimations([
                    {
                      id: 'pulse1', name: 'Pulse', type: 'to' as const, target: '[data-id="text1"]',
                      properties: { scale: 1.2 }, duration: 0.5, delay: 0, ease: 'power2.inOut',
                      repeat: -1, yoyo: true, stagger: 0, enabled: true
                    }
                  ])
                },
                {
                  title: "Color Morph",
                  description: "Smooth color transitions",
                  preset: () => setAnimations([
                    {
                      id: 'color1', name: 'Color Change', type: 'to' as const, target: '[data-type="box"]',
                      properties: { backgroundColor: '#ff6b6b', borderRadius: '50%' },
                      duration: 1.5, delay: 0, ease: 'power2.inOut', repeat: -1, yoyo: true, stagger: 0.2, enabled: true
                    }
                  ])
                },
                {
                  title: "Advanced Sequence",
                  description: "Complex multi-step animation",
                  preset: () => setAnimations([
                    {
                      id: 'seq1', name: 'Text Entry', type: 'fromTo' as const, target: '[data-id="text1"]',
                      properties: { x: 0, opacity: 1 }, fromProperties: { x: -100, opacity: 0 },
                      duration: 0.8, delay: 0, ease: 'power3.out', repeat: 0, yoyo: false, stagger: 0, enabled: true
                    },
                    {
                      id: 'seq2', name: 'Box Reveal', type: 'fromTo' as const, target: '[data-type="box"]',
                      properties: { scale: 1, rotation: 0 }, fromProperties: { scale: 0, rotation: 180 },
                      duration: 1, delay: 0.5, ease: 'back.out(1.7)', repeat: 0, yoyo: false, stagger: 0.15, enabled: true
                    },
                    {
                      id: 'seq3', name: 'Circle Float', type: 'to' as const, target: '[data-type="circle"]',
                      properties: { y: -30, scale: 1.1 }, duration: 1.5, delay: 1, ease: 'sine.inOut',
                      repeat: -1, yoyo: true, stagger: 0.1, enabled: true
                    }
                  ])
                }
              ].map((example, index) => (
                <Card key={index} className="shadow-lg border-0 bg-white/90 backdrop-blur-sm hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">{example.title}</CardTitle>
                    <CardDescription>{example.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <button
                      onClick={example.preset}
                      className="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-colors font-medium"
                    >
                      Load Example
                    </button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="export" className="space-y-6">
            <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Code className="h-6 w-6 text-purple-600" />
                  Generated Code
                </CardTitle>
                <CardDescription>
                  Copy or download your animation code for use in projects.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm overflow-auto max-h-96 border">
                    <code>{generatedCode || '// Create some animations to see the generated code!'}</code>
                  </pre>
                  <div className="flex gap-3">
                    <button
                      onClick={() => navigator.clipboard.writeText(generatedCode)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                      disabled={!generatedCode}
                    >
                      <Code className="h-4 w-4" />
                      Copy Code
                    </button>
                    <button
                      onClick={() => {
                        if (generatedCode) {
                          const blob = new Blob([generatedCode], { type: 'text/javascript' })
                          const url = URL.createObjectURL(blob)
                          const a = document.createElement('a')
                          a.href = url
                          a.download = 'gsap-animations.js'
                          a.click()
                          URL.revokeObjectURL(url)
                        }
                      }}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                      disabled={!generatedCode}
                    >
                      <ExternalLink className="h-4 w-4" />
                      Download JS
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Sticky Play Button */}
        <StickyPlayButton 
          animations={animations}
          onCodeGenerated={handleCodeGenerated}
        />
      </div>
    </div>
  )
}
