import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { categories as seed } from "@/lib/data";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/categories")({
  component: CategoriesAdmin,
});

function CategoriesAdmin() {
  const [list, setList] = useState(seed);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", description: "" });

  const add = (e) => {
    e.preventDefault();
    const id = form.name.toLowerCase().replace(/\s+/g, "-");
    setList([{ ...form, id, image: seed[0].image }, ...list]);
    setForm({ name: "", description: "" });
    setOpen(false);
    toast.success("Category added");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Categories"
        description="Organise products into browsable stone categories."
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="mr-1 h-4 w-4" /> New category</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>New category</DialogTitle></DialogHeader>
              <form onSubmit={add} className="space-y-4">
                <div><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
                <div><Label>Description</Label><Textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
                <DialogFooter><Button type="submit">Save</Button></DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {list.map((c) => (
          <div key={c.id} className="group overflow-hidden rounded-lg border bg-card">
            <div className="aspect-[16/10] overflow-hidden bg-muted">
              <img src={c.image} alt={c.name} className="h-full w-full object-cover transition group-hover:scale-105" />
            </div>
            <div className="p-4">
              <h3 className="font-display text-lg">{c.name}</h3>
              <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{c.description}</p>
              <div className="mt-3 flex justify-end gap-1">
                <Button size="icon" variant="ghost"><Pencil className="h-4 w-4" /></Button>
                <Button size="icon" variant="ghost" onClick={() => { setList(list.filter((x) => x.id !== c.id)); toast.success("Deleted"); }}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
