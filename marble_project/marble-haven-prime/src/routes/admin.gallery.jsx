import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Upload, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import s1 from "@/assets/tex-statuario.jpg";
import s2 from "@/assets/tex-marquina.jpg";
import s3 from "@/assets/tex-onyx.jpg";
import s4 from "@/assets/tex-travertine.jpg";
import s5 from "@/assets/tex-granite.jpg";

export const Route = createFileRoute("/admin/gallery")({
  component: GalleryAdmin,
});

const seed = [s1, s2, s3, s4, s5, s1, s2, s3, s4, s5, s1, s2].map((image, i) => ({
  id: i + 1, image, tag: ["Kitchen", "Bathroom", "Flooring", "Wall"][i % 4],
}));

function GalleryAdmin() {
  const [list, setList] = useState(seed);
  return (
    <div className="space-y-6">
      <PageHeader
        title="Gallery"
        description="Curate project photos featured across your site."
        actions={<Button><Upload className="mr-1 h-4 w-4" /> Upload images</Button>}
      />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
        {list.map((g) => (
          <div key={g.id} className="group relative overflow-hidden rounded-lg border bg-card">
            <img src={g.image} alt="" className="aspect-square w-full object-cover" />
            <div className="absolute inset-0 flex flex-col justify-between bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 transition group-hover:opacity-100">
              <span className="self-start rounded bg-white/90 px-2 py-0.5 text-[clamp(0.78rem,0.18vw+0.74rem,0.9rem)] uppercase tracking-widest text-primary">{g.tag}</span>
              <button
                className="self-end grid h-8 w-8 place-items-center rounded-full bg-white text-primary"
                onClick={() => { setList(list.filter((x) => x.id !== g.id)); toast.success("Removed"); }}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
