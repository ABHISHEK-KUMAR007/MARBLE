import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'

interface StatCardProps {
  title: string
  value: string | number
  change?: string
  icon: LucideIcon
  trend?: 'up' | 'down' | 'neutral'
}

export function StatCard({ title, value, change, icon: Icon, trend = 'neutral' }: StatCardProps) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[0.95rem] font-medium text-muted-foreground">{title}</p>
            <p className="mt-2 font-display text-[1.9rem] leading-none">{value}</p>
            {change && (
              <p
                className={cn(
                  'mt-1 text-xs',
                  trend === 'up' && 'text-forest',
                  trend === 'down' && 'text-destructive',
                  trend === 'neutral' && 'text-muted-foreground',
                )}
              >
                {change}
              </p>
            )}
          </div>
          <div className="grid h-10 w-10 place-items-center rounded-lg bg-accent/15">
            <Icon className="h-5 w-5 text-accent" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
