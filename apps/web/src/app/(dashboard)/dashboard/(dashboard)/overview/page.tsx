'use client'
import GlobalLoader from '@/components/shared/global-loader'
import { useGetCurrentProfileQuery } from '@/redux/api-queries/auth-api'

export default function OverviewPage() {
  const { data, isLoading } = useGetCurrentProfileQuery({})
  const user = data?.data?.user

  if (isLoading) return <GlobalLoader />

  return (
    <div className="flex-1 space-y-3 ">
      <div className="flex items-center justify-between">
        <h1 className="text-xl md:text-2xl font-bold tracking-tight">Overview</h1>
      </div>

      <div className="grid gap-3 grid-cols-1">
        <div>Name: {user?.name}</div>
        <div>Role: {user?.role}</div>
        <div>Email: {user?.email}</div>
      </div>
    </div>
  )
}
