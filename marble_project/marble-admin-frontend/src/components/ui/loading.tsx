import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export function LoadingSpinner({ className, fullPage }: { className?: string; fullPage?: boolean }) {
  const spinner = (
    <Loader2 className={cn('h-8 w-8 animate-spin text-accent', className)} aria-label="Loading" />
  )
  if (fullPage) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">{spinner}</div>
    )
  }
  return spinner
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('animate-pulse rounded-md bg-muted', className)} />
}
