import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { ImageLightbox } from "@/components/site/ImageLightbox";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      {
        title: "Journal — Aureo Stone",
      },
      {
        name: "description",
        content:
          "Insight and inspiration on marble, natural stone and interior design.",
      },
      {
        property: "og:title",
        content: "Journal — Aureo Stone",
      },
      {
        property: "og:description",
        content:
          "Insight and inspiration on marble and interior design.",
      },
      {
        property: "og:url",
        content: "/blog",
      },
    ],
    links: [
      {
        rel: "canonical",
        href: "/blog",
      },
    ],
  }),

  component: BlogPage,
});

function BlogPage() {
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);

  const {
    data: posts = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["blogs"],
    queryFn: api.getBlogs,
  });

  /*
   * Open the clicked blog image in the lightbox.
   */
  const openViewer = (index: number) => {
    if (!posts.length) {
      return;
    }

    setViewerIndex(index);
    setViewerOpen(true);
  };

  /*
   * Get valid image URLs.
   *
   * ImageLightbox expects an array of strings.
   */
  const imageUrls = posts
    .map((post: any) => {
      return (
        post.featuredImage ||
        post.image ||
        null
      );
    })
    .filter(Boolean);

  if (isLoading) {
    return (
      <section className="grid min-h-[60vh] place-items-center">
        <p className="text-muted-foreground">
          Loading journal...
        </p>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="grid min-h-[60vh] place-items-center">
        <p className="text-muted-foreground">
          Failed to load journal posts.
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
            Journal
          </p>

          <h1 className="mt-3 font-display text-5xl md:text-6xl">
            Ideas & Inspiration
          </h1>

          <p className="mt-4 max-w-2xl text-muted-foreground">
            Insight and inspiration on marble, natural stone,
            interiors and design.
          </p>
        </div>
      </section>

      {/* =====================================================
          BLOG POSTS
          ===================================================== */}
      <section className="py-16 md:py-20">
        <div className="container-luxe">

          {posts.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-muted-foreground">
                No journal posts available.
              </p>
            </div>
          ) : (
            <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">

              {posts.map(
                (p: any, i: number) => {
                  const image =
                    p.featuredImage ||
                    p.image ||
                    "/placeholder.jpg";

                  return (
                    <article
                      key={p.id || i}
                      className="group"
                    >
                      {/* =================================================
                          BLOG IMAGE
                          ================================================= */}
                      <button
                        type="button"
                        onClick={() =>
                          openViewer(i)
                        }
                        className="
                          relative
                          block
                          aspect-[4/3]
                          w-full
                          overflow-hidden
                          bg-muted
                          text-left
                          focus:outline-none
                          focus:ring-2
                          focus:ring-accent
                          focus:ring-offset-2
                        "
                        aria-label={`Open image for ${
                          p.title ||
                          "blog post"
                        }`}
                      >
                        <img
                          src={image}
                          alt={
                            p.title ||
                            "Blog post"
                          }
                          loading="lazy"
                          className="
                            h-full
                            w-full
                            object-cover
                            transition-transform
                            duration-[1200ms]
                            group-hover:scale-110
                          "
                        />

                        {/* Hover overlay */}
                        <div
                          className="
                            absolute
                            inset-0
                            bg-gradient-to-t
                            from-black/50
                            via-transparent
                            to-transparent
                            opacity-0
                            transition-opacity
                            duration-300
                            group-hover:opacity-100
                          "
                        />

                        {/* Optional image hint */}
                        <div
                          className="
                            absolute
                            inset-x-0
                            bottom-0
                            flex
                            translate-y-2
                            justify-center
                            p-5
                            opacity-0
                            transition-all
                            duration-300
                            group-hover:translate-y-0
                            group-hover:opacity-100
                          "
                        >
                          <span
                            className="
                              rounded-full
                              bg-white
                              px-5
                              py-2.5
                              text-sm
                              font-medium
                              text-black
                              shadow-xl
                            "
                          >
                            View Image
                          </span>
                        </div>
                      </button>

                      {/* =================================================
                          BLOG INFORMATION
                          ================================================= */}
                      <div className="mt-5">
                        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                          {p.date ||
                            p.publishedAt ||
                            "Draft"}
                        </p>

                        <h2
                          className="
                            mt-2
                            font-display
                            text-2xl
                            leading-tight
                            transition-colors
                            group-hover:text-accent
                          "
                        >
                          {p.title ||
                            "Untitled Post"}
                        </h2>

                        {(p.excerpt ||
                          p.shortDescription) && (
                          <p
                            className="
                              mt-3
                              line-clamp-3
                              text-sm
                              leading-6
                              text-muted-foreground
                            "
                          >
                            {p.excerpt ||
                              p.shortDescription}
                          </p>
                        )}
                      </div>
                    </article>
                  );
                }
              )}

            </div>
          )}
        </div>
      </section>

      {/* =====================================================
          IMAGE LIGHTBOX
          ===================================================== */}
      <ImageLightbox
        isOpen={viewerOpen}
        images={imageUrls}
        initialIndex={viewerIndex}
        onClose={() =>
          setViewerOpen(false)
        }
        title="Journal"
      />
    </>
  );
}