import { cn } from '@/lib/utils'

export function AccentRing({ accent }: { accent?: 'blue' | 'green' }) {
  if (!accent) return null
  return (
    <div
      className={cn(
        'pointer-events-none absolute inset-0 rounded-2xl ring-2 ring-offset-2 ring-offset-background',
        accent === 'blue' ? 'ring-blue-400/60' : 'ring-emerald-400/60'
      )}
    />
  )
}
