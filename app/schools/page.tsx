import { ComingSoon } from "@/components/ui/coming-soon"

// Revalidate every 2 minutes (when implemented with real data)
export const revalidate = 120

export default function SchoolsPage() {
  return <ComingSoon feature="학교 랭킹" />
}
