"use client";

import { useEffect, useState } from "react";
import { Plus, MoreHorizontal, Trash2, Edit, BookOpen, Eye, EyeOff, Star, Clock, FileText, Send, ArrowLeft, X, Copy } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImageUpload } from "./image-upload";
import { RichTextEditor } from "./rich-text-editor";
import { SEOPanel } from "./seo-panel";
import { PublishingPanel } from "./publishing-panel";
import { DragDropList } from "./drag-drop-list";
import { InlineEdit } from "./inline-edit";
import { BulkActionsBar } from "./bulk-actions-bar";
import { toast } from "sonner";

interface BlogPost {
  id: string; title: string; slug: string; excerpt: string; content: string;
  contentHtml?: string | null; category: string; author: string; authorRole?: string | null;
  image?: string | null; metaDescription?: string | null; tags?: string | null; ogImage?: string | null;
  status: string; scheduledAt?: string | null; readTime?: string | null;
  published: boolean; featured: boolean; order: number; createdAt: string;
}

const CATEGORIES = ["Growth Strategy", "Analytics", "Content", "Lead Gen", "SEO", "Automation", "Web Dev", "News"];

function safeParseTags(s: string): string[] { try { return JSON.parse(s); } catch { return []; } }

export function BlogManager() {
  const [items, setItems] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const fetchItems = async () => {
    setLoading(true);
    try { const res = await fetch("/api/blog"); const d = await res.json(); setItems(d.posts || []); }
    catch { toast.error("Failed to load blog posts"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchItems(); }, []);

  const remove = async (id: string) => { if (!confirm("Delete this blog post?")) return; try { await fetch(`/api/blog?id=${id}`, { method: "DELETE" }); toast.success("Post deleted"); fetchItems(); } catch { toast.error("Failed to delete"); } };
  const toggleStatus = async (p: BlogPost) => { const ns = p.status === "published" ? "draft" : "published"; try { await fetch("/api/blog", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: p.id, status: ns }) }); toast.success(ns === "published" ? "Published" : "Moved to draft"); fetchItems(); } catch { toast.error("Failed to update"); } };
  const openCreate = () => { setEditing(null); setEditorOpen(true); };
  const openEdit = (p: BlogPost) => { setEditing(p); setEditorOpen(true); };

  const handleReorder = async (newItems: BlogPost[]) => { setItems(newItems); try { await fetch("/api/reorder", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ model: "blogPost", items: newItems.map((it, idx) => ({ id: it.id, order: idx })) }) }); toast.success("Order saved"); } catch { toast.error("Failed to save order"); fetchItems(); } };
  const inlineUpdate = async (id: string, field: string, value: string) => { try { await fetch("/api/blog", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, [field]: value }) }); setItems((prev) => prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))); toast.success("Updated"); } catch { toast.error("Failed to update"); } };
  const toggleSelect = (id: string) => { setSelectedIds((prev) => { const n = new Set(prev); if (n.has(id)) n.delete(id); else n.add(id); return n; }); };
  const selectAll = () => setSelectedIds(new Set(items.map((p) => p.id)));
  const selectNone = () => setSelectedIds(new Set());
  const bulkDelete = async () => { if (!confirm(`Delete ${selectedIds.size} post(s)?`)) return; for (const id of selectedIds) await fetch(`/api/blog?id=${id}`, { method: "DELETE" }); toast.success(`${selectedIds.size} post(s) deleted`); setSelectedIds(new Set()); fetchItems(); };
  const bulkStatus = async (ns: "published" | "draft") => { for (const id of selectedIds) await fetch("/api/blog", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status: ns }) }); toast.success(`${selectedIds.size} ${ns === "published" ? "published" : "moved to draft"}`); setSelectedIds(new Set()); fetchItems(); };
  const bulkFeature = async (f: boolean) => { for (const id of selectedIds) await fetch("/api/blog", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, featured: f }) }); toast.success(`${selectedIds.size} ${f ? "featured" : "unfeatured"}`); setSelectedIds(new Set()); fetchItems(); };
  const duplicate = async (p: BlogPost) => { try { await fetch("/api/blog", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...p, title: `${p.title} (Copy)`, slug: `${p.slug}-copy-${Date.now().toString(36)}`, status: "draft", published: false, order: items.length }) }); toast.success("Post duplicated (saved as draft)"); fetchItems(); } catch { toast.error("Failed to duplicate"); } };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900" style={{ fontFamily: "var(--font-space-grotesk)" }}>Blog Posts</h1>
          <p className="text-sm text-slate-500 mt-1">{items.length} total · {items.filter(i => i.status === "published").length} published · {items.filter(i => i.status === "draft").length} drafts · {items.filter(i => i.status === "scheduled").length} scheduled · {items.filter(i => i.featured).length} featured</p>
        </div>
        <Button onClick={openCreate} size="sm" className="gradient-bg text-white border-0 hover:opacity-90"><Plus className="w-4 h-4 mr-1.5" /> New Post</Button>
      </div>

      {!loading && items.length > 0 && (
        <div className="flex items-center gap-3 px-1">
          <Checkbox checked={selectedIds.size === items.length && items.length > 0} onCheckedChange={(v) => (v ? selectAll() : selectNone())} />
          <span className="text-xs text-slate-500">{selectedIds.size > 0 ? `${selectedIds.size} of ${items.length} selected` : `Select all (${items.length})`}</span>
          <span className="text-[10px] text-slate-400 ml-auto">Tip: drag cards by the grip handle to reorder</span>
        </div>
      )}

      <BulkActionsBar selectedCount={selectedIds.size} onSelectNone={selectNone} onBulkDelete={bulkDelete}
        showPublishActions onBulkPublish={() => bulkStatus("published")} onBulkUnpublish={() => bulkStatus("draft")}
        showFeatureActions onBulkFeature={() => bulkFeature(true)} onBulkUnfeature={() => bulkFeature(false)} />

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{[1, 2, 3].map((i) => <div key={i} className="h-48 bg-white border border-slate-200 rounded-xl animate-pulse" />)}</div>
      ) : items.length === 0 ? (
        <Card className="border-slate-200 shadow-sm"><CardContent className="p-12 text-center"><BookOpen className="w-10 h-10 mx-auto text-slate-300 mb-3" /><p className="text-sm text-slate-500">No blog posts yet. Click "New Post" to start writing.</p></CardContent></Card>
      ) : (
        <DragDropList<BlogPost> items={items} onReorder={handleReorder} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
          renderItem={(p) => {
            const tags: string[] = p.tags ? safeParseTags(p.tags) : [];
            const isSelected = selectedIds.has(p.id);
            return (
              <Card key={p.id} className={`border-slate-200 shadow-sm overflow-hidden transition-all ${isSelected ? "ring-2 ring-[#FF6B2C] border-[#FF6B2C]" : ""}`}>
                {p.image ? (
                  <div className="relative h-32 bg-slate-100">
                    <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                    <div className="absolute top-2 left-2 flex gap-1 flex-wrap">
                      <Badge className="bg-white/95 text-slate-700 border-0 text-[10px]">{p.category}</Badge>
                      {p.featured && <Badge className="bg-amber-400 text-amber-950 border-0 text-[10px]"><Star className="w-2.5 h-2.5 mr-1 fill-amber-950" /> Featured</Badge>}
                    </div>
                    {p.status !== "published" && (
                      <div className="absolute top-2 right-2">
                        {p.status === "draft" && <Badge className="bg-slate-700/90 text-white border-0 text-[10px]"><FileText className="w-2.5 h-2.5 mr-1" /> Draft</Badge>}
                        {p.status === "scheduled" && <Badge className="bg-amber-600/90 text-white border-0 text-[10px]"><Clock className="w-2.5 h-2.5 mr-1" />{p.scheduledAt ? new Date(p.scheduledAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "Scheduled"}</Badge>}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="h-32 bg-slate-100 flex items-center justify-center"><BookOpen className="w-8 h-8 text-slate-300" /></div>
                )}
                <CardContent className="p-4 flex flex-col gap-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2 flex-1 min-w-0">
                      <Checkbox checked={isSelected} onCheckedChange={() => toggleSelect(p.id)} className="mt-0.5 shrink-0" />
                      <InlineEdit as="h3" value={p.title} onSave={(v) => inlineUpdate(p.id, "title", v)} className="text-sm font-bold text-slate-900 line-clamp-2 flex-1" />
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild><button className="p-1 rounded hover:bg-slate-100 text-slate-500 shrink-0"><MoreHorizontal className="w-4 h-4" /></button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEdit(p)}>Edit</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => duplicate(p)}><Copy className="w-3.5 h-3.5 mr-1.5" /> Duplicate</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toggleStatus(p)}>{p.status === "published" ? "Unpublish (→ Draft)" : "Publish now"}</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => remove(p.id)} className="text-red-600 focus:text-red-700">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-2">{p.excerpt}</p>
                  {tags.length > 0 && <div className="flex flex-wrap gap-1">{tags.slice(0, 3).map((t) => <Badge key={t} variant="secondary" className="text-[9px] bg-[#FFF3EC] text-[#FF6B2C]">{t}</Badge>)}</div>}
                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-2 border-t border-slate-100">
                    <span className="font-medium text-slate-700">{p.author}</span>
                    <div className="flex items-center gap-2">
                      {p.readTime && <span>{p.readTime}</span>}
                      {p.status === "published" ? <Badge className="bg-emerald-100 text-emerald-700 text-[10px]"><Eye className="w-2.5 h-2.5 mr-1" />Live</Badge> : p.status === "scheduled" ? <Badge className="bg-amber-100 text-amber-700 text-[10px]"><Clock className="w-2.5 h-2.5 mr-1" />Scheduled</Badge> : <Badge className="bg-slate-100 text-slate-600 text-[10px]"><EyeOff className="w-2.5 h-2.5 mr-1" />Draft</Badge>}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          }}
        />
      )}

      <BlogEditor open={editorOpen} onOpenChange={setEditorOpen} editing={editing} onSaved={fetchItems} />
    </div>
  );
}

function BlogEditor({ open, onOpenChange, editing, onSaved }: { open: boolean; onOpenChange: (v: boolean) => void; editing: BlogPost | null; onSaved: () => void; }) {
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("Growth Strategy");
  const [author, setAuthor] = useState("");
  const [authorRole, setAuthorRole] = useState("");
  const [image, setImage] = useState("");
  const [permalink, setPermalink] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [ogImage, setOgImage] = useState("");
  const [status, setStatus] = useState<"draft" | "published" | "scheduled">("draft");
  const [scheduledAt, setScheduledAt] = useState("");
  const [featured, setFeatured] = useState(false);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<string>("");
  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    if (editing) {
      setTitle(editing.title); setExcerpt(editing.excerpt); setContent(editing.content);
      setCategory(editing.category); setAuthor(editing.author); setAuthorRole(editing.authorRole || "");
      setImage(editing.image || ""); setPermalink(editing.slug); setMetaDescription(editing.metaDescription || "");
      setTags(editing.tags ? safeParseTags(editing.tags) : []); setOgImage(editing.ogImage || "");
      setStatus(editing.status as any || (editing.published ? "published" : "draft"));
      setScheduledAt(editing.scheduledAt ? editing.scheduledAt.slice(0, 16) : "");
      setFeatured(editing.featured); setLastSaved(new Date(editing.updatedAt).toLocaleString());
    } else {
      setTitle(""); setExcerpt(""); setContent(""); setCategory("Growth Strategy"); setAuthor(""); setAuthorRole("");
      setImage(""); setPermalink(""); setMetaDescription(""); setTags([]); setOgImage("");
      setStatus("draft"); setScheduledAt(""); setFeatured(false); setLastSaved("");
    }
  }, [editing, open]);

  useEffect(() => { if (!permalink && title) setPermalink(title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")); }, [title, permalink]);

  const buildBody = () => ({
    title, slug: permalink || title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
    excerpt, content, contentHtml: content, category, author, authorRole: authorRole || null,
    image: image || null, metaDescription: metaDescription || null, tags, ogImage: ogImage || null,
    status, scheduledAt: status === "scheduled" && scheduledAt ? new Date(scheduledAt).toISOString() : null,
    featured, readTime: `${Math.max(1, Math.ceil(content.trim().split(/\s+/).filter(Boolean).length / 200))} min read`,
    published: status === "published",
  });

  const save = async (newStatus?: "draft" | "published" | "scheduled") => {
    if (!title || !excerpt || !content || !author) { toast.error("Title, excerpt, content, and author are required"); return; }
    setSaving(true);
    const body = { ...buildBody() } as any;
    if (newStatus) { body.status = newStatus; body.published = newStatus === "published"; }
    try {
      if (editing) {
        await fetch("/api/blog", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: editing.id, ...body }) });
        toast.success(body.status === "published" ? "Post published" : body.status === "scheduled" ? "Post scheduled" : "Draft saved");
      } else {
        await fetch("/api/blog", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
        toast.success(body.status === "published" ? "Post published" : body.status === "scheduled" ? "Post scheduled" : "Draft created");
      }
      setLastSaved(new Date().toLocaleString()); onSaved();
      if (newStatus === "published") onOpenChange(false);
    } catch { toast.error("Failed to save"); }
    finally { setSaving(false); }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[1400px] w-[95vw] max-h-[95vh] p-0 gap-0 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200 bg-white">
          <div className="flex items-center gap-3">
            <button onClick={() => onOpenChange(false)} className="p-1.5 rounded hover:bg-slate-100 text-slate-600" aria-label="Back"><ArrowLeft className="w-4 h-4" /></button>
            <div>
              <DialogTitle className="text-base font-bold text-slate-900" style={{ fontFamily: "var(--font-space-grotesk)" }}>{editing ? "Edit Post" : "New Post"}</DialogTitle>
              <p className="text-[10px] text-slate-500">{lastSaved ? `Last saved: ${lastSaved}` : "Unsaved draft"}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setPreviewMode(!previewMode)} className="h-8"><Eye className="w-3.5 h-3.5 mr-1" />{previewMode ? "Edit" : "Preview"}</Button>
            <Button type="button" size="sm" onClick={() => save("published")} disabled={saving} className="gradient-bg text-white border-0 hover:opacity-90 h-8"><Send className="w-3.5 h-3.5 mr-1" />{status === "published" ? "Update" : "Publish"}</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] overflow-y-auto max-h-[calc(95vh-57px)]">
          <div className="p-6 lg:p-8 border-r border-slate-200 bg-white">
            {previewMode ? (
              <div className="max-w-2xl mx-auto">
                <Badge className="bg-[#FFF3EC] text-[#FF6B2C] border-[#FFD4BD] mb-4">{category}</Badge>
                <h1 className="text-4xl font-bold text-slate-900 mb-3" style={{ fontFamily: "var(--font-space-grotesk)" }}>{title || "Your headline"}</h1>
                <p className="text-lg text-slate-600 mb-4">{excerpt || "Your excerpt..."}</p>
                <div className="flex items-center gap-2 text-sm text-slate-500 mb-6 pb-4 border-b border-slate-200">
                  <div className="w-9 h-9 rounded-full gradient-bg flex items-center justify-center text-white text-xs font-bold">{author.split(" ").map((n) => n[0]).slice(0, 2).join("") || "—"}</div>
                  <div><div className="font-semibold text-slate-900">{author || "Author"}</div><div className="text-xs text-slate-500">{authorRole}</div></div>
                </div>
                {image && <div className="rounded-xl overflow-hidden mb-6"><img src={image} alt={title} className="w-full" /></div>}
                <div className="prose prose-slate max-w-none whitespace-pre-wrap">{content}</div>
              </div>
            ) : (
              <>
                <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Write an engaging headline..." className="w-full text-3xl lg:text-4xl font-bold text-slate-900 border-0 outline-none mb-4 bg-transparent" style={{ fontFamily: "var(--font-space-grotesk)" }} />
                <input value={excerpt} onChange={(e) => setExcerpt(e.target.value)} placeholder="Short summary shown in blog cards..." className="w-full text-base text-slate-600 border-0 outline-none mb-6 bg-transparent" />
                <RichTextEditor value={content} onChange={setContent} placeholder="Tell your story... Use ## for headings, - for bullets, or the toolbar above." />
              </>
            )}
          </div>

          <div className="bg-[#F7F8FB] p-5 space-y-6 overflow-y-auto">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                <BookOpen className="w-4 h-4 text-[#FF6B2C]" />
                <h3 className="text-sm font-bold text-slate-900" style={{ fontFamily: "var(--font-space-grotesk)" }}>Post Settings</h3>
              </div>
              <div className="flex flex-col gap-1.5"><Label className="text-xs font-semibold text-slate-700">Category</Label><Select value={category} onValueChange={setCategory}><SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger><SelectContent>{CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select></div>
              <div className="grid grid-cols-1 gap-3">
                <div className="flex flex-col gap-1.5"><Label className="text-xs font-semibold text-slate-700">Author</Label><Input value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Daniel Foster" className="h-8 text-xs" /></div>
                <div className="flex flex-col gap-1.5"><Label className="text-xs font-semibold text-slate-700">Author Role</Label><Input value={authorRole} onChange={(e) => setAuthorRole(e.target.value)} placeholder="Founder & CEO" className="h-8 text-xs" /></div>
              </div>
              <ImageUpload value={image} onChange={setImage} label="Thumbnail" aspect="wide" hint="1200×675px (16:9)" />
            </div>

            <div className="bg-white rounded-lg border border-slate-200 p-4">
              <SEOPanel permalink={permalink} onPermalinkChange={setPermalink} metaDescription={metaDescription} onMetaDescriptionChange={setMetaDescription} tags={tags} onTagsChange={setTags} ogImage={ogImage} onOgImageChange={setOgImage} fallbackImage={image} title={title} excerpt={excerpt} />
            </div>

            <div className="bg-white rounded-lg border border-slate-200 p-4">
              <PublishingPanel status={status} onStatusChange={setStatus} scheduledAt={scheduledAt} onScheduledAtChange={setScheduledAt} featured={featured} onFeaturedChange={setFeatured} onPreview={() => setPreviewMode(true)} onSaveDraft={() => save("draft")} onPublish={() => save("published")} saving={saving} lastSaved={lastSaved} />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
