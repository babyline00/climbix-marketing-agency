"use client";

import { useEffect, useState } from "react";
import {
  Plus, Search, MoreHorizontal, Trash2, Mail, Globe, Building2, DollarSign, Users
} from "lucide-react";
import {
  Card, CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface Client {
  id: string;
  name: string;
  company: string;
  email: string;
  phone?: string | null;
  website?: string | null;
  industry?: string | null;
  status: string;
  monthlyFee?: number | null;
  startDate: string;
  projects?: any[];
}

const STATUS_OPTIONS = ["active", "paused", "churned"];
const STATUS_COLORS: Record<string, string> = {
  active: "bg-emerald-100 text-emerald-700 border-emerald-200",
  paused: "bg-amber-100 text-amber-700 border-amber-200",
  churned: "bg-red-100 text-red-700 border-red-200",
};

export function ClientsManager() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Client | null>(null);

  const fetchClients = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/clients");
      const d = await res.json();
      setClients(d.clients || []);
    } catch {
      toast.error("Failed to load clients");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchClients(); }, []);

  const filtered = clients.filter((c) => {
    const matchesSearch = !search ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.company.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalMrr = filtered.reduce((sum, c) => sum + (c.monthlyFee || 0), 0);

  const remove = async (id: string) => {
    if (!confirm("Delete this client? Their projects will also be deleted.")) return;
    try {
      await fetch(`/api/clients?id=${id}`, { method: "DELETE" });
      toast.success("Client deleted");
      fetchClients();
    } catch {
      toast.error("Failed to delete");
    }
  };

  const openCreate = () => { setEditing(null); setModalOpen(true); };
  const openEdit = (c: Client) => { setEditing(c); setModalOpen(true); };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900" style={{ fontFamily: "var(--font-sora)" }}>
            Clients
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {filtered.length} clients · MRR: ${totalMrr.toLocaleString()}/mo
          </p>
        </div>
        <Button onClick={openCreate} size="sm" className="gradient-bg text-white border-0 hover:opacity-90">
          <Plus className="w-4 h-4 mr-1.5" />
          Add Client
        </Button>
      </div>

      <Card className="border-slate-200 shadow-sm">
        <CardContent className="py-4 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search clients..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {STATUS_OPTIONS.map((s) => (
                <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-48 bg-white border border-slate-200 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="p-12 text-center">
            <Users className="w-10 h-10 mx-auto text-slate-300 mb-3" />
            <p className="text-sm text-slate-500">No clients found.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((c) => (
            <Card key={c.id} className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-5 flex flex-col gap-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl gradient-bg flex items-center justify-center text-white font-bold shrink-0">
                      {c.company.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-slate-900 truncate">{c.company}</div>
                      <div className="text-xs text-slate-500 truncate">{c.name}</div>
                    </div>
                  </div>
                  <Badge variant="outline" className={`text-[10px] capitalize ${STATUS_COLORS[c.status]}`}>
                    {c.status}
                  </Badge>
                </div>

                <div className="flex flex-col gap-1.5 text-xs text-slate-600">
                  <a href={`mailto:${c.email}`} className="flex items-center gap-1.5 hover:text-teal-600">
                    <Mail className="w-3 h-3" /> {c.email}
                  </a>
                  {c.website && (
                    <a href={`https://${c.website}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-teal-600">
                      <Globe className="w-3 h-3" /> {c.website}
                    </a>
                  )}
                  {c.industry && (
                    <div className="flex items-center gap-1.5">
                      <Building2 className="w-3 h-3" /> {c.industry}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100">
                  <div>
                    <div className="text-[10px] uppercase tracking-wide text-slate-400">MRR</div>
                    <div className="text-sm font-bold text-slate-900 flex items-center gap-1">
                      <DollarSign className="w-3 h-3 text-teal-600" />
                      {(c.monthlyFee || 0).toLocaleString()}/mo
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-wide text-slate-400">Projects</div>
                    <div className="text-sm font-bold text-slate-900">{c.projects?.length || 0}</div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-1 pt-2 border-t border-slate-100">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="p-1.5 rounded hover:bg-slate-100 text-slate-500">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openEdit(c)}>Edit</DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => remove(c.id)}
                        className="text-red-600 focus:text-red-700"
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <ClientModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        editing={editing}
        onSaved={fetchClients}
      />
    </div>
  );
}

function ClientModal({
  open, onOpenChange, editing, onSaved,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  editing: Client | null;
  onSaved: () => void;
}) {
  const [form, setForm] = useState<any>({
    name: "", company: "", email: "", phone: "", website: "",
    industry: "", status: "active", monthlyFee: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editing) {
      setForm({
        name: editing.name, company: editing.company, email: editing.email,
        phone: editing.phone || "", website: editing.website || "",
        industry: editing.industry || "", status: editing.status,
        monthlyFee: editing.monthlyFee?.toString() || "",
      });
    } else {
      setForm({
        name: "", company: "", email: "", phone: "", website: "",
        industry: "", status: "active", monthlyFee: "",
      });
    }
  }, [editing, open]);

  const update = (k: string, v: string) => setForm((p: any) => ({ ...p, [k]: v }));

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.company || !form.email) {
      toast.error("Name, company, and email are required");
      return;
    }
    setSaving(true);
    try {
      if (editing) {
        await fetch("/api/clients", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editing.id, ...form }),
        });
        toast.success("Client updated");
      } else {
        await fetch("/api/clients", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        toast.success("Client created");
      }
      onOpenChange(false);
      onSaved();
    } catch {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editing ? "Edit Client" : "Add New Client"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={save} className="grid gap-4">
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-semibold text-slate-700">Contact Name *</Label>
              <Input value={form.name} onChange={(e) => update("name", e.target.value)} required />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-semibold text-slate-700">Company *</Label>
              <Input value={form.company} onChange={(e) => update("company", e.target.value)} required />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-semibold text-slate-700">Email *</Label>
              <Input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} required />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-semibold text-slate-700">Phone</Label>
              <Input value={form.phone} onChange={(e) => update("phone", e.target.value)} />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-semibold text-slate-700">Website</Label>
              <Input value={form.website} onChange={(e) => update("website", e.target.value)} placeholder="acme.com" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-semibold text-slate-700">Industry</Label>
              <Input value={form.industry} onChange={(e) => update("industry", e.target.value)} placeholder="SaaS" />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-semibold text-slate-700">Status</Label>
              <Select value={form.status} onValueChange={(v) => update("status", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((s) => (
                    <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-semibold text-slate-700">Monthly Fee ($)</Label>
              <Input type="number" value={form.monthlyFee} onChange={(e) => update("monthlyFee", e.target.value)} placeholder="5000" />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={saving} className="gradient-bg text-white border-0 hover:opacity-90">
              {saving ? "Saving..." : editing ? "Update Client" : "Create Client"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
