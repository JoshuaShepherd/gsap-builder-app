"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { extractedPaths, getPathsBySection } from "@/utils/extracted-paths";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

export default function PathTestPage() {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    // Get path sections based on the extracted data structure
    const pathSections = [
      { paths: getPathsBySection(0), startY: 0, endY: 1500, name: "Blue" },
      { paths: getPathsBySection(1), startY: 1600, endY: 3000, name: "Red" },
      { paths: getPathsBySection(2), startY: 3100, endY: 4500, name: "Green" },
      { paths: getPathsBySection(3), startY: 4600, endY: 6000, name: "Purple" },
      { paths: getPathsBySection(4), startY: 6100, endY: 7500, name: "Orange" }
    ];

    // Initialize all paths to be invisible
    const allPaths = svgRef.current.querySelectorAll("path");
    allPaths.forEach((path) => {
      const pathLength = path.getTotalLength();
      gsap.set(path, {
        strokeDasharray: pathLength,
        strokeDashoffset: pathLength,
        opacity: 0
      });
    });

    // Create scroll triggers for each section based on their Y positions
    pathSections.forEach((section, sectionIndex) => {
      section.paths.forEach((pathData, pathIndex) => {
        const pathElement = svgRef.current?.querySelector(`#${pathData.id}`) as SVGPathElement;
        if (!pathElement) return;

        const pathLength = pathElement.getTotalLength();
        
        // Calculate scroll trigger positions based on SVG Y coordinates
        // Map SVG coordinates (0-7500) to scroll positions
        const scrollStart = section.startY;
        const scrollEnd = section.endY;
        const sectionHeight = 400; // Height per section in vh
        
        ScrollTrigger.create({
          trigger: containerRef.current,
          start: `${scrollStart}px top`,
          end: `${scrollEnd}px top`,
          scrub: 1,
          onEnter: () => {
            gsap.set(pathElement, { opacity: 1 });
          },
          onUpdate: (self) => {
            const progress = self.progress;
            
            // Animate path drawing based on progress
            gsap.set(pathElement, {
              strokeDashoffset: pathLength * (1 - progress)
            });
          },
          // markers: true, // Uncomment for debugging
          id: `path-${pathData.id}`
        });
      });
    });

    // Cleanup function
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div className="bg-white min-h-screen">
      {/* Main container with proper height for all scroll positions */}
      <div 
        ref={containerRef} 
        className="relative"
        style={{ height: "7500px" }} // Match the SVG height for proper scroll mapping
      >
        {/* Fixed/Sticky SVG Container */}
        <div className="fixed top-0 left-0 w-full h-screen flex items-center justify-center pointer-events-none">
          <svg
            ref={svgRef}
            width="1000"
            height="7500"
            viewBox="0 0 1000 7500"
            className="w-full h-full max-w-screen-lg"
            style={{ 
              background: "transparent"
            }}
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Render all extracted paths */}
            {extractedPaths.map((pathData) => (
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
        </div>

        {/* Scroll indicators (optional - for debugging) */}
        <div className="absolute right-4 top-4 bg-black/10 p-2 rounded text-sm font-mono">
          <div>Scroll to see paths draw:</div>
          <div className="text-blue-600">0px: Blue paths</div>
          <div className="text-red-600">1600px: Red paths</div>
          <div className="text-green-600">3100px: Green paths</div>
          <div className="text-purple-600">4600px: Purple paths</div>
          <div className="text-orange-600">6100px: Orange paths</div>
        </div>
      </div>
    </div>
  );
}
