"use client";
import AppHeader from "@/components/app-header";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import React, { useState } from "react";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(true);
  // sidebar responsive class
  const openSidebarClass = "!lg:w-[16%] transition-all delay-75 duration-300";
  const closeSidebarClass = "w-0 transition-all delay-75 duration-300";
  // content responsive class
  const openContentClass =
    "!w-[100%] lg:!w-[84%] transition-all delay-75 duration-300";
  const closeContentClass = "!w-[100%] transition-all delay-75 duration-300";
  return (
    <SidebarProvider>
      <div className="flex w-full min-h-screen overflow-x-hidden">
        <div className={isOpen ? openSidebarClass : closeSidebarClass}>
          <AppSidebar className={openSidebarClass} />
        </div>
        <div
          className={`flex flex-col flex-1 ${
            isOpen ? openContentClass : closeContentClass
          }`}
        >
          <AppHeader isOpen={isOpen} setIsOpen={setIsOpen} />
          <div className="min-h-[calc(100vh-64px)] p-2 md:p-4 lg:p-5 bg-secondary overflow-x-hidden w-full">
            {children}
          </div>
          <SidebarInset />
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
