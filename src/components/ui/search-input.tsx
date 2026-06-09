import { useRef, useEffect } from 'react'
import { Search, Mic } from 'lucide-react'


interface SearchInputProps {
  value: string
  onChange: (val: string) => void
  onMicClick: () => void
  isListening: boolean
  placeholder?: string
}

export function SearchInput({ value, onChange, onMicClick, isListening, placeholder }: SearchInputProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  // Autofocus on mount
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  return (
    <div className="relative w-full max-w-2xl">
      <div className={`relative flex items-center bg-bgSecondary border-2 rounded-2xl transition-all duration-300 ${
        isListening 
          ? 'border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.15)]' 
          : 'border-borderCustom focus-within:border-accentPurple focus-within:shadow-[0_0_20px_rgba(107,92,246,0.12)]'
      }`}>
        {/* Left Search Icon */}
        <Search className="absolute left-5 w-5 h-5 text-textSecondary/40" />

        {/* Input field */}
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || "e.g. Magnetism, Photosynthesis, French Revolution..."}
          className="w-full pl-14 pr-14 py-4 bg-transparent text-textPrimary text-sm focus:outline-none placeholder:text-textSecondary/40"
        />

        {/* Right Mic Icon Trigger */}
        <button
          type="button"
          onClick={onMicClick}
          className={`absolute right-4 p-2 rounded-xl transition-all ${
            isListening 
              ? 'text-red-500 bg-red-50 animate-pulse' 
              : 'text-textSecondary/40 hover:text-accentPurple hover:bg-accentPurple/5'
          }`}
          title="Speak topic"
        >
          <Mic className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}

export default SearchInput
