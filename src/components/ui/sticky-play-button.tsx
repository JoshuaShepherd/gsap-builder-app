"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import { Play, Sparkles } from 'lucide-react'
import { AnimationModal } from '@/components/ui/animation-modal'

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

interface StickyPlayButtonProps {
  animations: AnimationConfig[]
  onCodeGenerated?: (code: string) => void
}

export function StickyPlayButton({ animations, onCodeGenerated }: StickyPlayButtonProps) {
  const enabledCount = animations.filter(anim => anim.enabled).length

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimationModal 
        animations={animations}
        onCodeGenerated={onCodeGenerated}
        trigger={
          <Button 
            size="lg" 
            className="h-14 px-6 shadow-lg hover:shadow-xl transition-all duration-200 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            disabled={enabledCount === 0}
          >
            <Play className="w-5 h-5 mr-2" />
            <span className="font-semibold">
              Play{enabledCount > 0 ? ` (${enabledCount})` : ''}
            </span>
            <Sparkles className="w-4 h-4 ml-2" />
          </Button>
        }
      />
      
      {enabledCount === 0 && (
        <div className="absolute -top-16 -left-8 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
          Enable some animations first!
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
        </div>
      )}
    </div>
  )
}
