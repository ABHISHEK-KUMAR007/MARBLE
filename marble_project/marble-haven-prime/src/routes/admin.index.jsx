import { createFileRoute } from "@tanstack/react-router";
import { Package, FolderTree, MessageSquare, Image as ImageIcon, TrendingUp, ArrowUpRight } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { products, categories, posts } from "@/lib/data";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/admin/")({
  component: Dashboard,
});

const inquiries = [
  { id: "INQ-1042", name: "Aditi Sharma", product: "Statuario Classico", date: "12 Jul 2026", status: "New" },
  { id: "INQ-1041", name: "Marco Rossi", product: "Calacatta Gold", date: "11 Jul 2026", status: "Contacted" },
  { id: "INQ-1040", name: "Rahul Mehta", product: "Emerald Onyx", date: "10 Jul 2026", status: "Completed" },
  { id: "INQ-1039", name: "Sara Kim", product: "Nero Marquina", date: "10 Jul 2026", status: "New" },
];

const statusColor = {
  New: "bg-accent text-primary",
  Contacted: "bg-amber-100 text-amber-800",
  Completed: "bg-emerald-100 text-emerald-800",
};

function Stat({ icon: Icon, label, value, delta }) {
  return (
    <div className="rounded-lg border bg-card p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">{label}</p>
          <p className="mt-2 font-display text-3xl">{value}</p>
        </div>
        <div className="grid h-10 w-10 place-items-center rounded-full bg-accent/40 text-primary">
          <Icon className="h-5 w-5" />
        </div>
      </div>
      {delta && (
        <p className="mt-3 flex items-center gap-1 text-xs text-emerald-600">
          <TrendingUp className="h-3 w-3" /> {delta}
        </p>
      )}
    </div>
  );
}

function Dashboard() {
  return (
    <div className="space-y-8">
      <PageHeader title="Dashboard" description="Overview of your catalog and customer activity." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
        <Stat icon={Package} label="Total Products" value={products.length} delta="+3 this month" />
        <Stat icon={FolderTree} label="Categories" value={categories.length} delta="+1 this month" />
        <Stat icon={MessageSquare} label="Open Inquiries" value={inquiries.filter(i => i.status !== "Completed").length} delta="+12 this week" />
        <Stat icon={ImageIcon} label="Gallery Assets" value={48} delta="+6 this week" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3 xl:grid-cols-4">
        <div className="rounded-lg border bg-card lg:col-span-2">
          <div className="flex items-center justify-between border-b p-5">
            <h2 className="font-display text-xl">Recent Inquiries</h2>
            <a href="/admin/inquiries" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
              View all <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inquiries.map((i) => (
                <TableRow key={i.id}>
                  <TableCell className="font-mono text-xs">{i.id}</TableCell>
                  <TableCell>{i.name}</TableCell>
                  <TableCell>{i.product}</TableCell>
                  <TableCell className="text-muted-foreground">{i.date}</TableCell>
                  <TableCell>
                    <Badge className={statusColor[i.status]} variant="secondary">{i.status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="rounded-lg border bg-card">
          <div className="border-b p-5">
            <h2 className="font-display text-xl">Latest Blog Posts</h2>
          </div>
          <ul className="divide-y">
            {posts.map((p) => (
              <li key={p.id} className="flex gap-3 p-4">
                <img src={p.image} alt="" className="h-14 w-14 flex-none object-cover" />
                <div className="min-w-0">
                  <p className="line-clamp-2 text-sm font-medium">{p.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{p.date}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
