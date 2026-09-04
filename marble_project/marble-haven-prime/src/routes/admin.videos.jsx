import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Trash2, Play } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/videos")({
  component: VideosAdmin,
});

function VideosAdmin() {
  const [list, setList] = useState([
    { id: 1, title: "Inside Carrara Quarry", youtubeId: "dQw4w9WgXcQ" },
    { id: 2, title: "Factory Walkthrough", youtubeId: "dQw4w9WgXcQ" },
    { id: 3, title: "Statuario Installation", youtubeId: "dQw4w9WgXcQ" },
  ]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", youtubeId: "" });

  const add = (e) => {
    e.preventDefault();
    setList([{ id: Date.now(), ...form }, ...list]);
    setForm({ title: "", youtubeId: "" });
    setOpen(false);
    toast.success("Video added");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Videos"
        description="Manage YouTube videos shown on the site."
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button><Plus className="mr-1 h-4 w-4" /> Add video</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Add video</DialogTitle></DialogHeader>
              <form onSubmit={add} className="space-y-4">
                <div><Label>Title</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></div>
                <div><Label>YouTube ID</Label><Input value={form.youtubeId} onChange={(e) => setForm({ ...form, youtubeId: e.target.value })} placeholder="dQw4w9WgXcQ" required /></div>
                <DialogFooter><Button type="submit">Save</Button></DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {list.map((v) => (
          <div key={v.id} className="overflow-hidden rounded-lg border bg-card">
            <div className="relative aspect-video bg-muted">
              <img src={`https://img.youtube.com/vi/${v.youtubeId}/hqdefault.jpg`} alt="" className="h-full w-full object-cover" />
              <div className="absolute inset-0 grid place-items-center">
                <div className="grid h-14 w-14 place-items-center rounded-full bg-white/90"><Play className="h-6 w-6 text-primary" /></div>
              </div>
            </div>
            <div className="flex items-center justify-between p-4">
              <div>
                <p className="font-medium">{v.title}</p>
                <p className="text-xs text-muted-foreground">{v.youtubeId}</p>
              </div>
              <Button size="icon" variant="ghost" onClick={() => { setList(list.filter((x) => x.id !== v.id)); toast.success("Deleted"); }}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
