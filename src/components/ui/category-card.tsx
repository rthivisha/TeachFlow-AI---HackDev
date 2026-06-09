import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import * as LucideIcons from 'lucide-react'
import type { ToolCategory } from '../../lib/categories'

interface CategoryCardProps {
  category: ToolCategory
  index: number
}

export function CategoryCard({ category, index }: CategoryCardProps) {
  // Dynamically resolve icon from Lucide
  const IconComp = (LucideIcons as any)[category.iconName] || LucideIcons.HelpCircle

  const visibleTools = category.tools.slice(0, 6)
  const remainingCount = category.tools.length - 6


  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      style={{
        width: '100%',
        minWidth: '0',
        boxSizing: 'border-box',
        alignSelf: 'stretch',
        display: 'flex',
        flexDirection: 'column',
        padding: '24px',
        borderRadius: '14px',
        border: '0.5px solid rgba(0,0,0,0.08)',
        background: '#ffffff',
      }}
      className={`group justify-between hover:shadow-[0_12px_24px_rgba(0,0,0,0.06)] border-l-0 transition-shadow duration-300 overflow-hidden h-auto ${
        index === 4 ? 'lg:col-start-2 lg:col-end-3' : ''
      }`}
    >
      {/* Slide-in Accent left border on hover */}
      <span
        style={{ backgroundColor: category.hex }}
        className="absolute left-0 top-0 bottom-0 w-[3px] scale-y-0 group-hover:scale-y-100 transition-transform origin-top duration-300"
      />

      <div>
        {/* Top Header */}
        <div className="flex items-center justify-between mb-6">
          <div style={{ color: category.hex, backgroundColor: `${category.hex}15` }} className="w-10 h-10 rounded-full flex items-center justify-center">
            <IconComp className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-syne font-semibold uppercase tracking-widest text-textSecondary bg-bgPrimary border border-borderCustom px-2.5 py-1 rounded-full">
            Engine {index + 1}
          </span>
        </div>

        {/* Title & Count */}
        <h3 className="font-card-h3 text-lg text-textPrimary leading-snug">
          {category.title}
        </h3>
        <p className="font-sans text-xs mt-1 mb-4">
          <span className="font-semibold" style={{ color: category.hex }}>{category.tools.length} platforms</span> indexed
        </p>

        {/* Chips */}
        <div className="flex flex-wrap gap-1.5 mb-6">
          {visibleTools.map((tool, idx) => (
            <span
              key={idx}
              className="text-[11px] font-sans text-textSecondary bg-bgPrimary border border-borderCustom px-2.5 py-1 rounded-full shrink-0"
            >
              {tool}
            </span>
          ))}
          {remainingCount > 0 && (
            <span
              style={{ color: category.hex, backgroundColor: `${category.hex}08`, borderColor: `${category.hex}15` }}
              className="text-[11px] font-sans font-semibold border px-2.5 py-1 rounded-full shrink-0"
            >
              +{remainingCount} more
            </span>
          )}
        </div>
      </div>

      {/* CTA Bottom */}
      <Link
        to="/discover"
        className="inline-flex items-center gap-1 text-[11px] font-syne font-bold uppercase tracking-wider text-textPrimary hover:opacity-80 transition-all"
      >
        <span>Get Started</span>
        <LucideIcons.ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" />
      </Link>
    </motion.div>
  )
}

// 6th wider card
export function EcosystemWorksCard() {
  return (
    <div
      style={{
        gridColumn: '1 / -1',
        width: '100%',
        background: '#0D0D0D',
        color: '#ffffff',
        borderRadius: '14px',
        padding: '32px 40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
      className="flex flex-col md:flex-row gap-8 shadow-lg"
    >
      <div className="max-w-xl">
        <span className="font-eyebrow text-[10px] tracking-[0.2em] text-accentTeal font-semibold uppercase">
          How The Ecosystem Works
        </span>
        <h3 className="font-playfair text-2xl md:text-3xl font-semibold mt-2 mb-3 leading-tight text-white">
          One prompt. Every platform searched.
        </h3>
        <p className="font-sans text-white/70 text-sm leading-relaxed">
          TeachFlow AI expands your search query into optimized directives and broadcasts it across all five specialized teaching engines. Results are curated, verified for board alignment, and organized into a single workspace in seconds.
        </p>
        <div className="mt-6">
          <a
            href="#how-it-works"
            className="inline-flex items-center gap-1.5 text-xs font-syne font-bold uppercase tracking-wider text-accentTeal hover:underline"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            See How It Works <LucideIcons.ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Orbit decorative SVG */}
      <div className="relative w-36 h-36 shrink-0 mx-auto md:mx-0 flex items-center justify-center">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          {/* Orbit paths */}
          <circle cx="50" cy="50" r="28" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
          <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
          <circle cx="50" cy="50" r="14" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
          
          {/* Center node */}
          <circle cx="50" cy="50" r="4" fill="#0FA884" />
          
          {/* Rotating nodes */}
          <g className="origin-center animate-[spin_8s_linear_infinite]">
            <circle cx="50" cy="22" r="3" fill="#6B5CF6" />
          </g>
          <g className="origin-center animate-[spin_12s_linear_infinite_reverse]">
            <circle cx="92" cy="50" r="3" fill="#E85D40" />
          </g>
          <g className="origin-center animate-[spin_15s_linear_infinite]">
            <circle cx="50" cy="92" r="2.5" fill="#F59E0B" />
          </g>
        </svg>
      </div>
    </div>
  )
}
