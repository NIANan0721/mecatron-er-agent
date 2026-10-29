import {
  AtSign,
  BadgeCheck,
  Building2,
  Contact,
  Database,
  FilePen,
  FileText,
  Handshake,
  History,
  ListChecks,
  Mail,
  MessagesSquare,
  Paperclip,
  Users,
  type LucideIcon,
} from 'lucide-react'

const icons: Record<string, LucideIcon> = {
  AtSign,
  BadgeCheck,
  Building2,
  Contact,
  FilePen,
  FileText,
  Handshake,
  History,
  ListChecks,
  Mail,
  MessagesSquare,
  Paperclip,
  Users,
}

/**
 * The lucide icon named in a resource description
 */
export default function ResourceIcon({ name, size = 16 }: { name: string; size?: number }) {
  const Icon = icons[name] ?? Database
  return <Icon size={size} strokeWidth={1.8} />
}
