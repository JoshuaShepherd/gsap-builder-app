"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { extractedPaths, getPathsBySection } from "@/utils/extracted-paths";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

export default function PathTestPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRefs = useRef<(SVGSVGElement | null)[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    // Define path sections with their scroll ranges
    const pathSections = [
      { 
        paths: getPathsBySection(0), 
        startScroll: 100, 
        endScroll: 1500, 
        name: "Blue",
        color: "#3b82f6"
      },
      { 
        paths: getPathsBySection(1), 
        startScroll: 1600, 
        endScroll: 3000, 
        name: "Red",
        color: "#ef4444"
      },
      { 
        paths: getPathsBySection(2), 
        startScroll: 3100, 
        endScroll: 4500, 
        name: "Green",
        color: "#10b981"
      },
      { 
        paths: getPathsBySection(3), 
        startScroll: 4600, 
        endScroll: 6000, 
        name: "Purple",
        color: "#8b5cf6"
      },
      { 
        paths: getPathsBySection(4), 
        startScroll: 6100, 
        endScroll: 7500, 
        name: "Orange",
        color: "#f59e0b"
      }
    ];

    // Create ScrollTrigger for each section
    pathSections.forEach((section, sectionIndex) => {
      const svgElement = svgRefs.current[sectionIndex];
      if (!svgElement) return;

      const paths = svgElement.querySelectorAll("path") as NodeListOf<SVGPathElement>;
      
      // Initialize all paths in this section to be invisible and not drawn
      paths.forEach((path) => {
        const pathLength = path.getTotalLength();
        gsap.set(path, {
          strokeDasharray: pathLength,
          strokeDashoffset: pathLength,
          opacity: 0
        });
      });

      // Create ScrollTrigger for this entire section
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: `${section.startScroll}px top`,
        end: `${section.endScroll}px top`,
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;
          
          // Show/hide the entire SVG based on scroll position
          gsap.set(svgElement, {
            opacity: progress > 0 && progress < 1 ? 1 : 0,
            display: progress > 0 && progress < 1 ? "block" : "none"
          });

          // Draw paths progressively based on scroll progress
          paths.forEach((path, pathIndex) => {
            const pathLength = path.getTotalLength();
            const pathProgress = Math.max(0, Math.min(1, progress * paths.length - pathIndex));
            
            gsap.set(path, {
              opacity: pathProgress > 0 ? 1 : 0,
              strokeDashoffset: pathLength * (1 - pathProgress)
            });
          });
        },
        onEnter: () => {
          console.log(`Entering ${section.name} section`);
        },
        onLeave: () => {
          console.log(`Leaving ${section.name} section`);
          // Hide the SVG when leaving the section
          gsap.set(svgElement, { opacity: 0, display: "none" });
        },
        onEnterBack: () => {
          console.log(`Re-entering ${section.name} section`);
        },
        onLeaveBack: () => {
          console.log(`Leaving ${section.name} section backwards`);
          gsap.set(svgElement, { opacity: 0, display: "none" });
        },
        // markers: true, // Uncomment for debugging
        id: `section-${sectionIndex}`
      });
    });

    // Cleanup function
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div className="bg-white min-h-screen">
      {/* Scroll container with proper height */}
      <div 
        ref={containerRef} 
        className="relative"
        style={{ height: "7600px" }} // Extra height to accommodate all sections
      >
        
        {/* Section indicators - fixed position for debugging */}
        <div className="fixed right-4 top-20 bg-black/80 text-white p-3 rounded-lg text-sm font-mono z-50">
          <div className="font-bold mb-2">Scroll Sections:</div>
          <div className="text-blue-400">100-1500px: Blue paths</div>
          <div className="text-red-400">1600-3000px: Red paths</div>
          <div className="text-green-400">3100-4500px: Green paths</div>
          <div className="text-purple-400">4600-6000px: Purple paths</div>
          <div className="text-orange-400">6100-7500px: Orange paths</div>
        </div>

        {/* Create separate SVG containers for each section */}
        {[
          { paths: getPathsBySection(0), name: "Blue" },
          { paths: getPathsBySection(1), name: "Red" },
          { paths: getPathsBySection(2), name: "Green" },
          { paths: getPathsBySection(3), name: "Purple" },
          { paths: getPathsBySection(4), name: "Orange" }
        ].map((section, sectionIndex) => (
          <div
            key={sectionIndex}
            className="fixed top-0 left-0 w-full h-screen flex items-center justify-center pointer-events-none"
            style={{ display: "none" }} // Initially hidden
          >
            <svg
              ref={(el) => {svgRefs.current[sectionIndex] = el;}}
              width="1000"
              height="1500"
              viewBox="0 0 1000 1500"
              className="w-full h-full max-w-4xl"
              style={{ 
                background: "transparent"
              }}
              preserveAspectRatio="xMidYMid meet"
            >
              {/* Render paths for this section */}
              {section.paths.map((pathData) => (
                <path
                  key={pathData.id}
                  id={pathData.id}
                  d={pathData.d}
                  stroke={pathData.stroke}
                  strokeWidth={pathData.strokeWidth}
                  fill={pathData.fill}
                  strokeLinecap={pathData.strokeLinecap as any}
                  strokeLinejoin={pathData.strokeLinejoin as any}
                  style={{
                    vectorEffect: "non-scaling-stroke"
                  }}
                />
              ))}
            </svg>
            
            {/* Section title overlay */}
            <div className="absolute top-8 left-8 bg-black/20 px-3 py-1 rounded text-lg font-bold" 
                 style={{ color: section.paths[0]?.stroke || '#000' }}>
              {section.name} Paths Drawing
            </div>
          </div>
        ))}

        {/* Initial instruction at the top */}
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 text-center z-10">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            GSAP Path Drawing - Scroll Based
          </h1>
          <p className="text-gray-600">
            Scroll down to see each set of 4 paths draw progressively
          </p>
        </div>
      </div>
    </div>
  );
}
