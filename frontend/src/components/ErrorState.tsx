interface Props {
  message: string;
  onRetry?: () => void;
}

export default function ErrorState({ message, onRetry }: Props) {
  return (
    <div className="card px-6 py-8 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
        <svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
        </svg>
      </div>
      <h3 className="mt-4 text-sm font-semibold text-slate-900">Analysis failed</h3>
      <p className="mt-1 text-sm text-slate-500 max-w-md mx-auto">{message}</p>
      {onRetry && (
        <button type="button" onClick={onRetry} className="btn-secondary mt-4">
          Try again
        </button>
      )}
    </div>
  );
}
