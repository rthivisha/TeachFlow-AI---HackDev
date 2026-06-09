import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Share2, FileText, CheckCircle, RefreshCw, X, FolderHeart } from 'lucide-react'
import type { SearchResult } from '../../lib/search'
import { getFriendlyTypeName } from '../../lib/search'


interface BundlePanelProps {
  bookmarks: SearchResult[]
  onRemoveBookmark: (index: number) => void
  onSaveBundle: (name: string) => Promise<boolean>
  saving: boolean
}

export function BundlePanel({ bookmarks, onRemoveBookmark, onSaveBundle, saving }: BundlePanelProps) {
  const [bundleName, setBundleName] = useState('')
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [shareCopied, setShareCopied] = useState(false)
  const [showSaveDialog, setShowSaveDialog] = useState(false)

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!bundleName.trim() || bookmarks.length === 0) return

    const success = await onSaveBundle(bundleName)
    if (success) {
      setSaveSuccess(true)
      setBundleName('')
      setTimeout(() => {
        setSaveSuccess(false)
        setShowSaveDialog(false)
      }, 2500)
    }
  }

  const handleShare = () => {
    // Generate mock share link
    const mockId = Math.random().toString(36).substring(2, 8).toUpperCase()
    const shareUrl = `${window.location.origin}/discover?importBundle=${mockId}`
    navigator.clipboard.writeText(shareUrl).then(() => {
      setShareCopied(true)
      setTimeout(() => setShareCopied(false), 2500)
    })
  }

  const handleExportPDF = () => {
    // Trigger window print or alert mockup
    alert("Exporting bundle to PDF... Your download will begin shortly.")
    window.print()
  }

  return (
    <div className="w-full bg-bgSecondary border border-borderCustom rounded-xl p-5 flex flex-col h-full shadow-sm max-h-[calc(100vh-140px)] overflow-y-auto">
      {/* Title */}
      <div className="flex items-center gap-2 pb-4 border-b border-borderCustom mb-4">
        <FolderHeart className="w-4 h-4 text-accentPurple" />
        <h3 className="font-card-h3 text-sm text-textPrimary tracking-wide uppercase">
          Lesson Bundle ({bookmarks.length})
        </h3>
      </div>

      {bookmarks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center text-textSecondary/50 flex-grow">
          <FolderHeart className="w-12 h-12 stroke-[1] mb-3 opacity-40" />
          <p className="font-sans text-xs">Bookmark resources to compile your lesson bundle.</p>
        </div>
      ) : (
        <div className="flex flex-col h-full justify-between flex-grow">
          {/* List */}
          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
            <AnimatePresence>
              {bookmarks.map((item, idx) => (
                <motion.div
                  key={`${item.url}-${idx}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex items-center justify-between gap-3 p-2.5 rounded-lg border border-borderCustom hover:border-accentPurple/20 bg-bgPrimary/20 hover:bg-bgPrimary/40 transition-all group"
                >
                  <div className="min-w-0">
                    <span className="text-[9px] font-syne font-bold uppercase tracking-wider text-textSecondary opacity-80 block mb-0.5">
                      {getFriendlyTypeName(item.type)}
                    </span>
                    <span className="text-xs font-sans text-textPrimary font-medium line-clamp-1">
                      {item.title}
                    </span>
                  </div>
                  <button
                    onClick={() => onRemoveBookmark(idx)}
                    className="p-1 rounded text-textSecondary/40 hover:text-red-500 hover:bg-red-50 transition-all shrink-0"
                    title="Remove from bundle"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Action Row */}
          <div className="border-t border-borderCustom pt-4 mt-6 space-y-3">
            {/* Share / PDF actions */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleShare}
                className="py-2 px-3 border border-accentTeal text-accentTeal hover:bg-accentTeal/5 rounded-lg font-syne text-[11px] font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all"
              >
                {shareCopied ? (
                  <>
                    <CheckCircle className="w-3.5 h-3.5" /> Copied!
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5" /> Share
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={handleExportPDF}
                className="py-2 px-3 border border-borderCustom text-textPrimary hover:bg-bgPrimary/40 rounded-lg font-syne text-[11px] font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all"
              >
                <FileText className="w-3.5 h-3.5" /> PDF
              </button>
            </div>

            {/* Save Bundle to Supabase */}
            {showSaveDialog ? (
              <form onSubmit={handleSave} className="bg-bgPrimary/30 border border-borderCustom p-3.5 rounded-lg space-y-3">
                {saveSuccess ? (
                  <div className="text-center py-2 text-accentTeal text-xs font-medium flex items-center justify-center gap-1">
                    <CheckCircle className="w-4 h-4 animate-bounce" /> Saved successfully to DB!
                  </div>
                ) : (
                  <>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Magnetism Class 8 CBSE"
                      value={bundleName}
                      onChange={(e) => setBundleName(e.target.value)}
                      className="w-full px-3 py-1.5 bg-bgSecondary border border-borderCustom rounded text-xs focus:outline-none focus:border-accentPurple transition-colors"
                      disabled={saving}
                    />
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        disabled={saving || !bundleName.trim()}
                        className="flex-grow py-1.5 bg-accentPurple text-white rounded text-xs font-syne font-bold uppercase tracking-wider flex items-center justify-center gap-1"
                      >
                        {saving ? <RefreshCw className="w-3 h-3 animate-spin" /> : "Save"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowSaveDialog(false)}
                        className="py-1.5 px-3 border border-borderCustom text-textPrimary rounded text-xs"
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                )}
              </form>
            ) : (
              <button
                type="button"
                onClick={() => setShowSaveDialog(true)}
                className="w-full py-2.5 bg-accentPurple hover:bg-accentPurple/95 text-white rounded-lg font-syne text-[11px] font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm"
              >
                Save Bundle to Supabase
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default BundlePanel
