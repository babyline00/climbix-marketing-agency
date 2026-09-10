"use client";

import { useEffect, useState } from "react";
import {
  Plus, MoreHorizontal, Trash2, Edit, GripVertical, Megaphone, TrendingUp,
  Search, Target, Code, Zap, PenTool, Star, Settings as SettingsIcon
} from "lucide-react";
import {
  Card, CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

interface Service {
  id: string;
  title: string;
  slug: string;
  tagline: string;
  description: string;
  icon: string;
  features?: string | null;
  order: number;
  active: boolean;
}

const ICON_OPTIONS = [
  { name: "Megaphone", icon: Megaphone },
  { name: "TrendingUp", icon: TrendingUp },
  { name: "Search", icon: Search },
  { name: "Target", icon: Target },
  { name: "Code", icon: Code },
  { name: "Zap", icon: Zap },
  { name: "PenTool", icon: PenTool },
  { name: "Star", icon: Star },
];

const ICON_MAP: Record<string, any> = {
  Megaphone, TrendingUp, Search, Target, Code, Zap, PenTool, Star,
};

export function ServicesManager() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/services");
      const d = await res.json();
      setServices(d.services || []);
    } catch {
      toast.error("Failed to load services");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchServices(); }, []);

  const remove = async (id: string) => {
    if (!confirm("Delete this service?")) return;
    try {
      await fetch(`/api/services?id=${id}`, { method: "DELETE" });
      toast.success("Service deleted");
      fetchServices();
    } catch {
      toast.error("Failed to delete");
    }
  };

  const toggleActive = async (s: Service) => {
    try {
      await fetch("/api/services", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: s.id, active: !s.active }),
      });
      toast.success(s.active ? "Service deactivated" : "Service activated");
      fetchServices();
    } catch {
      toast.error("Failed to update");
    }
  };

  const openCreate = () => { setEditing(null); setModalOpen(true); };
  const openEdit = (s: Service) => { setEditing(s); setModalOpen(true); };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900" style={{ fontFamily: "var(--font-sora)" }}>
            Services
          </h1>
          <p className="text-sm text-slate-500 mt-1">{services.length} services configured</p>
        </div>
        <Button onClick={openCreate} size="sm" className="gradient-bg text-white border-0 hover:opacity-90">
          <Plus className="w-4 h-4 mr-1.5" />
          Add Service
        </Button>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 bg-white border border-slate-200 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((s) => {
            const Icon = ICON_MAP[s.icon] || SettingsIcon;
            const features: string[] = s.features ? safeParse(s.features) : [];
            return (
              <Card key={s.id} className={`border-slate-200 shadow-sm ${!s.active ? "opacity-60" : ""}`}>
                <CardContent className="p-5 flex flex-col gap-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl gradient-bg flex items-center justify-center shadow-md shadow-teal-500/20">
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900">{s.title}</h3>
                        <p className="text-[11px] text-teal-600 font-semibold uppercase tracking-wide">{s.tagline}</p>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="p-1.5 rounded hover:bg-slate-100 text-slate-500">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEdit(s)}>Edit</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toggleActive(s)}>
                          {s.active ? "Deactivate" : "Activate"}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => remove(s.id)} className="text-red-600 focus:text-red-700">
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-3">{s.description}</p>

                  {features.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {features.slice(0, 3).map((f, i) => (
                        <Badge key={i} variant="secondary" className="text-[10px] bg-slate-100 text-slate-700">
                          {f}
                        </Badge>
                      ))}
                      {features.length > 3 && (
                        <Badge variant="secondary" className="text-[10px] bg-slate-100 text-slate-700">
                          +{features.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wide">Order: {s.order}</span>
                    <Switch checked={s.active} onCheckedChange={() => toggleActive(s)} />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <ServiceModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        editing={editing}
        onSaved={fetchServices}
      />
    </div>
  );
}

function ServiceModal({
  open, onOpenChange, editing, onSaved,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  editing: Service | null;
  onSaved: () => void;
}) {
  const [form, setForm] = useState<any>({
    title: "", tagline: "", description: "", icon: "Megaphone",
    featuresText: "", order: 0, active: true,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editing) {
      const features = editing.features ? safeParse(editing.features) : [];
      setForm({
        title: editing.title,
        tagline: editing.tagline,
        description: editing.description,
        icon: editing.icon,
        featuresText: features.join("\n"),
        order: editing.order,
        active: editing.active,
      });
    } else {
      setForm({
        title: "", tagline: "", description: "", icon: "Megaphone",
        featuresText: "", order: 0, active: true,
      });
    }
  }, [editing, open]);

  const update = (k: string, v: any) => setForm((p: any) => ({ ...p, [k]: v }));

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.tagline || !form.description) {
      toast.error("Title, tagline, and description are required");
      return;
    }
    setSaving(true);
    try {
      const features = form.featuresText
        .split("\n")
        .map((s: string) => s.trim())
        .filter(Boolean);
      const body = {
        title: form.title,
        slug: form.title.toLowerCase().replace(/\s+/g, "-"),
        tagline: form.tagline,
        description: form.description,
        icon: form.icon,
        features,
        order: Number(form.order),
        active: form.active,
      };
      if (editing) {
        await fetch("/api/services", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editing.id, ...body }),
        });
        toast.success("Service updated");
      } else {
        await fetch("/api/services", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        toast.success("Service created");
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
          <DialogTitle>{editing ? "Edit Service" : "Add New Service"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={save} className="grid gap-4">
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-semibold text-slate-700">Title *</Label>
              <Input value={form.title} onChange={(e) => update("title", e.target.value)} required />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-semibold text-slate-700">Tagline *</Label>
              <Input value={form.tagline} onChange={(e) => update("tagline", e.target.value)} required />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-semibold text-slate-700">Description *</Label>
            <Textarea
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              rows={3}
              required
            />
          </div>
          <div className="grid sm:grid-cols-3 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-semibold text-slate-700">Icon</Label>
              <select
                value={form.icon}
                onChange={(e) => update("icon", e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
              >
                {ICON_OPTIONS.map((o) => (
                  <option key={o.name} value={o.name}>{o.name}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-semibold text-slate-700">Order</Label>
              <Input type="number" value={form.order} onChange={(e) => update("order", e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-semibold text-slate-700">Active</Label>
              <div className="flex h-9 items-center">
                <Switch checked={form.active} onCheckedChange={(v) => update("active", v)} />
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-semibold text-slate-700">
              Features (one per line)
            </Label>
            <Textarea
              value={form.featuresText}
              onChange={(e) => update("featuresText", e.target.value)}
              rows={4}
              placeholder={"Google & Meta Ads\nAI bid optimization\nROAS reporting"}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={saving} className="gradient-bg text-white border-0 hover:opacity-90">
              {saving ? "Saving..." : editing ? "Update Service" : "Create Service"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function safeParse(s: string): string[] {
  try {
    return JSON.parse(s);
  } catch {
    return [];
  }
}
