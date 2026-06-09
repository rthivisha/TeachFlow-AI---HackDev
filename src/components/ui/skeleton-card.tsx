
export function SkeletonCard() {
  return (
    <div className="bg-bgSecondary border border-borderCustom rounded-xl overflow-hidden p-5 space-y-4 animate-pulse flex flex-col justify-between h-full">
      <div className="space-y-3">
        {/* Aspect Ratio 16:9 box */}
        <div className="w-full aspect-video bg-gray-200 rounded-lg"></div>
        {/* Eyebrow */}
        <div className="h-3 bg-gray-200 rounded w-1/4"></div>
        {/* Title */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        {/* Snippet */}
        <div className="space-y-2 pt-2">
          <div className="h-3 bg-gray-200 rounded w-full"></div>
          <div className="h-3 bg-gray-200 rounded w-4/5"></div>
        </div>
      </div>
      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-borderCustom mt-auto">
        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
      </div>
    </div>
  )
}

export function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array(6).fill(null).map((_, idx) => (
        <SkeletonCard key={idx} />
      ))}
    </div>
  )
}
