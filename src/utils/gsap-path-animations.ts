// GSAP MotionPath usage examples with extracted paths
import { gsap } from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { extractedPaths, getPathsBySection } from "./extracted-paths";

gsap.registerPlugin(MotionPathPlugin);

// Example: Animate an element along the first blue path
export const animateAlongPath = (element: HTMLElement, pathIndex: number = 0) => {
  const pathData = extractedPaths[pathIndex];
  
  return gsap.to(element, {
    duration: 5,
    ease: "none",
    motionPath: {
      path: pathData.d,
      align: "auto",
      alignOrigin: [0.5, 0.5],
      autoRotate: true,
    }
  });
};

// Example: Create a timeline that uses multiple paths in sequence
export const createScrollTimeline = (element: HTMLElement) => {
  const tl = gsap.timeline();
  const bluePaths = getPathsBySection(0); // First 4 paths (blue section)
  
  bluePaths.forEach((path, index) => {
    tl.to(element, {
      duration: 2,
      ease: "none",
      motionPath: {
        path: path.d,
        align: "auto",
        alignOrigin: [0.5, 0.5],
      }
    });
  });
  
  return tl;
};

// Example: Create an SVG element dynamically and animate along it
export const createPathElement = (pathData: typeof extractedPaths[0]) => {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  
  svg.setAttribute("width", "1000");
  svg.setAttribute("height", "7500");
  svg.setAttribute("viewBox", "0 0 1000 7500");
  
  path.setAttribute("d", pathData.d);
  path.setAttribute("stroke", pathData.stroke);
  path.setAttribute("stroke-width", pathData.strokeWidth.toString());
  path.setAttribute("fill", pathData.fill);
  path.setAttribute("stroke-linecap", pathData.strokeLinecap);
  path.setAttribute("stroke-linejoin", pathData.strokeLinejoin);
  path.setAttribute("id", pathData.id);
  
  svg.appendChild(path);
  return { svg, path };
};
