'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { TextPlugin } from 'gsap/TextPlugin'
import { useGSAP } from '@gsap/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Download,
  Copy,
  Save,
  Eye,
  EyeOff,
  Settings,
  Zap,
  MousePointer,
  Image as ImageIcon,
  Type,
  Box,
  Layers,
  Timer,
  BarChart3,
  Code,
  Sparkles
} from 'lucide-react'

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, TextPlugin, useGSAP)

interface AnimationConfig {
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
  useScrollTrigger: boolean
  scrollTriggerConfig?: {
    trigger: string
    start: string
    end: string
    scrub: boolean
    pin: boolean
    toggleActions: string
  }
}

interface ContentItem {
  id: string
  type: 'text' | 'image' | 'box' | 'component'
  content: string
  style: React.CSSProperties
  className: string
}

const EASE_OPTIONS = [
  'none', 'power1.out', 'power2.out', 'power3.out', 'power4.out',
  'power1.in', 'power2.in', 'power3.in', 'power4.in',
  'power1.inOut', 'power2.inOut', 'power3.inOut', 'power4.inOut',
  'back.out', 'back.in', 'back.inOut',
  'elastic.out', 'elastic.in', 'elastic.inOut',
  'bounce.out', 'bounce.in', 'bounce.inOut',
  'circ.out', 'circ.in', 'circ.inOut',
  'expo.out', 'expo.in', 'expo.inOut',
  'sine.out', 'sine.in', 'sine.inOut'
]

const TOGGLE_ACTIONS = [
  'play none none none',
  'play pause resume reset',
  'play reverse play reverse',
  'restart pause resume reset'
]

const PRESET_ANIMATIONS = {
  fadeIn: { opacity: 1, duration: 1, ease: 'power2.out' },
  slideUp: { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
  slideDown: { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
  slideLeft: { x: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
  slideRight: { x: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
  scaleIn: { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(1.7)' },
  rotateIn: { rotation: 0, opacity: 1, duration: 0.8, ease: 'back.out(1.4)' },
  bounce: { y: 0, duration: 0.6, ease: 'bounce.out' },
  elastic: { scale: 1, duration: 1, ease: 'elastic.out(1, 0.3)' },
  wobble: { rotation: 0, duration: 0.8, ease: 'elastic.out(1, 0.8)' }
}

const GSAPBuilder = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const previewRef = useRef<HTMLDivElement>(null)
  
  const [contentItems, setContentItems] = useState<ContentItem[]>([
    {
      id: 'text1',
      type: 'text',
      content: 'Hello GSAP World!',
      style: { fontSize: '2rem', fontWeight: 'bold', color: '#3b82f6' },
      className: 'demo-text'
    },
    {
      id: 'box1',
      type: 'box',
      content: 'Animated Box',
      style: { 
        width: '120px', 
        height: '120px', 
        backgroundColor: '#ef4444', 
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontWeight: 'bold'
      },
      className: 'demo-box'
    }
  ])

  const [animationConfig, setAnimationConfig] = useState<AnimationConfig>({
    type: 'to',
    target: '.demo-text',
    properties: { x: 200, scale: 1.2, rotation: 15 },
    duration: 1,
    delay: 0,
    ease: 'power2.out',
    repeat: 0,
    yoyo: false,
    stagger: 0,
    useScrollTrigger: false,
    scrollTriggerConfig: {
      trigger: '.demo-text',
      start: 'top 80%',
      end: 'bottom 20%',
      scrub: false,
      pin: false,
      toggleActions: 'play none none none'
    }
  })

  const [timeline, setTimeline] = useState<gsap.core.Timeline | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showCode, setShowCode] = useState(false)
  const [newContent, setNewContent] = useState('')
  const [newContentType, setNewContentType] = useState<'text' | 'image' | 'box'>('text')

  // Animation controls
  const playAnimation = useCallback(() => {
    if (timeline) {
      timeline.play()
      setIsPlaying(true)
    }
  }, [timeline])

  const pauseAnimation = useCallback(() => {
    if (timeline) {
      timeline.pause()
      setIsPlaying(false)
    }
  }, [timeline])

  const restartAnimation = useCallback(() => {
    if (timeline) {
      timeline.restart()
      setIsPlaying(true)
    }
  }, [timeline])

  // Generate animation code
  const generateCode = useCallback(() => {
    const { type, target, properties, fromProperties, duration, delay, ease, repeat, yoyo, stagger, useScrollTrigger, scrollTriggerConfig } = animationConfig

    let code = ''
    
    if (type === 'timeline') {
      code += `const tl = gsap.timeline();\n`
      code += `tl.to('${target}', {\n`
    } else {
      code += `gsap.${type}('${target}', `
      
      if (type === 'fromTo' && fromProperties) {
        code += `{\n${Object.entries(fromProperties).map(([key, value]) => `  ${key}: ${JSON.stringify(value)}`).join(',\n')}\n}, `
      }
      
      code += `{\n`
    }

    // Add properties
    Object.entries(properties).forEach(([key, value]) => {
      code += `  ${key}: ${JSON.stringify(value)},\n`
    })

    // Add animation options
    code += `  duration: ${duration},\n`
    if (delay > 0) code += `  delay: ${delay},\n`
    code += `  ease: "${ease}",\n`
    if (repeat > 0) code += `  repeat: ${repeat},\n`
    if (yoyo) code += `  yoyo: true,\n`
    if (stagger > 0) code += `  stagger: ${stagger},\n`

    // Add ScrollTrigger if enabled
    if (useScrollTrigger && scrollTriggerConfig) {
      code += `  scrollTrigger: {\n`
      code += `    trigger: "${scrollTriggerConfig.trigger}",\n`
      code += `    start: "${scrollTriggerConfig.start}",\n`
      code += `    end: "${scrollTriggerConfig.end}",\n`
      if (scrollTriggerConfig.scrub) code += `    scrub: true,\n`
      if (scrollTriggerConfig.pin) code += `    pin: true,\n`
      code += `    toggleActions: "${scrollTriggerConfig.toggleActions}"\n`
      code += `  }\n`
    }

    code += `});\n`

    return code
  }, [animationConfig])

  // Create and run animation
  useGSAP(() => {
    if (!previewRef.current) return

    // Kill existing animations
    gsap.killTweensOf('*')
    ScrollTrigger.getAll().forEach(trigger => trigger.kill())

    const { type, target, properties, fromProperties, duration, delay, ease, repeat, yoyo, stagger, useScrollTrigger, scrollTriggerConfig } = animationConfig

    let animationProps: any = {
      ...properties,
      duration,
      delay,
      ease,
      repeat,
      yoyo
    }

    if (stagger > 0) {
      animationProps.stagger = stagger
    }

    if (useScrollTrigger && scrollTriggerConfig) {
      animationProps.scrollTrigger = {
        trigger: scrollTriggerConfig.trigger,
        start: scrollTriggerConfig.start,
        end: scrollTriggerConfig.end,
        scrub: scrollTriggerConfig.scrub,
        pin: scrollTriggerConfig.pin,
        toggleActions: scrollTriggerConfig.toggleActions,
        markers: true // Show markers in preview
      }
    }

    let newTimeline: gsap.core.Timeline

    if (type === 'timeline') {
      newTimeline = gsap.timeline({ paused: true })
      newTimeline.to(target, animationProps)
    } else if (type === 'fromTo' && fromProperties) {
      newTimeline = gsap.timeline({ paused: true })
      newTimeline.fromTo(target, fromProperties, animationProps)
    } else if (type === 'from') {
      newTimeline = gsap.timeline({ paused: true })
      newTimeline.from(target, animationProps)
    } else {
      newTimeline = gsap.timeline({ paused: true })
      newTimeline.to(target, animationProps)
    }

    setTimeline(newTimeline)
    setIsPlaying(false)

  }, {
    dependencies: [animationConfig, contentItems], 
    scope: previewRef
  })

  // Add new content item
  const addContentItem = () => {
    if (!newContent.trim()) return

    const newItem: ContentItem = {
      id: `item-${Date.now()}`,
      type: newContentType,
      content: newContent,
      style: newContentType === 'text' 
        ? { fontSize: '1.5rem', color: '#374151' }
        : newContentType === 'box'
        ? { 
            width: '100px', 
            height: '100px', 
            backgroundColor: '#8b5cf6', 
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '0.875rem'
          }
        : {},
      className: `demo-${newContentType}-${Date.now()}`
    }

    setContentItems([...contentItems, newItem])
    setNewContent('')
  }

  // Apply preset animation
  const applyPreset = (presetName: string) => {
    const preset = PRESET_ANIMATIONS[presetName as keyof typeof PRESET_ANIMATIONS]
    if (preset) {
      setAnimationConfig(prev => ({
        ...prev,
        properties: preset
      }))
    }
  }

  // Update animation property
  const updateProperty = (key: string, value: any) => {
    setAnimationConfig(prev => ({
      ...prev,
      properties: {
        ...prev.properties,
        [key]: value
      }
    }))
  }

  // Copy code to clipboard
  const copyCode = () => {
    navigator.clipboard.writeText(generateCode())
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50">
      <div className="container mx-auto p-8 max-w-7xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            ⚡ GSAP Animation Builder
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Create, test, and export GSAP animations with an intuitive visual interface. 
            Perfect for prototyping animations and learning GSAP!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Panel - Controls */}
          <div className="space-y-6">
            {/* Content Management */}
            <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Layers className="h-6 w-6 text-purple-600" />
                  Content Items
                </CardTitle>
                <CardDescription>
                  Add and manage elements to animate
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-3">
                  <Select value={newContentType} onValueChange={(value: 'text' | 'image' | 'box') => setNewContentType(value)}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">Text</SelectItem>
                      <SelectItem value="box">Box</SelectItem>
                      <SelectItem value="image">Image</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder="Enter content..."
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={addContentItem}>Add</Button>
                </div>

                <div className="space-y-2">
                  {contentItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        {item.type === 'text' && <Type className="h-4 w-4" />}
                        {item.type === 'box' && <Box className="h-4 w-4" />}
                        {item.type === 'image' && <ImageIcon className="h-4 w-4" />}
                        <span className="font-medium">{item.content}</span>
                      </div>
                      <Badge variant="outline">.{item.className}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Animation Configuration */}
            <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Settings className="h-6 w-6 text-blue-600" />
                  Animation Settings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="basic" className="space-y-4">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="basic">Basic</TabsTrigger>
                    <TabsTrigger value="advanced">Advanced</TabsTrigger>
                    <TabsTrigger value="scroll">Scroll</TabsTrigger>
                  </TabsList>

                  <TabsContent value="basic" className="space-y-4">
                    {/* Animation Type */}
                    <div>
                      <Label>Animation Type</Label>
                      <Select value={animationConfig.type} onValueChange={(value: 'to' | 'from' | 'fromTo' | 'timeline') => 
                        setAnimationConfig(prev => ({ ...prev, type: value }))
                      }>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="to">gsap.to()</SelectItem>
                          <SelectItem value="from">gsap.from()</SelectItem>
                          <SelectItem value="fromTo">gsap.fromTo()</SelectItem>
                          <SelectItem value="timeline">Timeline</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Target Selector */}
                    <div>
                      <Label>Target Selector</Label>
                      <Input
                        value={animationConfig.target}
                        onChange={(e) => setAnimationConfig(prev => ({ ...prev, target: e.target.value }))}
                        placeholder=".demo-text"
                      />
                    </div>

                    {/* Transform Properties */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>X Position</Label>
                        <Input
                          type="number"
                          value={animationConfig.properties.x || 0}
                          onChange={(e) => updateProperty('x', Number(e.target.value))}
                        />
                      </div>
                      <div>
                        <Label>Y Position</Label>
                        <Input
                          type="number"
                          value={animationConfig.properties.y || 0}
                          onChange={(e) => updateProperty('y', Number(e.target.value))}
                        />
                      </div>
                      <div>
                        <Label>Scale</Label>
                        <Input
                          type="number"
                          step="0.1"
                          value={animationConfig.properties.scale || 1}
                          onChange={(e) => updateProperty('scale', Number(e.target.value))}
                        />
                      </div>
                      <div>
                        <Label>Rotation (deg)</Label>
                        <Input
                          type="number"
                          value={animationConfig.properties.rotation || 0}
                          onChange={(e) => updateProperty('rotation', Number(e.target.value))}
                        />
                      </div>
                    </div>

                    {/* Opacity */}
                    <div>
                      <Label>Opacity</Label>
                      <Slider
                        value={[animationConfig.properties.opacity || 1]}
                        onValueChange={([value]) => updateProperty('opacity', value)}
                        max={1}
                        min={0}
                        step={0.1}
                        className="mt-2"
                      />
                    </div>

                    {/* Duration and Delay */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Duration (s)</Label>
                        <Input
                          type="number"
                          step="0.1"
                          value={animationConfig.duration}
                          onChange={(e) => setAnimationConfig(prev => ({ ...prev, duration: Number(e.target.value) }))}
                        />
                      </div>
                      <div>
                        <Label>Delay (s)</Label>
                        <Input
                          type="number"
                          step="0.1"
                          value={animationConfig.delay}
                          onChange={(e) => setAnimationConfig(prev => ({ ...prev, delay: Number(e.target.value) }))}
                        />
                      </div>
                    </div>

                    {/* Ease */}
                    <div>
                      <Label>Ease</Label>
                      <Select value={animationConfig.ease} onValueChange={(value) => 
                        setAnimationConfig(prev => ({ ...prev, ease: value }))
                      }>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {EASE_OPTIONS.map(ease => (
                            <SelectItem key={ease} value={ease}>{ease}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </TabsContent>

                  <TabsContent value="advanced" className="space-y-4">
                    {/* Repeat and Yoyo */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Repeat (-1 for infinite)</Label>
                        <Input
                          type="number"
                          value={animationConfig.repeat}
                          onChange={(e) => setAnimationConfig(prev => ({ ...prev, repeat: Number(e.target.value) }))}
                        />
                      </div>
                      <div className="flex items-center space-x-2 pt-6">
                        <Switch
                          checked={animationConfig.yoyo}
                          onCheckedChange={(checked) => setAnimationConfig(prev => ({ ...prev, yoyo: checked }))}
                        />
                        <Label>Yoyo</Label>
                      </div>
                    </div>

                    {/* Stagger */}
                    <div>
                      <Label>Stagger (s)</Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={animationConfig.stagger}
                        onChange={(e) => setAnimationConfig(prev => ({ ...prev, stagger: Number(e.target.value) }))}
                      />
                    </div>

                    {/* Color Properties */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Background Color</Label>
                        <Input
                          value={animationConfig.properties.backgroundColor || ''}
                          onChange={(e) => updateProperty('backgroundColor', e.target.value)}
                          placeholder="#ff0000 or red"
                        />
                      </div>
                      <div>
                        <Label>Border Radius</Label>
                        <Input
                          value={animationConfig.properties.borderRadius || ''}
                          onChange={(e) => updateProperty('borderRadius', e.target.value)}
                          placeholder="10px or 50%"
                        />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="scroll" className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={animationConfig.useScrollTrigger}
                        onCheckedChange={(checked) => setAnimationConfig(prev => ({ ...prev, useScrollTrigger: checked }))}
                      />
                      <Label>Enable ScrollTrigger</Label>
                    </div>

                    {animationConfig.useScrollTrigger && animationConfig.scrollTriggerConfig && (
                      <>
                        <div>
                          <Label>Trigger Element</Label>
                          <Input
                            value={animationConfig.scrollTriggerConfig.trigger}
                            onChange={(e) => setAnimationConfig(prev => ({
                              ...prev,
                              scrollTriggerConfig: { ...prev.scrollTriggerConfig!, trigger: e.target.value }
                            }))}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Start Position</Label>
                            <Input
                              value={animationConfig.scrollTriggerConfig.start}
                              onChange={(e) => setAnimationConfig(prev => ({
                                ...prev,
                                scrollTriggerConfig: { ...prev.scrollTriggerConfig!, start: e.target.value }
                              }))}
                            />
                          </div>
                          <div>
                            <Label>End Position</Label>
                            <Input
                              value={animationConfig.scrollTriggerConfig.end}
                              onChange={(e) => setAnimationConfig(prev => ({
                                ...prev,
                                scrollTriggerConfig: { ...prev.scrollTriggerConfig!, end: e.target.value }
                              }))}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex items-center space-x-2">
                            <Switch
                              checked={animationConfig.scrollTriggerConfig.scrub}
                              onCheckedChange={(checked) => setAnimationConfig(prev => ({
                                ...prev,
                                scrollTriggerConfig: { ...prev.scrollTriggerConfig!, scrub: checked }
                              }))}
                            />
                            <Label>Scrub</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch
                              checked={animationConfig.scrollTriggerConfig.pin}
                              onCheckedChange={(checked) => setAnimationConfig(prev => ({
                                ...prev,
                                scrollTriggerConfig: { ...prev.scrollTriggerConfig!, pin: checked }
                              }))}
                            />
                            <Label>Pin</Label>
                          </div>
                        </div>

                        <div>
                          <Label>Toggle Actions</Label>
                          <Select 
                            value={animationConfig.scrollTriggerConfig.toggleActions} 
                            onValueChange={(value) => setAnimationConfig(prev => ({
                              ...prev,
                              scrollTriggerConfig: { ...prev.scrollTriggerConfig!, toggleActions: value }
                            }))}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {TOGGLE_ACTIONS.map(action => (
                                <SelectItem key={action} value={action}>{action}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Preset Animations */}
            <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Sparkles className="h-6 w-6 text-green-600" />
                  Preset Animations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {Object.keys(PRESET_ANIMATIONS).map(preset => (
                    <Button
                      key={preset}
                      variant="outline"
                      size="sm"
                      onClick={() => applyPreset(preset)}
                      className="text-left justify-start"
                    >
                      {preset}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Animation Controls */}
            <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Timer className="h-6 w-6 text-orange-600" />
                  Controls
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-3">
                  <Button onClick={playAnimation} disabled={isPlaying}>
                    <Play className="h-4 w-4 mr-2" />
                    Play
                  </Button>
                  <Button onClick={pauseAnimation} disabled={!isPlaying}>
                    <Pause className="h-4 w-4 mr-2" />
                    Pause
                  </Button>
                  <Button onClick={restartAnimation}>
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Restart
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Preview and Code */}
          <div className="space-y-6">
            {/* Preview Area */}
            <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Eye className="h-6 w-6 text-indigo-600" />
                  Animation Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div 
                  ref={previewRef}
                  className="min-h-[400px] bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-8 relative overflow-hidden"
                >
                  {contentItems.map((item) => (
                    <div
                      key={item.id}
                      className={item.className}
                      style={{
                        ...item.style,
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        margin: '20px'
                      }}
                    >
                      {item.type === 'text' && item.content}
                      {item.type === 'box' && item.content}
                      {item.type === 'image' && (
                        <img 
                          src={item.content} 
                          alt="Preview" 
                          className="max-w-full max-h-full object-contain"
                        />
                      )}
                    </div>
                  ))}
                  
                  {/* Demo content for scroll triggers */}
                  {animationConfig.useScrollTrigger && (
                    <div className="absolute bottom-0 left-0 right-0 h-[200vh] bg-gradient-to-b from-transparent to-gray-200">
                      <div className="h-full flex items-center justify-center">
                        <p className="text-gray-500 text-lg">Scroll to test ScrollTrigger</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Generated Code */}
            <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 justify-between">
                  <div className="flex items-center gap-3">
                    <Code className="h-6 w-6 text-purple-600" />
                    Generated Code
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={copyCode}>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => setShowCode(!showCode)}
                    >
                      {showCode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              {showCode && (
                <CardContent>
                  <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm overflow-x-auto">
                    <code>{generateCode()}</code>
                  </pre>
                </CardContent>
              )}
            </Card>

            {/* Export Options */}
            <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Download className="h-6 w-6 text-blue-600" />
                  Export & Save
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-3">
                  <Button onClick={() => {
                    const blob = new Blob([generateCode()], { type: 'text/javascript' })
                    const url = URL.createObjectURL(blob)
                    const a = document.createElement('a')
                    a.href = url
                    a.download = 'gsap-animation.js'
                    a.click()
                  }}>
                    <Download className="h-4 w-4 mr-2" />
                    Download JS
                  </Button>
                  <Button variant="outline" onClick={() => {
                    const config = JSON.stringify(animationConfig, null, 2)
                    const blob = new Blob([config], { type: 'application/json' })
                    const url = URL.createObjectURL(blob)
                    const a = document.createElement('a')
                    a.href = url
                    a.download = 'animation-config.json'
                    a.click()
                  }}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Config
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

export default GSAPBuilder
