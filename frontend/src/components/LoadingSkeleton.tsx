export default function LoadingSkeleton() {
  return (
    <div className="space-y-6 animate-in">
      <div className="card overflow-hidden">
        <div className="border-b border-slate-100 px-6 py-4">
          <div className="skeleton h-3 w-24 mb-2" />
          <div className="skeleton h-5 w-48 mb-1" />
          <div className="skeleton h-4 w-36" />
        </div>
        <div className="px-6 py-5 space-y-5">
          {[...Array(4)].map((_, i) => (
            <div key={i}>
              <div className="skeleton h-3 w-20 mb-2" />
              <div className="flex gap-1.5">
                {[...Array(3)].map((_, j) => (
                  <div key={j} className="skeleton h-6 w-16 rounded-full" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <div className="skeleton h-5 w-32" />
        {[...Array(3)].map((_, i) => (
          <div key={i} className="card px-5 py-4">
            <div className="flex items-start gap-3">
              <div className="skeleton h-6 w-6 rounded-md shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="skeleton h-4 w-40" />
                <div className="skeleton h-3 w-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
