import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Phone } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/inquiries")({
  component: InquiriesAdmin,
});

const seed = [
  { id: "INQ-1042", name: "Aditi Sharma", email: "aditi@studio.in", phone: "+91 98111 22334", product: "Statuario Classico", message: "Need 200 sqft for penthouse project in Mumbai.", date: "12 Jul 2026", status: "New" },
  { id: "INQ-1041", name: "Marco Rossi", email: "marco@studio.it", phone: "+39 320 1122334", product: "Calacatta Gold", message: "Sample request for a hotel lobby in Milan.", date: "11 Jul 2026", status: "Contacted" },
  { id: "INQ-1040", name: "Rahul Mehta", email: "rahul@dev.ae", phone: "+971 50 111 2233", product: "Emerald Onyx", message: "Backlit wall for Dubai tower lobby.", date: "10 Jul 2026", status: "Completed" },
  { id: "INQ-1039", name: "Sara Kim", email: "sara@design.kr", phone: "+82 10 1111 2222", product: "Nero Marquina", message: "Kitchen countertops.", date: "10 Jul 2026", status: "New" },
  { id: "INQ-1038", name: "James Lee", email: "james@arch.us", phone: "+1 415 555 0100", product: "Roman Travertine", message: "Facade cladding quote.", date: "09 Jul 2026", status: "Contacted" },
];

const statusColor = {
  New: "bg-accent text-primary",
  Contacted: "bg-amber-100 text-amber-800",
  Completed: "bg-emerald-100 text-emerald-800",
};

function InquiriesAdmin() {
  const [list, setList] = useState(seed);
  const [tab, setTab] = useState("all");

  const filtered = tab === "all" ? list : list.filter((i) => i.status.toLowerCase() === tab);

  const setStatus = (id, status) => {
    setList(list.map((i) => (i.id === id ? { ...i, status } : i)));
    toast.success(`Marked ${status}`);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Inquiries" description="Customer inquiries submitted from product pages and contact forms." />

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="all">All ({list.length})</TabsTrigger>
          <TabsTrigger value="new">New ({list.filter((i) => i.status === "New").length})</TabsTrigger>
          <TabsTrigger value="contacted">Contacted ({list.filter((i) => i.status === "Contacted").length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({list.filter((i) => i.status === "Completed").length})</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((i) => (
              <TableRow key={i.id}>
                <TableCell className="font-mono text-xs">{i.id}</TableCell>
                <TableCell>
                  <p className="font-medium">{i.name}</p>
                  <p className="text-xs text-muted-foreground">{i.email}</p>
                </TableCell>
                <TableCell>{i.product}</TableCell>
                <TableCell className="max-w-xs">
                  <p className="line-clamp-2 text-sm text-muted-foreground">{i.message}</p>
                </TableCell>
                <TableCell className="text-muted-foreground text-xs">{i.date}</TableCell>
                <TableCell>
                  <Badge className={statusColor[i.status]} variant="secondary">{i.status}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button size="icon" variant="ghost" asChild><a href={`mailto:${i.email}`}><Mail className="h-4 w-4" /></a></Button>
                    <Button size="icon" variant="ghost" asChild><a href={`tel:${i.phone}`}><Phone className="h-4 w-4" /></a></Button>
                    <Select value={i.status} onValueChange={(v) => setStatus(i.id, v)}>
                      <SelectTrigger className="h-8 w-32"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="New">New</SelectItem>
                        <SelectItem value="Contacted">Contacted</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
