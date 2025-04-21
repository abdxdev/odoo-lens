"use client";

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarHeader,
} from "@/components/ui/sidebar"
import { OdooLensLogo } from "@/components/ui/odoo-lens-logo"
import { Search, Shield, Database, FileQuestion } from "lucide-react"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()

  const navItems = [
    {
      title: "Odoo Lens",
      url: "#",
      items: [
        {
          title: "Search Faculty",
          url: "/search-faculty",
          isActive: pathname === "/search-faculty",
          icon: <Search className="h-4 w-4 mr-2" />,
          description: "Async search functionality for faculty members"
        },
        {
          title: "Review Permissions",
          url: "/review-permissions",
          isActive: pathname === "/review-permissions",
          icon: <Shield className="h-4 w-4 mr-2" />,
          description: "ShadCN UI-based search for permissions review"
        },
        {
          title: "Explore Model",
          url: "/explore-model",
          isActive: pathname === "/explore-model",
          icon: <Database className="h-4 w-4 mr-2" />,
          description: "ShadCN UI-based model search and exploration"
        },
        {
          title: "Data Query",
          url: "/data-query",
          isActive: pathname === "/data-query",
          icon: <FileQuestion className="h-4 w-4 mr-2" />,
          description: "ShadCN UI-based data query interface"
        },
      ],
    },
  ]

  return (
    <Sidebar {...props}>
      <SidebarContent>
        <SidebarHeader className="flex justify-start p-4">
          <Link href="/">
            <OdooLensLogo className="w-32 text-foreground" />
          </Link>
        </SidebarHeader>

        {navItems.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>Get Started</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={item.isActive}>
                      <Link href={item.url} className="flex items-center">
                        {item.icon}
                        {item.title}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
