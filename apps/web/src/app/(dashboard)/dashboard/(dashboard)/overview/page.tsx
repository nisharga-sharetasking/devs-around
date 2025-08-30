'use client'

import GlobalLoader from '@/components/shared/global-loader'

export default function OverviewPage() {
  const loading = false
  if (loading) return <GlobalLoader />

  return (
    <div className="flex-1 space-y-3 ">
      <div className="flex items-center justify-between">
        <h1 className="text-xl md:text-2xl font-bold tracking-tight">Overview</h1>
      </div>

      <div className="grid gap-3">cdf</div>
    </div>
  )
}
