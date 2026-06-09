import { motion } from 'framer-motion'

import { Mic, MicOff } from 'lucide-react'

interface VoiceButtonProps {
  isListening: boolean
  isSupported: boolean
  onClick: () => void
}

export function VoiceButton({ isListening, isSupported, onClick }: VoiceButtonProps) {
  return (
    <div className="relative inline-flex items-center justify-center">
      {/* Concentric ripple rings when listening */}
      {isListening && (
        <>
          <motion.div
            initial={{ scale: 0.9, opacity: 0.8 }}
            animate={{ scale: 2.2, opacity: 0 }}
            transition={{
              repeat: Infinity,
              duration: 2,
              ease: "easeOut",
            }}
            className="absolute inset-0 rounded-full bg-red-500/20 pointer-events-none"
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0.8 }}
            animate={{ scale: 1.8, opacity: 0 }}
            transition={{
              repeat: Infinity,
              duration: 2,
              delay: 0.6,
              ease: "easeOut",
            }}
            className="absolute inset-0 rounded-full bg-red-500/20 pointer-events-none"
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0.8 }}
            animate={{ scale: 1.4, opacity: 0 }}
            transition={{
              repeat: Infinity,
              duration: 2,
              delay: 1.2,
              ease: "easeOut",
            }}
            className="absolute inset-0 rounded-full bg-red-500/20 pointer-events-none"
          />
        </>
      )}

      {/* Main button */}
      <button
        type="button"
        onClick={onClick}
        className={`relative z-10 flex items-center gap-2 px-5 py-2.5 rounded-full border transition-all duration-300 font-syne text-xs font-semibold uppercase tracking-wider ${
          !isSupported
            ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
            : isListening
            ? 'bg-red-50 border-red-500 text-red-500 hover:bg-red-100/80 shadow-md shadow-red-500/10'
            : 'bg-white border-accentPurple text-accentPurple hover:bg-accentPurple/5 hover:shadow-sm'
        }`}
        title={!isSupported ? "Voice input is not supported in this browser" : "Voice search"}
      >
        {isListening ? (
          <>
            <motion.span
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ repeat: Infinity, duration: 1.2 }}
              className="w-2.5 h-2.5 rounded-full bg-red-500 shrink-0"
            />
            <span>Listening...</span>
          </>
        ) : (
          <>
            {isSupported ? (
              <Mic className="w-4 h-4 shrink-0" />
            ) : (
              <MicOff className="w-4 h-4 shrink-0" />
            )}
            <span>Speak Your Topic</span>
          </>
        )}
      </button>
    </div>
  )
}

export default VoiceButton
