import { useInView } from 'framer-motion'
import { useRef } from 'react'

export function useScrollReveal(once = true, amount = 0.15) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once, amount })
  return { ref, isInView }
}
