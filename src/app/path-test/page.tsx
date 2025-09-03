"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { extractedPaths } from "@/utils/extracted-paths";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

export default function PathTestPage() {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    // Set up the SVG paths for drawing animation
    const paths = svgRef.current.querySelectorAll("path");
    
    // Initialize each path
    paths.forEach((path, index) => {
      const pathLength = path.getTotalLength();
      
      // Set initial state - path is invisible
      gsap.set(path, {
        strokeDasharray: pathLength,
        strokeDashoffset: pathLength,
        opacity: 1
      });
    });

    // Create scroll-triggered animations for each path
    paths.forEach((path, index) => {
      const pathLength = path.getTotalLength();
      
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: `${index * 20}% top`, // Stagger the start times
        end: `${(index * 20) + 40}% bottom`, // Each path draws over 40% of scroll
        scrub: 1, // Smooth scrubbing tied to scroll position
        animation: gsap.to(path, {
          strokeDashoffset: 0,
          duration: 1,
          ease: "none"
        }),
        onUpdate: (self) => {
          // Optional: Add some visual feedback
          const progress = self.progress;
          gsap.set(path, {
            opacity: 0.3 + (progress * 0.7) // Fade in as it draws
          });
        }
      });
    });

    // Cleanup function
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div className="bg-white">
      {/* Header section */}
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            GSAP Path Drawing Test
          </h1>
          <p className="text-lg text-gray-600 max-w-md">
            Scroll down to see the SVG paths draw themselves based on your scroll position.
          </p>
        </div>
      </div>

      {/* SVG Container - this is where the magic happens */}
      <div 
        ref={containerRef} 
        className="relative"
        style={{ height: "800vh" }} // Extra tall to enable lots of scrolling
      >
        <div className="sticky top-0 h-screen flex items-center justify-center">
          <svg
            ref={svgRef}
            width="1000"
            height="800"
            viewBox="0 0 1000 7500"
            className="w-full max-w-4xl h-auto"
            style={{ 
              background: "transparent",
              overflow: "visible"
            }}
          >
            {/* Render all extracted paths */}
            {extractedPaths.map((pathData, index) => (
              <path
                key={pathData.id}
                id={pathData.id}
                d={pathData.d}
                stroke={pathData.stroke}
                strokeWidth={pathData.strokeWidth}
                fill={pathData.fill}
                strokeLinecap={pathData.strokeLinecap as any}
                strokeLinejoin={pathData.strokeLinejoin as any}
                opacity={0.1} // Start very faint
                style={{
                  vectorEffect: "non-scaling-stroke" // Keep stroke width consistent
                }}
              />
            ))}
            
            {/* Add some visual markers for reference */}
            <circle cx="174" cy="64" r="4" fill="#3b82f6" opacity={0.5} />
            <circle cx="627" cy="65" r="4" fill="#3b82f6" opacity={0.5} />
            <text x="174" y="50" fill="#3b82f6" fontSize="12" textAnchor="middle">
              Start
            </text>
            <text x="627" y="50" fill="#3b82f6" fontSize="12" textAnchor="middle">
              End
            </text>
          </svg>
        </div>
      </div>

      {/* Footer section */}
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Animation Complete
          </h2>
          <p className="text-lg text-gray-600">
            All {extractedPaths.length} paths have been drawn!
          </p>
        </div>
      </div>
    </div>
  );
}
