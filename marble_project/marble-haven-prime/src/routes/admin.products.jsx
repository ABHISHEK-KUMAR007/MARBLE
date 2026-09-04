import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { products as seed } from "@/lib/data";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/products")({
  component: ProductsAdmin,
});

function ProductForm({ initial, onSubmit }) {
  const [f, setF] = useState(initial ?? { name: "", category: "", origin: "", finish: "", thickness: "", price: "", description: "" });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  return (
    <form
      onSubmit={(e) => { e.preventDefault(); onSubmit(f); }}
      className="grid gap-4 sm:grid-cols-2"
    >
      <div className="sm:col-span-2"><Label>Name</Label><Input value={f.name} onChange={set("name")} required /></div>
      <div><Label>Category</Label><Input value={f.category} onChange={set("category")} required /></div>
      <div><Label>Origin</Label><Input value={f.origin} onChange={set("origin")} /></div>
      <div><Label>Finish</Label><Input value={f.finish} onChange={set("finish")} /></div>
      <div><Label>Thickness</Label><Input value={f.thickness} onChange={set("thickness")} /></div>
      <div className="sm:col-span-2"><Label>Price</Label><Input value={f.price} onChange={set("price")} placeholder="On request" /></div>
      <div className="sm:col-span-2"><Label>Description</Label><Textarea rows={4} value={f.description} onChange={set("description")} /></div>
      <DialogFooter className="sm:col-span-2">
        <Button type="submit">Save product</Button>
      </DialogFooter>
    </form>
  );
}

function ProductsAdmin() {
  const [list, setList] = useState(seed);
  const [q, setQ] = useState("");
  const [openNew, setOpenNew] = useState(false);
  const [editing, setEditing] = useState(null);

  const filtered = list.filter((p) =>
    (p.name + p.category + p.origin).toLowerCase().includes(q.toLowerCase())
  );

  const create = (data) => {
    const id = data.name.toLowerCase().replace(/\s+/g, "-");
    setList([{ ...data, id, image: seed[0].image, price: data.price || "On request" }, ...list]);
    setOpenNew(false);
    toast.success("Product created");
  };
  const update = (data) => {
    setList(list.map((p) => (p.id === editing.id ? { ...p, ...data } : p)));
    setEditing(null);
    toast.success("Product updated");
  };
  const remove = (id) => {
    setList(list.filter((p) => p.id !== id));
    toast.success("Product deleted");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Products"
        description="Add, edit and organise your marble & stone catalog."
        actions={
          <Dialog open={openNew} onOpenChange={setOpenNew}>
            <DialogTrigger asChild>
              <Button><Plus className="mr-1 h-4 w-4" /> New product</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader><DialogTitle>New product</DialogTitle></DialogHeader>
              <ProductForm onSubmit={create} />
            </DialogContent>
          </Dialog>
        }
      />

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products…" className="pl-9" />
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Origin</TableHead>
              <TableHead>Finish</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((p) => (
              <TableRow key={p.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <img src={p.image} alt="" className="h-10 w-10 object-cover" />
                    <div>
                      <p className="font-medium">{p.name}</p>
                      <p className="text-xs text-muted-foreground">{p.thickness}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{p.category}</TableCell>
                <TableCell className="text-muted-foreground">{p.origin}</TableCell>
                <TableCell>{p.finish}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    {p.isNew && <Badge variant="secondary">New</Badge>}
                    {p.popular && <Badge>Popular</Badge>}
                    {p.featured && <Badge variant="outline">Featured</Badge>}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button size="icon" variant="ghost" onClick={() => setEditing(p)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => remove(p.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>Edit product</DialogTitle></DialogHeader>
          {editing && <ProductForm initial={editing} onSubmit={update} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}
