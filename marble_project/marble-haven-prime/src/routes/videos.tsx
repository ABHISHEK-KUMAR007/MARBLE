import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PlayCircle, X, Loader2, AlertCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export const Route = createFileRoute("/videos")({
  head: () => ({
    meta: [
      { title: "Videos — Aureo Stone" },
      { name: "description", content: "Tour our quarries, factories and finished stone installations." },
      { property: "og:title", content: "Videos — Aureo Stone" },
      { property: "og:description", content: "Tour our quarries, factories and finished stone installations." },
      { property: "og:url", content: "/videos" },
    ],
    links: [{ rel: "canonical", href: "/videos" }],
  }),
  component: VideosPage,
});

function getYoutubeId(url: string): string | null {
  if (!url) return null;
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

function VideosPage() {
  const [play, setPlay] = useState<string | null>(null);
  const { data: videos = [], isLoading, isError } = useQuery({
    queryKey: ["videos"],
    queryFn: api.getVideos,
  });

  const activeVideos = videos
    .filter((v: any) => v.active === true)
    .map((v: any) => {
      const videoId = getYoutubeId(v.youtubeUrl);
      return {
        id: videoId || v.id,
        title: v.title,
        thumbnail: v.thumbnail || (videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null),
        videoId,
      };
    })
    .filter((v: any) => v.videoId !== null);

  return (
    <>
      <section className="pt-32 pb-12 border-b bg-secondary/40">
        <div className="container-luxe">
          <p className="eyebrow">Watch</p>
          <h1 className="mt-3 font-display text-5xl md:text-6xl">Videos</h1>
        </div>
      </section>
      <section className="py-16">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <AlertCircle className="h-10 w-10 text-destructive mb-4" />
            <p className="text-lg font-medium text-destructive">Failed to load videos</p>
            <p className="text-sm text-muted-foreground mt-1">Please try again later.</p>
          </div>
        ) : activeVideos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-lg font-medium text-muted-foreground">No videos available</p>
            <p className="text-sm text-muted-foreground mt-1">Check back soon for new content.</p>
          </div>
        ) : (
          <div className="container-luxe grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 xl:gap-8">
            {activeVideos.map((v: any) => (
              <button key={v.id} onClick={() => setPlay(v.id)} className="group relative aspect-video overflow-hidden bg-muted text-left">
                <img src={v.thumbnail} alt={v.title} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition grid place-items-center">
                  <PlayCircle className="h-16 w-16 text-white/95 group-hover:scale-110 transition-transform" />
                </div>
                <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                  <p className="text-white font-display text-lg">{v.title}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </section>
      {play && (
        <div className="fixed inset-0 z-[60] bg-black/90 grid place-items-center p-4" onClick={() => setPlay(null)}>
          <button aria-label="Close" className="absolute top-6 right-6 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"><X /></button>
          <div className="w-full max-w-5xl aspect-video" onClick={(e) => e.stopPropagation()}>
            <iframe title="Video" src={`https://www.youtube.com/embed/${play}?autoplay=1`} className="w-full h-full" allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen />
          </div>
        </div>
      )}
    </>
  );
}
