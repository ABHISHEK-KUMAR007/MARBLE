import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { WhatsAppFab } from "@/components/site/WhatsAppFab";
import { Toaster } from "@/components/ui/sonner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 pt-24">
      <div className="max-w-md text-center">
        <p className="eyebrow">404</p>
        <h1 className="mt-3 font-display text-5xl">Page not found</h1>
        <p className="mt-3 text-sm text-muted-foreground">The page you're looking for has moved or no longer exists.</p>
        <Link to="/" className="mt-6 inline-flex items-center justify-center bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          Return home
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  useEffect(() => { reportLovableError(error, { boundary: "tanstack_root_error_component" }); }, [error]);
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 pt-24">
      <div className="max-w-md text-center">
        <h1 className="font-display text-3xl">Something went wrong</h1>
        <p className="mt-2 text-sm text-muted-foreground">Please try again or head back home.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button onClick={() => { router.invalidate(); reset(); }} className="bg-primary px-5 py-2.5 text-sm text-primary-foreground hover:bg-primary/90">Try again</button>
          <a href="/" className="border border-border px-5 py-2.5 text-sm hover:bg-muted">Go home</a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Makrana Marble Art | Premium Makrana Marble Manufacturer & Supplier" },
      { name: "description", content: "Makrana Marble Art is a trusted manufacturer and supplier of authentic Makrana Marble, Vietnam Marble, Marble Temples, Marble Jali, CNC Marble Carving, Marble Fountains, and custom marble solutions across India." },
      { name: "author", content: "Makrana Marble Art" },
      { property: "og:title", content: "Makrana Marble Art | Premium Makrana Marble Manufacturer & Supplier" },
      { property: "og:description", content: "Manufacturer, supplier and exporter of premium marble, granite and natural stone." },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Makrana Marble Art" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=Inter:wght@300;400;500;600;700&display=swap" },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);

  const isAdmin = pathname.startsWith("/admin");

  return (
    <QueryClientProvider client={queryClient}>
      {!isAdmin && <Header />}
      <main id="main" className="min-h-screen w-full overflow-x-hidden">
        <Outlet />
      </main>
      {!isAdmin && <Footer />}
      {!isAdmin && <WhatsAppFab />}
      <Toaster />
    </QueryClientProvider>
  );
}
