import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { ImageLightbox } from "@/components/site/ImageLightbox";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      {
        title: "Gallery — Aureo Stone",
      },
      {
        name: "description",
        content:
          "A masonry gallery of Aureo Stone projects, slabs, factory and applications.",
      },
      {
        property: "og:title",
        content: "Gallery — Aureo Stone",
      },
      {
        property: "og:description",
        content: "A masonry gallery of Aureo Stone projects.",
      },
      {
        property: "og:url",
        content: "/gallery",
      },
    ],
    links: [
      {
        rel: "canonical",
        href: "/gallery",
      },
    ],
  }),

  component: GalleryPage,
});

const TABS = ["All", "Slabs", "Projects", "Factory"];

function GalleryPage() {
  const [tab, setTab] = useState("All");

  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);

  const {
    data: gallery = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["gallery"],
    queryFn: api.getGallery,
  });

  /*
   * Filter gallery based on selected tab.
   *
   * Change `category` below if your backend uses another
   * field name such as `type`.
   */
  const filteredImages = useMemo(() => {
    if (!Array.isArray(gallery)) {
      return [];
    }

    if (tab === "All") {
      return gallery;
    }

    return gallery.filter((item: any) => {
      const category =
        item.category ||
        item.type ||
        item.categoryName ||
        "";

      return (
        String(category).toLowerCase() ===
        tab.toLowerCase()
      );
    });
  }, [gallery, tab]);

  /*
   * Only valid image URLs are passed to ImageLightbox.
   *
   * IMPORTANT:
   * This array is created from filteredImages, so the
   * index of an image in the grid is exactly the same
   * index used by the lightbox.
   */
  const imageUrls = useMemo(() => {
    return filteredImages
      .map((item: any) => {
        if (typeof item === "string") {
          return item;
        }

        return (
          item?.url ||
          item?.imageUrl ||
          item?.path ||
          item?.image ||
          null
        );
      })
      .filter(Boolean);
  }, [filteredImages]);

  /*
   * Open lightbox when the user clicks an image.
   */
  const openViewer = (index: number) => {
    if (!imageUrls.length) {
      return;
    }

    setViewerIndex(index);
    setViewerOpen(true);
  };

  /*
   * Loading
   */
  if (isLoading) {
    return (
      <section className="grid min-h-[60vh] place-items-center">
        <p className="text-muted-foreground">
          Loading gallery...
        </p>
      </section>
    );
  }

  /*
   * Error
   */
  if (isError) {
    return (
      <section className="grid min-h-[60vh] place-items-center">
        <p className="text-muted-foreground">
          Failed to load gallery.
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
            Portfolio
          </p>

          <h1 className="mt-3 font-display text-5xl md:text-6xl">
            Gallery
          </h1>

          <p className="mt-4 max-w-2xl text-muted-foreground">
            Explore our marble slabs, completed projects,
            factory work and natural stone applications.
          </p>
        </div>
      </section>

      {/* =====================================================
          TABS
          ===================================================== */}
      <section className="border-b">
        <div className="container-luxe">
          <div className="flex gap-6 overflow-x-auto">
            {TABS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => {
                  setTab(t);
                  setViewerOpen(false);
                  setViewerIndex(0);
                }}
                className={`
                  whitespace-nowrap
                  border-b-2
                  pb-3
                  pt-5
                  text-sm
                  transition
                  ${
                    tab === t
                      ? "border-accent text-foreground"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }
                `}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          GALLERY
          ===================================================== */}
      <section className="py-14">
        <div
          className="
            container-luxe
            columns-2
            gap-4
            space-y-4
            md:columns-3
            lg:columns-4
            xl:columns-5
            2xl:columns-6
            xl:gap-6
            xl:space-y-6
          "
        >
          {filteredImages.length === 0 ? (
            <div className="col-span-full py-20 text-center">
              <p className="text-muted-foreground">
                No gallery images available.
              </p>
            </div>
          ) : (
            filteredImages.map(
              (g: any, i: number) => {
                const imageUrl =
                  typeof g === "string"
                    ? g
                    : g?.url ||
                      g?.imageUrl ||
                      g?.path ||
                      g?.image;

                if (!imageUrl) {
                  return null;
                }

                return (
                  /*
                   * IMPORTANT:
                   *
                   * There is NO "View Image" button.
                   *
                   * The image itself is the clickable element.
                   */
                  <button
                    key={g?.id || i}
                    type="button"
                    onClick={() =>
                      openViewer(i)
                    }
                    className="
                      group
                      block
                      w-full
                      break-inside-avoid
                      overflow-hidden
                      bg-muted
                      text-left
                      focus:outline-none
                      focus:ring-2
                      focus:ring-accent
                      focus:ring-offset-2
                    "
                    aria-label={`Open ${
                      g?.title ||
                      `Gallery image ${i + 1}`
                    }`}
                  >
                    <img
                      src={imageUrl}
                      alt={
                        g?.title ||
                        `Gallery ${i + 1}`
                      }
                      loading="lazy"
                      className={`
                        w-full
                        object-cover
                        transition-transform
                        duration-[1200ms]
                        group-hover:scale-110
                        ${
                          i % 3 === 0
                            ? "aspect-[3/4]"
                            : i % 2 === 0
                              ? "aspect-square"
                              : "aspect-[4/5]"
                        }
                      `}
                    />
                  </button>
                );
              }
            )
          )}
        </div>
      </section>

      {/* =====================================================
          LIGHTBOX
          ===================================================== */}
      <ImageLightbox
        isOpen={viewerOpen}
        images={imageUrls}
        initialIndex={viewerIndex}
        onClose={() =>
          setViewerOpen(false)
        }
        title="Gallery"
      />
    </>
  );
}