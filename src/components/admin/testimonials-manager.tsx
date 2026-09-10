"use client";

import { useEffect, useState } from "react";
import { Plus, MoreHorizontal, Trash2, Star, Edit, Quote } from "lucide-react";
import {
  Card, CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

interface Testimonial {
  id: string;
  clientName: string;
  clientTitle?: string | null;
  clientCompany?: string | null;
  rating: number;
  message: string;
  active: boolean;
  createdAt: string;
}

export function TestimonialsManager() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Testimonial | null>(null);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/testimonials");
      const d = await res.json();
      setItems(d.testimonials || []);
    } catch {
      toast.error("Failed to load testimonials");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchItems(); }, []);

  const remove = async (id: string) => {
    if (!confirm("Delete this testimonial?")) return;
    try {
      await fetch(`/api/testimonials?id=${id}`, { method: "DELETE" });
      toast.success("Testimonial deleted");
      fetchItems();
    } catch {
      toast.error("Failed to delete");
    }
  };

  const toggleActive = async (t: Testimonial) => {
    try {
      await fetch("/api/testimonials", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: t.id, active: !t.active }),
      });
      toast.success(t.active ? "Hidden from site" : "Published to site");
      fetchItems();
    } catch {
      toast.error("Failed to update");
    }
  };

  const openCreate = () => { setEditing(null); setModalOpen(true); };
  const openEdit = (t: Testimonial) => { setEditing(t); setModalOpen(true); };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900" style={{ fontFamily: "var(--font-sora)" }}>
            Testimonials
          </h1>
          <p className="text-sm text-slate-500 mt-1">{items.length} client testimonials</p>
        </div>
        <Button onClick={openCreate} size="sm" className="gradient-bg text-white border-0 hover:opacity-90">
          <Plus className="w-4 h-4 mr-1.5" />
          Add Testimonial
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
          {items.map((t) => (
            <Card key={t.id} className={`border-slate-200 shadow-sm ${!t.active ? "opacity-60" : ""}`}>
              <CardContent className="p-5 flex flex-col gap-3">
                <div className="flex items-start justify-between">
                  <div className="flex gap-0.5">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="p-1.5 rounded hover:bg-slate-100 text-slate-500">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openEdit(t)}>Edit</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => toggleActive(t)}>
                        {t.active ? "Hide" : "Publish"}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => remove(t.id)} className="text-red-600 focus:text-red-700">
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="flex items-start gap-2 flex-1">
                  <Quote className="w-5 h-5 text-slate-200 shrink-0 mt-0.5" />
                  <p className="text-sm text-slate-700 leading-relaxed line-clamp-4">{t.message}</p>
                </div>

                <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                  <Avatar className="w-9 h-9 border border-slate-200">
                    <AvatarFallback className="gradient-bg text-white text-xs font-semibold">
                      {t.clientName.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-slate-900 truncate">{t.clientName}</div>
                    <div className="text-xs text-slate-500 truncate">
                      {[t.clientTitle, t.clientCompany].filter(Boolean).join(" · ")}
                    </div>
                  </div>
                  <Switch checked={t.active} onCheckedChange={() => toggleActive(t)} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <TestimonialModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        editing={editing}
        onSaved={fetchItems}
      />
    </div>
  );
}

function TestimonialModal({
  open, onOpenChange, editing, onSaved,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  editing: Testimonial | null;
  onSaved: () => void;
}) {
  const [form, setForm] = useState<any>({
    clientName: "", clientTitle: "", clientCompany: "",
    rating: 5, message: "", active: true,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editing) {
      setForm({
        clientName: editing.clientName,
        clientTitle: editing.clientTitle || "",
        clientCompany: editing.clientCompany || "",
        rating: editing.rating,
        message: editing.message,
        active: editing.active,
      });
    } else {
      setForm({
        clientName: "", clientTitle: "", clientCompany: "",
        rating: 5, message: "", active: true,
      });
    }
  }, [editing, open]);

  const update = (k: string, v: any) => setForm((p: any) => ({ ...p, [k]: v }));

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.clientName || !form.message) {
      toast.error("Client name and message are required");
      return;
    }
    setSaving(true);
    try {
      const body = { ...form, rating: Number(form.rating) };
      if (editing) {
        await fetch("/api/testimonials", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editing.id, ...body }),
        });
        toast.success("Testimonial updated");
      } else {
        await fetch("/api/testimonials", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        toast.success("Testimonial created");
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
          <DialogTitle>{editing ? "Edit Testimonial" : "Add New Testimonial"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={save} className="grid gap-4">
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-semibold text-slate-700">Client Name *</Label>
              <Input value={form.clientName} onChange={(e) => update("clientName", e.target.value)} required />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-semibold text-slate-700">Title / Role</Label>
              <Input value={form.clientTitle} onChange={(e) => update("clientTitle", e.target.value)} placeholder="CMO" />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-semibold text-slate-700">Company</Label>
              <Input value={form.clientCompany} onChange={(e) => update("clientCompany", e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-semibold text-slate-700">Rating</Label>
              <div className="flex items-center gap-1 h-9">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => update("rating", n)}
                    className="p-0.5"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        n <= form.rating
                          ? "fill-amber-400 text-amber-400"
                          : "fill-slate-100 text-slate-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-semibold text-slate-700">Message *</Label>
            <Textarea
              value={form.message}
              onChange={(e) => update("message", e.target.value)}
              rows={4}
              required
            />
          </div>
          <div className="flex items-center gap-3">
            <Switch checked={form.active} onCheckedChange={(v) => update("active", v)} />
            <Label className="text-xs font-semibold text-slate-700">Show on website</Label>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={saving} className="gradient-bg text-white border-0 hover:opacity-90">
              {saving ? "Saving..." : editing ? "Update Testimonial" : "Create Testimonial"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
