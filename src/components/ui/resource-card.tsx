import { Bookmark, BookmarkCheck, ExternalLink, CheckCircle } from 'lucide-react'
import type { SearchResult } from '../../lib/search'
import { getFriendlyTypeName } from '../../lib/search'


interface ResourceCardProps {
  resource: SearchResult
  isBookmarked: boolean
  onBookmarkToggle: () => void
}

const RESOURCE_COLORS: Record<string, { bg: string; text: string; gradient: string }> = {
  video: { bg: 'bg-accentTeal/10', text: 'text-accentTeal', gradient: 'from-[#0FA884]/20 to-[#0FA884]/5' },
  image: { bg: 'bg-accentAmber/10', text: 'text-accentAmber', gradient: 'from-[#F59E0B]/20 to-[#F59E0B]/5' },
  simulation: { bg: 'bg-accentBlue/10', text: 'text-accentBlue', gradient: 'from-[#2563EB]/20 to-[#2563EB]/5' },
  flowchart: { bg: 'bg-accentCoral/10', text: 'text-accentCoral', gradient: 'from-[#E85D40]/20 to-[#E85D40]/5' },
  worksheets: { bg: 'bg-accentPurple/10', text: 'text-accentPurple', gradient: 'from-[#6B5CF6]/20 to-[#6B5CF6]/5' },
  pdfs: { bg: 'bg-gray-200/50', text: 'text-gray-700', gradient: 'from-gray-300/30 to-gray-200/10' },
  quiz: { bg: 'bg-accentAmber/10', text: 'text-accentAmber', gradient: 'from-[#F59E0B]/20 to-[#F59E0B]/5' },
  websites: { bg: 'bg-accentTeal/10', text: 'text-accentTeal', gradient: 'from-[#0FA884]/20 to-[#0FA884]/5' }
}

export function ResourceCard({ resource, isBookmarked, onBookmarkToggle }: ResourceCardProps) {
  const styles = RESOURCE_COLORS[resource.type] || { bg: 'bg-gray-100', text: 'text-gray-600', gradient: 'from-gray-200 to-gray-50' }

  return (
    <div className="relative group bg-bgSecondary border border-borderCustom rounded-xl overflow-hidden hover:shadow-[0_8px_20px_rgba(0,0,0,0.05)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between h-full">
      
      {/* Upper part */}
      <div>
        {/* Thumbnail Placeholder */}
        <div className="relative w-full aspect-video overflow-hidden border-b border-borderCustom">
          <div className={`w-full h-full bg-gradient-to-br ${styles.gradient} flex items-center justify-center group-hover:scale-104 transition-transform duration-500`}>
            <span className="font-syne text-xs font-semibold tracking-wider text-textSecondary uppercase opacity-60">
              {getFriendlyTypeName(resource.type)}
            </span>
          </div>

          {/* Type Badge */}
          <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-syne font-bold uppercase tracking-wider ${styles.bg} ${styles.text}`}>
            {getFriendlyTypeName(resource.type)}
          </span>

          {/* Bookmark Toggle */}
          <button
            onClick={(e) => {
              e.preventDefault()
              onBookmarkToggle()
            }}
            className="absolute top-3 right-3 p-1.5 rounded-full bg-white/80 border border-borderCustom shadow-sm hover:bg-white text-textPrimary hover:text-accentPurple transition-all"
            title={isBookmarked ? "Remove bookmark" : "Add to lesson bundle"}
          >
            {isBookmarked ? (
              <BookmarkCheck className="w-4 h-4 text-accentPurple fill-accentPurple" />
            ) : (
              <Bookmark className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Content details */}
        <div className="p-5">
          <span className="text-[11px] font-syne text-accentTeal uppercase tracking-wider font-semibold">
            {resource.source}
          </span>
          <h4 className="font-sans font-semibold text-textPrimary text-sm mt-1 mb-2 line-clamp-2 leading-snug group-hover:text-accentPurple transition-colors">
            {resource.title}
          </h4>
          <p className="font-sans text-xs text-textSecondary line-clamp-2 leading-relaxed mb-4">
            {resource.snippet}
          </p>
        </div>
      </div>

      {/* Footer details */}
      <div className="px-5 pb-5 pt-0 flex items-center justify-between mt-auto">
        {/* Alignment badge */}
        <div>
          {resource.aligned ? (
            <span className="inline-flex items-center gap-1 text-[10px] font-sans font-medium text-accentTeal bg-accentTeal/10 px-2 py-0.5 rounded">
              <CheckCircle className="w-3 h-3" /> Verified Aligned
            </span>
          ) : (
            <span className="text-[10px] font-sans text-textSecondary/60 italic">
              General Resource
            </span>
          )}
        </div>

        {/* External Link */}
        <a
          href={resource.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-[11px] font-syne font-bold uppercase tracking-wider text-textPrimary hover:text-accentPurple transition-colors"
        >
          <span>Open Link</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  )
}

export default ResourceCard
