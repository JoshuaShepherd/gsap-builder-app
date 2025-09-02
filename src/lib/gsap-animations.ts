import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Reusable GSAP Animation Library
 * Optimized patterns for use throughout the application
 */

export const GSAPAnimations = {
  // ENTRANCE ANIMATIONS
  fadeInUp: (element: string | Element, options = {}) => {
    return gsap.fromTo(element, 
      { y: 50, opacity: 0 },
      { 
        y: 0, 
        opacity: 1, 
        duration: 0.8,
        ease: "power3.out",
        ...options 
      }
    );
  },

  fadeInScale: (element: string | Element, options = {}) => {
    return gsap.fromTo(element,
      { scale: 0.8, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 0.6,
        ease: "back.out(1.7)",
        ...options
      }
    );
  },

  slideInFromLeft: (element: string | Element, options = {}) => {
    return gsap.fromTo(element,
      { x: -100, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power3.out",
        ...options
      }
    );
  },

  slideInFromRight: (element: string | Element, options = {}) => {
    return gsap.fromTo(element,
      { x: 100, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power3.out",
        ...options
      }
    );
  },

  // STAGGER ANIMATIONS
  staggerReveal: (elements: string | Element[], options = {}) => {
    return gsap.fromTo(elements,
      { y: 30, opacity: 0, scale: 0.9 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: "back.out(1.7)",
        ...options
      }
    );
  },

  staggerSlide: (elements: string | Element[], direction = 'up', options = {}) => {
    const fromVars = direction === 'up' ? { y: 50 } : 
                    direction === 'down' ? { y: -50 } :
                    direction === 'left' ? { x: 50 } : { x: -50 };
    
    return gsap.fromTo(elements,
      { ...fromVars, opacity: 0 },
      {
        x: 0,
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
        ...options
      }
    );
  },

  // HOVER EFFECTS
  cardHover: (card: Element) => {
    const tl = gsap.timeline({ paused: true });
    tl.to(card, {
      y: -12,
      scale: 1.03,
      boxShadow: "0 25px 50px rgba(0,0,0,0.15)",
      duration: 0.3,
      ease: "power2.out"
    });
    return tl;
  },

  buttonHover: (button: Element) => {
    const tl = gsap.timeline({ paused: true });
    tl.to(button, {
      scale: 1.05,
      duration: 0.2,
      ease: "power2.out"
    });
    return tl;
  },

  magneticEffect: (element: Element, strength = 0.3) => {
    let isHovering = false;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!isHovering) return;
      
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const deltaX = (e.clientX - centerX) * strength;
      const deltaY = (e.clientY - centerY) * strength;
      
      gsap.to(element, {
        x: deltaX,
        y: deltaY,
        duration: 0.3,
        ease: "power2.out"
      });
    };

    const handleMouseEnter = () => {
      isHovering = true;
    };

    const handleMouseLeave = () => {
      isHovering = false;
      gsap.to(element, {
        x: 0,
        y: 0,
        duration: 0.3,
        ease: "power2.out"
      });
    };

    document.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  },

  // SUCCESS & FEEDBACK ANIMATIONS
  checkmarkAnimation: (element: string | Element, options = {}) => {
    return gsap.fromTo(element,
      { scale: 0, rotation: -180 },
      {
        scale: 1,
        rotation: 0,
        duration: 0.6,
        ease: "back.out(2.5)",
        ...options
      }
    );
  },

  pulseSuccess: (element: string | Element, options = {}) => {
    return gsap.to(element, {
      scale: 1.2,
      duration: 0.2,
      ease: "power2.out",
      yoyo: true,
      repeat: 1,
      ...options
    });
  },

  celebrationBurst: (x: number, y: number, colors = ['#10b981', '#3b82f6', '#8b5cf6']) => {
    const particleCount = 8;
    
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.style.cssText = `
        position: fixed;
        width: 6px;
        height: 6px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        border-radius: 50%;
        pointer-events: none;
        z-index: 1000;
      `;
      document.body.appendChild(particle);
      
      gsap.set(particle, { x, y });
      
      const angle = (i / particleCount) * Math.PI * 2;
      const distance = gsap.utils.random(30, 60);
      
      gsap.to(particle, {
        x: x + Math.cos(angle) * distance,
        y: y + Math.sin(angle) * distance,
        opacity: 0,
        scale: 0,
        duration: gsap.utils.random(0.6, 1.2),
        ease: "power2.out",
        onComplete: () => particle.remove()
      });
    }
  },

  // PROGRESS ANIMATIONS
  progressBar: (element: string | Element, progress: number, options = {}) => {
    return gsap.to(element, {
      width: `${progress}%`,
      duration: 1,
      ease: "power2.out",
      ...options
    });
  },

  counterAnimation: (element: Element, endValue: number, options = {}) => {
    const obj = { value: 0 };
    return gsap.to(obj, {
      value: endValue,
      duration: 1.5,
      ease: "power2.out",
      onUpdate: () => {
        element.textContent = Math.round(obj.value).toString();
      },
      ...options
    });
  },

  // MODAL & DIALOG ANIMATIONS
  modalEntrance: (modal: string | Element, backdrop: string | Element) => {
    const tl = gsap.timeline();
    tl.fromTo(backdrop, 
      { opacity: 0 },
      { opacity: 1, duration: 0.3 }
    )
    .fromTo(modal,
      { scale: 0.8, opacity: 0, y: 50 },
      { 
        scale: 1, 
        opacity: 1, 
        y: 0,
        duration: 0.4,
        ease: "back.out(1.7)"
      },
      "-=0.1"
    );
    return tl;
  },

  modalExit: (modal: string | Element, backdrop: string | Element) => {
    const tl = gsap.timeline();
    tl.to(modal, {
      scale: 0.8,
      opacity: 0,
      y: 30,
      duration: 0.3,
      ease: "power2.in"
    })
    .to(backdrop, {
      opacity: 0,
      duration: 0.2
    }, "-=0.1");
    return tl;
  },

  // PAGE TRANSITIONS
  pageTransitionOut: (element: string | Element) => {
    return gsap.to(element, {
      x: -100,
      opacity: 0,
      duration: 0.3,
      ease: "power2.in"
    });
  },

  pageTransitionIn: (element: string | Element) => {
    return gsap.fromTo(element,
      { x: 100, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 0.4,
        ease: "power2.out"
      }
    );
  },

  // TEXT ANIMATIONS
  textReveal: (element: string | Element, options = {}) => {
    return gsap.fromTo(element,
      { y: "100%", opacity: 0 },
      {
        y: "0%",
        opacity: 1,
        duration: 0.8,
        ease: "power3.out",
        ...options
      }
    );
  },

  typewriter: (element: Element, text: string, options = {}) => {
    const chars = text.split('');
    element.textContent = '';
    
    return gsap.to({}, {
      duration: chars.length * 0.05,
      ease: "none",
      onUpdate: function() {
        const progress = this.progress();
        const currentLength = Math.floor(progress * chars.length);
        element.textContent = chars.slice(0, currentLength).join('');
      },
      ...options
    });
  },

  // SCROLL TRIGGERED ANIMATIONS
  scrollReveal: (element: string | Element, options: any = {}) => {
    return gsap.fromTo(element,
      { y: 100, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: element,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
          ...(options.scrollTrigger || {})
        },
        ...options
      }
    );
  },

  parallax: (element: string | Element, speed = 0.5, options: any = {}) => {
    return gsap.to(element, {
      yPercent: -100 * speed,
      ease: "none",
      scrollTrigger: {
        trigger: element,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
        ...(options.scrollTrigger || {})
      },
      ...options
    });
  },

  // LOADING ANIMATIONS
  skeletonPulse: (element: string | Element, options = {}) => {
    return gsap.to(element, {
      opacity: 0.4,
      duration: 1,
      ease: "power2.inOut",
      yoyo: true,
      repeat: -1,
      ...options
    });
  },

  spinLoader: (element: string | Element, options = {}) => {
    return gsap.to(element, {
      rotation: 360,
      duration: 1,
      ease: "none",
      repeat: -1,
      ...options
    });
  }
};

/**
 * React Hook for GSAP Animations
 * Provides cleanup and scoped animation management
 */
export const useGSAPAnimations = () => {
  const animateOnMount = (elements: string, options = {}) => {
    return GSAPAnimations.staggerReveal(elements, options);
  };

  const setupHoverAnimation = (element: Element, type: 'card' | 'button' | 'magnetic' = 'card') => {
    let animation: gsap.core.Timeline | (() => void);
    
    switch (type) {
      case 'card':
        animation = GSAPAnimations.cardHover(element);
        break;
      case 'button':
        animation = GSAPAnimations.buttonHover(element);
        break;
      case 'magnetic':
        animation = GSAPAnimations.magneticEffect(element);
        return animation; // Returns cleanup function
    }

    const handleMouseEnter = () => {
      if (typeof animation.play === 'function') {
        animation.play();
      }
    };

    const handleMouseLeave = () => {
      if (typeof animation.reverse === 'function') {
        animation.reverse();
      }
    };

    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
      if (typeof animation.kill === 'function') {
        animation.kill();
      }
    };
  };

  const createScrollAnimation = (trigger: string | Element, animation: any) => {
    return ScrollTrigger.create({
      trigger,
      start: "top 80%",
      end: "bottom 20%",
      animation,
      toggleActions: "play none none reverse"
    });
  };

  return {
    animateOnMount,
    setupHoverAnimation,
    createScrollAnimation,
    ...GSAPAnimations
  };
};

/**
 * Performance Utilities
 */
export const GSAPUtils = {
  // Batch operations for better performance
  batchSet: (elements: Element[], properties: any) => {
    gsap.set(elements, properties);
  },

  // Quick setters for high-frequency updates
  createQuickSetter: (element: string | Element, property: string, unit?: string) => {
    return gsap.quickSetter(element, property, unit);
  },

  // Quick animations for smooth interactions
  createQuickTo: (element: string | Element, property: string, options = {}) => {
    return gsap.quickTo(element, property, {
      duration: 0.3,
      ease: "power2.out",
      ...options
    });
  },

  // Refresh ScrollTrigger instances
  refreshScrollTrigger: () => {
    ScrollTrigger.refresh();
  },

  // Kill all animations on an element
  killAnimations: (element: string | Element) => {
    gsap.killTweensOf(element);
  },

  // Global performance settings
  setGlobalDefaults: (options = {}) => {
    gsap.defaults({
      ease: "power2.out",
      duration: 0.6,
      ...options
    });
  }
};

export default GSAPAnimations;
