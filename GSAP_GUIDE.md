# GSAP (GreenSock Animation Platform) - Complete Guide

## Table of Contents
1. [Overview](#overview)
2. [Installation](#installation)
3. [Core Concepts](#core-concepts)
4. [Basic Usage](#basic-usage)
5. [Timelines](#timelines)
6. [ScrollTrigger Plugin](#scrolltrigger-plugin)
7. [All Plugins](#plugins)
8. [Easing](#easing)
9. [Utility Methods](#utility-methods)
10. [React Integration](#react-integration)
11. [Best Practices](#best-practices)
12. [Resources](#resources)

---

## Overview

**GSAP (GreenSock Animation Platform)** is a wildly robust JavaScript animation library built for professionals. It's framework-agnostic, meaning it works with React, Vue, Angular, Webflow, WordPress, or any JS framework.

### Why GSAP?
- **Performance**: Up to 20x faster than jQuery
- **Compatibility**: Works in all browsers, even IE6
- **Control**: Precise timing and sequencing
- **Plugins**: Extensive plugin ecosystem
- **Professional**: Used by top agencies and developers worldwide

### What's New in GSAP 3.13+
🎉 **GSAP is now 100% FREE including ALL bonus plugins** (thanks to Webflow support!)
- SplitText, MorphSVG, DrawSVG, and all premium plugins
- No more Club GSAP membership required

---

## Installation

### NPM (Recommended)
```bash
npm install gsap
```

### CDN
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.13.0/gsap.min.js"></script>
```

### Basic Setup
```javascript
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register plugins you want to use
gsap.registerPlugin(ScrollTrigger);
```

---

## Core Concepts

### What's a Tween?
A **Tween** is what does all the animation work - it's like a high-performance property setter that animates values over time.

### What's a Timeline?
A **Timeline** is a container for Tweens and other Timelines. It's the ultimate sequencing tool that lets you control complex animations as a whole.

---

## Basic Usage

### Simple Animations

#### gsap.to() - Animate TO values
```javascript
// Move element to x: 100 over 1 second
gsap.to(".box", { x: 100, duration: 1 });

// Multiple properties
gsap.to(".box", {
  x: 100,
  y: 50,
  rotation: 45,
  duration: 2,
  ease: "bounce.out"
});
```

#### gsap.from() - Animate FROM values
```javascript
// Animate from invisible to visible
gsap.from(".box", {
  opacity: 0,
  y: -50,
  duration: 1
});
```

#### gsap.fromTo() - Control both FROM and TO
```javascript
gsap.fromTo(".box",
  { opacity: 0, scale: 0 }, // FROM
  { opacity: 1, scale: 1, duration: 1 } // TO
);
```

### Common Properties
```javascript
gsap.to(".element", {
  // Transform properties (no units needed for most)
  x: 100,           // translateX(100px)
  y: 50,            // translateY(50px)
  rotation: 45,     // rotate(45deg)
  scale: 1.5,       // scale(1.5)
  
  // CSS properties
  opacity: 0.5,
  backgroundColor: "#ff0000",
  borderRadius: "50%",
  
  // Timing
  duration: 2,
  delay: 0.5,
  ease: "power2.out",
  
  // Callbacks
  onComplete: () => console.log("Done!"),
  onUpdate: () => console.log("Updating...")
});
```

---

## Timelines

Timelines make complex sequencing easy and maintainable.

### Creating a Timeline
```javascript
let tl = gsap.timeline();

// Add animations sequentially (one after another)
tl.to(".box1", { x: 100, duration: 1 })
  .to(".box2", { y: 100, duration: 1 })
  .to(".box3", { rotation: 360, duration: 1 });
```

### Positioning Animations
Use the position parameter to control timing:

```javascript
let tl = gsap.timeline();

// Absolute time (start at 2 seconds)
tl.to(".box", { x: 100 }, 2);

// Relative to timeline end
tl.to(".box", { y: 100 }, "+=1");  // 1 second gap
tl.to(".box", { rotation: 45 }, "-=0.5"); // 0.5 second overlap

// Relative to previous animation
tl.to(".box1", { x: 100 })
  .to(".box2", { y: 100 }, "<")    // Start with previous
  .to(".box3", { scale: 2 }, "<0.5"); // 0.5s after previous starts
```

### Labels
```javascript
let tl = gsap.timeline();

tl.to(".box", { x: 100 })
  .addLabel("midpoint")
  .to(".box", { y: 100 })
  .to(".circle", { scale: 2 }, "midpoint"); // Start at label
```

### Timeline Control
```javascript
let tl = gsap.timeline();

// Control methods
tl.play();
tl.pause();
tl.reverse();
tl.restart();
tl.seek(2); // Jump to 2 seconds
tl.progress(0.5); // Jump to 50%
tl.timeScale(2); // Double speed
```

### Timeline Configuration
```javascript
let tl = gsap.timeline({
  repeat: 2,           // Repeat 2 times
  repeatDelay: 1,      // 1 second between repeats
  yoyo: true,          // Reverse every other cycle
  onComplete: myFunction,
  
  // Set defaults for all child animations
  defaults: {
    duration: 1,
    ease: "power2.out"
  }
});
```

---

## ScrollTrigger Plugin

ScrollTrigger enables scroll-based animations with minimal code.

### Basic ScrollTrigger
```javascript
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

// Simple trigger
gsap.to(".box", {
  scrollTrigger: ".box", // Element to watch
  x: 100,
  duration: 1
});
```

### Advanced ScrollTrigger
```javascript
gsap.to(".box", {
  scrollTrigger: {
    trigger: ".box",
    start: "top 80%",      // When top of element hits 80% of viewport
    end: "bottom 20%",     // When bottom hits 20% of viewport
    scrub: true,           // Link directly to scroll position
    pin: true,             // Pin element while animating
    markers: true,         // Show markers (for debugging)
    
    // Callbacks
    onEnter: () => console.log("Entered!"),
    onLeave: () => console.log("Left!"),
    onUpdate: (self) => console.log(self.progress)
  },
  x: 100
});
```

### Scrub Animation (Scroll-linked)
```javascript
gsap.to(".box", {
  scrollTrigger: {
    trigger: ".section",
    start: "top center",
    end: "bottom center",
    scrub: 1 // 1 second to catch up
  },
  rotation: 360,
  scale: 2
});
```

### Timeline with ScrollTrigger
```javascript
let tl = gsap.timeline({
  scrollTrigger: {
    trigger: ".container",
    start: "top center",
    end: "bottom center",
    scrub: true,
    pin: true
  }
});

tl.from(".title", { y: -100, opacity: 0 })
  .from(".content", { y: 100, opacity: 0 })
  .from(".button", { scale: 0 });
```

### Batch Animations
```javascript
ScrollTrigger.batch(".item", {
  onEnter: (elements) => {
    gsap.from(elements, {
      opacity: 0,
      y: 100,
      stagger: 0.15
    });
  }
});
```

---

## Plugins

GSAP has an extensive plugin ecosystem. All plugins are now FREE!

### Scroll Plugins
- **ScrollTrigger**: Scroll-based animations
- **ScrollSmoother**: Smooth scrolling
- **ScrollTo**: Animate scroll position

### Text Plugins  
- **SplitText**: Split text into lines, words, characters
- **ScrambleText**: Scrambling text animations
- **TextPlugin**: Text replacement animations

### SVG Plugins
- **DrawSVG**: Animate SVG strokes
- **MorphSVG**: Morph between SVG shapes  
- **MotionPath**: Animate along SVG paths

### UI Plugins
- **Draggable**: Make elements draggable
- **Flip**: FLIP animations
- **Observer**: Unified event handling

### Usage Example
```javascript
// Import and register plugins
import { DrawSVGPlugin, MorphSVGPlugin } from "gsap/all";
gsap.registerPlugin(DrawSVGPlugin, MorphSVGPlugin);

// Use DrawSVG
gsap.from(".path", {
  drawSVG: "0%",
  duration: 2
});

// Use MorphSVG
gsap.to(".shape", {
  morphSVG: ".target-shape",
  duration: 1.5
});
```

---

## Easing

Easing controls the rate of change during animations.

### Built-in Eases
```javascript
// Power eases (most common)
ease: "power1.out"    // Slow end
ease: "power2.in"     // Slow start  
ease: "power3.inOut"  // Slow start and end

// Specialty eases
ease: "bounce.out"    // Bouncy ending
ease: "elastic.out"   // Elastic/spring effect
ease: "back.out"      // Slight overshoot
ease: "circ.inOut"    // Circular motion
ease: "expo.out"      // Exponential

// Steps (no smoothing)
ease: "steps(5)"      // 5 discrete steps
ease: "none"          // Linear (constant speed)
```

### Custom Eases (Plugin)
```javascript
import { CustomEase } from "gsap/CustomEase";
gsap.registerPlugin(CustomEase);

// Create custom ease
CustomEase.create("myEase", "M0,0 C0.25,0.1 0.25,1 1,1");

gsap.to(".box", {
  x: 100,
  ease: "myEase"
});
```

---

## Utility Methods

GSAP includes helpful utility functions:

```javascript
// Random values
x: gsap.utils.random(-100, 100)        // Random number
rotation: gsap.utils.random([0, 90, 180, 270]) // Random from array

// Interpolation  
const lerp = gsap.utils.interpolate(0, 100);
console.log(lerp(0.5)); // 50

// Mapping values
const mapped = gsap.utils.mapRange(0, 100, 0, 1, 75); // 0.75

// Array utilities
const shuffled = gsap.utils.shuffle([1, 2, 3, 4]);
const wrapped = gsap.utils.wrap(0, 100, 150); // 50

// Snapping
const snap = gsap.utils.snap(5); // Snap to increments of 5
console.log(snap(23)); // 25

// Element selection
gsap.utils.toArray(".item").forEach((item, i) => {
  gsap.to(item, { x: i * 100 });
});
```

---

## React Integration

### useGSAP Hook
```bash
npm install @gsap/react
```

```jsx
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";

function MyComponent() {
  const container = useRef();

  useGSAP(() => {
    // GSAP animations go here
    gsap.from(".box", { 
      opacity: 0, 
      y: 20, 
      stagger: 0.1 
    });
  }, { scope: container }); // Scope to container

  return (
    <div ref={container}>
      <div className="box">Box 1</div>
      <div className="box">Box 2</div>
      <div className="box">Box 3</div>
    </div>
  );
}
```

### Context and Cleanup
```jsx
useGSAP(() => {
  const tl = gsap.timeline();
  
  tl.from(".title", { opacity: 0 })
    .from(".content", { y: 50 });

  return () => {
    tl.kill(); // Cleanup
  };
}, []);
```

---

## Best Practices

### Performance
- Use transforms (`x`, `y`, `scale`, `rotation`) instead of changing layout properties
- Set `will-change: transform` on animated elements
- Use `force3D: true` for GPU acceleration
- Batch DOM reads and writes

### Code Organization
```javascript
// Use timeline defaults for consistency
const tl = gsap.timeline({
  defaults: { duration: 1, ease: "power2.out" }
});

// Create reusable animations
function fadeIn(element, delay = 0) {
  return gsap.from(element, {
    opacity: 0,
    y: 20,
    duration: 0.8,
    delay
  });
}

// Use contexts for cleanup
let ctx = gsap.context(() => {
  gsap.to(".box", { rotation: 360 });
});

// Later...
ctx.revert(); // Cleanup all animations in context
```

### Responsive Animations
```javascript
// Use matchMedia for responsive behavior
let mm = gsap.matchMedia();

mm.add("(min-width: 768px)", () => {
  // Desktop animations
  gsap.to(".box", { x: 100 });
});

mm.add("(max-width: 767px)", () => {
  // Mobile animations  
  gsap.to(".box", { x: 50 });
});
```

### Common Patterns
```javascript
// Stagger animations
gsap.from(".item", {
  opacity: 0,
  y: 50,
  stagger: 0.1 // 0.1 second between each
});

// Infinite loop
gsap.to(".spinner", {
  rotation: 360,
  duration: 2,
  repeat: -1,
  ease: "none"
});

// Hover animations
const boxes = gsap.utils.toArray(".box");
boxes.forEach(box => {
  box.addEventListener("mouseenter", () => {
    gsap.to(box, { scale: 1.1, duration: 0.3 });
  });
  
  box.addEventListener("mouseleave", () => {
    gsap.to(box, { scale: 1, duration: 0.3 });
  });
});
```

---

## Resources

### Official Documentation
- **Docs**: https://gsap.com/docs/v3/
- **Getting Started**: https://gsap.com/resources/get-started/
- **Cheat Sheet**: https://gsap.com/cheatsheet/

### Learning Resources
- **Creative Coding Club**: https://www.creativecodingclub.com/
- **YouTube Channel**: https://www.youtube.com/@GreenSockLearning
- **CodePen Demos**: https://codepen.io/collection/bNPYOw

### Tools
- **GSDevTools**: Visual timeline scrubbing
- **MotionPathHelper**: Visual path creation
- **Ease Visualizer**: https://gsap.com/docs/v3/Eases/

### Community
- **Forum**: https://gsap.com/community/
- **Discord**: Active community support
- **GitHub**: https://github.com/greensock/GreenSock-JS

---

## Example: Complete Animation Sequence

```javascript
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Hero animation on load
const heroTL = gsap.timeline();
heroTL.from(".hero-title", { opacity: 0, y: -50 })
      .from(".hero-subtitle", { opacity: 0, y: 30 }, "-=0.3")
      .from(".hero-cta", { opacity: 0, scale: 0.8 }, "-=0.2");

// Scroll-triggered section animations
ScrollTrigger.batch(".fade-in", {
  onEnter: elements => {
    gsap.from(elements, {
      opacity: 0,
      y: 100,
      stagger: 0.15,
      duration: 1,
      ease: "power3.out"
    });
  }
});

// Parallax effect
gsap.to(".parallax-bg", {
  yPercent: -50,
  ease: "none",
  scrollTrigger: {
    trigger: ".parallax-section",
    start: "top bottom",
    end: "bottom top",
    scrub: true
  }
});

// Navigation highlight
gsap.to(".nav-indicator", {
  x: 200,
  scrollTrigger: {
    trigger: ".section-2",
    start: "top center",
    end: "bottom center",
    scrub: 1
  }
});
```

---

## License

GSAP is now **completely FREE** including all plugins, thanks to Webflow's support. See [gsap.com/pricing](https://gsap.com/pricing) for details.

---

*Last updated: January 2025 - GSAP 3.13+*
