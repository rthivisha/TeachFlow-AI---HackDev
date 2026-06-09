import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger)

export function AnimatedSectionDivider() {
  const containerRef = useRef<HTMLDivElement>(null)
  const pathRef = useRef<SVGPathElement>(null)

  useEffect(() => {
    const path = pathRef.current
    const container = containerRef.current
    if (!path || !container) return

    // Ensure path has dimensions computed
    let length = 1000
    try {
      length = path.getTotalLength() || 1000
    } catch (e) {
      console.warn("Could not calculate total SVG length, using fallback.")
    }

    // Set initial dash array and offset properties
    gsap.set(path, {
      strokeDasharray: length,
      strokeDashoffset: length,
      opacity: 1
    })

    // 1. Draw line as it enters viewport
    const drawTrigger = gsap.to(path, {
      strokeDashoffset: 0,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: container,
        start: 'top 92%', // Triggers near bottom of viewport
        end: 'bottom 80%',
        scrub: 0.5,
        toggleActions: 'play none none reverse'
      }
    })

    // 2. Fade line out as it scrolls high up and leaves
    const fadeTrigger = gsap.to(container, {
      opacity: 0,
      scrollTrigger: {
        trigger: container,
        start: 'top 20%', // Triggers as it moves past the upper view
        end: 'top 5%',
        scrub: true
      }
    })

    return () => {
      drawTrigger.scrollTrigger?.kill()
      fadeTrigger.scrollTrigger?.kill()
    }
  }, [])

  return (
    <div ref={containerRef} className="w-full flex justify-center py-6 overflow-visible">
      <svg 
        className="w-[90%] max-w-6xl h-[2px] overflow-visible" 
        viewBox="0 0 1000 2" 
        fill="none" 
        preserveAspectRatio="none"
      >
        <path
          ref={pathRef}
          d="M0 1 H1000"
          stroke="rgba(0,0,0,0.12)"
          strokeWidth="1"
          strokeLinecap="round"
        />
      </svg>
    </div>
  )
}

export default AnimatedSectionDivider
