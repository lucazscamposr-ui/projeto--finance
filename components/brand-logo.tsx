import { cn } from '@/lib/utils'

/** Marca do Finance AI: anel tech (JARVIS sóbrio) com núcleo. */
export function BrandLogo({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'relative grid size-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary glow-primary',
        className,
      )}
      aria-hidden="true"
    >
      <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth={1.6}>
        <circle cx="12" cy="12" r="9" strokeOpacity="0.35" />
        <circle cx="12" cy="12" r="5.5" strokeDasharray="3 3" />
        <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none" />
      </svg>
    </div>
  )
}
