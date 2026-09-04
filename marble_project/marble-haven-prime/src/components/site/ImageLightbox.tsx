import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCcw,
} from "lucide-react";

type ImageLightboxProps = {
  isOpen: boolean;
  images: string[];
  initialIndex?: number;
  onClose: () => void;
  title?: string;
};

export function ImageLightbox({
  isOpen,
  images,
  initialIndex = 0,
  onClose,
  title = "Image",
}: ImageLightboxProps) {
  const [currentIndex, setCurrentIndex] =
    useState(initialIndex);

  const [zoom, setZoom] = useState(1);

  /*
   * Update current image whenever lightbox opens
   * or initialIndex changes.
   */
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      setZoom(1);
    }
  }, [isOpen, initialIndex]);

  /*
   * Prevent background page scrolling while
   * lightbox is open.
   */
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const originalOverflow =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow =
        originalOverflow;
    };
  }, [isOpen]);

  /*
   * Keyboard controls
   */
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (
      event: KeyboardEvent
    ) => {
      if (event.key === "Escape") {
        onClose();
      }

      if (
        event.key === "ArrowRight" &&
        images.length > 1
      ) {
        setCurrentIndex(
          (prev) =>
            (prev + 1) % images.length
        );
        setZoom(1);
      }

      if (
        event.key === "ArrowLeft" &&
        images.length > 1
      ) {
        setCurrentIndex(
          (prev) =>
            (prev - 1 + images.length) %
            images.length
        );
        setZoom(1);
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [
    isOpen,
    images.length,
    onClose,
  ]);

  if (!isOpen || images.length === 0) {
    return null;
  }

  const currentImage =
    images[currentIndex];

  const previousImage = () => {
    setCurrentIndex(
      (prev) =>
        (prev - 1 + images.length) %
        images.length
    );

    setZoom(1);
  };

  const nextImage = () => {
    setCurrentIndex(
      (prev) =>
        (prev + 1) % images.length
    );

    setZoom(1);
  };

  const zoomIn = () => {
    setZoom((prev) =>
      Math.min(prev + 0.25, 3)
    );
  };

  const zoomOut = () => {
    setZoom((prev) =>
      Math.max(prev - 0.25, 0.5)
    );
  };

  const resetZoom = () => {
    setZoom(1);
  };

  /*
   * IMPORTANT:
   *
   * createPortal renders this outside the
   * ProductCard / article / grid.
   *
   * Therefore the lightbox can cover the
   * complete browser viewport.
   */
  return createPortal(
    <div
      className="
        fixed
        inset-0
        z-[99999]
        flex
        h-screen
        w-screen
        items-center
        justify-center
        bg-black/95
      "
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={onClose}
    >
      {/* =================================================
          TOP BAR
          ================================================= */}
      <div
        className="
          absolute
          left-0
          right-0
          top-0
          z-[100000]
          flex
          items-center
          justify-between
          bg-gradient-to-b
          from-black/70
          to-transparent
          px-4
          py-4
          md:px-6
        "
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        {/* Title */}
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-white md:text-base">
            {title}
          </p>

          {images.length > 1 && (
            <p className="mt-1 text-xs text-white/60">
              {currentIndex + 1} /{" "}
              {images.length}
            </p>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          {/* Zoom Out */}
          <button
            type="button"
            onClick={zoomOut}
            disabled={zoom <= 0.5}
            className="
              grid
              h-10
              w-10
              place-items-center
              rounded-full
              bg-white/10
              text-white
              backdrop-blur-md
              transition
              hover:bg-white/20
              disabled:cursor-not-allowed
              disabled:opacity-40
            "
            aria-label="Zoom out"
          >
            <ZoomOut className="h-5 w-5" />
          </button>

          {/* Reset Zoom */}
          <button
            type="button"
            onClick={resetZoom}
            className="
              grid
              h-10
              w-10
              place-items-center
              rounded-full
              bg-white/10
              text-white
              backdrop-blur-md
              transition
              hover:bg-white/20
            "
            aria-label="Reset zoom"
          >
            <RotateCcw className="h-5 w-5" />
          </button>

          {/* Zoom In */}
          <button
            type="button"
            onClick={zoomIn}
            disabled={zoom >= 3}
            className="
              grid
              h-10
              w-10
              place-items-center
              rounded-full
              bg-white/10
              text-white
              backdrop-blur-md
              transition
              hover:bg-white/20
              disabled:cursor-not-allowed
              disabled:opacity-40
            "
            aria-label="Zoom in"
          >
            <ZoomIn className="h-5 w-5" />
          </button>

          {/* Close */}
          <button
            type="button"
            onClick={onClose}
            className="
              ml-2
              grid
              h-10
              w-10
              place-items-center
              rounded-full
              bg-white/10
              text-white
              backdrop-blur-md
              transition
              hover:bg-white/20
            "
            aria-label="Close image viewer"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* =================================================
          PREVIOUS
          ================================================= */}
      {images.length > 1 && (
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            previousImage();
          }}
          className="
            absolute
            left-3
            top-1/2
            z-[100000]
            grid
            h-12
            w-12
            -translate-y-1/2
            place-items-center
            rounded-full
            bg-white/10
            text-white
            backdrop-blur-md
            transition
            hover:bg-white/20
            md:left-6
            md:h-14
            md:w-14
          "
          aria-label="Previous image"
        >
          <ChevronLeft className="h-7 w-7" />
        </button>
      )}

      {/* =================================================
          IMAGE
          ================================================= */}
      <div
        className="
          relative
          flex
          h-full
          w-full
          items-center
          justify-center
          overflow-hidden
          px-16
          py-20
          md:px-24
        "
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        <img
          src={currentImage}
          alt={`${title} ${currentIndex + 1}`}
          className="
            max-h-full
            max-w-full
            select-none
            object-contain
            transition-transform
            duration-300
          "
          style={{
            transform: `scale(${zoom})`,
          }}
          draggable={false}
        />
      </div>

      {/* =================================================
          NEXT
          ================================================= */}
      {images.length > 1 && (
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            nextImage();
          }}
          className="
            absolute
            right-3
            top-1/2
            z-[100000]
            grid
            h-12
            w-12
            -translate-y-1/2
            place-items-center
            rounded-full
            bg-white/10
            text-white
            backdrop-blur-md
            transition
            hover:bg-white/20
            md:right-6
            md:h-14
            md:w-14
          "
          aria-label="Next image"
        >
          <ChevronRight className="h-7 w-7" />
        </button>
      )}

      {/* =================================================
          BOTTOM IMAGE COUNTER
          ================================================= */}
      {images.length > 1 && (
        <div
          className="
            absolute
            bottom-5
            left-1/2
            z-[100000]
            -translate-x-1/2
            rounded-full
            bg-black/50
            px-4
            py-2
            text-xs
            text-white/80
            backdrop-blur-md
          "
          onClick={(event) =>
            event.stopPropagation()
          }
        >
          {currentIndex + 1} /{" "}
          {images.length}
        </div>
      )}
    </div>,
    document.body
  );
}