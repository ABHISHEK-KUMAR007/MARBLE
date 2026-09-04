import { createFileRoute, Outlet, Link } from "@tanstack/react-router";
import { Bell, Search, User } from "lucide-react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — Aureo Stone" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminLayout,
});

function AdminLayout() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-muted/30">
        <AdminSidebar />
        <div className="flex flex-1 flex-col">
          <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b bg-background/80 px-4 backdrop-blur">
            <SidebarTrigger />
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search products, inquiries…" className="w-80 pl-9" />
            </div>
            <div className="ml-auto flex items-center gap-2">
              <button className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted">
                <Bell className="h-4 w-4" />
              </button>
              <Link to="/" className="grid h-9 w-9 place-items-center rounded-full bg-primary text-primary-foreground">
                <User className="h-4 w-4" />
              </Link>
            </div>
          </header>
          <main className="flex-1 p-6 md:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
