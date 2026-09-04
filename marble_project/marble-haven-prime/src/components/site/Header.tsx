import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, Phone, Search, X, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import logoIcon from "@/assets/com_logo.jpeg";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/products", label: "Products" },
  { to: "/categories", label: "Categories" },
  { to: "/gallery", label: "Gallery" },
  { to: "/videos", label: "Videos" },
  { to: "/projects", label: "Projects" },
  { to: "/blog", label: "Blog" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-background/85 backdrop-blur-md border-b border-border shadow-[0_1px_0_rgba(0,0,0,0.02)]" : "bg-transparent"
      }`}
    >
      <div className="container-luxe flex h-20 items-center justify-between md:h-24">
        <Link to="/" className="flex items-center gap-2 shrink-0" aria-label="Aureo Stone home">
          <img
          src={logoIcon}
          alt="Makrana Marble Art"
          className="h-10 w-10 shrink-0 rounded-lg object-cover"
          />
          <span className="flex flex-col leading-none">
            <span className="font-display text-[clamp(1.12rem,0.2vw+1.02rem,1.28rem)] font-semibold tracking-[0.02em]">Markram Marble Art</span>
            <span className="text-[clamp(0.82rem,0.2vw+0.78rem,0.95rem)] uppercase tracking-[0.28em] text-muted-foreground">Marble &middot; Since 1978</span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-7 xl:gap-10" aria-label="Primary">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="text-[clamp(1rem,0.2vw+0.94rem,1.08rem)] font-medium text-foreground/80 hover:text-foreground transition-colors relative after:absolute after:left-0 after:-bottom-1 after:h-px after:w-0 after:bg-accent hover:after:w-full after:transition-all"
              activeProps={{ className: "text-foreground after:!w-full" }}
              activeOptions={{ exact: n.to === "/" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button suppressHydrationWarning aria-label="Search" className="hidden sm:grid h-9 w-9 place-items-center rounded-full hover:bg-muted transition">
            <Search className="h-4 w-4" />
          </button>
          <a
            href="https://wa.me/917378260294"
            target="_blank"
            rel="noreferrer"
            aria-label="WhatsApp"
            className="hidden sm:grid h-9 w-9 place-items-center rounded-full hover:bg-muted transition"
          >
            <MessageCircle className="h-4 w-4" />
          </a>
          <a
            href="tel:+91 7378260294"
            className="hidden md:inline-flex items-center gap-2 text-[clamp(1rem,0.2vw+0.94rem,1.08rem)] font-medium text-foreground/80 hover:text-foreground"
          >
            <Phone className="h-4 w-4" /> +91 7378260294
          </a>
          {/* <Button asChild size="sm" className="hidden md:inline-flex rounded-none bg-primary text-primary-foreground hover:bg-primary/90">
            <Link to="/contact">Request Quote</Link>
          </Button> */}

          <Sheet>
            <SheetTrigger asChild>
              <button suppressHydrationWarning className="lg:hidden grid h-10 w-10 place-items-center rounded-full hover:bg-muted" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[86%] sm:w-96 p-0">
              <div className="flex h-16 items-center justify-between border-b px-5">
                <span className="font-display text-[1.15rem]">Menu</span>
                <SheetTrigger asChild>
                  <button suppressHydrationWarning aria-label="Close" className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted">
                    <X className="h-5 w-5" />
                  </button>
                </SheetTrigger>
              </div>
              <div className="flex flex-col p-5">
                {NAV.map((n) => (
                  <Link key={n.to} to={n.to} className="py-3 text-[1.05rem] border-b border-border/60">
                    {n.label}
                  </Link>
                ))}
                <div className="mt-6 grid gap-3">
                  <Button asChild className="rounded-none">
                    <Link to="/contact">Request Quote</Link>
                  </Button>
                  <Button asChild variant="outline" className="rounded-none">
                    <a href="tel:+91 7378260294"><Phone className="mr-2 h-4 w-4" /> Call Now</a>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
