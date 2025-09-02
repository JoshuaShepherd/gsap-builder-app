"use client"

import React, { useRef, useEffect, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { TextPlugin } from 'gsap/TextPlugin'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin'
import { useGSAP } from '@gsap/react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Play, Pause, RotateCcw, Copy, Download } from 'lucide-react'
import { toast } from 'sonner'

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

interface AnimationModalProps {
  animations: AnimationConfig[]
  trigger: React.ReactNode
  onCodeGenerated?: (code: string) => void
}

const DEMO_ELEMENTS = [
  { id: 'text1', type: 'text', content: 'Animated Text', className: 'text-4xl font-bold text-blue-600' },
  { id: 'text2', type: 'text', content: 'Secondary Text', className: 'text-2xl text-gray-600' },
  { id: 'box1', type: 'box', content: 'Box 1', className: 'w-20 h-20 bg-red-500 flex items-center justify-center text-white font-bold rounded-lg' },
  { id: 'box2', type: 'box', content: 'Box 2', className: 'w-20 h-20 bg-green-500 flex items-center justify-center text-white font-bold rounded-lg' },
  { id: 'box3', type: 'box', content: 'Box 3', className: 'w-20 h-20 bg-blue-500 flex items-center justify-center text-white font-bold rounded-lg' },
  { id: 'circle1', type: 'circle', content: '●', className: 'w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center text-white text-2xl' },
  { id: 'circle2', type: 'circle', content: '●', className: 'w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center text-white text-2xl' },
  { id: 'image1', type: 'image', content: '📦', className: 'text-6xl' },
  { id: 'image2', type: 'image', content: '🚀', className: 'text-6xl' },
]

export function AnimationModal({ animations, trigger, onCodeGenerated }: AnimationModalProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [timeline, setTimeline] = useState<gsap.core.Timeline | null>(null)
  const [generatedCode, setGeneratedCode] = useState('')

  // Reset elements to initial state
  const resetElements = () => {
    if (!containerRef.current) return
    
    const elements = containerRef.current.querySelectorAll('[data-animate]')
    gsap.set(elements, {
      x: 0,
      y: 0,
      rotation: 0,
      scale: 1,
      opacity: 1,
      skewX: 0,
      skewY: 0,
      scaleX: 1,
      scaleY: 1,
      transformOrigin: 'center center',
      clearProps: 'all'
    })
  }

  // Generate GSAP code from animations
  const generateCode = () => {
    const enabledAnimations = animations.filter(anim => anim.enabled)
    
    if (enabledAnimations.length === 0) {
      return '// No animations enabled'
    }

    let code = ''
    
    // Check if we need a timeline
    const needsTimeline = enabledAnimations.length > 1 || 
                         enabledAnimations.some(anim => anim.delay > 0 || anim.stagger > 0)
    
    if (needsTimeline) {
      code += 'const tl = gsap.timeline();\n\n'
      
      enabledAnimations.forEach((anim, index) => {
        const methodCall = anim.type === 'fromTo' && anim.fromProperties 
          ? `tl.fromTo('${anim.target}', ${JSON.stringify(anim.fromProperties, null, 2)}, ${JSON.stringify({
              ...anim.properties,
              duration: anim.duration,
              ease: anim.ease,
              repeat: anim.repeat,
              yoyo: anim.yoyo,
              stagger: anim.stagger || undefined
            }, null, 2)}${anim.delay > 0 ? `, "${anim.delay}"` : ''})`
          : `tl.${anim.type}('${anim.target}', ${JSON.stringify({
              ...anim.properties,
              duration: anim.duration,
              ease: anim.ease,
              repeat: anim.repeat,
              yoyo: anim.yoyo,
              stagger: anim.stagger || undefined
            }, null, 2)}${anim.delay > 0 ? `, "${anim.delay}"` : '})'}`
        
        code += `// ${anim.name}\n${methodCall};\n\n`
      })
    } else {
      const anim = enabledAnimations[0]
      const methodCall = anim.type === 'fromTo' && anim.fromProperties
        ? `gsap.fromTo('${anim.target}', ${JSON.stringify(anim.fromProperties, null, 2)}, ${JSON.stringify({
            ...anim.properties,
            duration: anim.duration,
            ease: anim.ease,
            repeat: anim.repeat,
            yoyo: anim.yoyo,
            delay: anim.delay || undefined,
            stagger: anim.stagger || undefined
          }, null, 2)})`
        : `gsap.${anim.type}('${anim.target}', ${JSON.stringify({
            ...anim.properties,
            duration: anim.duration,
            ease: anim.ease,
            repeat: anim.repeat,
            yoyo: anim.yoyo,
            delay: anim.delay || undefined,
            stagger: anim.stagger || undefined
          }, null, 2)})`
      
      code = `// ${anim.name}\n${methodCall};`
    }
    
    return code
  }

  // Create and play animations
  const playAnimations = () => {
    if (!containerRef.current) return
    
    resetElements()
    
    const enabledAnimations = animations.filter(anim => anim.enabled)
    if (enabledAnimations.length === 0) {
      toast.error('No animations enabled')
      return
    }

    const tl = gsap.timeline({
      onComplete: () => setIsPlaying(false)
    })

    enabledAnimations.forEach((anim) => {
      const elements = containerRef.current!.querySelectorAll(anim.target)
      
      if (elements.length === 0) {
        console.warn(`No elements found for selector: ${anim.target}`)
        return
      }

      const animProps = {
        ...anim.properties,
        duration: anim.duration,
        ease: anim.ease,
        repeat: anim.repeat,
        yoyo: anim.yoyo,
        stagger: anim.stagger || undefined
      }

      if (anim.type === 'fromTo' && anim.fromProperties) {
        tl.fromTo(elements, anim.fromProperties, animProps, anim.delay || undefined)
      } else {
        tl[anim.type](elements, animProps, anim.delay || undefined)
      }
    })

    setTimeline(tl)
    setIsPlaying(true)
    tl.play()
  }

  // Copy code to clipboard
  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(generatedCode)
      toast.success('Code copied to clipboard!')
    } catch (err) {
      toast.error('Failed to copy code')
    }
  }

  // Generate code when animations change
  useEffect(() => {
    const code = generateCode()
    setGeneratedCode(code)
    onCodeGenerated?.(code)
  }, [animations])

  // Reset when modal opens
  useEffect(() => {
    if (isOpen) {
      resetElements()
      setIsPlaying(false)
      if (timeline) {
        timeline.kill()
        setTimeline(null)
      }
    }
  }, [isOpen])

  const enabledCount = animations.filter(anim => anim.enabled).length

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Animation Preview</span>
            <Badge variant="secondary">{enabledCount} animation{enabledCount !== 1 ? 's' : ''} enabled</Badge>
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[70vh]">
          {/* Preview Area */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Button 
                onClick={playAnimations} 
                disabled={isPlaying || enabledCount === 0}
                variant="default"
              >
                <Play className="w-4 h-4 mr-2" />
                Play Animation
              </Button>
              <Button 
                onClick={() => timeline?.pause()} 
                disabled={!isPlaying}
                variant="outline"
              >
                <Pause className="w-4 h-4" />
              </Button>
              <Button 
                onClick={resetElements}
                variant="outline"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>
            
            <div 
              ref={containerRef}
              className="relative w-full h-96 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border-2 border-dashed border-gray-300 overflow-hidden"
            >
              {/* Demo Elements */}
              <div className="absolute inset-4 grid grid-cols-4 grid-rows-3 gap-4 place-items-center">
                {DEMO_ELEMENTS.map((element) => (
                  <div
                    key={element.id}
                    data-animate
                    className={`${element.className} transition-transform cursor-pointer hover:scale-105`}
                    data-type={element.type}
                    data-id={element.id}
                  >
                    {element.content}
                  </div>
                ))}
              </div>
              
              {/* Target Selectors Helper */}
              <div className="absolute bottom-2 left-2 text-xs text-gray-500 bg-white/80 p-2 rounded">
                Selectors: [data-id="text1"], [data-type="box"], .target-class
              </div>
            </div>
          </div>
          
          {/* Code Area */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Generated Code</h3>
              <div className="flex gap-2">
                <Button onClick={copyCode} variant="outline" size="sm">
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
                <Button 
                  onClick={() => {
                    const blob = new Blob([generatedCode], { type: 'text/javascript' })
                    const url = URL.createObjectURL(blob)
                    const a = document.createElement('a')
                    a.href = url
                    a.download = 'gsap-animation.js'
                    a.click()
                    URL.revokeObjectURL(url)
                  }}
                  variant="outline" 
                  size="sm"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
            
            <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-auto h-80 text-sm font-mono">
              <code>{generatedCode}</code>
            </pre>
            
            {enabledCount === 0 && (
              <div className="text-center text-gray-500 py-8">
                <p>Enable some animations to see the generated code!</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
