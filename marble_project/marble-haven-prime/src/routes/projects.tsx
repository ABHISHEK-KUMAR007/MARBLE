import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { ImageLightbox } from "@/components/site/ImageLightbox";
import {
  Image as ImageIcon,
  Film,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      {
        title: "Projects — Makrana Marble Art",
      },
      {
        name: "description",
        content:
          "Explore our completed marble, granite and natural stone projects.",
      },
    ],
  }),

  component: ProjectsPage,
});

function ProjectsPage() {
  const {
    data: projects = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["projects"],
    queryFn: api.getProjects,
  });

  // Which project is currently expanded
  const [expandedProjectId, setExpandedProjectId] = React.useState<
    string | number | null
  >(null);

  // Full project details
  const [selectedProject, setSelectedProject] = React.useState<any | null>(
    null
  );

  const [loadingProjectId, setLoadingProjectId] = React.useState<
    string | number | null
  >(null);

  const [viewerOpen, setViewerOpen] = React.useState(false);
  const [viewerIndex, setViewerIndex] = React.useState(0);
  const [viewerImages, setViewerImages] = React.useState<string[]>([]);

  const openLightbox = (images: string[], index: number) => {
    if (!images.length) return;
    setViewerImages(images.filter(Boolean));
    setViewerIndex(index);
    setViewerOpen(true);
  };

  const handleViewProject = async (project: any) => {
    // If already open, close it
    if (expandedProjectId === project.id) {
      setExpandedProjectId(null);
      setSelectedProject(null);
      return;
    }

    try {
      setLoadingProjectId(project.id);

      // Get complete project details
      const fullProject = await api.getProject(String(project.id));

      console.log("PROJECT DETAIL:", fullProject);

      setSelectedProject(fullProject);
      setExpandedProjectId(project.id);
    } catch (error) {
      console.error("Failed to load project details:", error);
    } finally {
      setLoadingProjectId(null);
    }
  };

  if (isLoading) {
    return (
      <section className="grid min-h-[60vh] place-items-center">
        <p className="text-muted-foreground">
          Loading projects...
        </p>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="grid min-h-[60vh] place-items-center">
        <p className="text-muted-foreground">
          Failed to load projects.
        </p>
      </section>
    );
  }

  return (
    <>
      {/* Hero */}
      <section className="border-b bg-secondary/40 pt-32 pb-12">
        <div className="container-luxe">
          <p className="eyebrow">
            Selected Work
          </p>

          <h1 className="mt-3 font-display text-5xl md:text-6xl">
            Projects
          </h1>

          <p className="mt-4 max-w-2xl text-muted-foreground">
            Explore our completed marble and natural stone projects,
            including residential, commercial and custom applications.
          </p>
        </div>
      </section>

      {/* Projects */}
      <section className="py-16 md:py-20">
        <div className="container-luxe">

          {projects.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-muted-foreground">
                No projects available.
              </p>
            </div>
          ) : (
            <div className="grid gap-12 md:grid-cols-2 lg:gap-16">

              {projects.map((p: any) => {

                const images = Array.isArray(p.images)
                  ? p.images
                  : [];

                const videos = Array.isArray(p.videos)
                  ? p.videos
                  : [];

                const image =
                  images.length > 0
                    ? images[0]
                    : p.image || "/placeholder.jpg";

                const projectName =
                  p.name ||
                  p.title ||
                  "Untitled Project";

                const isExpanded =
                  expandedProjectId === p.id;

                /*
                 * If this project is expanded, use the
                 * complete API response.
                 */
                const detail =
                  isExpanded && selectedProject
                    ? selectedProject
                    : p;

                const detailImages =
                  Array.isArray(detail.images)
                    ? detail.images
                    : [];

                const detailVideos =
                  Array.isArray(detail.videos)
                    ? detail.videos
                    : [];

                return (
                  <div
                    key={p.id}
                    className={`group overflow-hidden rounded-2xl border bg-card transition-all duration-500 ${
                      isExpanded
                        ? "md:col-span-2"
                        : ""
                    }`}
                  >

                    {/* ========================= */}
                    {/* PROJECT CARD */}
                    {/* ========================= */}

                    <div className="grid md:grid-cols-2">

                      {/* Thumbnail */}
                      <div className="relative aspect-[4/3] overflow-hidden bg-muted md:aspect-auto">

                        <img
                          src={image}
                          alt={projectName}
                          loading="lazy"
                          className="h-full min-h-[300px] w-full object-cover transition-transform duration-[1200ms] group-hover:scale-105"
                        />

                        {/* Media Count */}
                        <div className="absolute right-3 top-3 flex items-center gap-2">

                          {images.length > 0 && (
                            <span className="flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-md">
                              <ImageIcon className="h-3 w-3" />
                              {images.length}
                            </span>
                          )}

                          {videos.length > 0 && (
                            <span className="flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-md">
                              <Film className="h-3 w-3" />
                              {videos.length}
                            </span>
                          )}

                        </div>

                      </div>

                      {/* Basic Information */}
                      <div className="flex flex-col justify-between p-6 md:p-8">

                        <div>

                          <p className="eyebrow !text-muted-foreground">
                            {p.active
                              ? "Completed Project"
                              : "Project"}
                          </p>

                          <h2 className="mt-2 font-display text-3xl">
                            {projectName}
                          </h2>

                          <p className="mt-3 text-sm leading-7 text-muted-foreground">
                            {p.description ||
                              "Marble and natural stone project"}
                          </p>

                          <div className="mt-6 grid grid-cols-2 gap-4">

                            <div>
                              <p className="text-xs text-muted-foreground">
                                Completion Date
                              </p>

                              <p className="mt-1 text-sm font-medium">
                                {p.completionDate ||
                                  "N/A"}
                              </p>
                            </div>

                            <div>
                              <p className="text-xs text-muted-foreground">
                                Status
                              </p>

                              <p className="mt-1 text-sm font-medium">
                                {p.active
                                  ? "Completed"
                                  : "Inactive"}
                              </p>
                            </div>

                          </div>

                        </div>

                        {/* View Button */}
                        <button
                          type="button"
                          onClick={() =>
                            handleViewProject(p)
                          }
                          disabled={
                            loadingProjectId === p.id
                          }
                          className="mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-black/80 disabled:opacity-50"
                        >

                          {loadingProjectId === p.id
                            ? "Loading..."
                            : isExpanded
                            ? "Hide Project"
                            : "View Project"}

                          {isExpanded ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}

                        </button>

                      </div>

                    </div>

                    {/* ================================= */}
                    {/* EXPANDED PROJECT DETAILS */}
                    {/* ================================= */}

                    {isExpanded && (
                      <div className="border-t bg-secondary/20 p-6 md:p-10">

                        {/* Project Details Header */}
                        <div className="mb-10">

                          <p className="eyebrow">
                            Project Details
                          </p>

                          <h3 className="mt-2 font-display text-3xl md:text-4xl">
                            {detail.name ||
                              detail.title ||
                              "Untitled Project"}
                          </h3>

                        </div>

                        {/* Information */}
                        <div className="grid gap-4 md:grid-cols-4">

                          <div className="rounded-2xl border bg-card p-5">

                            <p className="text-xs text-muted-foreground">
                              Project Name
                            </p>

                            <p className="mt-2 font-medium">
                              {detail.name ||
                                "N/A"}
                            </p>

                          </div>

                          <div className="rounded-2xl border bg-card p-5">

                            <p className="text-xs text-muted-foreground">
                              Title
                            </p>

                            <p className="mt-2 font-medium">
                              {detail.title ||
                                "N/A"}
                            </p>

                          </div>

                          <div className="rounded-2xl border bg-card p-5">

                            <p className="text-xs text-muted-foreground">
                              Completion Date
                            </p>

                            <p className="mt-2 font-medium">
                              {detail.completionDate ||
                                "N/A"}
                            </p>

                          </div>

                          <div className="rounded-2xl border bg-card p-5">

                            <p className="text-xs text-muted-foreground">
                              Status
                            </p>

                            <p className="mt-2 font-medium">
                              {detail.active
                                ? "Completed"
                                : "Inactive"}
                            </p>

                          </div>

                        </div>

                        {/* Description */}
                        <div className="mt-10">

                          <h3 className="font-display text-2xl">
                            Description
                          </h3>

                          <p className="mt-3 whitespace-pre-line leading-8 text-muted-foreground">
                            {detail.description ||
                              "No description available."}
                          </p>

                        </div>

                        {/* ========================= */}
                        {/* ALL IMAGES */}
                        {/* ========================= */}

                        {detailImages.length > 0 && (
                          <div className="mt-12">

                            <div className="mb-5 flex items-center gap-3">

                              <ImageIcon className="h-5 w-5" />

                              <h3 className="font-display text-2xl">
                                Image Gallery
                              </h3>

                              <span className="text-sm text-muted-foreground">
                                ({detailImages.length})
                              </span>

                            </div>

                            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

                              {detailImages.map(
                                (
                                  img: string,
                                  index: number
                                ) => (
                                  <button
                                    key={index}
                                    type="button"
                                    onClick={() => openLightbox(detailImages, index)}
                                    className="aspect-[4/3] overflow-hidden rounded-2xl bg-muted text-left"
                                  >
                                    <img
                                      src={img}
                                      alt={`${projectName} - Image ${
                                        index + 1
                                      }`}
                                      className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                                    />
                                  </button>
                                )
                              )}

                            </div>

                          </div>
                        )}

                        {/* ========================= */}
                        {/* ALL VIDEOS */}
                        {/* ========================= */}

                        {detailVideos.length > 0 && (
                          <div className="mt-12">

                            <div className="mb-5 flex items-center gap-3">

                              <Film className="h-5 w-5" />

                              <h3 className="font-display text-2xl">
                                Project Videos
                              </h3>

                              <span className="text-sm text-muted-foreground">
                                ({detailVideos.length})
                              </span>

                            </div>

                            <div className="grid gap-6 md:grid-cols-2">

                              {detailVideos.map(
                                (
                                  video: string,
                                  index: number
                                ) => (
                                  <div
                                    key={index}
                                    className="overflow-hidden rounded-2xl bg-black"
                                  >
                                    <video
                                      src={video}
                                      controls
                                      preload="metadata"
                                      className="aspect-video w-full"
                                    />
                                  </div>
                                )
                              )}

                            </div>

                          </div>
                        )}

                        {/* Close */}
                        <div className="mt-10 border-t pt-6">

                          <button
                            type="button"
                            onClick={() => {
                              setExpandedProjectId(null);
                              setSelectedProject(null);
                            }}
                            className="rounded-full border px-5 py-2.5 text-sm font-medium transition hover:bg-muted"
                          >
                            Hide Project Details
                          </button>

                        </div>

                      </div>
                    )}

                  </div>
                );
              })}

            </div>
          )}

        </div>
      </section>

      <ImageLightbox
        isOpen={viewerOpen}
        images={viewerImages}
        initialIndex={viewerIndex}
        onClose={() => setViewerOpen(false)}
        title="Project gallery"
      />
    </>
  );
}