import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import hero1 from "@/assets/hero-marble-1.jpg";
import hero2 from "@/assets/hero-marble-2.jpg";
import hero3 from "@/assets/hero-marble-3.jpg";

export const Route = createFileRoute("/admin/banners")({
  component: BannersAdmin,
});

function BannersAdmin() {
  const [list, setList] = useState([
    { id: 1, title: "Timeless Italian Marble", subtitle: "Handpicked from Carrara", image: hero1, active: true },
    { id: 2, title: "Crafted for Landmarks", subtitle: "Trusted by architects worldwide", image: hero2, active: true },
    { id: 3, title: "The Art of Stone", subtitle: "Since 1978", image: hero3, active: false },
  ]);

  const toggle = (id) => setList(list.map((b) => (b.id === id ? { ...b, active: !b.active } : b)));
  const remove = (id) => { setList(list.filter((b) => b.id !== id)); toast.success("Banner removed"); };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Homepage Banners"
        description="Manage the hero slider on your homepage."
        actions={<Button><Plus className="mr-1 h-4 w-4" /> Upload banner</Button>}
      />

      <div className="space-y-3">
        {list.map((b) => (
          <div key={b.id} className="flex items-center gap-4 rounded-lg border bg-card p-3">
            <GripVertical className="h-5 w-5 flex-none text-muted-foreground" />
            <img src={b.image} alt="" className="h-16 w-28 flex-none object-cover" />
            <div className="min-w-0 flex-1 space-y-2">
              <Input defaultValue={b.title} />
              <Input defaultValue={b.subtitle} />
            </div>
            <div className="flex flex-none flex-col items-center gap-2">
              <Label className="text-xs">Active</Label>
              <Switch checked={b.active} onCheckedChange={() => toggle(b.id)} />
            </div>
            <Button size="icon" variant="ghost" onClick={() => remove(b.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
