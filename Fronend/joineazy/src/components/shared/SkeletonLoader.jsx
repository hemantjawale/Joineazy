export function SkeletonCard({ className = "" }) {
  return (
    <div className={`skeuo-panel animate-pulse bg-[color:var(--bg-page)] ${className}`}>
      <div className="h-full w-full bg-surface-200 dark:bg-surface-800 rounded-xl"></div>
    </div>
  );
}

export function SkeletonList({ count = 3, className = "" }) {
  return (
    <div className={`space-y-4 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skeuo-input p-4 rounded-xl animate-pulse flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-surface-200 dark:bg-surface-800"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-surface-200 dark:bg-surface-800 rounded w-3/4"></div>
            <div className="h-3 bg-surface-200 dark:bg-surface-800 rounded w-1/2"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
