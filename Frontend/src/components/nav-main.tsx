import { useNavigate } from "react-router-dom"
import { type LucideIcon } from "lucide-react"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon
  }[]
}) {
  const navigate = useNavigate()

  const handleNavigation = (url: string) => {
    navigate(url)
  }

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu className="flex flex-col items-start">
          {items.map((item) => (
            <SidebarMenuItem key={item.title} className="mb-2 mt-4 flex items-start">
              <SidebarMenuButton
                tooltip={item.title}
                className="flex items-center space-x-2"
                onClick={() => handleNavigation(item.url)}
              >
                {item.icon && <item.icon />}
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
