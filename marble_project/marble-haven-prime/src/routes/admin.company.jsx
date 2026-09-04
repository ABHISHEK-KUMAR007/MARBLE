import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/company")({
  component: CompanyAdmin,
});

function CompanyAdmin() {
  return (
    <div className="space-y-6">
      <PageHeader title="Company Profile" description="Details used across the website footer, contact and about pages." />
      <form
        onSubmit={(e) => { e.preventDefault(); toast.success("Company profile saved"); }}
        className="grid max-w-3xl gap-6 rounded-lg border bg-card p-6"
      >
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <div><Label>Company Name</Label><Input defaultValue="Aureo Stone" /></div>
          <div><Label>Established</Label><Input defaultValue="1978" /></div>
          <div><Label>Email</Label><Input type="email" defaultValue="contact@aureostone.com" /></div>
          <div><Label>Phone</Label><Input defaultValue="+91 98765 43210" /></div>
          <div className="sm:col-span-2"><Label>WhatsApp Number</Label><Input defaultValue="+91 98765 43210" /></div>
          <div className="sm:col-span-2"><Label>Address</Label><Textarea rows={3} defaultValue="Plot 12, Marble Market, Kishangarh, Rajasthan 305802, India" /></div>
          <div className="sm:col-span-2"><Label>About</Label><Textarea rows={5} defaultValue="Aureo Stone is a manufacturer, supplier and exporter of premium Italian marble, granite, onyx and natural stone since 1978." /></div>
        </div>
        <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-4">
          <div><Label>Instagram</Label><Input placeholder="https://…" /></div>
          <div><Label>Facebook</Label><Input placeholder="https://…" /></div>
          <div><Label>LinkedIn</Label><Input placeholder="https://…" /></div>
        </div>
        <div className="flex justify-end">
          <Button type="submit">Save changes</Button>
        </div>
      </form>
    </div>
  );
}
