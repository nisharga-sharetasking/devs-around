/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import * as React from 'react'
import { ChevronRight } from 'lucide-react'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar'
import Link from 'next/link'
import { SIDEBAR_LINKS } from '@/constants/sidebar-links'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

export function AppSidebar({ className, ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()

  return (
    <Sidebar {...props} className={`${className}`}>
      <SidebarHeader className="border-b h-16 flex items-center pl-4 justify-center bg-primary">
        <Link
          href="/dashboard/overview"
          className="w-fit flex items-center justify-center p-1 text-xl font-medium text-primary"
        >
          <div className="overflow-hidden pb-2 text-4xl text-white">Devs Around</div>
        </Link>
      </SidebarHeader>
      <SidebarContent className="gap-0">
        {SIDEBAR_LINKS?.map((item: any) => (
          <Collapsible
            key={item.title}
            title={item.title}
            defaultOpen
            className="group/collapsible"
          >
            <SidebarGroup>
              <SidebarGroupLabel
                asChild
                className="group/label text-sidebar-foreground mb-2 bg-primary/5 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sm"
              >
                <CollapsibleTrigger>
                  {item.title}{' '}
                  <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                </CollapsibleTrigger>
              </SidebarGroupLabel>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {item.items.map((item: any) => (
                      <SidebarMenuItem key={item.title} className="ml-2">
                        <SidebarMenuButton
                          asChild
                          className={cn({
                            'bg-primary text-white': pathname === item.url,
                          })}
                        >
                          <Link href={item.url}>{item.title}</Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
