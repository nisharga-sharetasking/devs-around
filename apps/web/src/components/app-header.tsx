'use client'

import { removeAccessToken, removeRefreshToken } from '@/auth/cookies'
import { useRouter } from 'next/navigation'
import React from 'react'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import { useGetCurrentProfileQuery } from '@/redux/api-queries/auth-api'
import GlobalLoader from './shared/global-loader'

export interface ISidebarOpen {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}
const AppHeader = ({ isOpen, setIsOpen }: ISidebarOpen) => {
  // === router ===
  const router = useRouter()
  const { data, isLoading } = useGetCurrentProfileQuery({})
  const user = data?.data?.user

  // === handle logout ===
  const handleLogout = () => {
    removeAccessToken()
    removeRefreshToken()
    router.refresh()
  }
  if (isLoading) return <GlobalLoader />
  return (
    <header className="bg-primary sticky top-0 flex items-center justify-between w-full h-16 shrink-0 gap-4 border-b px-4 z-50">
      <div className="flex items-center gap-1">
        <SidebarTrigger className="-ml-1 text-white" isOpen={isOpen} setIsOpen={setIsOpen} />
        <p className="text-sm lg:text-base font-medium text-white">
          Hi, {user?.name}
          <span className="lowercase text-white/80">({user?.role})</span>
        </p>
      </div>

      <Button onClick={handleLogout} variant="destructive" size="sm">
        Logout
      </Button>
    </header>
  )
}

export default AppHeader
