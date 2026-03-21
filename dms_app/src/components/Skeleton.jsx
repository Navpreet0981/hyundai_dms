export function SkeletonCard() {
  return (
    <div className="apple-card p-5 sm:p-6 h-28 animate-pulse">
      <div className="flex justify-between items-center h-full">
        <div className="space-y-3">
          <div className="h-3 w-20 bg-[#e5e5ea] dark:bg-[#2c2c2e] rounded-full" />
          <div className="h-7 w-14 bg-[#e5e5ea] dark:bg-[#2c2c2e] rounded-full" />
        </div>
        <div className="w-10 h-10 bg-[#e5e5ea] dark:bg-[#2c2c2e] rounded-xl" />
      </div>
    </div>
  );
}

export function SkeletonChart() {
  return (
    <div className="apple-card p-5 sm:p-6 h-[300px] sm:h-[360px] animate-pulse">
      <div className="h-4 w-36 bg-[#e5e5ea] dark:bg-[#2c2c2e] rounded-full mb-6" />
      <div className="flex items-end gap-3 h-48">
        {[60, 80, 45, 90, 55, 70, 40, 85].map((h, i) => (
          <div
            key={i}
            className="flex-1 bg-[#e5e5ea] dark:bg-[#2c2c2e] rounded-t-lg"
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
    </div>
  );
}

export function SkeletonTable({ rows = 5 }) {
  return (
    <div className="apple-card overflow-hidden animate-pulse">
      <div className="p-5 border-b border-[#e5e5ea] dark:border-[#2c2c2e]">
        <div className="h-4 w-32 bg-[#e5e5ea] dark:bg-[#2c2c2e] rounded-full" />
      </div>
      <div className="divide-y divide-[#e5e5ea] dark:divide-[#2c2c2e]">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-5 py-4">
            <div className="w-8 h-8 bg-[#e5e5ea] dark:bg-[#2c2c2e] rounded-full shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-1/3 bg-[#e5e5ea] dark:bg-[#2c2c2e] rounded-full" />
              <div className="h-2.5 w-1/2 bg-[#e5e5ea] dark:bg-[#2c2c2e] rounded-full" />
            </div>
            <div className="h-3 w-16 bg-[#e5e5ea] dark:bg-[#2c2c2e] rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function SkeletonProfile() {
  return (
    <div className="space-y-5 animate-pulse">
      <div className="apple-card p-6 flex items-center gap-5">
        <div className="w-16 h-16 bg-[#e5e5ea] dark:bg-[#2c2c2e] rounded-full shrink-0" />
        <div className="space-y-2 flex-1">
          <div className="h-4 w-40 bg-[#e5e5ea] dark:bg-[#2c2c2e] rounded-full" />
          <div className="h-3 w-28 bg-[#e5e5ea] dark:bg-[#2c2c2e] rounded-full" />
        </div>
      </div>
      <div className="apple-card p-6 space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-1.5">
            <div className="h-2.5 w-20 bg-[#e5e5ea] dark:bg-[#2c2c2e] rounded-full" />
            <div className="h-4 w-48 bg-[#e5e5ea] dark:bg-[#2c2c2e] rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
