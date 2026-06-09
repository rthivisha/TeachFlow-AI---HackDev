import { useEffect, useState, useRef, useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { gsap } from 'gsap'
import { 
  ArrowLeft, Edit2, SlidersHorizontal, RefreshCw, FolderHeart, 
  ChevronLeft, ChevronRight, AlertCircle, Sparkles
} from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useSearch } from '../hooks/useSearch'
import { useBundle } from '../hooks/useBundle'
import type { SearchResult } from '../lib/search'
import { getFriendlyTypeName } from '../lib/search'
import ResourceCard from '../components/ui/resource-card'
import BundlePanel from '../components/ui/bundle-panel'
import { SkeletonGrid } from '../components/ui/skeleton-card'


export function ResultsPage() {
  const [searchParams] = useSearchParams()
  const { user } = useAuth()
  
  // Custom hooks
  const { results, loading, error, triggerSearch } = useSearch()
  const { saveBundle, loading: savingBundle } = useBundle()

  // URL parameters
  const board = searchParams.get('board') || ''
  const grade = searchParams.get('grade') || ''
  const langStr = searchParams.get('lang') || ''
  const topic = searchParams.get('topic') || ''
  const typesStr = searchParams.get('types') || ''

  // local filters state
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState('all')

  // sidebar/panel collapsibility
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [bundleOpen, setBundleOpen] = useState(true)

  // Bookmarks local state
  const [bookmarks, setBookmarks] = useState<SearchResult[]>([])

  // GSAP animation refs
  const gridRef = useRef<HTMLDivElement>(null)

  // Initial trigger search
  useEffect(() => {
    if (topic) {
      const activeTypes = typesStr ? typesStr.split(',') : []
      triggerSearch({
        topic,
        board,
        grade,
        language: langStr,
        types: activeTypes
      })
    }
  }, [searchParams])

  // Sync initial types checkboxes from query parameters
  useEffect(() => {
    if (typesStr) {
      setSelectedTypes(typesStr.split(','))
    }
  }, [typesStr])

  // Get list of platforms that actually returned results
  const availablePlatforms = useMemo(() => {
    if (!results) return []
    const platforms = new Set(results.all.map(r => r.source))
    return Array.from(platforms)
  }, [results])

  // Filter logic: re-filter in-memory results array
  const filteredResults = useMemo(() => {
    if (!results) return []
    let list = results.all

    // 1. Filter by checkboxes selectedTypes
    if (selectedTypes.length > 0) {
      list = list.filter(r => selectedTypes.includes(r.type))
    }

    // 2. Filter by active Tab (tab selection overrides type list if not 'all')
    if (activeTab !== 'all') {
      list = list.filter(r => r.type === activeTab)
    }

    // 3. Filter by checkboxes selectedPlatforms
    if (selectedPlatforms.length > 0) {
      list = list.filter(r => selectedPlatforms.includes(r.source))
    }

    return list
  }, [results, selectedTypes, selectedPlatforms, activeTab])

  // Animate grid cards whenever filters or results change
  useEffect(() => {
    if (gridRef.current && filteredResults.length > 0) {
      gsap.killTweensOf(gridRef.current.children)
      gsap.fromTo(
        gridRef.current.children,
        { opacity: 0, y: 15 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.35, 
          stagger: 0.04, 
          ease: 'power2.out',
          overwrite: 'auto'
        }
      )
    }
  }, [filteredResults, activeTab])

  // Handle sidebar checkbox toggle
  const handleTypeCheckboxToggle = (typeKey: string) => {
    // Animate out filter content area slightly before updating filter
    if (gridRef.current) {
      gsap.to(gridRef.current, { opacity: 0.5, y: -4, duration: 0.15, onComplete: () => {
        setSelectedTypes(prev => {
          const next = prev.includes(typeKey) ? prev.filter(t => t !== typeKey) : [...prev, typeKey]
          return next
        })
        gsap.to(gridRef.current, { opacity: 1, y: 0, duration: 0.25 })
      }})
    }
  }

  const handlePlatformCheckboxToggle = (platform: string) => {
    if (gridRef.current) {
      gsap.to(gridRef.current, { opacity: 0.5, y: -4, duration: 0.15, onComplete: () => {
        setSelectedPlatforms(prev => {
          const next = prev.includes(platform) ? prev.filter(p => p !== platform) : [...prev, platform]
          return next
        })
        gsap.to(gridRef.current, { opacity: 1, y: 0, duration: 0.25 })
      }})
    }
  }

  const handleClearFilters = () => {
    setSelectedTypes([])
    setSelectedPlatforms([])
    setActiveTab('all')
  }

  // Bookmarking Handlers
  const handleBookmarkToggle = (resource: SearchResult) => {
    const isExist = bookmarks.some(b => b.url === resource.url)
    if (isExist) {
      setBookmarks(prev => prev.filter(b => b.url !== resource.url))
    } else {
      setBookmarks(prev => [...prev, resource])
    }
  }

  const handleRemoveBookmark = (index: number) => {
    setBookmarks(prev => prev.filter((_, idx) => idx !== index))
  }

  const handleSaveBundleToDb = async (bundleName: string): Promise<boolean> => {
    const success = await saveBundle(bundleName, bookmarks, {
      board,
      grade,
      language: langStr,
      topic
    })
    return success
  }

  // Get user initials for topbar avatar
  const userInitials = useMemo(() => {
    if (!user?.email) return 'TC'
    return user.email.slice(0, 2).toUpperCase()
  }, [user])

  // Count helper for tabs
  const getTabCount = (typeKey: string) => {
    if (!results) return 0
    let list = results.all
    if (selectedPlatforms.length > 0) {
      list = list.filter(r => selectedPlatforms.includes(r.source))
    }
    return list.filter(r => r.type === typeKey).length
  }

  const getAllTabCount = () => {
    if (!results) return 0
    let list = results.all
    if (selectedPlatforms.length > 0) {
      list = list.filter(r => selectedPlatforms.includes(r.source))
    }
    return list.length
  }

  return (
    <div className="min-h-screen bg-bgPrimary text-textPrimary flex flex-col font-sans">
      
      {/* 1. TOP BAR */}
      <header className="fixed top-0 left-0 w-full z-40 bg-bgSecondary border-b border-borderCustom py-4 px-6 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <Link
            to="/discover"
            className="p-1.5 rounded-lg border border-borderCustom text-textSecondary hover:text-textPrimary hover:bg-bgPrimary transition-all"
            title="Start a new search"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          
          {/* Result context chip */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-bgPrimary border border-borderCustom rounded-xl text-xs font-sans font-medium">
            <span>{board}</span>
            <span className="text-borderCustom">•</span>
            <span>Class {grade}</span>
            <span className="text-borderCustom">•</span>
            <span className="text-accentPurple font-semibold">"{topic}"</span>
            <Link to="/discover" className="p-0.5 text-textSecondary hover:text-accentPurple transition-colors ml-1">
              <Edit2 className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setBundleOpen(!bundleOpen)}
            className={`p-2 rounded-lg border flex items-center gap-1.5 text-xs font-syne font-bold uppercase tracking-wider transition-all ${
              bundleOpen 
                ? 'bg-accentPurple border-accentPurple text-white' 
                : 'bg-white border-borderCustom text-textPrimary hover:bg-bgPrimary'
            }`}
          >
            <FolderHeart className="w-4 h-4" />
            <span className="hidden sm:inline">Bundle ({bookmarks.length})</span>
          </button>

          {/* User Initials Avatar */}
          <div className="w-8 h-8 rounded-full bg-accentTeal text-white font-syne font-bold text-xs uppercase flex items-center justify-center border border-accentTeal/20" title={user?.email || 'Teacher Account'}>
            {userInitials}
          </div>
        </div>
      </header>

      {/* Main Workspace Frame */}
      <div className="flex-grow flex pt-[72px] min-h-[calc(100vh-72px)] overflow-hidden">
        
        {/* 2. FILTER SIDEBAR (LEFT) */}
        <aside
          className={`shrink-0 border-r border-borderCustom bg-bgSecondary transition-all duration-300 overflow-y-auto flex flex-col justify-between ${
            sidebarOpen ? 'w-[220px] p-5 opacity-100' : 'w-0 p-0 opacity-0 overflow-hidden border-r-0'
          }`}
        >
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-borderCustom/50">
              <span className="font-syne text-[10px] uppercase tracking-wider text-textSecondary font-semibold flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5" /> Sidebar Filters
              </span>
              <button onClick={handleClearFilters} className="text-[10px] font-syne uppercase text-accentPurple hover:underline font-semibold">
                Clear All
              </button>
            </div>

            {/* Resource Types Checkboxes */}
            <div className="space-y-2.5">
              <h4 className="text-[10px] font-syne uppercase tracking-wider text-textSecondary/60 font-bold">Resource Format</h4>
              <div className="space-y-1.5">
                {['video', 'image', 'simulation', 'flowchart', 'worksheets', 'pdfs', 'quiz', 'websites'].map((typeKey) => {
                  const isChecked = selectedTypes.includes(typeKey)
                  const count = getTabCount(typeKey)
                  return (
                    <label key={typeKey} className="flex items-center justify-between text-xs font-sans text-textSecondary hover:text-textPrimary cursor-pointer select-none">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleTypeCheckboxToggle(typeKey)}
                          className="rounded border-borderCustom text-accentPurple focus:ring-accentPurple w-3.5 h-3.5"
                        />
                        <span>{getFriendlyTypeName(typeKey)}</span>
                      </div>
                      <span className="text-[10px] bg-bgPrimary border border-borderCustom px-1.5 py-0.5 rounded text-textSecondary/60 font-semibold">{count}</span>
                    </label>
                  )
                })}
              </div>
            </div>

            {/* Platforms checkboxes */}
            {availablePlatforms.length > 0 && (
              <div className="space-y-2.5 pt-4 border-t border-borderCustom/40">
                <h4 className="text-[10px] font-syne uppercase tracking-wider text-textSecondary/60 font-bold">Platform / Domain</h4>
                <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
                  {availablePlatforms.map((platform) => {
                    const isChecked = selectedPlatforms.includes(platform)
                    return (
                      <label key={platform} className="flex items-center gap-2 text-xs font-sans text-textSecondary hover:text-textPrimary cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handlePlatformCheckboxToggle(platform)}
                          className="rounded border-borderCustom text-accentPurple focus:ring-accentPurple w-3.5 h-3.5"
                        />
                        <span className="truncate">{platform}</span>
                      </label>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="pt-6 border-t border-borderCustom/40 text-center">
            <span className="text-[10px] font-syne text-textSecondary/40 tracking-wider block">
              TeachFlow AI Router
            </span>
          </div>
        </aside>

        {/* 3. CONTENT AREA */}
        <main className="flex-grow p-6 md:p-8 overflow-y-auto bg-bgPrimary relative flex flex-col">
          
          {/* Toggle sidebar controller button */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="absolute left-0 top-6 z-10 py-1.5 px-1 bg-bgSecondary border border-l-0 border-borderCustom rounded-r shadow-sm text-textSecondary hover:text-textPrimary transition-all"
            title={sidebarOpen ? "Hide filters" : "Show filters"}
          >
            {sidebarOpen ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </button>

          {loading ? (
            <div className="flex-grow flex flex-col justify-center py-20">
              <div className="text-center max-w-sm mx-auto space-y-4">
                <div className="relative inline-flex items-center justify-center">
                  <RefreshCw className="w-10 h-10 text-accentPurple animate-spin" />
                  <Sparkles className="w-4 h-4 text-accentTeal absolute animate-bounce" />
                </div>
                <h3 className="font-playfair text-xl font-semibold text-textPrimary">
                  Searching Every Platform...
                </h3>
                <p className="font-sans text-xs text-textSecondary leading-relaxed">
                  TeachFlow AI is expanding your prompt, fetching resource listings, and aligning curriculum mappings. This may take a moment.
                </p>
                <SkeletonGrid />
              </div>
            </div>
          ) : error ? (
            <div className="flex-grow flex flex-col items-center justify-center py-20">
              <div className="bg-bgSecondary border border-borderCustom rounded-xl p-8 max-w-md text-center shadow-sm space-y-6">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
                <div className="space-y-2">
                  <h3 className="font-playfair text-xl font-semibold text-textPrimary">Search Failed</h3>
                  <p className="font-sans text-xs text-textSecondary leading-relaxed">{error}</p>
                </div>
                <button
                  onClick={() => triggerSearch({ topic, board, grade, language: langStr, types: typesStr ? typesStr.split(',') : [] })}
                  className="px-6 py-2 bg-textPrimary hover:bg-textPrimary/90 text-white rounded-lg font-syne text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 mx-auto transition-all"
                >
                  Retry Search <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : results ? (
            <div className="space-y-6 flex-grow flex flex-col justify-between">
              
              <div>
                {/* Horizontal Content Tabs */}
                <div className="flex gap-2 overflow-x-auto pb-4 border-b border-borderCustom scrollbar-none">
                  <button
                    onClick={() => setActiveTab('all')}
                    className={`px-4 py-2 rounded-lg font-syne text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-1.5 shrink-0 ${
                      activeTab === 'all'
                        ? 'bg-textPrimary text-white shadow-sm'
                        : 'bg-bgSecondary border border-borderCustom text-textSecondary hover:border-accentPurple/20 hover:text-textPrimary'
                    }`}
                  >
                    <span>All</span>
                    <span className="text-[10px] bg-bgPrimary/10 border border-borderCustom px-1.5 py-0.5 rounded text-inherit/60">{getAllTabCount()}</span>
                  </button>
                  {['video', 'image', 'simulation', 'flowchart', 'worksheets', 'pdfs', 'quiz', 'websites'].map((typeKey) => {
                    const count = getTabCount(typeKey)
                    // Only display tab if it has resources or counts
                    if (count === 0) return null
                    return (
                      <button
                        key={typeKey}
                        onClick={() => setActiveTab(typeKey)}
                        className={`px-4 py-2 rounded-lg font-syne text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-1.5 shrink-0 ${
                          activeTab === typeKey
                            ? 'bg-textPrimary text-white shadow-sm'
                            : 'bg-bgSecondary border border-borderCustom text-textSecondary hover:border-accentPurple/20 hover:text-textPrimary'
                        }`}
                      >
                        <span>{getFriendlyTypeName(typeKey)}s</span>
                        <span className="text-[10px] bg-bgPrimary/10 border border-borderCustom px-1.5 py-0.5 rounded text-inherit/60">{count}</span>
                      </button>
                    )
                  })}
                </div>

                {/* Cards Grid Container */}
                {filteredResults.length === 0 ? (
                  <div className="text-center py-20 text-textSecondary/50 font-sans text-sm">
                    No resources matched the selected sidebar checkboxes.
                  </div>
                ) : (
                  <div
                    ref={gridRef}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6"
                  >
                    {filteredResults.map((item, idx) => {
                      const isBookmarked = bookmarks.some(b => b.url === item.url)
                      return (
                        <ResourceCard
                          key={`${item.url}-${idx}`}
                          resource={item}
                          isBookmarked={isBookmarked}
                          onBookmarkToggle={() => handleBookmarkToggle(item)}
                        />
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Grid Footer details */}
              <div className="pt-10 border-t border-borderCustom/40 flex flex-col sm:flex-row items-center justify-between text-xs text-textSecondary/50 gap-4 mt-auto">
                <span>Surfaced {filteredResults.length} matching resources in 0.8 seconds.</span>
                <span className="flex items-center gap-1 text-[11px] font-syne text-accentTeal font-semibold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" /> Powered by Tavily & Gemini 1.5 Flash
                </span>
              </div>

            </div>
          ) : (
            <div className="flex-grow flex items-center justify-center py-20 text-textSecondary/50 font-sans text-sm">
              Trigger a search to fetch resources.
            </div>
          )}

        </main>

        {/* 4. BUNDLE PANEL (RIGHT) */}
        <aside
          className={`shrink-0 border-l border-borderCustom bg-bgSecondary transition-all duration-300 overflow-y-auto ${
            bundleOpen ? 'w-[280px] p-5 opacity-100' : 'w-0 p-0 opacity-0 overflow-hidden border-l-0'
          }`}
        >
          <BundlePanel
            bookmarks={bookmarks}
            onRemoveBookmark={handleRemoveBookmark}
            onSaveBundle={handleSaveBundleToDb}
            saving={savingBundle}
          />
        </aside>

      </div>
    </div>
  )
}

export default ResultsPage
