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
        },
        {
          title: "Review Permissions",
          url: "/review-permissions",
          isActive: pathname === "/review-permissions",
        },
        {
          title: "Explore Model",
          url: "/explore-model",
          isActive: pathname === "/explore-model",
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
                      <Link href={item.url}>{item.title}</Link>
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
