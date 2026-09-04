import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";

import { Input } from "@/components/ui/input";
import {
  Button,
} from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { ProductCard } from "@/components/site/ProductCard";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export const Route = createFileRoute("/products")({
  head: () => ({
    meta: [
      {
        title: "Products — Aureo Stone",
      },
      {
        name: "description",
        content:
          "Browse our full collection of marble, granite, onyx, quartz, travertine and mosaic.",
      },
      {
        property: "og:title",
        content: "Products — Aureo Stone",
      },
      {
        property: "og:description",
        content:
          "Browse our full collection of luxury stone.",
      },
      {
        property: "og:url",
        content: "/products",
      },
    ],

    links: [
      {
        rel: "canonical",
        href: "/products",
      },
    ],
  }),

  component: ProductsPage,
});

function ProductsPage() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  const [sort, setSort] = useState("newest");

  /*
   * Products
   */
  const {
    data: products = [],
    isLoading: productsLoading,
  } = useQuery({
    queryKey: ["products"],
    queryFn: api.getProducts,
  });

  /*
   * Categories
   */
  const {
    data: categories = [],
    isLoading: categoriesLoading,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: api.getCategories,
  });

  /*
   * Filter + Sort
   */
  const filtered = useMemo(() => {
    let list = products.filter((p: any) => {
      const productName =
        typeof p.name === "string"
          ? p.name
          : "";

      const matchesSearch =
        !q ||
        productName
          .toLowerCase()
          .includes(q.toLowerCase());

      const matchesCategory =
        cat === "all" ||
        p.category === cat ||
        p.category?.name === cat;

      return (
        matchesSearch &&
        matchesCategory
      );
    });

    /*
     * A → Z
     */
    if (sort === "az") {
      list = [...list].sort((a, b) =>
        String(a.name || "").localeCompare(
          String(b.name || "")
        )
      );
    }

    /*
     * Popular
     */
    if (sort === "popular") {
      list = [...list].sort(
        (a, b) =>
          Number(!!b.popular) -
          Number(!!a.popular)
      );
    }

    /*
     * Newest
     */
    if (sort === "newest") {
      list = [...list].sort(
        (a, b) =>
          Number(!!b.isNew) -
          Number(!!a.isNew)
      );
    }

    return list;
  }, [
    products,
    q,
    cat,
    sort,
  ]);

  /*
   * Loading
   */
  if (productsLoading || categoriesLoading) {
    return (
      <section className="grid min-h-[60vh] place-items-center">
        <p className="text-muted-foreground">
          Loading products...
        </p>
      </section>
    );
  }

  return (
    <>
      {/* =====================================================
          HERO
          ===================================================== */}
      <section className="border-b bg-secondary/40 pt-32 pb-12">
        <div className="container-luxe">
          <p className="eyebrow">
            Catalogue
          </p>

          <h1 className="mt-3 font-display text-5xl md:text-6xl">
            Products
          </h1>

          <p className="mt-4 max-w-2xl text-muted-foreground">
            All our natural and engineered stones,
            filterable by category.
          </p>
        </div>
      </section>

      {/* =====================================================
          PRODUCTS SECTION
          ===================================================== */}
      <section className="py-12 md:py-16">
        <div
          className="
            container-luxe
            grid
            gap-10
            lg:grid-cols-[240px_minmax(0,1fr)]
            xl:grid-cols-[280px_minmax(0,1fr)]
            2xl:grid-cols-[300px_minmax(0,1fr)]
            2xl:gap-14
          "
        >

          {/* =================================================
              SIDEBAR
              ================================================= */}
          <aside
            className="
              self-start
              space-y-8
              lg:sticky
              lg:top-24
            "
          >

            {/* Search */}
            <div>
              <label className="eyebrow">
                Search
              </label>

              <div className="relative mt-3">
                <Search
                  className="
                    absolute
                    left-3
                    top-1/2
                    h-4
                    w-4
                    -translate-y-1/2
                    text-muted-foreground
                  "
                />

                <Input
                  value={q}
                  onChange={(e) =>
                    setQ(e.target.value)
                  }
                  placeholder="Statuario, Onyx..."
                  className="rounded-none pl-9"
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <p className="eyebrow">
                Category
              </p>

              <ul className="mt-3 space-y-2 text-sm">

                <li>
                  <button
                    type="button"
                    onClick={() =>
                      setCat("all")
                    }
                    className={`
                      transition-colors
                      hover:text-accent
                      ${
                        cat === "all"
                          ? "font-medium text-accent"
                          : "text-muted-foreground"
                      }
                    `}
                  >
                    All categories
                  </button>
                </li>

                {categories.map((c: any) => (
                  <li key={c.id}>
                    <button
                      type="button"
                      onClick={() =>
                        setCat(c.name)
                      }
                      className={`
                        transition-colors
                        hover:text-accent
                        ${
                          cat === c.name
                            ? "font-medium text-accent"
                            : "text-muted-foreground"
                        }
                      `}
                    >
                      {c.name}
                    </button>
                  </li>
                ))}

              </ul>
            </div>

            {/* Clear Filters */}
            {(q || cat !== "all") && (
              <Button
                type="button"
                variant="outline"
                className="w-full rounded-none"
                onClick={() => {
                  setQ("");
                  setCat("all");
                }}
              >
                Clear filters
              </Button>
            )}

          </aside>

          {/* =================================================
              PRODUCTS
              ================================================= */}
          <div className="min-w-0">

            {/* Toolbar */}
            <div
              className="
                mb-8
                flex
                flex-wrap
                items-center
                justify-between
                gap-4
              "
            >
              <p className="text-sm text-muted-foreground">
                <SlidersHorizontal className="mr-1 inline h-4 w-4" />

                {filtered.length}{" "}
                {filtered.length === 1
                  ? "product"
                  : "products"}
              </p>

              <Select
                value={sort}
                onValueChange={setSort}
              >
                <SelectTrigger className="w-44 rounded-none">
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="newest">
                    Newest
                  </SelectItem>

                  <SelectItem value="popular">
                    Popular
                  </SelectItem>

                  <SelectItem value="az">
                    A → Z
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* =================================================
                RESPONSIVE PRODUCT GRID

                Mobile  = 1
                Small   = 2
                Large   = 2
                XL      = 3
                2XL     = 3
                ================================================= */}
            <div
              className="
                grid
                grid-cols-1
                gap-8
                sm:grid-cols-2
                lg:grid-cols-2
                xl:grid-cols-3
                2xl:grid-cols-3
                xl:gap-10
                2xl:gap-12
              "
            >
              {filtered.map((p: any) => (
                <ProductCard
                  key={p.id}
                  product={p}
                />
              ))}
            </div>

            {/* Empty */}
            {filtered.length === 0 && (
              <div className="py-24 text-center">
                <p className="text-muted-foreground">
                  No products match your filters.
                </p>

                {(q || cat !== "all") && (
                  <Button
                    type="button"
                    variant="outline"
                    className="mt-5 rounded-none"
                    onClick={() => {
                      setQ("");
                      setCat("all");
                    }}
                  >
                    Clear filters
                  </Button>
                )}
              </div>
            )}

          </div>
        </div>
      </section>
    </>
  );
}