import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { Check, Coins } from 'lucide-react'
import { AccentRing } from './AccentRing'
import type { PackageItem } from './PackageItem'

export function PackageCard({
  item,
  selected,
  onSelect,
}: {
  item: PackageItem
  selected: boolean
  onSelect: () => void
}) {
  const total = item.coins + (item.bonus ?? 0)

  return (
    <div className="relative">
      {item.highlight && (
        <div className="absolute -top-3 left-4 z-10">
          <Badge
            className={cn(
              'rounded-full px-3 py-1 text-xs',
              item.accent === 'blue' && 'bg-blue-50 text-blue-700',
              item.accent === 'green' && 'bg-emerald-50 text-emerald-700'
            )}
          >
            {item.highlight}
          </Badge>
        </div>
      )}

      <Card
        className={cn(
          'relative h-full rounded-2xl border bg-white shadow-sm flex flex-col',
          selected && 'border-primary/50'
        )}
      >
        <CardContent className="p-6 flex flex-col flex-1">
          <div className="relative">
            <div className="absolute right-0 top-0">
              <Checkbox
                checked={selected}
                onCheckedChange={onSelect}
                className={cn(
                  'h-5 w-5 rounded-md border-2 transition-colors',
                  selected
                    ? 'border-zinc-900 bg-zinc-900 text-white'
                    : 'border-zinc-300 bg-white'
                )}
              />
            </div>

            <div className="space-y-1">
              <p className="text-bg text-muted-foreground">{item.title}</p>
              <p className="text-xl font-semibold text-zinc-900">
                {item.price}
              </p>
            </div>
          </div>

          <div className="mt-8 text-center flex flex-col items-center justify-center flex-1">
            <div className="flex justify-center items-center gap-2">
              <Coins className="h-5 w-5 text-amber-500" />
              <span className="text-4xl font-semibold">{item.coins}</span>
            </div>

            {item.bonus && (
              <div className="mt-3 flex justify-center items-center gap-2 text-sm text-emerald-600">
                <Check className="h-4 w-4" /> +{item.bonus} bonus
              </div>
            )}

            <p className="mt-3 text-sm text-muted-foreground">
              Razem: {total} CT Coins
            </p>
          </div>
        </CardContent>

        <AccentRing accent={item.accent} />
      </Card>
    </div>
  )
}
