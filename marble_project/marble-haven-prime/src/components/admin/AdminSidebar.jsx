import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Image as ImageIcon,
  Video,
  MessageSquare,
  FileText,
  Settings,
  Building2,
  LogOut,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const items = [
  { title: "Dashboard", url: "/admin", icon: LayoutDashboard, exact: true },
  { title: "Products", url: "/admin/products", icon: Package },
  { title: "Categories", url: "/admin/categories", icon: FolderTree },
  { title: "Banners", url: "/admin/banners", icon: ImageIcon },
  { title: "Gallery", url: "/admin/gallery", icon: ImageIcon },
  { title: "Videos", url: "/admin/videos", icon: Video },
  { title: "Inquiries", url: "/admin/inquiries", icon: MessageSquare },
  { title: "Blog", url: "/admin/blog", icon: FileText },
  { title: "Company", url: "/admin/company", icon: Building2 },
  { title: "Settings", url: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isActive = (url, exact) => (exact ? pathname === url : pathname.startsWith(url));

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b">
        <Link to="/admin" className="flex items-center gap-2 px-2 py-3">
          <div className="grid h-8 w-8 place-items-center bg-primary text-primary-foreground font-display text-[clamp(1.02rem,0.18vw+0.95rem,1.14rem)]">A</div>
          <div className="flex flex-col leading-tight">
            <span className="font-display text-[clamp(0.98rem,0.18vw+0.92rem,1.08rem)]">Aureo</span>
            <span className="text-[clamp(0.78rem,0.18vw+0.74rem,0.9rem)] uppercase tracking-widest text-muted-foreground">Admin</span>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Manage</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild isActive={isActive(item.url, item.exact)}>
                    <Link to={item.url} className="flex items-center gap-2">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link to="/" className="flex items-center gap-2">
                <LogOut className="h-4 w-4" />
                <span>Exit to site</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
