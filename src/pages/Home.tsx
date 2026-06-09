import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { gsap } from 'gsap'

import { ScrollTrigger } from 'gsap/ScrollTrigger'
import * as LucideIcons from 'lucide-react'

// UI Components
import Navbar from '../components/ui/navbar'
import AnimatedSectionDivider from '../components/ui/animated-section-divider'
import { CategoryCard, EcosystemWorksCard } from '../components/ui/category-card'
import FeaturesMarqueeSection from '../components/ui/marquee'
import Accordion from '../components/ui/accordion'

// Data
import { toolCategories, orbitCategoryData } from '../lib/categories'

// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger)

export function HomePage() {
  const [activeTooltip, setActiveTooltip] = useState<{ tool: string; ringIdx: number } | null>(null)
  
  // DOM element refs for GSAP ScrollTriggers
  const heroRef = useRef<HTMLDivElement>(null)
  const arsenalRef = useRef<HTMLDivElement>(null)
  const ecosystemRef = useRef<HTMLDivElement>(null)
  const comparisonRef = useRef<HTMLDivElement>(null)
  const stepsRef = useRef<HTMLDivElement>(null)
  const faqPreviewRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // 1. General Section entry animations
    const sections = [arsenalRef, ecosystemRef, comparisonRef, stepsRef, faqPreviewRef]
    sections.forEach((ref) => {
      const section = ref.current
      if (!section) return

      // Animate entry: y: 60 -> 0, opacity: 0 -> 1
      gsap.fromTo(section, 
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 85%',
            end: 'bottom 15%',
            toggleActions: 'play none none reverse', // reverse when scrolling up past
          }
        }
      )

      // Stagger children inside sections
      const staggerEls = section.querySelectorAll('.stagger-reveal')
      if (staggerEls.length > 0) {
        gsap.fromTo(staggerEls,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 80%',
              toggleActions: 'play none none reverse'
            }
          }
        )
      }
    })

    // 2. Split Hero Word Animation
    const heroWords = document.querySelectorAll('.hero-word')
    if (heroWords.length > 0) {
      gsap.fromTo(heroWords,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: 'power2.out', delay: 0.5 }
      )
    }

    // 3. Comparison panels sliding from left/right
    gsap.fromTo('.comparison-left',
      { x: -120, opacity: 0 },
      { 
        x: 0, 
        opacity: 1, 
        duration: 0.9, 
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '#comparison',
          start: 'top 75%',
          toggleActions: 'play none none reverse'
        }
      }
    )
    gsap.fromTo('.comparison-right',
      { x: 120, opacity: 0 },
      { 
        x: 0, 
        opacity: 1, 
        duration: 0.9, 
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '#comparison',
          start: 'top 75%',
          toggleActions: 'play none none reverse'
        }
      }
    )

    // 4. Ecosystem Category Orbit Rings fade + scale in
    gsap.fromTo('.orbit-ring-card',
      { scale: 0.8, opacity: 0 },
      { 
        scale: 1, 
        opacity: 1, 
        duration: 0.7, 
        stagger: 0.1, 
        ease: 'back.out(1.1)',
        scrollTrigger: {
          trigger: '#ecosystem',
          start: 'top 75%',
          toggleActions: 'play none none reverse'
        }
      }
    )

    // 5. How It Works zigzag steps sliding in alternatingly
    const steps = document.querySelectorAll('.zigzag-step')
    steps.forEach((step, idx) => {
      const isEven = idx % 2 === 0
      gsap.fromTo(step,
        { x: isEven ? -100 : 100, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: step,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      )
    })

    // 6. How It Works progress line scrub height
    gsap.fromTo('.step-progress-line-fill',
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: '#how-it-works',
          start: 'top 40%',
          end: 'bottom 70%',
          scrub: true
        }
      }
    )

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
  }, [])

  return (
    <div className="min-h-screen bg-bgPrimary text-textPrimary selection:bg-accentPurple/25 font-sans overflow-x-hidden">
      
      {/* Navbar header */}
      <Navbar />

      {/* SECTION 1: HERO (id="hero") */}
      <section
        id="hero"
        ref={heroRef}
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: '64px',
          paddingBottom: '80px',
          paddingLeft: '24px',
          paddingRight: '24px',
          textAlign: 'center',
          position: 'relative',
          backgroundImage: `url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: 1,
        }}
        className="w-full overflow-hidden"
      >
        {/* Background image overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(247,246,243,0.94) 72%, #F7F6F3 100%)',
            zIndex: 0,
          }}
          className="pointer-events-none"
        />

        {/* Hero content wrapper (sits above overlay) */}
        <div className="relative z-10 w-full flex flex-col items-center justify-center">

          {/* Floating pill badge */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 16px',
              borderRadius: '999px',
              border: '1px solid rgba(0,0,0,0.12)',
              background: 'rgba(255,255,255,0.85)',
              fontSize: '12px',
              fontFamily: 'Syne, sans-serif',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              marginBottom: '24px',
              marginTop: '24px',
              zIndex: 10,
            }}
            className="relative select-none self-center text-textPrimary font-bold"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-accentTeal animate-pulse" />
            <span>● Synora Intelligence Discovery Router ✦</span>
          </motion.div>

          {/* Headline */}
          <div className="relative z-10 max-w-4xl space-y-1 select-none">
            <h1 
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '72px',
                fontWeight: '800',
                lineHeight: '1.1',
              }}
              className="text-5xl md:text-7xl lg:text-[72px] tracking-tight text-textPrimary"
            >
              <span className="hero-word inline-block mr-3">Less</span>
              <span className="hero-word inline-block mr-3">Searching.</span>
            </h1>
            <h1 
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '72px',
                fontStyle: 'italic',
                color: '#6B5CF6',
                lineHeight: '1.1',
              }}
              className="text-5xl md:text-7xl lg:text-[72px] tracking-tight"
            >
              <span className="hero-word inline-block mr-3">More</span>
              <span className="hero-word inline-block">Teaching.</span>
            </h1>
          </div>

          {/* Subtext */}
          <p 
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '18px',
              maxWidth: '560px',
              margin: '0 auto',
            }}
            className="relative z-10 text-textSecondary mt-6 leading-relaxed text-base md:text-lg"
          >
            Broadcast your lesson plans across every AI educational engine simultaneously. Filtered for your board, grade, and language instantly.
          </p>

          {/* CTA Row */}
          <div 
            style={{
              marginTop: '32px',
              display: 'flex',
              gap: '16px',
              justifyContent: 'center',
            }}
            className="relative z-10 flex flex-col sm:flex-row gap-4"
          >
            <Link
              to="/discover"
              className="px-8 py-3.5 bg-accentPurple hover:bg-accentPurple/95 text-white font-syne text-xs font-bold uppercase tracking-wider rounded-full shadow-md shadow-accentPurple/15 hover:shadow-lg transition-all"
            >
              Start Discovering →
            </Link>
            <button
              onClick={() => document.getElementById('ecosystem')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-3.5 bg-white/40 border border-borderCustom backdrop-blur-sm hover:bg-white text-textPrimary font-syne text-xs font-bold uppercase tracking-wider rounded-full shadow-sm transition-all"
            >
              Explore Ecosystem
            </button>
          </div>

          {/* Floating preview card */}
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
            style={{
              marginTop: '48px',
              maxWidth: '480px',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
            className="relative z-10 bg-white/90 backdrop-blur-md border border-borderCustom rounded-xl p-5 shadow-lg w-full"
          >
            <div className="flex items-center gap-1.5 mb-3.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
            </div>
            <div className="flex flex-wrap gap-1.5 mb-4 justify-center">
              <span className="text-[10px] font-sans font-semibold bg-accentPurple/10 text-accentPurple px-2.5 py-0.5 rounded border border-accentPurple/15">CBSE</span>
              <span className="text-[10px] font-sans font-semibold bg-accentTeal/10 text-accentTeal px-2.5 py-0.5 rounded border border-accentTeal/15">Class 8</span>
              <span className="text-[10px] font-sans font-semibold bg-accentAmber/10 text-accentAmber px-2.5 py-0.5 rounded border border-accentAmber/15">English</span>
              <span className="text-[10px] font-sans font-semibold bg-accentCoral/10 text-accentCoral px-2.5 py-0.5 rounded border border-accentCoral/15">Photosynthesis</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-xs text-textSecondary italic">
              <LucideIcons.Sparkles className="w-4 h-4 text-accentPurple animate-pulse" />
              <span>AI is compiling resources...</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* DRAW LINE */}
      <AnimatedSectionDivider />

      {/* SECTION 2: ARSENAL CARDS (id="arsenal") */}
      <section id="arsenal" ref={arsenalRef} style={{ paddingTop: '80px', paddingBottom: '80px', paddingLeft: '24px', paddingRight: '24px', marginTop: '0' }} className="w-full">
        <div style={{ textAlign: 'center', maxWidth: '800px', marginLeft: 'auto', marginRight: 'auto', marginBottom: '48px' }} className="space-y-3">
          <span className="font-eyebrow text-xs text-accentPurple tracking-[0.2em] font-semibold block">
            Intelligent Engines
          </span>
          <h2 className="font-section-h2 text-4xl md:text-5xl text-textPrimary">
            Your Teaching Arsenal.
          </h2>
          <p className="font-sans text-textSecondary text-base max-w-md mx-auto">
            Five intelligent discovery engines. One unified workspace.
          </p>
        </div>

        {/* 5 Cards Grid */}
        <div 
          style={{
            width: '100%',
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '80px 24px',
            display: 'grid',
            gap: '20px',
            alignItems: 'stretch',
            boxSizing: 'border-box',
          }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
        >
          {toolCategories.map((category, idx) => (
            <CategoryCard key={category.id} category={category} index={idx} />
          ))}

          {/* Ecosystem Works Card */}
          <EcosystemWorksCard />
        </div>
      </section>

      <AnimatedSectionDivider />

      {/* SECTION 3: ECOSYSTEM ORBITS (id="ecosystem") */}
      <section id="ecosystem" ref={ecosystemRef} style={{ paddingTop: '80px', paddingBottom: '80px', paddingLeft: '24px', paddingRight: '24px', marginTop: '0' }} className="bg-bgSecondary/40 w-full">
        <div className="w-full">
          <div style={{ textAlign: 'center', maxWidth: '800px', marginLeft: 'auto', marginRight: 'auto', marginBottom: '48px' }} className="space-y-3">
            <span className="font-eyebrow text-xs text-accentPurple tracking-[0.2em] font-semibold block">
              Multi-Platform Querying
            </span>
            <h2 className="font-section-h2 text-4xl md:text-5xl text-textPrimary">
              Every Resource. <span className="text-accentPurple italic font-medium">One Search.</span>
            </h2>
            <p className="font-sans text-textSecondary text-base max-w-lg mx-auto">
              TeachFlow AI queries AI tools across every resource category simultaneously.
            </p>
          </div>

          {/* Orbit rings canvas visualizer */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 max-w-5xl mx-auto pt-6">
            {orbitCategoryData.map((data, ringIdx) => {
              // Resolve category name and icon
              const catTitle = toolCategories.find(c => c.id === data.category)?.title || 'Category'
              const IconComp = (LucideIcons as any)[data.icon] || LucideIcons.Layers

              return (
                <div
                  key={ringIdx}
                  className="orbit-ring-card bg-bgSecondary border border-borderCustom rounded-xl p-5 flex flex-col justify-between items-center text-center relative shadow-sm min-h-[220px]"
                >
                  <span className="text-[10px] font-syne uppercase tracking-wider text-textSecondary/40 block mb-2 font-bold">
                    {data.category}
                  </span>

                  {/* Centered Orbit ring graphical component */}
                  <div className="relative w-28 h-28 flex items-center justify-center border border-borderCustom rounded-full">
                    {/* Ring line */}
                    <div className="absolute inset-2 border border-borderCustom/40 rounded-full" />
                    
                    {/* Center Icon */}
                    <div style={{ color: data.color }} className="w-8 h-8 rounded-full bg-bgPrimary flex items-center justify-center z-10 shadow-sm border border-borderCustom/60">
                      <IconComp className="w-4 h-4" />
                    </div>

                    {/* Orbiting tool chips */}
                    {data.tools.map((tool, toolIdx) => {
                      // Calculate offset positions to spread orbiting items
                      const angle = (toolIdx / data.tools.length) * 360
                      // Use CSS custom variables to animate orbit
                      const orbitRadius = '36px'
                      const orbitDuration = `${12 + ringIdx * 3}s`

                      return (
                        <div
                          key={toolIdx}
                          className="orbit-item group"
                          style={{
                            '--orbit-x': `calc(${orbitRadius} * cos(${angle}deg))`,
                            '--orbit-y': `calc(${orbitRadius} * sin(${angle}deg))`,
                            '--orbit-duration': orbitDuration,
                          } as React.CSSProperties}
                        >
                          <button
                            onClick={() => setActiveTooltip({ tool, ringIdx })}
                            className="w-4 h-4 rounded-full bg-white border border-borderCustom shadow-sm flex items-center justify-center hover:border-accentPurple transition-colors"
                          >
                            <span style={{ backgroundColor: data.color }} className="w-1.5 h-1.5 rounded-full" />
                          </button>

                          {/* Orbit Ring Chip Tooltip */}
                          <AnimatePresence>
                            {activeTooltip?.tool === tool && activeTooltip?.ringIdx === ringIdx && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-textPrimary text-white text-[10px] font-sans px-2.5 py-1.5 rounded shadow-lg z-30 w-[140px] pointer-events-auto leading-tight"
                              >
                                <div className="flex justify-between items-center mb-1">
                                  <span className="font-semibold">{tool}</span>
                                  <button onClick={(e) => {
                                    e.stopPropagation()
                                    setActiveTooltip(null)
                                  }} className="text-white/40 hover:text-white">
                                    <LucideIcons.X className="w-2.5 h-2.5" />
                                  </button>
                                </div>
                                <span className="text-white/60">Searched via TeachFlow AI</span>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      )
                    })}
                  </div>

                  <h4 className="font-card-h3 text-xs mt-4 text-textPrimary leading-snug">
                    {catTitle}
                  </h4>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <AnimatedSectionDivider />

      {/* SECTION 4: COMPARISON (id="comparison") */}
      <section id="comparison" ref={comparisonRef} style={{ paddingTop: '80px', paddingBottom: '80px', paddingLeft: '24px', paddingRight: '24px', marginTop: '0' }} className="w-full">
        <div style={{ textAlign: 'center', maxWidth: '800px', marginLeft: 'auto', marginRight: 'auto', marginBottom: '48px' }} className="space-y-3">
          <span className="font-eyebrow text-xs text-accentPurple tracking-[0.2em] font-semibold block">
            The Difference
          </span>
          <h2 className="font-section-h2 text-4xl md:text-5xl text-textPrimary">
            Stop wasting hours on <span className="text-accentPurple italic font-medium">manual search.</span>
          </h2>
        </div>

        {/* Side-by-Side GSAP Sliding Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          
          {/* Left panel (Traditional) */}
          <div className="comparison-left bg-bgSecondary border border-red-200/60 rounded-2xl p-8 shadow-sm flex flex-col justify-between min-h-[360px]">
            <div>
              <span className="text-[10px] font-syne uppercase tracking-wider text-red-500 font-bold block mb-1">Traditional Method</span>
              <h3 className="font-playfair text-xl font-bold text-textPrimary mb-6">Manual Tab Searching</h3>
              
              <div className="space-y-3">
                {[
                  "Tab 1: YouTube — Searching classroom video...",
                  "Tab 2: PhET — Finding simulation labs...",
                  "Tab 3: Diffit — Generating practice sheets...",
                  "Tab 4: Kahoot — Compiling quiz questions...",
                  "Tab 5: Miro — Structuring flowchart maps..."
                ].map((row, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-xs text-textSecondary">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                    <span className="truncate">{row}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-borderCustom flex items-center justify-between mt-8 text-xs">
              <div className="space-y-0.5">
                <span className="text-textSecondary/50 block">Stress Index</span>
                <span className="font-bold text-red-500 uppercase tracking-wide">High (90%)</span>
              </div>
              <div className="space-y-0.5">
                <span className="text-textSecondary/50 block">Time Elapsed</span>
                <span className="font-bold text-textPrimary text-xl">35 Min</span>
              </div>
            </div>
          </div>

          {/* Right panel (TeachFlow) */}
          <div className="comparison-right bg-bgSecondary border border-accentTeal/60 rounded-2xl p-8 shadow-sm flex flex-col justify-between min-h-[360px]">
            <div>
              <span className="text-[10px] font-syne uppercase tracking-wider text-accentTeal font-bold block mb-1">Teachflow Router</span>
              <h3 className="font-playfair text-xl font-bold text-textPrimary mb-6 font-medium">AI Discovery Packs</h3>
              
              <div className="space-y-3">
                {[
                  "Videos Found & Curated",
                  "Simulation Labs Compiled",
                  "Diagrams & Visuals Organised",
                  "Quizzes & Tests Generated"
                ].map((row, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-xs text-textSecondary">
                    <LucideIcons.Check className="w-4 h-4 text-accentTeal shrink-0 stroke-[3]" />
                    <span>{row}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-borderCustom flex items-center justify-between mt-8 text-xs">
              <div className="space-y-0.5">
                <span className="text-textSecondary/50 block">Stress Index</span>
                <span className="font-bold text-accentTeal uppercase tracking-wide">0% Stress</span>
              </div>
              <div className="space-y-0.5 animate-pulse">
                <span className="text-textSecondary/50 block">Router Speed</span>
                <span className="font-bold text-accentPurple text-xl">30 Sec</span>
              </div>
            </div>
          </div>

        </div>

        {/* Comparison Table below */}
        <div className="max-w-4xl mx-auto mt-20 border border-borderCustom bg-bgSecondary rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse text-xs md:text-sm">
            <thead>
              <tr className="bg-bgPrimary border-b border-borderCustom">
                <th className="p-4 font-syne uppercase tracking-wider font-semibold text-textSecondary">Capability</th>
                <th className="p-4 font-syne uppercase tracking-wider font-semibold text-textSecondary">Manual Search</th>
                <th className="p-4 bg-accentPurple/5 font-syne uppercase tracking-wider font-semibold text-accentPurple">Teachflow AI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-borderCustom text-textSecondary font-sans">
              <tr>
                <td className="p-4 font-medium text-textPrimary">Search time</td>
                <td className="p-4">35 minutes</td>
                <td className="p-4 bg-accentPurple/5 font-semibold text-textPrimary">30 seconds</td>
              </tr>
              <tr>
                <td className="p-4 font-medium text-textPrimary">Platforms queried</td>
                <td className="p-4">1-2 at a time</td>
                <td className="p-4 bg-accentPurple/5">75+ simultaneously</td>
              </tr>
              <tr>
                <td className="p-4 font-medium text-textPrimary">Curriculum alignment</td>
                <td className="p-4">Self-verified</td>
                <td className="p-4 bg-accentPurple/5 font-semibold text-accentTeal">✓ Automatically aligned</td>
              </tr>
              <tr>
                <td className="p-4 font-medium text-textPrimary">Language filtering</td>
                <td className="p-4">Manual keywords</td>
                <td className="p-4 bg-accentPurple/5">13 local languages</td>
              </tr>
              <tr>
                <td className="p-4 font-medium text-textPrimary">Resource types</td>
                <td className="p-4">Single source format</td>
                <td className="p-4 bg-accentPurple/5">8 educational formats</td>
              </tr>
              <tr>
                <td className="p-4 font-medium text-textPrimary">Sharing</td>
                <td className="p-4">Copy links manually</td>
                <td className="p-4 bg-accentPurple/5">Unified lesson bundle</td>
              </tr>
              <tr>
                <td className="p-4 font-medium text-textPrimary">Voice input</td>
                <td className="p-4">No</td>
                <td className="p-4 bg-accentPurple/5">Yes (Local Web Speech)</td>
              </tr>
              <tr>
                <td className="p-4 font-medium text-textPrimary">Free to use</td>
                <td className="p-4">Yes</td>
                <td className="p-4 bg-accentPurple/5 font-semibold">Yes for Teachers</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <AnimatedSectionDivider />

      {/* SECTION 5: HOW IT WORKS (id="how-it-works") */}
      <section id="how-it-works" ref={stepsRef} style={{ paddingTop: '80px', paddingBottom: '80px', paddingLeft: '24px', paddingRight: '24px', marginTop: '0' }} className="bg-bgSecondary/20 w-full">
        <div className="w-full">
          <div style={{ textAlign: 'center', maxWidth: '800px', marginLeft: 'auto', marginRight: 'auto', marginBottom: '48px' }} className="space-y-3">
            <span className="font-eyebrow text-xs text-accentPurple tracking-[0.2em] font-semibold block">
              The Protocol
            </span>
            <h2 className="font-section-h2 text-4xl md:text-5xl text-textPrimary">
              How TeachFlow <span className="text-accentPurple italic font-medium">works.</span>
            </h2>
          </div>

          {/* Zigzag steps wrapper with progress timeline */}
          <div className="max-w-4xl mx-auto relative pt-4 space-y-16">
            
            {/* Scroll scrubbed progress line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 top-10 bottom-10 w-0.5 bg-borderCustom z-0 hidden md:block">
              <div className="step-progress-line-fill w-full h-full bg-accentPurple origin-top transform scale-y-0" />
            </div>

            {/* Step 1 */}
            <div className="zigzag-step grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10">
              <div className="md:col-span-5 text-left md:text-right order-2 md:order-1">
                <span className="font-syne text-[10px] text-accentTeal font-bold uppercase tracking-wider">Step 1</span>
                <h3 className="font-playfair text-xl font-bold text-textPrimary mt-1.5 mb-2.5">Enter Lesson Topic</h3>
                <p className="font-sans text-xs text-textSecondary leading-relaxed">
                  Provide your lesson theme or speak your instructions. Select your board (CBSE/Samacheer Kalvi/etc.), Class grade level, and language medium context.
                </p>
              </div>
              <div className="md:col-span-2 flex justify-center order-1 md:order-2">
                <div className="w-10 h-10 rounded-full bg-bgSecondary border border-borderCustom flex items-center justify-center shadow font-syne font-bold text-xs">
                  1
                </div>
              </div>
              <div className="md:col-span-5 bg-bgSecondary border border-borderCustom rounded-xl p-4.5 shadow-sm order-3">
                <div className="space-y-2">
                  <div className="h-7 bg-bgPrimary rounded-lg flex items-center px-3 gap-2 border border-borderCustom">
                    <LucideIcons.Search className="w-3.5 h-3.5 text-textSecondary/40" />
                    <span className="text-[10px] font-sans text-textSecondary font-semibold">Magnetism & Induction</span>
                  </div>
                  <div className="flex gap-1">
                    <span className="text-[9px] bg-accentPurple/15 text-accentPurple px-2 py-0.5 rounded">CBSE</span>
                    <span className="text-[9px] bg-accentTeal/15 text-accentTeal px-2 py-0.5 rounded">Class 8</span>
                    <span className="text-[9px] bg-accentAmber/15 text-accentAmber px-2 py-0.5 rounded">Tamil Medium</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="zigzag-step grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10">
              <div className="md:col-span-5 bg-bgSecondary border border-borderCustom rounded-xl p-4.5 shadow-sm order-3 md:order-1">
                <div className="bg-[#12131C] text-accentTeal p-4.5 rounded-lg font-mono text-[10px] space-y-1">
                  <p className="text-white/40">// Query expansion logs</p>
                  <p><span className="text-accentPurple">root:</span> expand "Magnetism" --class 8</p>
                  <p><span className="text-accentAmber">&gt;</span> Directives: ["magnetic flux", "bar magnets", "field lines"]</p>
                  <p><span className="text-accentTeal">&gt;</span> Querying 5 categories simultaneously...</p>
                </div>
              </div>
              <div className="md:col-span-2 flex justify-center order-1 md:order-2">
                <div className="w-10 h-10 rounded-full bg-bgSecondary border border-borderCustom flex items-center justify-center shadow font-syne font-bold text-xs">
                  2
                </div>
              </div>
              <div className="md:col-span-5 text-left order-2 md:order-3">
                <span className="font-syne text-[10px] text-accentTeal font-bold uppercase tracking-wider">Step 2</span>
                <h3 className="font-playfair text-xl font-bold text-textPrimary mt-1.5 mb-2.5">AI Query Expansion</h3>
                <p className="font-sans text-xs text-textSecondary leading-relaxed">
                  Our router evaluates your topic inputs, structures subqueries for topic keywords, and targets relevant indices according to education standards.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="zigzag-step grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10">
              <div className="md:col-span-5 text-left md:text-right order-2 md:order-1">
                <span className="font-syne text-[10px] text-accentTeal font-bold uppercase tracking-wider">Step 3</span>
                <h3 className="font-playfair text-xl font-bold text-textPrimary mt-1.5 mb-2.5">Curation & Verification</h3>
                <p className="font-sans text-xs text-textSecondary leading-relaxed">
                  TeachFlow AI executes search queries on external sites. Results are evaluated using curriculum scoring to flag whether content aligns with target education board metrics.
                </p>
              </div>
              <div className="md:col-span-2 flex justify-center order-1 md:order-2">
                <div className="w-10 h-10 rounded-full bg-bgSecondary border border-borderCustom flex items-center justify-center shadow font-syne font-bold text-xs">
                  3
                </div>
              </div>
              <div className="md:col-span-5 bg-bgSecondary border border-borderCustom rounded-xl p-4.5 shadow-sm order-3">
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="font-semibold font-sans">CBSE Alignment Score</span>
                    <span className="text-accentTeal font-bold">98%</span>
                  </div>
                  <div className="w-full bg-bgPrimary h-2 rounded-full overflow-hidden">
                    <div className="bg-accentTeal h-full w-[98%] rounded-full" />
                  </div>
                  <span className="inline-block text-[9px] font-sans text-accentTeal bg-accentTeal/10 px-2 py-0.5 rounded font-medium mt-1">
                    ✓ Verified Curriculum Aligned
                  </span>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="zigzag-step grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10">
              <div className="md:col-span-5 bg-bgSecondary border border-borderCustom rounded-xl p-4.5 shadow-sm order-3 md:order-1">
                <div className="grid grid-cols-2 gap-2">
                  {["YouTube explainer", "PhET simulation lab", "Printable worksheet", "Lesson Quiz"].map((row, i) => (
                    <div key={i} className="border border-borderCustom bg-bgPrimary/30 rounded p-2 text-[10px] font-sans flex items-center gap-1.5 truncate">
                      <LucideIcons.CheckSquare className="w-3.5 h-3.5 text-accentPurple shrink-0" />
                      <span className="truncate">{row}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="md:col-span-2 flex justify-center order-1 md:order-2">
                <div className="w-10 h-10 rounded-full bg-bgSecondary border border-borderCustom flex items-center justify-center shadow font-syne font-bold text-xs">
                  4
                </div>
              </div>
              <div className="md:col-span-5 text-left order-2 md:order-3">
                <span className="font-syne text-[10px] text-accentTeal font-bold uppercase tracking-wider">Step 4</span>
                <h3 className="font-playfair text-xl font-bold text-textPrimary mt-1.5 mb-2.5">Organized Workspace</h3>
                <p className="font-sans text-xs text-textSecondary leading-relaxed">
                  Browse video links, simulation sandboxes, visual diagrams, flowcharts, and assessments in one clean workspace. Bookmark to compile and share bundles immediately.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* DRAW LINE */}
      <AnimatedSectionDivider />

      {/* SECTION 6: FEATURES (Redesigned with Marquee) */}
      <FeaturesMarqueeSection />

      {/* DRAW LINE */}
      <AnimatedSectionDivider />

      {/* SECTION 7: MINI FAQ PREVIEW (id="faq-preview") */}
      <section id="faq-preview" ref={faqPreviewRef} style={{ paddingTop: '80px', paddingBottom: '80px', paddingLeft: '24px', paddingRight: '24px', marginTop: '0' }} className="w-full">
        <div style={{ textAlign: 'center', maxWidth: '800px', marginLeft: 'auto', marginRight: 'auto', marginBottom: '48px' }} className="space-y-3">
          <span className="font-eyebrow text-xs text-accentPurple tracking-[0.2em] font-semibold block">
            FAQ Preview
          </span>
          <h2 className="font-section-h2 text-4xl md:text-5xl text-textPrimary">
            Common Questions
          </h2>
        </div>

        {/* 3 Common accordions */}
        <div className="space-y-4 max-w-2xl mx-auto">
          <Accordion
            question="How do I get started with TeachFlow AI?"
            answer="Simply click 'Start Discovering' on the homepage to go directly to the Discovery Wizard. There is no account creation or sign-in required to begin searching."
          />
          <Accordion
            question="Where does the AI get its search results from?"
            answer="TeachFlow AI queries across top educational websites and specialized tool indices simultaneously using Tavily Search. When results are sparse, the Gemini API is automatically triggered to recommend targeted, highly relevant curriculum resources."
          />
          <Accordion
            question="Is TeachFlow AI free to use for individual teachers?"
            answer="Yes, the core TeachFlow AI search and workspace is 100% free for individual classroom teachers. We want to make high-quality educational resources accessible to everyone."
          />
        </div>

        <div className="text-center mt-10">
          <Link
            to="/faq"
            className="inline-flex items-center gap-1 text-xs font-syne font-bold uppercase tracking-wider text-accentPurple hover:underline"
          >
            See all FAQs <LucideIcons.ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-bgSecondary border-t border-borderCustom py-16">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-10">
          
          {/* Col 1 Brand */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex flex-col items-start leading-none">
              <span className="font-syne font-bold text-textPrimary text-base tracking-wide">
                TeachFlow AI
              </span>
              <span className="font-syne font-semibold text-[9px] text-accentTeal tracking-[0.18em] uppercase mt-0.5">
                SYNORA INTEL
              </span>
            </div>
            <p className="font-sans text-xs text-textSecondary leading-relaxed max-w-sm">
              Making educational resources instant and accessible. We build tools that cut search time for teachers, giving you more hours in the classroom.
            </p>
            <div className="pt-2">
              <a
                href="https://linkedin.com/company/synora-intel"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full border border-borderCustom flex items-center justify-center text-textSecondary hover:text-accentPurple hover:border-accentPurple transition-colors"
                title="LinkedIn Page"
              >
                <LucideIcons.Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2 Product */}
          <div className="md:col-span-2 space-y-3.5 text-xs">
            <h5 className="font-syne font-bold uppercase tracking-wider text-textPrimary">Product</h5>
            <ul className="space-y-2 font-sans text-textSecondary">
              <li><Link to="/discover" className="hover:text-textPrimary transition-colors">Discovery Router</Link></li>
              <li><a href="#arsenal" className="hover:text-textPrimary transition-colors" onClick={(e) => { e.preventDefault(); document.getElementById('arsenal')?.scrollIntoView({ behavior: 'smooth' }) }}>Resource Category</a></li>
              <li><a href="#comparison" className="hover:text-textPrimary transition-colors" onClick={(e) => { e.preventDefault(); document.getElementById('comparison')?.scrollIntoView({ behavior: 'smooth' }) }}>Manual vs Router</a></li>
            </ul>
          </div>

          {/* Col 3 Resources */}
          <div className="md:col-span-2 space-y-3.5 text-xs">
            <h5 className="font-syne font-bold uppercase tracking-wider text-textPrimary">Resources</h5>
            <ul className="space-y-2 font-sans text-textSecondary">
              <li><Link to="/faq" className="hover:text-textPrimary transition-colors">FAQ Knowledge Base</Link></li>
              <li><Link to="/contact" className="hover:text-textPrimary transition-colors">Help Center</Link></li>
              <li><a href="mailto:hello@synoraIntel.com" className="hover:text-textPrimary transition-colors">Developer Contact</a></li>
            </ul>
          </div>

          {/* Col 4 Company */}
          <div className="md:col-span-3 space-y-3.5 text-xs">
            <h5 className="font-syne font-bold uppercase tracking-wider text-textPrimary">Company</h5>
            <ul className="space-y-2 font-sans text-textSecondary">
              <li><span className="opacity-75">Synora Intelligence Intel Group</span></li>
              <li><span className="opacity-50">Private Research Laboratory</span></li>
              <li><span className="opacity-50">Bangalore · Dublin · Silicon Valley</span></li>
            </ul>
          </div>

        </div>

        {/* Bottom */}
        <div className="max-w-6xl mx-auto px-6 border-t border-borderCustom/50 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-textSecondary/50 font-sans">
          <span>© 2025 Synora Intel · Synora Intelligence Discovery Router.</span>
          <div className="flex gap-4">
            <Link to="/faq" className="hover:underline">Privacy Policy</Link>
            <span>·</span>
            <Link to="/faq" className="hover:underline">Terms of Service</Link>
          </div>
        </div>
      </footer>

    </div>
  )
}

export default HomePage
