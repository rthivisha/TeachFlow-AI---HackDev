import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ArrowRight } from 'lucide-react'

const navLinks = [
  { name: 'Ecosystem', hash: '#ecosystem' },
  { name: 'Comparison', hash: '#comparison' },
  { name: 'How It Works', hash: '#how-it-works' },
  { name: 'Features', hash: '#features' },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on path changes
  useEffect(() => {
    setIsOpen(false)
  }, [location])

  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, hash: string) => {
    e.preventDefault()
    setIsOpen(false)

    if (location.pathname === '/') {
      const el = document.querySelector(hash)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
      }
    } else {
      // Navigate to homepage first, then scroll to section after mount
      navigate('/' + hash)
    }
  }

  return (
    <>
      <header
        style={{ height: '64px', padding: '0 32px' }}
        className={`fixed top-0 left-0 w-full z-[100] flex items-center justify-between box-border transition-all duration-300 ${
          scrolled
            ? 'backdrop-blur-md bg-bgPrimary/88 border-b border-borderCustom shadow-sm'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        {/* Left section: Logo + "SYNORA INTEL" subtitle */}
        <Link to="/" className="flex flex-col items-start leading-none group shrink-0">
          <span className="font-syne font-bold text-textPrimary text-base tracking-wide group-hover:opacity-85 transition-opacity">
            TeachFlow AI
          </span>
          <span className="font-syne font-semibold text-[9px] text-accentTeal tracking-[0.18em] uppercase mt-0.5">
            SYNORA INTEL
          </span>
        </Link>

        {/* Center section: Nav links row centered absolutely */}
        <nav className="hidden md:flex items-center gap-8 absolute left-1/2 transform -translate-x-1/2 whitespace-nowrap z-[101]">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.hash}
              onClick={(e) => handleAnchorClick(e, link.hash)}
              className="font-sans text-xs text-textSecondary hover:text-textPrimary font-medium transition-colors"
            >
              {link.name}
            </a>
          ))}
          <Link
            to="/faq"
            className={`font-sans text-xs hover:text-textPrimary font-medium transition-colors ${
              location.pathname === '/faq' ? 'text-textPrimary font-semibold' : 'text-textSecondary'
            }`}
          >
            FAQ
          </Link>
          <Link
            to="/contact"
            className={`font-sans text-xs hover:text-textPrimary font-medium transition-colors ${
              location.pathname === '/contact' ? 'text-textPrimary font-semibold' : 'text-textSecondary'
            }`}
          >
            Contact
          </Link>
        </nav>

        {/* Right section: CTA button / Hamburger */}
        <div className="flex items-center gap-4 shrink-0">
          <div className="hidden md:flex items-center">
            <Link
              to="/discover"
              className="inline-flex items-center gap-1.5 px-4.5 py-2.5 bg-accentPurple hover:bg-accentPurple/95 text-white font-syne text-xs font-semibold uppercase tracking-wider rounded-full shadow-sm hover:shadow-md transition-all duration-200"
            >
              Start Discovering <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden flex p-1.5 rounded-lg border border-borderCustom text-textPrimary bg-bgSecondary hover:bg-bgPrimary transition-colors items-center justify-center"
            aria-label="Toggle navigation menu"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            style={{
              backgroundColor: 'rgba(247, 246, 243, 0.97)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
            }}
            className="fixed inset-x-0 top-16 bottom-0 z-30 border-t border-borderCustom flex flex-col md:hidden overflow-y-auto"
          >
            <div className="flex flex-col w-full">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.hash}
                  onClick={(e) => handleAnchorClick(e, link.hash)}
                  className="font-syne text-base text-textSecondary hover:text-textPrimary font-semibold tracking-wider transition-colors py-4 px-6 border-b border-black/[0.06]"
                >
                  {link.name}
                </a>
              ))}
              <Link
                to="/faq"
                className="font-syne text-base text-textSecondary hover:text-textPrimary font-semibold tracking-wider transition-colors py-4 px-6 border-b border-black/[0.06]"
              >
                FAQ
              </Link>
              <Link
                to="/contact"
                className="font-syne text-base text-textSecondary hover:text-textPrimary font-semibold tracking-wider transition-colors py-4 px-6 border-b border-black/[0.06]"
              >
                Contact
              </Link>

              <div className="p-6">
                <Link
                  to="/discover"
                  className="w-full py-3 bg-accentPurple text-white font-syne text-xs font-bold text-center uppercase tracking-wider rounded-full flex items-center justify-center gap-2"
                >
                  Start Discovering <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Navbar
