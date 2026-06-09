import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import { motion, AnimatePresence } from 'framer-motion'
import { Edit2, Search, ArrowRight, ArrowLeft, ChevronDown, Check, Loader2, Sparkles } from 'lucide-react'
import Navbar from '../components/ui/navbar'
import StepProgress from '../components/ui/step-progress'
import SearchInput from '../components/ui/search-input'
import VoiceButton from '../components/ui/voice-button'
import { useVoiceInput } from '../hooks/useVoiceInput'

const BOARDS = [
  'CBSE', 'ICSE', 'IGCSE', 'IB', 'Tamil Nadu (Samacheer Kalvi)', 
  'Maharashtra', 'Karnataka', 'Kerala', 'Andhra Pradesh', 
  'Telangana', 'Rajasthan', 'Gujarat', 'West Bengal', 'Delhi', 
  'UP Board', 'Bihar', 'MP Board', 'Other State Board'
]

const GRADES = [
  '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', 
  'UG Level', 'Teacher Training'
]

const LANGUAGES = [
  'English', 'Tamil', 'Hindi', 'Telugu', 'Kannada', 'Malayalam', 
  'Marathi', 'Bengali', 'Gujarati', 'Odia', 'Punjabi', 'Urdu', 'Sanskrit'
]

const SUBJECTS = [
  'Mathematics', 'Science', 'Physics', 'Chemistry', 'Biology', 
  'History', 'Geography', 'Civics', 'Economics', 'English', 
  'Computer Science', 'Environmental Science'
]

const EXAMPLES = [
  { topic: 'Magnetism', grade: '8', board: 'CBSE', lang: 'English' },
  { topic: 'Photosynthesis', grade: '10', board: 'Tamil Nadu (Samacheer Kalvi)', lang: 'Tamil' },
  { topic: 'French Revolution', grade: '9', board: 'ICSE', lang: 'English' }
]

const RESOURCE_OPTIONS = [
  { key: 'video', label: 'Video Lessons', color: 'border-accentTeal hover:bg-accentTeal/5', hex: '#0FA884', desc: 'searches YouTube, DIKSHA, Khan Academy' },
  { key: 'image', label: 'Images & Diagrams', color: 'border-accentAmber hover:bg-accentAmber/5', hex: '#F59E0B', desc: 'searches Canva, Adobe Firefly, deep AI' },
  { key: 'simulation', label: 'Simulations', color: 'border-accentBlue hover:bg-accentBlue/5', hex: '#2563EB', desc: 'searches PhET, Labster virtual labs' },
  { key: 'flowchart', label: 'Flowcharts & Mind Maps', color: 'border-accentCoral hover:bg-accentCoral/5', hex: '#E85D40', desc: 'searches Whimsical, Miro, Lucid' },
  { key: 'worksheets', label: 'Worksheets & Practice', color: 'border-accentPurple hover:bg-accentPurple/5', hex: '#6B5CF6', desc: 'searches liveworksheets, worksheetplace' },
  { key: 'pdfs', label: 'PDFs & Notes', color: 'border-gray-400 hover:bg-gray-50', hex: '#6b7280', desc: 'searches NCERT textbooks & publications' },
  { key: 'quiz', label: 'Quizzes & Tests', color: 'border-accentAmber hover:bg-accentAmber/5', hex: '#F59E0B', desc: 'searches Quizizz, Kahoot, Quizgecko' },
  { key: 'websites', label: 'Websites & References', color: 'border-accentTeal hover:bg-accentTeal/5', hex: '#0FA884', desc: 'searches Britannica, Wiki, BBC Bitesize' }
]

export function DiscoverPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const [step, setStep] = useState(1)
  const [slideDirection, setSlideDirection] = useState<'forward' | 'backward'>('forward')

  // Step 1: Context States
  const [board, setBoard] = useState('')
  const [grade, setGrade] = useState('')
  const [languages, setLanguages] = useState<string[]>([])
  
  // Custom dropdown state for Board
  const [boardOpen, setBoardOpen] = useState(false)
  const [boardSearch, setBoardSearch] = useState('')

  // Step 2: Topic States
  const [topic, setTopic] = useState('')

  // Step 3: Types States
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false)

  // Voice Web Speech Hook
  const {
    isListening,
    transcript,
    isSupported,
    startListening,
    stopListening
  } = useVoiceInput()

  // Sync vocal transcript to topic input
  useEffect(() => {
    if (transcript) {
      setTopic(transcript)
    }
  }, [transcript])

  // Support voice activation click
  const handleVoiceToggle = () => {
    if (isListening) {
      stopListening()
    } else {
      // Pass the first selected language to voice locale
      const activeLang = languages[0] || 'English'
      const started = startListening(activeLang)
      if (!started) {
        alert("Voice recognition is not supported on this browser. Please use Google Chrome or Microsoft Edge.")
      }
    }
  }

  // Pre-load parameters if importing a bundle
  useEffect(() => {
    const importId = searchParams.get('importBundle')
    if (importId) {
      console.log('Importing bundle context payload...', importId)
      // Autofill values with CBSE Magnetism placeholder for demonstrate
      setBoard('CBSE')
      setGrade('8')
      setLanguages(['English'])
      setTopic('Magnetism')
    }
  }, [searchParams])

  // Filters boards based on search
  const filteredBoards = BOARDS.filter(b => 
    b.toLowerCase().includes(boardSearch.toLowerCase())
  )

  const handleLanguageToggle = (lang: string) => {
    if (languages.includes(lang)) {
      setLanguages(prev => prev.filter(l => l !== lang))
    } else {
      setLanguages(prev => [...prev, lang])
    }
  }

  const handleTypeToggle = (typeKey: string) => {
    if (selectedTypes.includes(typeKey)) {
      setSelectedTypes(prev => prev.filter(t => t !== typeKey))
    } else {
      setSelectedTypes(prev => [...prev, typeKey])
    }
  }

  const handleSelectAllTypes = () => {
    setSelectedTypes(RESOURCE_OPTIONS.map(r => r.key))
  }

  const handleClearAllTypes = () => {
    setSelectedTypes([])
  }

  const goForward = () => {
    setSlideDirection('forward')
    setStep(prev => prev + 1)
  }

  const goBackward = () => {
    setSlideDirection('backward')
    setStep(prev => prev - 1)
  }

  const handleSearchSubmit = async () => {
    setSubmitting(true)
    // Build query params
    const activeTypes = selectedTypes.length > 0 ? selectedTypes : RESOURCE_OPTIONS.map(r => r.key)
    const typesStr = activeTypes.join(',')
    const langStr = languages.join(',')

    // Simulating short loading latency to wow user
    setTimeout(() => {
      setSubmitting(false)
      navigate(`/results?board=${encodeURIComponent(board)}&grade=${encodeURIComponent(grade)}&lang=${encodeURIComponent(langStr)}&topic=${encodeURIComponent(topic)}&types=${encodeURIComponent(typesStr)}`)
    }, 1200)
  }

  // Animation variants
  const slideVariants = {
    enter: (direction: 'forward' | 'backward') => ({
      x: direction === 'forward' ? 250 : -250,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.35, ease: 'easeOut' }
    },
    exit: (direction: 'forward' | 'backward') => ({
      x: direction === 'forward' ? -250 : 250,
      opacity: 0,
      transition: { duration: 0.3, ease: 'easeIn' }
    })
  }

  return (
    <div className="min-h-screen bg-bgPrimary text-textPrimary flex flex-col justify-between">
      {/* Top Navbar */}
      <Navbar />

      {/* Step Wizard Indicator */}
      <div className="pt-24">
        <StepProgress currentStep={step} />
      </div>

      {/* Main wizard workspace */}
      <main className="flex-grow flex items-center justify-center py-16 px-6 max-w-4xl mx-auto w-full overflow-hidden">
        <AnimatePresence mode="wait" custom={slideDirection}>
          {step === 1 && (
            <motion.div
              key="step-1"
              custom={slideDirection}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full space-y-10"
            >
              {/* Header */}
              <div className="text-center">
                <span className="font-eyebrow text-[10px] tracking-[0.2em] text-accentPurple font-semibold uppercase">
                  Step 1 of 3
                </span>
                <h2 className="font-display-h1 text-4xl mt-3 text-textPrimary">
                  Choose Your Context
                </h2>
                <p className="font-sans text-textSecondary text-base mt-2 max-w-md mx-auto">
                  Specify curriculum parameters to align your resource discovery.
                </p>
              </div>

              {/* Form container */}
              <div className="bg-bgSecondary border border-borderCustom rounded-2xl p-8 shadow-sm space-y-8 max-w-2xl mx-auto">
                {/* Board Dropdown */}
                <div className="relative">
                  <label className="block text-[10px] font-syne uppercase tracking-wider text-textSecondary mb-2 font-semibold">
                    Education Board
                  </label>
                  <button
                    type="button"
                    onClick={() => setBoardOpen(!boardOpen)}
                    className="w-full px-4 py-3 bg-bgPrimary/40 border border-borderCustom rounded-xl text-left text-sm flex items-center justify-between focus:outline-none focus:border-accentPurple transition-colors"
                  >
                    <span className={board ? 'text-textPrimary font-medium' : 'text-textSecondary/50'}>
                      {board || "Select board (e.g. CBSE, ICSE...)"}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-textSecondary transition-transform ${boardOpen ? 'rotate-185' : ''}`} />
                  </button>

                  {/* Dropdown panel */}
                  {boardOpen && (
                    <div className="absolute left-0 right-0 mt-2 bg-white border border-borderCustom rounded-xl shadow-lg z-30 overflow-hidden">
                      <div className="p-3 border-b border-borderCustom/50 flex items-center gap-2">
                        <Search className="w-4 h-4 text-textSecondary/40 shrink-0" />
                        <input
                          type="text"
                          placeholder="Search boards..."
                          value={boardSearch}
                          onChange={(e) => setBoardSearch(e.target.value)}
                          className="w-full text-sm focus:outline-none placeholder:text-textSecondary/30"
                        />
                      </div>
                      <div className="max-h-[220px] overflow-y-auto">
                        {filteredBoards.length === 0 ? (
                          <div className="p-4 text-center text-xs text-textSecondary/50">
                            No boards found.
                          </div>
                        ) : (
                          filteredBoards.map((b) => (
                            <button
                              key={b}
                              type="button"
                              onClick={() => {
                                setBoard(b)
                                setBoardOpen(false)
                                setBoardSearch('')
                              }}
                              className="w-full px-4 py-2.5 hover:bg-bgPrimary/40 text-left text-sm flex items-center justify-between text-textPrimary hover:text-accentPurple transition-colors"
                            >
                              <span>{b}</span>
                              {board === b && <Check className="w-4 h-4 text-accentTeal" />}
                            </button>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Grade Selector */}
                <div>
                  <label className="block text-[10px] font-syne uppercase tracking-wider text-textSecondary mb-3 font-semibold">
                    Grade / Class Level
                  </label>
                  <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                    {GRADES.map((g, idx) => (
                      <motion.button
                        key={g}
                        type="button"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.02 }}
                        onClick={() => setGrade(g)}
                        className={`py-2 rounded-lg font-sans text-xs font-medium border transition-all ${
                          grade === g
                            ? 'bg-accentPurple border-accentPurple text-white shadow-sm'
                            : 'bg-white border-borderCustom text-textSecondary hover:border-accentPurple/20 hover:text-textPrimary'
                        }`}
                      >
                        {isNaN(Number(g)) ? g : `Class ${g}`}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Language Select */}
                <div>
                  <label className="block text-[10px] font-syne uppercase tracking-wider text-textSecondary mb-3 font-semibold">
                    Language Medium (Multi-select)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {LANGUAGES.map((l) => {
                      const isSelected = languages.includes(l)
                      return (
                        <button
                          key={l}
                          type="button"
                          onClick={() => handleLanguageToggle(l)}
                          className={`px-4 py-1.5 rounded-full font-sans text-xs border transition-all flex items-center gap-1.5 ${
                            isSelected
                              ? 'bg-accentTeal border-accentTeal text-white font-medium shadow-sm'
                              : 'bg-white border-borderCustom text-textSecondary hover:border-accentTeal/20 hover:text-textPrimary'
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5" />}
                          <span>{l}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Continue Buttons */}
              <div className="flex justify-end max-w-2xl mx-auto">
                <button
                  type="button"
                  onClick={goForward}
                  disabled={!board || !grade || languages.length === 0}
                  className="px-6 py-3 bg-textPrimary hover:bg-textPrimary/90 text-white rounded-xl font-syne text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-all disabled:opacity-30 disabled:hover:bg-textPrimary"
                >
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step-2"
              custom={slideDirection}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full space-y-10"
            >
              {/* Header */}
              <div className="text-center">
                <span className="font-eyebrow text-[10px] tracking-[0.2em] text-accentPurple font-semibold uppercase">
                  Step 2 of 3
                </span>
                <h2 className="font-display-h1 text-4xl mt-3 text-textPrimary">
                  What Do You Want to Teach?
                </h2>
                <p className="font-sans text-textSecondary text-base mt-2 max-w-md mx-auto">
                  Type or speak your lesson topic.
                </p>
              </div>

              {/* Selections chips bar */}
              <div className="flex flex-wrap items-center justify-center gap-2 max-w-2xl mx-auto bg-bgSecondary/60 border border-borderCustom rounded-xl p-3 text-xs">
                <span className="text-textSecondary/60 font-syne uppercase tracking-wider font-semibold">Active Context:</span>
                <span className="px-2.5 py-1 bg-accentPurple/10 text-accentPurple rounded border border-accentPurple/15 font-sans font-medium">
                  {board}
                </span>
                <span className="px-2.5 py-1 bg-accentTeal/10 text-accentTeal rounded border border-accentTeal/15 font-sans font-medium">
                  {isNaN(Number(grade)) ? grade : `Class ${grade}`}
                </span>
                <span className="px-2.5 py-1 bg-accentAmber/10 text-accentAmber rounded border border-accentAmber/15 font-sans font-medium">
                  {languages.join(', ')}
                </span>
                <button
                  onClick={goBackward}
                  className="p-1 text-textSecondary hover:text-accentPurple transition-colors ml-2"
                  title="Edit context parameters"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Form Input Area */}
              <div className="flex flex-col items-center gap-6 max-w-2xl mx-auto">
                <SearchInput
                  value={topic}
                  onChange={setTopic}
                  onMicClick={handleVoiceToggle}
                  isListening={isListening}
                />

                {/* Voice assistant button with ripples */}
                <VoiceButton
                  isListening={isListening}
                  isSupported={isSupported}
                  onClick={handleVoiceToggle}
                />

                {/* Subject Quick Selection */}
                <div className="w-full text-center">
                  <span className="text-[10px] font-syne uppercase tracking-wider text-textSecondary/50 block mb-2.5 font-semibold">
                    Or select a subject template
                  </span>
                  <div className="flex gap-2 overflow-x-auto pb-2 px-2 mask-linear-edges justify-start md:justify-center">
                    {SUBJECTS.map((sub) => (
                      <button
                        key={sub}
                        type="button"
                        onClick={() => setTopic(prev => prev ? `${prev} ${sub}` : sub)}
                        className="px-4 py-1.5 bg-white border border-borderCustom rounded-full text-xs font-sans text-textSecondary hover:border-accentPurple/20 hover:text-textPrimary transition-all shrink-0"
                      >
                        {sub}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Example prompt cards */}
                <div className="w-full pt-4">
                  <span className="text-[10px] font-syne uppercase tracking-wider text-textSecondary/50 block text-center mb-3.5 font-semibold">
                    Popular Discoveries
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {EXAMPLES.map((ex, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setTopic(ex.topic)
                          setGrade(ex.grade)
                          setBoard(ex.board)
                          setLanguages([ex.lang])
                        }}
                        className="bg-bgSecondary border border-borderCustom rounded-xl p-4 text-left hover:border-accentPurple/20 hover:shadow-sm transition-all"
                      >
                        <span className="font-syne text-[9px] text-accentTeal font-bold uppercase tracking-wider">
                          {ex.board} · Class {ex.grade}
                        </span>
                        <h4 className="font-sans font-semibold text-sm text-textPrimary mt-1">
                          "{ex.topic}"
                        </h4>
                        <span className="text-[10px] text-textSecondary/60 block mt-2">
                          Medium: {ex.lang}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Navigation button row */}
              <div className="flex justify-between max-w-2xl mx-auto pt-6 border-t border-borderCustom/40">
                <button
                  type="button"
                  onClick={goBackward}
                  className="px-6 py-3 border border-borderCustom text-textPrimary hover:bg-bgSecondary rounded-xl font-syne text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-all"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button
                  type="button"
                  onClick={goForward}
                  disabled={topic.trim().length < 3}
                  className="px-6 py-3 bg-textPrimary hover:bg-textPrimary/90 text-white rounded-xl font-syne text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-all disabled:opacity-30 disabled:hover:bg-textPrimary"
                >
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step-3"
              custom={slideDirection}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full space-y-10"
            >
              {/* Header */}
              <div className="text-center">
                <span className="font-eyebrow text-[10px] tracking-[0.2em] text-accentPurple font-semibold uppercase">
                  Step 3 of 3
                </span>
                <h2 className="font-display-h1 text-4xl mt-3 text-textPrimary">
                  What Type of Resources?
                </h2>
                <p className="font-sans text-textSecondary text-base mt-2 max-w-md mx-auto">
                  Select educational output formats to discover.
                </p>
              </div>

              {/* Active Context Chips */}
              <div className="flex flex-wrap items-center justify-center gap-2 max-w-2xl mx-auto bg-bgSecondary/60 border border-borderCustom rounded-xl p-3 text-xs">
                <span className="text-textSecondary/60 font-syne uppercase tracking-wider font-semibold">Search:</span>
                <span className="px-2.5 py-1 bg-accentPurple/10 text-accentPurple rounded border border-accentPurple/15 font-sans font-medium">
                  {board}
                </span>
                <span className="px-2.5 py-1 bg-accentTeal/10 text-accentTeal rounded border border-accentTeal/15 font-sans font-medium">
                  Class {grade}
                </span>
                <span className="px-2.5 py-1 bg-accentAmber/10 text-accentAmber rounded border border-accentAmber/15 font-sans font-medium text-center italic">
                  "{topic}"
                </span>
                <button
                  onClick={() => setStep(2)}
                  className="p-1 text-textSecondary hover:text-accentPurple transition-colors ml-2"
                  title="Edit topic input"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="max-w-2xl mx-auto space-y-4">
                {/* Select / Clear All text buttons */}
                <div className="flex justify-end gap-4 text-xs font-syne uppercase tracking-wider font-semibold px-2">
                  <button
                    type="button"
                    onClick={handleSelectAllTypes}
                    className="text-accentPurple hover:underline"
                  >
                    Select All
                  </button>
                  <span className="text-borderCustom">|</span>
                  <button
                    type="button"
                    onClick={handleClearAllTypes}
                    className="text-textSecondary hover:underline"
                  >
                    Clear All
                  </button>
                </div>

                {/* 8 cards grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {RESOURCE_OPTIONS.map((opt) => {
                    const isSelected = selectedTypes.includes(opt.key)
                    return (
                      <button
                        key={opt.key}
                        type="button"
                        onClick={() => handleTypeToggle(opt.key)}
                        style={{ borderColor: isSelected ? opt.hex : 'rgba(0,0,0,0.08)' }}
                        className={`bg-bgSecondary border-2 rounded-xl p-4 text-left transition-all relative group flex flex-col justify-between h-28 ${
                          isSelected 
                            ? 'shadow-sm shadow-black/5' 
                            : 'hover:shadow-sm'
                        }`}
                      >
                        {/* Selector checkmark */}
                        {isSelected && (
                          <span
                            style={{ backgroundColor: opt.hex }}
                            className="absolute top-2.5 right-2.5 w-4 h-4 rounded-full flex items-center justify-center text-white"
                          >
                            <Check className="w-2.5 h-2.5 stroke-[4]" />
                          </span>
                        )}

                        <div className="min-w-0 pr-6">
                          <h4 className="font-card-h3 text-sm text-textPrimary">
                            {opt.label}
                          </h4>
                          <span className="text-[10px] text-textSecondary/50 line-clamp-2 mt-1 leading-normal font-sans">
                            {opt.desc}
                          </span>
                        </div>

                        {/* Colored bottom tint */}
                        <div
                          style={{ backgroundColor: isSelected ? opt.hex : 'transparent' }}
                          className="h-[3px] w-full absolute bottom-0 left-0 right-0 rounded-b-xl"
                        />
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Navigation button row */}
              <div className="flex justify-between max-w-2xl mx-auto pt-6 border-t border-borderCustom/40">
                <button
                  type="button"
                  onClick={goBackward}
                  className="px-6 py-3 border border-borderCustom text-textPrimary hover:bg-bgSecondary rounded-xl font-syne text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-all"
                  disabled={submitting}
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button
                  type="button"
                  onClick={handleSearchSubmit}
                  disabled={submitting}
                  className="px-8 py-3 bg-accentPurple hover:bg-accentPurple/95 text-white rounded-xl font-syne text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-md shadow-accentPurple/15 disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Searching...
                    </>
                  ) : (
                    <>
                      Discover Resources <Sparkles className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t border-borderCustom py-6 bg-bgSecondary">
        <div className="max-w-6xl mx-auto px-6 text-center text-textSecondary text-xs">
          <p>© 2025 Synora Intel · Private Discovery Workspace.</p>
        </div>
      </footer>
    </div>
  )
}

export default DiscoverPage
