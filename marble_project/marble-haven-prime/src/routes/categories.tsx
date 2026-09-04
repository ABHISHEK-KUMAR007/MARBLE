import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export const Route = createFileRoute("/categories")({
  head: () => ({
    meta: [
      { title: "Categories — Aureo Stone" },
      { name: "description", content: "Explore all stone categories: Italian marble, granite, onyx, travertine and more." },
      { property: "og:title", content: "Categories — Aureo Stone" },
      { property: "og:description", content: "Explore all stone categories." },
      { property: "og:url", content: "/categories" },
    ],
    links: [{ rel: "canonical", href: "/categories" }],
  }),
  component: CategoriesPage,
});

function CategoriesPage() {
  const { data: categories = [] } = useQuery({ queryKey: ["categories"], queryFn: api.getCategories });
  
  return (
    <>
      <section className="pt-32 pb-12 border-b bg-secondary/40">
        <div className="container-luxe">
          <p className="eyebrow">Explore</p>
          <h1 className="mt-3 font-display text-5xl md:text-6xl">Categories</h1>
        </div>
      </section>
      <section className="py-16">
        <div className="container-luxe grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6">
{categories.map((c: any) => (
            <Link key={c.id} to="/products" className="group relative aspect-[5/6] overflow-hidden bg-muted">
              <img src={c.image || undefined} alt={c.name} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6">
                <h2 className="font-display text-3xl text-white">{c.name}</h2>
                <p className="mt-1 text-sm text-white/70">{c.description}</p>
                <span className="mt-4 inline-flex items-center gap-2 text-xs uppercase tracking-widest text-accent">View products <ArrowRight className="h-3 w-3" /></span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
