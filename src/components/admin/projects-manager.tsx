"use client";

import { useEffect, useState } from "react";
import {
  Plus, Search, MoreHorizontal, Trash2, FolderKanban, Calendar, DollarSign, ChevronRight
} from "lucide-react";
import {
  Card, CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface Project {
  id: string;
  title: string;
  description?: string | null;
  clientId: string;
  client?: { id: string; company: string };
  service: string;
  status: string;
  progress: number;
  budget?: number | null;
  dueDate?: string | null;
  createdAt: string;
}

interface Client {
  id: string;
  company: string;
}

const STATUS_OPTIONS = ["planning", "in_progress", "review", "completed", "on_hold"];
const STATUS_COLORS: Record<string, string> = {
  planning: "bg-blue-100 text-blue-700 border-blue-200",
  in_progress: "bg-teal-100 text-teal-700 border-teal-200",
  review: "bg-amber-100 text-amber-700 border-amber-200",
  completed: "bg-emerald-100 text-emerald-700 border-emerald-200",
  on_hold: "bg-slate-100 text-slate-700 border-slate-200",
};

const SERVICES = [
  "Digital Marketing", "Performance Marketing", "SEO Services",
  "Lead Generation", "Website Development", "Business Automation", "Content Marketing",
];

export function ProjectsManager() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const [pRes, cRes] = await Promise.all([
        fetch("/api/projects"),
        fetch("/api/clients"),
      ]);
      const pData = await pRes.json();
      const cData = await cRes.json();
      setProjects(pData.projects || []);
      setClients((cData.clients || []).map((c: any) => ({ id: c.id, company: c.company })));
    } catch {
      toast.error("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProjects(); }, []);

  const filtered = projects.filter((p) => {
    const matchesSearch = !search ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      (p.client?.company || "").toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const remove = async (id: string) => {
    if (!confirm("Delete this project?")) return;
    try {
      await fetch(`/api/projects?id=${id}`, { method: "DELETE" });
      toast.success("Project deleted");
      fetchProjects();
    } catch {
      toast.error("Failed to delete");
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      await fetch("/api/projects", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      toast.success(`Status → ${status.replace("_", " ")}`);
      fetchProjects();
    } catch {
      toast.error("Failed to update");
    }
  };

  const openCreate = () => { setEditing(null); setModalOpen(true); };
  const openEdit = (p: Project) => { setEditing(p); setModalOpen(true); };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900" style={{ fontFamily: "var(--font-sora)" }}>
            Projects
          </h1>
          <p className="text-sm text-slate-500 mt-1">{filtered.length} active and completed projects</p>
        </div>
        <Button onClick={openCreate} size="sm" className="gradient-bg text-white border-0 hover:opacity-90">
          <Plus className="w-4 h-4 mr-1.5" />
          Add Project
        </Button>
      </div>

      <Card className="border-slate-200 shadow-sm">
        <CardContent className="py-4 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search projects..."
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
                <SelectItem key={s} value={s} className="capitalize">{s.replace("_", " ")}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {loading ? (
        <div className="grid sm:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-40 bg-white border border-slate-200 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="p-12 text-center">
            <FolderKanban className="w-10 h-10 mx-auto text-slate-300 mb-3" />
            <p className="text-sm text-slate-500">No projects found.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {filtered.map((p) => (
            <Card key={p.id} className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-5 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                      <FolderKanban className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-slate-900 truncate">{p.title}</h3>
                      <p className="text-xs text-slate-500 truncate">{p.client?.company || "—"}</p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="p-1.5 rounded hover:bg-slate-100 text-slate-500 shrink-0">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openEdit(p)}>Edit</DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => remove(p.id)}
                        className="text-red-600 focus:text-red-700"
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {p.description && (
                  <p className="text-xs text-slate-600 line-clamp-2">{p.description}</p>
                )}

                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className="text-[10px]">{p.service}</Badge>
                  <Select value={p.status} onValueChange={(v) => updateStatus(p.id, v)}>
                    <SelectTrigger className={`h-6 w-[110px] text-[10px] font-semibold capitalize border-0 ${STATUS_COLORS[p.status]}`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS_OPTIONS.map((s) => (
                        <SelectItem key={s} value={s} className="capitalize">{s.replace("_", " ")}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Progress</span>
                    <span className="font-semibold text-slate-700">{p.progress}%</span>
                  </div>
                  <Progress value={p.progress} className="h-1.5" />
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-3 h-3" />
                    {(p.budget || 0).toLocaleString()}
                  </div>
                  {p.dueDate && (
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(p.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <ProjectModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        editing={editing}
        clients={clients}
        onSaved={fetchProjects}
      />
    </div>
  );
}

function ProjectModal({
  open, onOpenChange, editing, clients, onSaved,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  editing: Project | null;
  clients: Client[];
  onSaved: () => void;
}) {
  const [form, setForm] = useState<any>({
    title: "", description: "", clientId: "", service: "Digital Marketing",
    status: "planning", progress: 0, budget: "", dueDate: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editing) {
      setForm({
        title: editing.title,
        description: editing.description || "",
        clientId: editing.clientId,
        service: editing.service,
        status: editing.status,
        progress: editing.progress,
        budget: editing.budget?.toString() || "",
        dueDate: editing.dueDate ? editing.dueDate.split("T")[0] : "",
      });
    } else {
      setForm({
        title: "", description: "", clientId: clients[0]?.id || "",
        service: "Digital Marketing", status: "planning", progress: 0,
        budget: "", dueDate: "",
      });
    }
  }, [editing, open, clients]);

  const update = (k: string, v: any) => setForm((p: any) => ({ ...p, [k]: v }));

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.clientId) {
      toast.error("Title and client are required");
      return;
    }
    setSaving(true);
    try {
      const body = { ...form, progress: Number(form.progress) };
      if (editing) {
        await fetch("/api/projects", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editing.id, ...body }),
        });
        toast.success("Project updated");
      } else {
        await fetch("/api/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        toast.success("Project created");
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
          <DialogTitle>{editing ? "Edit Project" : "Add New Project"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={save} className="grid gap-4">
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-semibold text-slate-700">Project Title *</Label>
            <Input value={form.title} onChange={(e) => update("title", e.target.value)} required />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-semibold text-slate-700">Description</Label>
            <Textarea
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              rows={3}
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-semibold text-slate-700">Client *</Label>
              <Select value={form.clientId} onValueChange={(v) => update("clientId", v)}>
                <SelectTrigger><SelectValue placeholder="Select client" /></SelectTrigger>
                <SelectContent>
                  {clients.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.company}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-semibold text-slate-700">Service</Label>
              <Select value={form.service} onValueChange={(v) => update("service", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {SERVICES.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-semibold text-slate-700">Status</Label>
              <Select value={form.status} onValueChange={(v) => update("status", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((s) => (
                    <SelectItem key={s} value={s} className="capitalize">{s.replace("_", " ")}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-semibold text-slate-700">Progress (%)</Label>
              <Input type="number" min="0" max="100" value={form.progress} onChange={(e) => update("progress", e.target.value)} />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-semibold text-slate-700">Budget ($)</Label>
              <Input type="number" value={form.budget} onChange={(e) => update("budget", e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-semibold text-slate-700">Due Date</Label>
              <Input type="date" value={form.dueDate} onChange={(e) => update("dueDate", e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={saving} className="gradient-bg text-white border-0 hover:opacity-90">
              {saving ? "Saving..." : editing ? "Update Project" : "Create Project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
