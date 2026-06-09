import { useState } from 'react'

import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

interface AccordionProps {
  question: string
  answer: string
}

export function Accordion({ question, answer }: AccordionProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="border border-borderCustom bg-bgSecondary rounded-xl overflow-hidden transition-all duration-300 hover:border-accentPurple/25">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4.5 flex items-center justify-between text-left focus:outline-none"
      >
        <span className="font-card-h3 text-textPrimary text-sm tracking-wide select-none">
          {question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="text-textSecondary shrink-0 ml-4"
        >
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            transition={{ type: 'spring', stiffness: 220, damping: 24 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-5 font-sans text-xs text-textSecondary leading-relaxed border-t border-borderCustom/40 pt-3">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Accordion
