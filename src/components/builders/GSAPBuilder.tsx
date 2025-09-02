"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Trash2, Plus, Copy, Eye, EyeOff } from 'lucide-react'

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

interface GSAPBuilderProps {
  animations: AnimationConfig[]
  onAnimationsChange: (animations: AnimationConfig[]) => void
}

const EASE_OPTIONS = [
  'none', 'power1.out', 'power2.out', 'power3.out', 'power4.out',
  'power1.in', 'power2.in', 'power3.in', 'power4.in',
  'power1.inOut', 'power2.inOut', 'power3.inOut', 'power4.inOut',
  'back.out(1.7)', 'back.in(1.7)', 'back.inOut(1.7)',
  'elastic.out(1, 0.3)', 'elastic.in(1, 0.3)', 'elastic.inOut(1, 0.3)',
  'bounce.out', 'bounce.in', 'bounce.inOut',
  'circ.out', 'circ.in', 'circ.inOut',
  'expo.out', 'expo.in', 'expo.inOut',
  'sine.out', 'sine.in', 'sine.inOut',
  'steps(12)', 'rough({ template: none.out, strength: 1, points: 20, taper: none, randomize: true, clamp: false })'
]

const PRESET_ANIMATIONS = {
  fadeIn: { name: 'Fade In', properties: { opacity: 1 }, fromProperties: { opacity: 0 } },
  fadeOut: { name: 'Fade Out', properties: { opacity: 0 } },
  slideUp: { name: 'Slide Up', properties: { y: 0, opacity: 1 }, fromProperties: { y: 50, opacity: 0 } },
  slideDown: { name: 'Slide Down', properties: { y: 0, opacity: 1 }, fromProperties: { y: -50, opacity: 0 } },
  slideLeft: { name: 'Slide Left', properties: { x: 0, opacity: 1 }, fromProperties: { x: 50, opacity: 0 } },
  slideRight: { name: 'Slide Right', properties: { x: 0, opacity: 1 }, fromProperties: { x: -50, opacity: 0 } },
  scaleIn: { name: 'Scale In', properties: { scale: 1, opacity: 1 }, fromProperties: { scale: 0, opacity: 0 } },
  scaleOut: { name: 'Scale Out', properties: { scale: 0, opacity: 0 } },
  rotateIn: { name: 'Rotate In', properties: { rotation: 0, opacity: 1 }, fromProperties: { rotation: 180, opacity: 0 } },
  bounce: { name: 'Bounce', properties: { y: 0 }, fromProperties: { y: -30 } },
  elastic: { name: 'Elastic', properties: { scale: 1 }, fromProperties: { scale: 0 } },
  flip: { name: 'Flip', properties: { rotationY: 0 }, fromProperties: { rotationY: 180 } },
  wobble: { name: 'Wobble', properties: { rotation: 0, x: 0 } },
  pulse: { name: 'Pulse', properties: { scale: 1.1 } },
  shake: { name: 'Shake', properties: { x: 0 } },
  swing: { name: 'Swing', properties: { rotation: 0 } },
}

const TRANSFORM_PROPERTIES = [
  { key: 'x', label: 'X Position', type: 'number', range: [-500, 500], unit: 'px' },
  { key: 'y', label: 'Y Position', type: 'number', range: [-500, 500], unit: 'px' },
  { key: 'scale', label: 'Scale', type: 'number', range: [0, 3], step: 0.1 },
  { key: 'scaleX', label: 'Scale X', type: 'number', range: [0, 3], step: 0.1 },
  { key: 'scaleY', label: 'Scale Y', type: 'number', range: [0, 3], step: 0.1 },
  { key: 'rotation', label: 'Rotation', type: 'number', range: [-360, 360], unit: '°' },
  { key: 'rotationX', label: 'Rotation X', type: 'number', range: [-360, 360], unit: '°' },
  { key: 'rotationY', label: 'Rotation Y', type: 'number', range: [-360, 360], unit: '°' },
  { key: 'skewX', label: 'Skew X', type: 'number', range: [-45, 45], unit: '°' },
  { key: 'skewY', label: 'Skew Y', type: 'number', range: [-45, 45], unit: '°' },
]

const STYLE_PROPERTIES = [
  { key: 'opacity', label: 'Opacity', type: 'number', range: [0, 1], step: 0.1 },
  { key: 'backgroundColor', label: 'Background Color', type: 'color' },
  { key: 'color', label: 'Text Color', type: 'color' },
  { key: 'borderRadius', label: 'Border Radius', type: 'number', range: [0, 50], unit: 'px' },
  { key: 'borderWidth', label: 'Border Width', type: 'number', range: [0, 10], unit: 'px' },
  { key: 'fontSize', label: 'Font Size', type: 'number', range: [8, 72], unit: 'px' },
  { key: 'filter', label: 'Filter', type: 'text', placeholder: 'blur(5px) or brightness(150%)' },
]

const TARGET_SUGGESTIONS = [
  '[data-id="text1"]', '[data-id="text2"]', '[data-id="box1"]', '[data-id="box2"]', '[data-id="box3"]',
  '[data-id="circle1"]', '[data-id="circle2"]', '[data-id="image1"]', '[data-id="image2"]',
  '[data-type="text"]', '[data-type="box"]', '[data-type="circle"]', '[data-type="image"]',
  '.animate-target', '.demo-element', '.my-element'
]

export function GSAPBuilder({ animations, onAnimationsChange }: GSAPBuilderProps) {
  const [selectedAnimation, setSelectedAnimation] = useState<string | null>(null)

  const addAnimation = () => {
    const newAnimation: AnimationConfig = {
      id: `anim_${Date.now()}`,
      name: `Animation ${animations.length + 1}`,
      type: 'to',
      target: '[data-id="text1"]',
      properties: { x: 100, scale: 1.2 },
      duration: 1,
      delay: 0,
      ease: 'power2.out',
      repeat: 0,
      yoyo: false,
      stagger: 0,
      enabled: true
    }
    onAnimationsChange([...animations, newAnimation])
    setSelectedAnimation(newAnimation.id)
  }

  const duplicateAnimation = (animation: AnimationConfig) => {
    const duplicated: AnimationConfig = {
      ...animation,
      id: `anim_${Date.now()}`,
      name: `${animation.name} Copy`
    }
    onAnimationsChange([...animations, duplicated])
  }

  const deleteAnimation = (id: string) => {
    onAnimationsChange(animations.filter(anim => anim.id !== id))
    if (selectedAnimation === id) {
      setSelectedAnimation(null)
    }
  }

  const updateAnimation = (id: string, updates: Partial<AnimationConfig>) => {
    onAnimationsChange(animations.map(anim => 
      anim.id === id ? { ...anim, ...updates } : anim
    ))
  }

  const applyPreset = (animationId: string, presetKey: string) => {
    const preset = PRESET_ANIMATIONS[presetKey as keyof typeof PRESET_ANIMATIONS]
    if (preset) {
      updateAnimation(animationId, {
        name: preset.name,
        type: 'fromProperties' in preset ? 'fromTo' : 'to',
        properties: preset.properties,
        fromProperties: 'fromProperties' in preset ? preset.fromProperties : undefined,
        ease: presetKey === 'bounce' ? 'bounce.out' : 
               presetKey === 'elastic' ? 'elastic.out(1, 0.3)' :
               presetKey === 'scaleIn' ? 'back.out(1.7)' : 'power2.out'
      })
    }
  }

  const selectedAnim = animations.find(anim => anim.id === selectedAnimation)

  return (
    <div className="space-y-6">
      {/* Animation List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Animations ({animations.length})</CardTitle>
            <Button onClick={addAnimation} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Animation
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {animations.map((animation) => (
              <div
                key={animation.id}
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  selectedAnimation === animation.id 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedAnimation(animation.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={animation.enabled}
                      onCheckedChange={(enabled) => updateAnimation(animation.id, { enabled })}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <span className="font-medium">{animation.name}</span>
                    <Badge variant="outline">{animation.type}</Badge>
                    <code className="text-xs bg-gray-100 px-1 rounded">{animation.target}</code>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation()
                        duplicateAnimation(animation)
                      }}
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation()
                        updateAnimation(animation.id, { enabled: !animation.enabled })
                      }}
                    >
                      {animation.enabled ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteAnimation(animation.id)
                      }}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            {animations.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <p>No animations yet. Click "Add Animation" to get started!</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Animation Editor */}
      {selectedAnim && (
        <Card>
          <CardHeader>
            <CardTitle>Edit: {selectedAnim.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="basic">Basic</TabsTrigger>
                <TabsTrigger value="properties">Properties</TabsTrigger>
                <TabsTrigger value="presets">Presets</TabsTrigger>
                <TabsTrigger value="advanced">Advanced</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Animation Name</Label>
                    <Input
                      id="name"
                      value={selectedAnim.name}
                      onChange={(e) => updateAnimation(selectedAnim.id, { name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="type">Animation Type</Label>
                    <Select 
                      value={selectedAnim.type} 
                      onValueChange={(type) => updateAnimation(selectedAnim.id, { type: type as any })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="to">To (animate to values)</SelectItem>
                        <SelectItem value="from">From (animate from values)</SelectItem>
                        <SelectItem value="fromTo">FromTo (from → to values)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="target">Target Selector</Label>
                  <Select 
                    value={selectedAnim.target} 
                    onValueChange={(target) => updateAnimation(selectedAnim.id, { target })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TARGET_SUGGESTIONS.map((target) => (
                        <SelectItem key={target} value={target}>{target}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="duration">Duration (seconds)</Label>
                    <Slider
                      value={[selectedAnim.duration]}
                      onValueChange={([duration]) => updateAnimation(selectedAnim.id, { duration })}
                      max={5}
                      min={0.1}
                      step={0.1}
                      className="mt-2"
                    />
                    <div className="text-sm text-gray-500 mt-1">{selectedAnim.duration}s</div>
                  </div>
                  <div>
                    <Label htmlFor="delay">Delay (seconds)</Label>
                    <Slider
                      value={[selectedAnim.delay]}
                      onValueChange={([delay]) => updateAnimation(selectedAnim.id, { delay })}
                      max={3}
                      min={0}
                      step={0.1}
                      className="mt-2"
                    />
                    <div className="text-sm text-gray-500 mt-1">{selectedAnim.delay}s</div>
                  </div>
                  <div>
                    <Label htmlFor="stagger">Stagger (seconds)</Label>
                    <Slider
                      value={[selectedAnim.stagger]}
                      onValueChange={([stagger]) => updateAnimation(selectedAnim.id, { stagger })}
                      max={1}
                      min={0}
                      step={0.05}
                      className="mt-2"
                    />
                    <div className="text-sm text-gray-500 mt-1">{selectedAnim.stagger}s</div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="ease">Easing</Label>
                  <Select 
                    value={selectedAnim.ease} 
                    onValueChange={(ease) => updateAnimation(selectedAnim.id, { ease })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {EASE_OPTIONS.map((ease) => (
                        <SelectItem key={ease} value={ease}>{ease}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={selectedAnim.yoyo}
                      onCheckedChange={(yoyo) => updateAnimation(selectedAnim.id, { yoyo })}
                    />
                    <Label>Yoyo (reverse)</Label>
                  </div>
                  <div>
                    <Label htmlFor="repeat">Repeat</Label>
                    <Select 
                      value={selectedAnim.repeat.toString()} 
                      onValueChange={(repeat) => updateAnimation(selectedAnim.id, { repeat: parseInt(repeat) })}
                    >
                      <SelectTrigger className="w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">0</SelectItem>
                        <SelectItem value="1">1</SelectItem>
                        <SelectItem value="2">2</SelectItem>
                        <SelectItem value="3">3</SelectItem>
                        <SelectItem value="-1">Infinite</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="properties" className="space-y-4">
                <h4 className="font-semibold">Transform Properties</h4>
                <div className="grid grid-cols-2 gap-4">
                  {TRANSFORM_PROPERTIES.map((prop) => (
                    <div key={prop.key}>
                      <Label>{prop.label}</Label>
                      <div className="flex items-center gap-2">
                        <Slider
                          value={[selectedAnim.properties[prop.key] || 0]}
                          onValueChange={([value]) => 
                            updateAnimation(selectedAnim.id, {
                              properties: { ...selectedAnim.properties, [prop.key]: value }
                            })
                          }
                          max={prop.range[1]}
                          min={prop.range[0]}
                          step={prop.step || 1}
                          className="flex-1"
                        />
                        <span className="text-sm text-gray-500 w-16">
                          {selectedAnim.properties[prop.key] || 0}{prop.unit}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                <h4 className="font-semibold">Style Properties</h4>
                <div className="grid grid-cols-2 gap-4">
                  {STYLE_PROPERTIES.map((prop) => (
                    <div key={prop.key}>
                      <Label>{prop.label}</Label>
                      {prop.type === 'number' ? (
                        <div className="flex items-center gap-2">
                          <Slider
                            value={[selectedAnim.properties[prop.key] || prop.range![0]]}
                            onValueChange={([value]) => 
                              updateAnimation(selectedAnim.id, {
                                properties: { ...selectedAnim.properties, [prop.key]: value }
                              })
                            }
                            max={prop.range![1]}
                            min={prop.range![0]}
                            step={prop.step || 1}
                            className="flex-1"
                          />
                          <span className="text-sm text-gray-500 w-16">
                            {selectedAnim.properties[prop.key] || prop.range![0]}{prop.unit}
                          </span>
                        </div>
                      ) : prop.type === 'color' ? (
                        <Input
                          type="color"
                          value={selectedAnim.properties[prop.key] || '#000000'}
                          onChange={(e) => 
                            updateAnimation(selectedAnim.id, {
                              properties: { ...selectedAnim.properties, [prop.key]: e.target.value }
                            })
                          }
                        />
                      ) : (
                        <Input
                          value={selectedAnim.properties[prop.key] || ''}
                          placeholder={prop.placeholder}
                          onChange={(e) => 
                            updateAnimation(selectedAnim.id, {
                              properties: { ...selectedAnim.properties, [prop.key]: e.target.value }
                            })
                          }
                        />
                      )}
                    </div>
                  ))}
                </div>

                {selectedAnim.type === 'fromTo' && (
                  <>
                    <Separator />
                    <h4 className="font-semibold">From Properties</h4>
                    <div className="text-sm text-gray-600 mb-2">
                      Set the initial values for fromTo animations
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {Object.keys(selectedAnim.properties).map((key) => (
                        <div key={key}>
                          <Label>From {key}</Label>
                          <Input
                            type="number"
                            value={selectedAnim.fromProperties?.[key] || 0}
                            onChange={(e) => 
                              updateAnimation(selectedAnim.id, {
                                fromProperties: { 
                                  ...selectedAnim.fromProperties, 
                                  [key]: parseFloat(e.target.value) || 0 
                                }
                              })
                            }
                          />
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </TabsContent>

              <TabsContent value="presets" className="space-y-4">
                <h4 className="font-semibold">Quick Presets</h4>
                <div className="grid grid-cols-3 gap-2">
                  {Object.entries(PRESET_ANIMATIONS).map(([key, preset]) => (
                    <Button
                      key={key}
                      variant="outline"
                      size="sm"
                      onClick={() => applyPreset(selectedAnim.id, key)}
                      className="justify-start"
                    >
                      {preset.name}
                    </Button>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="advanced" className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="transformOrigin">Transform Origin</Label>
                    <Select 
                      value={selectedAnim.properties.transformOrigin || 'center center'} 
                      onValueChange={(transformOrigin) => 
                        updateAnimation(selectedAnim.id, {
                          properties: { ...selectedAnim.properties, transformOrigin }
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="center center">Center</SelectItem>
                        <SelectItem value="top left">Top Left</SelectItem>
                        <SelectItem value="top center">Top Center</SelectItem>
                        <SelectItem value="top right">Top Right</SelectItem>
                        <SelectItem value="center left">Center Left</SelectItem>
                        <SelectItem value="center right">Center Right</SelectItem>
                        <SelectItem value="bottom left">Bottom Left</SelectItem>
                        <SelectItem value="bottom center">Bottom Center</SelectItem>
                        <SelectItem value="bottom right">Bottom Right</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="customEase">Custom Ease Function</Label>
                    <Input
                      id="customEase"
                      value={selectedAnim.ease}
                      onChange={(e) => updateAnimation(selectedAnim.id, { ease: e.target.value })}
                      placeholder="e.g., power2.out or CustomEase.create(...)"
                    />
                  </div>

                  <div>
                    <Label htmlFor="motionPath">Motion Path</Label>
                    <Input
                      id="motionPath"
                      value={selectedAnim.properties.motionPath || ''}
                      onChange={(e) => 
                        updateAnimation(selectedAnim.id, {
                          properties: { ...selectedAnim.properties, motionPath: e.target.value }
                        })
                      }
                      placeholder="SVG path or selector (requires MotionPathPlugin)"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="perspective">Perspective</Label>
                      <Input
                        id="perspective"
                        type="number"
                        value={selectedAnim.properties.perspective || ''}
                        onChange={(e) => 
                          updateAnimation(selectedAnim.id, {
                            properties: { ...selectedAnim.properties, perspective: e.target.value }
                          })
                        }
                        placeholder="1000"
                      />
                    </div>
                    <div>
                      <Label htmlFor="perspectiveOrigin">Perspective Origin</Label>
                      <Input
                        id="perspectiveOrigin"
                        value={selectedAnim.properties.perspectiveOrigin || ''}
                        onChange={(e) => 
                          updateAnimation(selectedAnim.id, {
                            properties: { ...selectedAnim.properties, perspectiveOrigin: e.target.value }
                          })
                        }
                        placeholder="50% 50%"
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
