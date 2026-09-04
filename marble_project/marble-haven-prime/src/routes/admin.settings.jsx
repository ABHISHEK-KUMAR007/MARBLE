import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/settings")({
  component: SettingsAdmin,
});

function SettingsAdmin() {
  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Site-wide SEO and preferences." />
      <form
        onSubmit={(e) => { e.preventDefault(); toast.success("Settings saved"); }}
        className="grid max-w-3xl gap-6"
      >
        <section className="rounded-lg border bg-card p-6 space-y-4">
          <h2 className="font-display text-xl">SEO Defaults</h2>
          <div><Label>Site Title</Label><Input defaultValue="Aureo Stone — Luxury Marble & Natural Stone" /></div>
          <div><Label>Meta Description</Label><Textarea rows={3} defaultValue="Manufacturer, supplier and exporter of premium marble, granite and natural stone." /></div>
          <div><Label>Keywords</Label><Input defaultValue="marble, granite, onyx, italian marble, exporter" /></div>
          <div><Label>OG Image URL</Label><Input placeholder="https://…" /></div>
        </section>

        <section className="rounded-lg border bg-card p-6 space-y-4">
          <h2 className="font-display text-xl">Preferences</h2>
          <div className="flex items-center justify-between"><div><Label>Show WhatsApp button</Label><p className="text-xs text-muted-foreground">Floating chat CTA on all pages.</p></div><Switch defaultChecked /></div>
          <div className="flex items-center justify-between"><div><Label>Enable Inquiry Emails</Label><p className="text-xs text-muted-foreground">Notify admins on new inquiries.</p></div><Switch defaultChecked /></div>
          <div className="flex items-center justify-between"><div><Label>Maintenance mode</Label><p className="text-xs text-muted-foreground">Hide public site temporarily.</p></div><Switch /></div>
        </section>

        <div className="flex justify-end">
          <Button type="submit">Save settings</Button>
        </div>
      </form>
    </div>
  );
}
