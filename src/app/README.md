# GSAP Animation Builder

A comprehensive, intuitive visual interface for creating, testing, and exporting GSAP animations.

## Quick Start

1. **Add Content**: Create text, boxes, or images to animate
2. **Configure Animation**: Set target selectors and animation properties  
3. **Preview**: Use play controls to see your animation in real-time
4. **Export**: Copy generated code or download as JavaScript file

## Key Features

- ⚡ **Real-time Preview** - See animations instantly as you adjust parameters
- 🎯 **Visual Controls** - Sliders, inputs, and dropdowns for all GSAP properties
- 📝 **Code Generation** - Automatically generates clean, production-ready GSAP code
- 🔄 **ScrollTrigger Support** - Full ScrollTrigger configuration with visual markers
- 🎨 **Preset Library** - Quick-start with common animation patterns
- 💾 **Export Options** - Download JavaScript files or save configurations

## Animation Types

- **gsap.to()** - Animate to specific values
- **gsap.from()** - Animate from specific values
- **gsap.fromTo()** - Animate between two states
- **Timeline** - Chain multiple animations
- **ScrollTrigger** - Scroll-based animations

## Transform Properties

- Position (X, Y coordinates)
- Scale (uniform scaling)
- Rotation (degrees)
- Opacity (transparency)
- Background Color
- Border Radius
- Custom CSS properties

## Timing Controls

- Duration (animation length)
- Delay (start delay)
- Ease (comprehensive easing library)
- Repeat (loop count, -1 for infinite)
- Yoyo (reverse on repeat)
- Stagger (delay between multiple elements)

## ScrollTrigger Configuration

- Trigger element selector
- Start/End positions
- Scrub (tie to scroll position)
- Pin (lock element during scroll)
- Toggle Actions (play states)
- Visual markers for debugging

## Preset Animations

- **fadeIn** - Simple opacity fade
- **slideUp/Down/Left/Right** - Directional slides
- **scaleIn** - Scale up with back ease
- **rotateIn** - Rotation with opacity
- **bounce** - Bounce effect
- **elastic** - Elastic animations
- **wobble** - Elastic rotation

## Export & Integration

### Copy Code
Click "Copy" to get ready-to-use GSAP code for your project.

### Download JavaScript
Download a complete `.js` file with your animation code.

### Save Configuration
Export your settings as JSON for later use or sharing.

### React Integration
```javascript
import { useGSAP } from '@gsap/react'

function MyComponent() {
  const containerRef = useRef()

  useGSAP(() => {
    // Paste your generated code here
  }, { scope: containerRef })

  return <div ref={containerRef}>...</div>
}
```

## Tips

1. **Start Simple** - Begin with basic transforms before adding complexity
2. **Use CSS Selectors** - Target elements with classes (.my-element)
3. **Test Performance** - Stick to transform properties for best performance
4. **Preview Often** - Use play controls to test your animations frequently
5. **Save Configurations** - Export settings before major changes

## Requirements

- GSAP 3.13.0+
- @gsap/react 2.1.2+ (for React projects)
- Modern browser with CSS transform support

Built with ❤️ for the GSAP community
