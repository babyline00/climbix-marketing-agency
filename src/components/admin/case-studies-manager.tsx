"use client";

import { useEffect, useState } from "react";
import { Plus, MoreHorizontal, Trash2, Star, Image as ImageIcon, FolderKanban, Copy } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImageUpload } from "./image-upload";
import { DragDropList } from "./drag-drop-list";
import { InlineEdit } from "./inline-edit";
import { BulkActionsBar } from "./bulk-actions-bar";
import { toast } from "sonner";

interface CaseStudy {
  id: string;
  title: string;
  category: string;
  clientName: string;
  challenge: string;
  result: string;
  image?: string | null;
  metric1Label: string | null;
  metric1Value: string | null;
  metric2Label: string | null;
  metric2Value: string | null;
  metric3Label: string | null;
  metric3Value: string | null;
  featured: boolean;
  order: number;
}

const CATEGORIES = ["B2B SaaS", "E-commerce", "Healthcare", "Fintech", "B2B Services", "Education", "Real Estate", "Manufacturing"];

export function CaseStudiesManager() {
  const [items, setItems] = useState<CaseStudy[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<CaseStudy | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/case-studies");
      const d = await res.json();
      setItems(d.caseStudies || []);
    } catch { toast.error("Failed to load case studies"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchItems(); }, []);

  const remove = async (id: string) => {
    if (!confirm("Delete this case study?")) return;
    try {
      await fetch(`/api/case-studies?id=${id}`, { method: "DELETE" });
      toast.success("Case study deleted");
      fetchItems();
    } catch { toast.error("Failed to delete"); }
  };

  const toggleFeatured = async (c: CaseStudy) => {
    try {
      await fetch("/api/case-studies", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: c.id, featured: !c.featured }),
      });
      toast.success(c.featured ? "Unfeatured" : "Featured");
      fetchItems();
    } catch { toast.error("Failed to update"); }
  };

  const openCreate = () => { setEditing(null); setModalOpen(true); };
  const openEdit = (c: CaseStudy) => { setEditing(c); setModalOpen(true); };

  const handleReorder = async (newItems: CaseStudy[]) => {
    setItems(newItems);
    try {
      await fetch("/api/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "caseStudy", items: newItems.map((it, idx) => ({ id: it.id, order: idx })) }),
      });
      toast.success("Order saved");
    } catch { toast.error("Failed to save order"); fetchItems(); }
  };

  const inlineUpdate = async (id: string, field: string, value: string) => {
    try {
      await fetch("/api/case-studies", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, [field]: value }),
      });
      setItems((prev) => prev.map((c) => (c.id === id ? { ...c, [field]: value } : c)));
      toast.success("Updated");
    } catch { toast.error("Failed to update"); }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => { const n = new Set(prev); if (n.has(id)) n.delete(id); else n.add(id); return n; });
  };
  const selectAll = () => setSelectedIds(new Set(items.map((c) => c.id)));
  const selectNone = () => setSelectedIds(new Set());

  const bulkDelete = async () => {
    if (!confirm(`Delete ${selectedIds.size} case stud(y/ies)?`)) return;
    for (const id of selectedIds) await fetch(`/api/case-studies?id=${id}`, { method: "DELETE" });
    toast.success(`${selectedIds.size} deleted`);
    setSelectedIds(new Set()); fetchItems();
  };

  const bulkFeature = async (feature: boolean) => {
    for (const id of selectedIds) {
      await fetch("/api/case-studies", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, featured: feature }) });
    }
    toast.success(`${selectedIds.size} ${feature ? "featured" : "unfeatured"}`);
    setSelectedIds(new Set()); fetchItems();
  };

  const duplicate = async (c: CaseStudy) => {
    try {
      await fetch("/api/case-studies", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...c, title: `${c.title} (Copy)`, order: items.length }) });
      toast.success("Case study duplicated"); fetchItems();
    } catch { toast.error("Failed to duplicate"); }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900" style={{ fontFamily: "var(--font-space-grotesk)" }}>Case Studies</h1>
          <p className="text-sm text-slate-500 mt-1">{items.length} case studies · {items.filter(i => i.featured).length} featured</p>
        </div>
        <Button onClick={openCreate} size="sm" className="gradient-bg text-white border-0 hover:opacity-90">
          <Plus className="w-4 h-4 mr-1.5" /> Add Case Study
        </Button>
      </div>

      {!loading && items.length > 0 && (
        <div className="flex items-center gap-3 px-1">
          <Checkbox checked={selectedIds.size === items.length && items.length > 0} onCheckedChange={(v) => (v ? selectAll() : selectNone())} />
          <span className="text-xs text-slate-500">{selectedIds.size > 0 ? `${selectedIds.size} of ${items.length} selected` : `Select all (${items.length})`}</span>
          <span className="text-[10px] text-slate-400 ml-auto">Tip: drag cards by the grip handle to reorder</span>
        </div>
      )}

      <BulkActionsBar selectedCount={selectedIds.size} onSelectNone={selectNone} onBulkDelete={bulkDelete}
        showFeatureActions onBulkFeature={() => bulkFeature(true)} onBulkUnfeature={() => bulkFeature(false)} />

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => <div key={i} className="h-64 bg-white border border-slate-200 rounded-xl animate-pulse" />)}
        </div>
      ) : items.length === 0 ? (
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="p-12 text-center">
            <FolderKanban className="w-10 h-10 mx-auto text-slate-300 mb-3" />
            <p className="text-sm text-slate-500">No case studies yet. Add your first success story.</p>
          </CardContent>
        </Card>
      ) : (
        <DragDropList<CaseStudy> items={items} onReorder={handleReorder} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
          renderItem={(c) => {
            const isSelected = selectedIds.has(c.id);
            return (
              <Card key={c.id} className={`border-slate-200 shadow-sm overflow-hidden transition-all ${isSelected ? "ring-2 ring-[#FF6B2C] border-[#FF6B2C]" : ""}`}>
                {c.image ? (
                  <div className="relative h-32 bg-slate-100">
                    <img src={c.image} alt={c.title} className="w-full h-full object-cover" />
                    {c.featured && <Badge className="absolute top-2 left-2 bg-amber-400 text-amber-950 border-0 text-[10px]"><Star className="w-2.5 h-2.5 mr-1 fill-amber-950" /> Featured</Badge>}
                  </div>
                ) : (
                  <div className="h-32 bg-slate-100 flex items-center justify-center"><ImageIcon className="w-8 h-8 text-slate-300" /></div>
                )}
                <CardContent className="p-4 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Checkbox checked={isSelected} onCheckedChange={() => toggleSelect(c.id)} />
                      <Badge variant="outline" className="text-[10px]">{c.category}</Badge>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild><button className="p-1 rounded hover:bg-slate-100 text-slate-500"><MoreHorizontal className="w-4 h-4" /></button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEdit(c)}>Edit</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => duplicate(c)}><Copy className="w-3.5 h-3.5 mr-1.5" /> Duplicate</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toggleFeatured(c)}>{c.featured ? "Unfeature" : "Feature"}</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => remove(c.id)} className="text-red-600 focus:text-red-700">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <InlineEdit as="h3" value={c.title} onSave={(v) => inlineUpdate(c.id, "title", v)} className="text-sm font-bold text-slate-900 line-clamp-2" />
                  <p className="text-xs text-slate-500">Client: <InlineEdit as="span" value={c.clientName} onSave={(v) => inlineUpdate(c.id, "clientName", v)} className="font-medium text-slate-700" /></p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {[c.metric1Value, c.metric2Value, c.metric3Value].filter(Boolean).map((v, i) => (
                      <Badge key={i} variant="secondary" className="text-[10px] bg-orange-50 text-orange-700">{v}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          }}
        />
      )}

      <CaseStudyModal open={modalOpen} onOpenChange={setModalOpen} editing={editing} onSaved={fetchItems} />
    </div>
  );
}

function CaseStudyModal({ open, onOpenChange, editing, onSaved }: { open: boolean; onOpenChange: (v: boolean) => void; editing: CaseStudy | null; onSaved: () => void; }) {
  const [form, setForm] = useState<any>({ title: "", category: "B2B SaaS", clientName: "", challenge: "", result: "", image: "", metric1Label: "", metric1Value: "", metric2Label: "", metric2Value: "", metric3Label: "", metric3Value: "", featured: false });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editing) {
      setForm({ title: editing.title, category: editing.category, clientName: editing.clientName, challenge: editing.challenge, result: editing.result, image: editing.image || "", metric1Label: editing.metric1Label || "", metric1Value: editing.metric1Value || "", metric2Label: editing.metric2Label || "", metric2Value: editing.metric2Value || "", metric3Label: editing.metric3Label || "", metric3Value: editing.metric3Value || "", featured: editing.featured });
    } else {
      setForm({ title: "", category: "B2B SaaS", clientName: "", challenge: "", result: "", image: "", metric1Label: "", metric1Value: "", metric2Label: "", metric2Value: "", metric3Label: "", metric3Value: "", featured: false });
    }
  }, [editing, open]);

  const update = (k: string, v: any) => setForm((p: any) => ({ ...p, [k]: v }));

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.clientName || !form.challenge || !form.result) { toast.error("Title, client, challenge, and result are required"); return; }
    setSaving(true);
    try {
      if (editing) {
        await fetch("/api/case-studies", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: editing.id, ...form }) });
        toast.success("Case study updated");
      } else {
        await fetch("/api/case-studies", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
        toast.success("Case study created");
      }
      onOpenChange(false); onSaved();
    } catch { toast.error("Failed to save"); }
    finally { setSaving(false); }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>{editing ? "Edit Case Study" : "Add New Case Study"}</DialogTitle></DialogHeader>
        <form onSubmit={save} className="grid gap-4">
          <div className="flex flex-col gap-1.5"><Label className="text-xs font-semibold text-slate-700">Title *</Label><Input value={form.title} onChange={(e) => update("title", e.target.value)} required placeholder="B2B SaaS: From 12 to 47 Demos/Month" /></div>
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5"><Label className="text-xs font-semibold text-slate-700">Category *</Label><Select value={form.category} onValueChange={(v) => update("category", v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select></div>
            <div className="flex flex-col gap-1.5"><Label className="text-xs font-semibold text-slate-700">Client Name *</Label><Input value={form.clientName} onChange={(e) => update("clientName", e.target.value)} required placeholder="BrightPath" /></div>
          </div>
          <ImageUpload value={form.image} onChange={(url) => update("image", url)} label="Thumbnail Image" aspect="wide" hint="Recommended: 1200×675px (16:9)" />
          <div className="flex flex-col gap-1.5"><Label className="text-xs font-semibold text-slate-700">Challenge *</Label><Textarea value={form.challenge} onChange={(e) => update("challenge", e.target.value)} required rows={2} /></div>
          <div className="flex flex-col gap-1.5"><Label className="text-xs font-semibold text-slate-700">Result *</Label><Textarea value={form.result} onChange={(e) => update("result", e.target.value)} required rows={2} /></div>
          <div className="grid sm:grid-cols-3 gap-3">
            {[1, 2, 3].map((n) => (
              <div key={n} className="flex flex-col gap-1.5">
                <Label className="text-xs font-semibold text-slate-700">Metric {n}</Label>
                <Input value={form[`metric${n}Value`]} onChange={(e) => update(`metric${n}Value`, e.target.value)} placeholder="12 → 47" className="mb-1" />
                <Input value={form[`metric${n}Label`]} onChange={(e) => update(`metric${n}Label`, e.target.value)} placeholder="Demos / month" />
              </div>
            ))}
          </div>
          <div className="flex items-center gap-3"><Switch checked={form.featured} onCheckedChange={(v) => update("featured", v)} /><Label className="text-xs font-semibold text-slate-700">Feature on homepage</Label></div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={saving} className="gradient-bg text-white border-0 hover:opacity-90">{saving ? "Saving..." : editing ? "Update Case Study" : "Create Case Study"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
