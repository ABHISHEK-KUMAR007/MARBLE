import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface PageHeaderProps {
  title: string
  description?: string
  breadcrumbs?: { label: string; href?: string }[]
  actions?: ReactNode
}

export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h1 className="font-display text-[1.7rem] md:text-[2.1rem]">{title}</h1>
        {description && <p className="mt-1 text-[0.95rem] leading-7 text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  )
}

interface DataTableProps {
  children: ReactNode
  className?: string
}

export function DataTable({ children, className }: DataTableProps) {
  return (
    <div className={cn('w-full overflow-x-auto rounded-xl border bg-card', className)}>
      <table className="w-full min-w-[760px] text-sm">{children}</table>
    </div>
  )
}

export function DataTableHead({ children }: { children: ReactNode }) {
  return (
    <thead>
      <tr className="border-b bg-muted/50 text-left text-xs uppercase tracking-wider text-muted-foreground">
        {children}
      </tr>
    </thead>
  )
}

export function DataTableBody({ children }: { children: ReactNode }) {
  return <tbody className="divide-y">{children}</tbody>
}

export function DataTableRow({ children, className }: { children: ReactNode; className?: string }) {
  return <tr className={cn('hover:bg-muted/30 transition-colors', className)}>{children}</tr>
}

export function DataTableCell({
  children,
  className,
  header,
}: {
  children: ReactNode
  className?: string
  header?: boolean
}) {
  const Tag = header ? 'th' : 'td'
  return (
    <Tag className={cn(header ? 'px-4 py-3 font-medium' : 'px-4 py-3', className)}>{children}</Tag>
  )
}
