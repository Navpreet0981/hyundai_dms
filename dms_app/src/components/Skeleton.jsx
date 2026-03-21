// Reusable skeleton primitives
export function SkeletonBox({ className = "" }) {
  return (
    <div className={`animate-pulse bg-gray-200 dark:bg-slate-700 rounded ${className}`} />
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-6 shadow-sm h-28 flex justify-between items-center">
      <div className="space-y-3">
        <SkeletonBox className="h-3 w-20" />
        <SkeletonBox className="h-8 w-16" />
      </div>
      <SkeletonBox className="h-8 w-8 rounded-full" />
    </div>
  );
}

export function SkeletonTable({ rows = 5, cols = 5 }) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
      <div className="bg-gray-50 dark:bg-slate-800 p-4 flex gap-4">
        {Array.from({ length: cols }).map((_, i) => (
          <SkeletonBox key={i} className="h-3 flex-1" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="border-t border-gray-200 dark:border-slate-800 p-4 flex gap-4">
          {Array.from({ length: cols }).map((_, j) => (
            <SkeletonBox key={j} className="h-3 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}

export function SkeletonChart() {
  return (
    <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl shadow-sm p-6 h-[360px]">
      <SkeletonBox className="h-5 w-40 mb-6" />
      <div className="flex items-end gap-3 h-[260px]">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonBox
            key={i}
            className="flex-1 rounded-t"
            style={{ height: `${30 + Math.random() * 70}%` }}
          />
        ))}
      </div>
    </div>
  );
}

export function SkeletonProfile() {
  return (
    <div className="w-full max-w-xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl shadow-sm p-6 space-y-6">
      <SkeletonBox className="h-6 w-32 mx-auto" />
      <div className="space-y-3">
        <SkeletonBox className="h-3 w-24" />
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonBox key={i} className="h-3 w-full" />
        ))}
      </div>
      <div className="grid grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <SkeletonBox key={i} className="h-16 rounded-lg" />
        ))}
      </div>
    </div>
  );
}
