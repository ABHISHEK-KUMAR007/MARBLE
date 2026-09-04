import type { EntityStatus, InquiryStatus } from '@/types'
import { Badge } from '@/components/ui/badge'

export function StatusBadge({
  status,
}: {
  status: EntityStatus | InquiryStatus | 'draft' | 'published' | 'Active' | 'Inactive'
}) {
  const map: Record<string, { label: string; variant: 'success' | 'muted' | 'warning' | 'destructive' | 'secondary' }> = {
    active: { label: 'Active', variant: 'success' },
    inactive: { label: 'Inactive', variant: 'muted' },
    Active: { label: 'Active', variant: 'success' },
    Inactive: { label: 'Inactive', variant: 'muted' },
    draft: { label: 'Draft', variant: 'secondary' },
    published: { label: 'Published', variant: 'success' },
    Pending: { label: 'Pending', variant: 'warning' },
    Contacted: { label: 'Contacted', variant: 'secondary' },
    'In Progress': { label: 'In Progress', variant: 'default' as 'secondary' },
    Completed: { label: 'Completed', variant: 'success' },
    Rejected: { label: 'Rejected', variant: 'destructive' },
  }
  const config = map[status] ?? { label: status, variant: 'secondary' as const }
  return <Badge variant={config.variant}>{config.label}</Badge>
}
