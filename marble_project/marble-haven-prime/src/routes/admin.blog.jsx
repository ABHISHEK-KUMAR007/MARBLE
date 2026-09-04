import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { posts as seed } from "@/lib/data";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/blog")({
  component: BlogAdmin,
});

function BlogAdmin() {
  const [list, setList] = useState(seed);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", excerpt: "", date: "" });

  const add = (e) => {
    e.preventDefault();
    const id = form.title.toLowerCase().replace(/\s+/g, "-");
    setList([{ ...form, id, image: seed[0].image }, ...list]);
    setForm({ title: "", excerpt: "", date: "" });
    setOpen(false);
    toast.success("Post published");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Blog Posts"
        description="Manage editorial content and guides."
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button><Plus className="mr-1 h-4 w-4" /> New post</Button></DialogTrigger>
            <DialogContent className="max-w-xl">
              <DialogHeader><DialogTitle>New blog post</DialogTitle></DialogHeader>
              <form onSubmit={add} className="space-y-4">
                <div><Label>Title</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></div>
                <div><Label>Excerpt</Label><Textarea rows={3} value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} /></div>
                <div><Label>Date</Label><Input value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} placeholder="Jul 2026" /></div>
                <DialogFooter><Button type="submit">Publish</Button></DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {list.map((p) => (
          <article key={p.id} className="overflow-hidden rounded-lg border bg-card">
            <img src={p.image} alt="" className="aspect-[16/10] w-full object-cover" />
            <div className="p-4">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">{p.date}</p>
              <h3 className="mt-1 font-display text-lg leading-snug">{p.title}</h3>
              <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{p.excerpt}</p>
              <div className="mt-3 flex justify-end gap-1">
                <Button size="icon" variant="ghost"><Pencil className="h-4 w-4" /></Button>
                <Button size="icon" variant="ghost" onClick={() => { setList(list.filter((x) => x.id !== p.id)); toast.success("Deleted"); }}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
