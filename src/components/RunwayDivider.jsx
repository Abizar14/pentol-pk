// Motif garis landasan (runway stripes) sebagai pemisah section / aksen.
export default function RunwayDivider({ className = '' }) {
  return (
    <div className={`flex items-center gap-2 ${className}`} aria-hidden="true">
      <div className="h-1.5 flex-1 rounded-full bg-runway opacity-60" />
      <span className="h-2 w-2 rounded-full bg-brand-terracotta" />
      <div className="h-1.5 flex-1 rounded-full bg-runway opacity-60" />
    </div>
  )
}
