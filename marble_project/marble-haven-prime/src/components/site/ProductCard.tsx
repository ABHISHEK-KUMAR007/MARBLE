import { useState } from "react";
import { ImageLightbox } from "@/components/site/ImageLightbox";
import { toast } from "sonner";

type ProductProps = {
  product: any;
};

export function ProductCard({ product }: ProductProps) {
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);

  const image = product.image || "/placeholder.jpg";

  const category =
    typeof product.category === "string"
      ? product.category
      : product.category?.name || "Uncategorized";

  const handleOpenViewer = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    event.stopPropagation();

    if (!product.image) {
      toast.error("No product image available");
      return;
    }

    setViewerIndex(0);
    setViewerOpen(true);
  };

  return (
    <article className="group overflow-hidden border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">

      {/* =====================================================
          IMAGE
          ===================================================== */}
      <button
        type="button"
        onClick={handleOpenViewer}
        className="relative block aspect-[4/3] w-full overflow-hidden bg-muted text-left"
        aria-label={`Open image viewer for ${product.name}`}
      >
        <img
          src={image}
          alt={product.name || "Product"}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* Dark hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* Badges */}
        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          {product.isNew && (
            <span className="rounded-full bg-accent px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.18em] text-primary shadow-sm">
              New
            </span>
          )}

          {product.popular && (
            <span className="rounded-full bg-primary px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.18em] text-primary-foreground shadow-sm">
              Popular
            </span>
          )}
        </div>

        {/* View Image */}
        <div className="absolute inset-x-0 bottom-0 flex translate-y-2 justify-center p-5 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <span className="rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black shadow-xl">
            View Image
          </span>
        </div>
      </button>

      {/* =====================================================
          PRODUCT INFORMATION
          ===================================================== */}
      <div className="p-5 md:p-6">

        {/* Category */}
        <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-muted-foreground">
          {category}
        </p>

        {/* Product name */}
        <h3 className="mt-2 font-display text-2xl leading-tight text-foreground md:text-[1.65rem]">
          {product.name || "Unnamed Product"}
        </h3>

        {/* Description */}
        <p className="mt-3 line-clamp-3 min-h-[4.5rem] text-sm leading-6 text-muted-foreground">
          {product.description ||
            "Premium natural stone selected for quality, durability and elegant applications."}
        </p>

        {/* =================================================
            SPECIFICATIONS
            ================================================= */}
        <div className="mt-5 grid grid-cols-2 gap-2">

          {/* Origin */}
          <div className="rounded-md border border-border/70 bg-secondary/30 px-3 py-3">
            <p className="text-[9px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
              Origin
            </p>

            <p className="mt-1.5 truncate text-sm font-medium text-foreground">
              {product.origin || "N/A"}
            </p>
          </div>

          {/* Finish */}
          <div className="rounded-md border border-border/70 bg-secondary/30 px-3 py-3">
            <p className="text-[9px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
              Finish
            </p>

            <p className="mt-1.5 truncate text-sm font-medium text-foreground">
              {product.finish || "N/A"}
            </p>
          </div>

          {/* Thickness */}
          <div className="rounded-md border border-border/70 bg-secondary/30 px-3 py-3">
            <p className="text-[9px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
              Thickness
            </p>

            <p className="mt-1.5 truncate text-sm font-medium text-foreground">
              {product.thickness || "N/A"}
            </p>
          </div>

          {/* Price Unit */}
          <div className="rounded-md border border-border/70 bg-secondary/30 px-3 py-3">
            <p className="text-[9px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
              Unit
            </p>

            <p className="mt-1.5 truncate text-sm font-medium text-foreground">
              {product.priceUnit || "N/A"}
            </p>
          </div>

        </div>

        {/* =================================================
            PRICE
            ================================================= */}
        <div className="mt-5 flex items-end justify-between border-t border-border pt-5">

          <div>
            <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Price
            </p>

            <p className="mt-1 font-display text-2xl font-semibold text-primary">
              {product.price
                ? `₹ ${product.price}`
                : "On Request"}
            </p>
          </div>

          {product.priceUnit && product.price && (
            <span className="pb-1 text-xs text-muted-foreground">
              / {product.priceUnit}
            </span>
          )}

        </div>

      </div>

      {/* =====================================================
          IMAGE LIGHTBOX
          ===================================================== */}
      <ImageLightbox
        isOpen={viewerOpen}
        images={[image]}
        initialIndex={viewerIndex}
        onClose={() => setViewerOpen(false)}
        title={product.name || "Product"}
      />

    </article>
  );
}