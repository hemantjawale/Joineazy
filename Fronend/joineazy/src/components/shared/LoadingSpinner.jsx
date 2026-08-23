export default function LoadingSpinner({ text = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-surface-200 rounded-full" />
        <div className="absolute top-0 left-0 w-12 h-12 border-4 border-transparent border-t-primary-500 rounded-full animate-spin" />
      </div>
      <p className="text-sm text-surface-500 animate-pulse">{text}</p>
    </div>
  );
}
