'use client'

import React, { useRef, useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

// Dynamically import the component to avoid SSR issues
const NatureTrailsContent = dynamic(() => Promise.resolve(NatureTrailsComponent), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-green-50 via-blue-50 to-green-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading Nature Trails...</p>
      </div>
    </div>
  )
})

function NatureTrailsComponent() {
  const containerRef = useRef<HTMLDivElement>(null)
  const pathsRef = useRef<(SVGPathElement | null)[]>([])
  const hikersRef = useRef<(HTMLDivElement | null)[]>([])

  const trailColors = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444'] // Green, Blue, Amber, Red
  const trailNames = ['Forest Trail', 'River Trail', 'Mountain Trail', 'Canyon Trail']

  // SVG path data for each stage - simpler, more reliable paths
  const trailPaths = [
    // Trail 1: Forest Trail (Green)
    'M 50 150 Q 150 100 250 150 Q 350 120 450 150 Q 550 80 650 150 Q 750 180 850 150 Q 950 120 1050 150',
    // Trail 2: River Trail (Blue)  
    'M 50 150 Q 150 130 250 150 Q 350 170 450 150 Q 550 100 650 150 Q 750 200 850 150 Q 950 100 1050 150',
    // Trail 3: Mountain Trail (Amber)
    'M 50 150 Q 150 180 250 150 Q 350 90 450 150 Q 550 220 650 150 Q 750 80 850 150 Q 950 180 1050 150',
    // Trail 4: Canyon Trail (Red)
    'M 50 150 Q 150 160 250 150 Q 350 140 450 150 Q 550 160 650 150 Q 750 140 850 150 Q 950 160 1050 150',
  ]

  useEffect(() => {
    if (!containerRef.current || typeof window === 'undefined') return

    // Dynamically import GSAP only on client
    import('gsap').then(({ gsap }) => {
      import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
        import('gsap/MotionPathPlugin').then(({ MotionPathPlugin }) => {
          gsap.registerPlugin(ScrollTrigger, MotionPathPlugin)

          const ctx = gsap.context(() => {
            // Create a timeline for synchronized animations
            const tl = gsap.timeline({
              scrollTrigger: {
                trigger: containerRef.current,
                start: "top center",
                end: "bottom center",
                scrub: 1
              }
            })

            // Animate each trail path and its corresponding hiker
            pathsRef.current.forEach((path, i) => {
              if (!path) return

              // Path drawing animation using proper SVG stroke animation
              // Set initial state - path hidden
              gsap.set(path, { 
                strokeDasharray: "1000 1000",
                strokeDashoffset: 1000
              })

              // Animate path drawing
              tl.to(path, {
                strokeDashoffset: 0,
                duration: 1,
                ease: "none"
              }, 0) // All paths start at the same time

              // Hiker motion along the path using MotionPathPlugin
              if (hikersRef.current[i]) {
                gsap.set(hikersRef.current[i], { opacity: 0 })
                
                tl.to(hikersRef.current[i], {
                  opacity: 1,
                  duration: 0.1
                }, 0.1) // Fade in hikers slightly after paths start
                
                tl.to(hikersRef.current[i], {
                  motionPath: {
                    path: path,
                    align: path,
                    alignOrigin: [0.5, 0.5],
                    autoRotate: true
                  },
                  duration: 1,
                  ease: "none"
                }, 0.1) // Start motion slightly after fade in
              }
            })

            // Add floating nature elements animation
            const leaves = containerRef.current?.querySelectorAll('.floating-leaf')
            leaves?.forEach((leaf, i) => {
              gsap.to(leaf, {
                y: -20,
                rotation: 360,
                duration: 3 + i,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"
              })
            })

          }, containerRef)

          return () => ctx.revert()
        })
      })
    })
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-blue-50 to-green-100">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b p-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Nature Trails Journey</h1>
          <p className="text-gray-600">Follow the four trails as they diverge and converge through 5 stages</p>
          
          {/* Trail Legend */}
          <div className="flex gap-6 mt-4">
            {trailNames.map((name, i) => (
              <div key={name} className="flex items-center gap-2">
                <div 
                  className="w-4 h-1 rounded-full"
                  style={{ backgroundColor: trailColors[i] }}
                />
                <span className="text-sm font-medium text-gray-700">{name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Trail Container */}
      <div ref={containerRef} className="relative">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Trees */}
          {[...Array(20)].map((_, i) => (
            <div
              key={`tree-${i}`}
              className="absolute text-green-600"
              style={{
                left: `${Math.random() * 90 + 5}%`,
                top: `${Math.random() * 90 + 5}%`,
                fontSize: `${Math.random() * 20 + 20}px`
              }}
            >
              🌲
            </div>
          ))}
          
          {/* Rocks */}
          {[...Array(15)].map((_, i) => (
            <div
              key={`rock-${i}`}
              className="absolute text-gray-600"
              style={{
                left: `${Math.random() * 90 + 5}%`,
                top: `${Math.random() * 90 + 5}%`,
                fontSize: `${Math.random() * 15 + 15}px`
              }}
            >
              🪨
            </div>
          ))}

          {/* Floating leaves */}
          {[...Array(10)].map((_, i) => (
            <div
              key={`leaf-${i}`}
              className="floating-leaf absolute text-yellow-600"
              style={{
                left: `${Math.random() * 90 + 5}%`,
                top: `${Math.random() * 90 + 5}%`,
                fontSize: '16px'
              }}
            >
              🍃
            </div>
          ))}
        </div>

        {/* SVG Trail Paths */}
        <div className="relative h-[400vh]"> {/* Make it tall for scrolling */}
          <svg 
            viewBox="0 0 1200 300" 
            className="absolute inset-0 w-full h-full"
            preserveAspectRatio="none"
          >
            <defs>
              {/* Add some texture patterns */}
              <pattern id="grass" patternUnits="userSpaceOnUse" width="10" height="10">
                <rect width="10" height="10" fill="#f0fdf4"/>
                <circle cx="2" cy="2" r="0.5" fill="#22c55e" opacity="0.3"/>
                <circle cx="8" cy="8" r="0.5" fill="#22c55e" opacity="0.3"/>
              </pattern>
            </defs>
            
            {/* Background */}
            <rect width="100%" height="100%" fill="url(#grass)"/>
            
            {/* Trail Paths */}
            {trailPaths.map((pathData, i) => (
              <path
                key={`trail-${i}`}
                ref={(el) => { pathsRef.current[i] = el }}
                d={pathData}
                fill="none"
                stroke={trailColors[i]}
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.8"
                filter="drop-shadow(2px 2px 4px rgba(0,0,0,0.1))"
              />
            ))}

            {/* Stage Markers */}
            {[
              { x: 100, y: 150, label: 'Trailhead' },
              { x: 300, y: 150, label: 'Forest' },
              { x: 550, y: 150, label: 'Lodge' },
              { x: 800, y: 150, label: 'Summit' },
              { x: 1000, y: 150, label: 'Journey\'s End' }
            ].map((marker, i) => (
              <g key={`marker-${i}`}>
                <circle 
                  cx={marker.x} 
                  cy={marker.y} 
                  r="12" 
                  fill="white" 
                  stroke="#374151" 
                  strokeWidth="2"
                />
                <text 
                  x={marker.x} 
                  y={marker.y - 20} 
                  textAnchor="middle" 
                  className="text-xs font-semibold fill-gray-700"
                >
                  {marker.label}
                </text>
                <text 
                  x={marker.x} 
                  y={marker.y + 4} 
                  textAnchor="middle" 
                  className="text-xs fill-gray-600"
                >
                  {i + 1}
                </text>
              </g>
            ))}
          </svg>

          {/* Hiking Icons */}
          {[...Array(4)].map((_, i) => (
            <div
              key={`hiker-${i}`}
              ref={(el) => { hikersRef.current[i] = el }}
              className="absolute w-5 h-5 text-lg pointer-events-none z-10"
              style={{ 
                transformOrigin: 'center',
                filter: 'drop-shadow(1px 1px 2px rgba(0,0,0,0.3))'
              }}
            >
              🚶‍♂️
            </div>
          ))}
        </div>

        {/* Information Panels */}
        <div className="absolute inset-0 pointer-events-none">
          {[
            { 
              stage: 1, 
              top: '10%', 
              left: '10%',
              title: 'The Journey Begins',
              description: 'All trails start together from the visitor center'
            },
            { 
              stage: 2, 
              top: '30%', 
              right: '10%',
              title: 'Paths Diverge',
              description: 'Each trail takes its unique route through different terrains'
            },
            { 
              stage: 3, 
              top: '50%', 
              left: '10%',
              title: 'Lodge Gathering',
              description: 'All trails converge at the mountain lodge for rest'
            },
            { 
              stage: 4, 
              top: '70%', 
              right: '10%',
              title: 'Into the Wild',
              description: 'Trails separate again into wilderness areas'
            },
            { 
              stage: 5, 
              top: '90%', 
              left: '50%',
              title: 'Journey\'s End',
              description: 'All paths lead home, enriched by the adventure'
            }
          ].map((info, i) => (
            <div
              key={`info-${i}`}
              className="absolute bg-white/90 backdrop-blur-sm rounded-lg p-4 max-w-xs pointer-events-auto shadow-lg border"
              style={{ 
                top: info.top, 
                left: info.left, 
                right: info.right,
                transform: info.left === '50%' ? 'translateX(-50%)' : 'none'
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {info.stage}
                </div>
                <h3 className="font-semibold text-gray-900">{info.title}</h3>
              </div>
              <p className="text-sm text-gray-600">{info.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-900 text-white p-8">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Trail Statistics</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {trailNames.map((name, i) => (
              <div key={name} className="text-center">
                <div 
                  className="w-3 h-3 rounded-full mx-auto mb-2"
                  style={{ backgroundColor: trailColors[i] }}
                />
                <h3 className="font-semibold text-sm">{name}</h3>
                <p className="text-xs text-gray-400 mt-1">
                  {Math.floor(Math.random() * 5 + 3)} miles • 
                  {Math.floor(Math.random() * 300 + 200)}ft elevation
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

const NatureTrails = () => {
  return <NatureTrailsContent />
}

export default NatureTrails
