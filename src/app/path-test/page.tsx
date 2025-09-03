"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { extractedPaths, getPathsBySection } from "@/utils/extracted-paths";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

export default function PathTestPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Define simple sections with scroll ranges
    const sections = [
      { name: "Blue", color: "#3b82f6", start: 100, end: 1500 },
      { name: "Red", color: "#ef4444", start: 1600, end: 3000 },
      { name: "Green", color: "#10b981", start: 3100, end: 4500 },
      { name: "Purple", color: "#8b5cf6", start: 4600, end: 6000 },
      { name: "Orange", color: "#f59e0b", start: 6100, end: 7500 }
    ];

    // Create one ScrollTrigger that controls everything
    ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: "bottom bottom",
      scrub: 1,
      onUpdate: (self) => {
        const scrollY = self.scroll();
        
        // Find which section we're in
        let currentSection = null;
        let progress = 0;
        
        for (let i = 0; i < sections.length; i++) {
          const section = sections[i];
          if (scrollY >= section.start && scrollY <= section.end) {
            currentSection = i;
            progress = (scrollY - section.start) / (section.end - section.start);
            break;
          }
        }
        
        console.log(`Scroll: ${scrollY}px, Section: ${currentSection}, Progress: ${progress}`);
        
        // Update all path visibility
        document.querySelectorAll('.path-section').forEach((el, index) => {
          if (index === currentSection) {
            (el as HTMLElement).style.display = 'block';
            (el as HTMLElement).style.opacity = '1';
            
            // Update paths in this section
            const paths = el.querySelectorAll('path') as NodeListOf<SVGPathElement>;
            paths.forEach((path, pathIndex) => {
              const pathLength = path.getTotalLength();
              const pathProgress = Math.max(0, Math.min(1, progress * 4 - pathIndex));
              path.style.strokeDasharray = pathLength.toString();
              path.style.strokeDashoffset = (pathLength * (1 - pathProgress)).toString();
              path.style.opacity = pathProgress > 0 ? '1' : '0.2';
            });
            
          } else {
            (el as HTMLElement).style.display = 'none';
            (el as HTMLElement).style.opacity = '0';
          }
        });
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div className="bg-white">
      {/* Scroll container */}
      <div ref={containerRef} style={{ height: "7600px" }}>
        
        {/* Fixed position indicator */}
        <div className="fixed top-20 right-4 bg-black text-white p-4 rounded z-50">
          <div>Scroll to see paths:</div>
          <div className="text-blue-400">100-1500px: Blue</div>
          <div className="text-red-400">1600-3000px: Red</div>
          <div className="text-green-400">3100-4500px: Green</div>
          <div className="text-purple-400">4600-6000px: Purple</div>
          <div className="text-orange-400">6100-7500px: Orange</div>
        </div>

        {/* Path sections - all fixed positioned */}
        {[
          { name: "Blue", color: "#3b82f6" },
          { name: "Red", color: "#ef4444" },
          { name: "Green", color: "#10b981" },
          { name: "Purple", color: "#8b5cf6" },
          { name: "Orange", color: "#f59e0b" }
        ].map((section, index) => (
          <div
            key={index}
            className="path-section fixed top-0 left-0 w-full h-full flex items-center justify-center"
            style={{ 
              display: "none",
              zIndex: 10,
              backgroundColor: "rgba(255,255,255,0.9)"
            }}
          >
            {/* Big visible SVG */}
            <svg
              width="80%"
              height="60%"
              viewBox="0 0 1000 600"
              style={{
                border: "3px solid " + section.color,
                backgroundColor: "rgba(255,255,255,0.9)"
              }}
            >
              {/* Simple test paths that are guaranteed visible */}
              <path
                d="M 100 150 Q 300 100 500 150 Q 700 200 900 150"
                stroke={section.color}
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                strokeDasharray="0"
                strokeDashoffset="0"
              />
              <path
                d="M 100 250 Q 300 200 500 250 Q 700 300 900 250"
                stroke={section.color}
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                strokeDasharray="0"
                strokeDashoffset="0"
              />
              <path
                d="M 100 350 Q 300 300 500 350 Q 700 400 900 350"
                stroke={section.color}
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                strokeDasharray="0"
                strokeDashoffset="0"
              />
              <path
                d="M 100 450 Q 300 400 500 450 Q 700 500 900 450"
                stroke={section.color}
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                strokeDasharray="0"
                strokeDashoffset="0"
              />
              
              {/* Section title */}
              <text 
                x="500" 
                y="80" 
                textAnchor="middle" 
                fontSize="32" 
                fontWeight="bold"
                fill={section.color}
              >
                {section.name} Section - 4 Paths Drawing
              </text>
              
              {/* Corner markers */}
              <circle cx="50" cy="50" r="20" fill={section.color} />
              <circle cx="950" cy="50" r="20" fill={section.color} />
            </svg>
          </div>
        ))}
      </div>
    </div>
  );
}
