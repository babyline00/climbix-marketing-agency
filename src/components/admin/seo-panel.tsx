"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ImageUpload } from "./image-upload";
import { Globe, Tag, X, Plus, Search, FileImage } from "lucide-react";

interface SEOPanelProps {
  permalink: string; onPermalinkChange: (v: string) => void;
  metaDescription: string; onMetaDescriptionChange: (v: string) => void;
  tags: string[]; onTagsChange: (tags: string[]) => void;
  ogImage: string; onOgImageChange: (v: string) => void;
  fallbackImage: string; title: string; excerpt: string;
}

export function SEOPanel({ permalink, onPermalinkChange, metaDescription, onMetaDescriptionChange, tags, onTagsChange, ogImage, onOgImageChange, fallbackImage, title, excerpt }: SEOPanelProps) {
  const [tagInput, setTagInput] = useState("");
  const addTag = () => { const t = tagInput.trim().toLowerCase(); if (t && !tags.includes(t)) onTagsChange([...tags, t]); setTagInput(""); };
  const removeTag = (t: string) => onTagsChange(tags.filter((tag) => tag !== t));

  const seoScore = (() => {
    let score = 0;
    const checks = [
      { pass: title.length >= 30 && title.length <= 60, points: 20, label: "Title length (30-60 chars)" },
      { pass: !!permalink && permalink.length >= 3, points: 15, label: "Permalink set" },
      { pass: metaDescription.length >= 120 && metaDescription.length <= 160, points: 25, label: "Meta description (120-160 chars)" },
      { pass: tags.length >= 1, points: 15, label: "At least 1 tag" },
      { pass: !!(ogImage || fallbackImage), points: 15, label: "Image set" },
      { pass: permalink && !permalink.match(/^(test|temp|copy|untitled)/i) ? true : !permalink, points: 10, label: "Clean slug" },
    ];
    for (const c of checks) if (c.pass) score += c.points;
    return { score, checks };
  })();
  const scoreColor = seoScore.score >= 80 ? "text-emerald-600 bg-emerald-50 border-emerald-200" : seoScore.score >= 50 ? "text-amber-600 bg-amber-50 border-amber-200" : "text-red-600 bg-red-50 border-red-200";
  const previewUrl = `climbix.agency/blog/${permalink || "your-post"}`;
  const descLen = metaDescription.length;
  const descColor = descLen > 160 ? "text-amber-600" : descLen > 120 ? "text-emerald-600" : "text-slate-500";

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-200">
        <div className="flex items-center gap-2"><Search className="w-4 h-4 text-[#FF6B2C]" /><h3 className="text-sm font-bold text-slate-900" style={{ fontFamily: "var(--font-space-grotesk)" }}>SEO & Metadata</h3></div>
        <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[10px] font-bold ${scoreColor}`}><span className="w-1.5 h-1.5 rounded-full bg-current" />{seoScore.score}/100</div>
      </div>
      <div className="flex flex-col gap-1 p-3 rounded-md bg-slate-50 border border-slate-200">
        <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-1">SEO Checklist</div>
        {seoScore.checks.map((c, i) => (<div key={i} className="flex items-center gap-2 text-[10px]"><span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-white text-[8px] ${c.pass ? "bg-emerald-500" : "bg-slate-300"}`}>{c.pass ? "✓" : "·"}</span><span className={c.pass ? "text-slate-700" : "text-slate-400"}>{c.label}</span></div>))}
      </div>
      <div className="flex flex-col gap-1.5">
        <Label className="text-xs font-semibold text-slate-700">Permalink (URL slug)</Label>
        <div className="flex items-center gap-1 px-2 py-1.5 rounded-md border border-[#E2E6EF] bg-white"><Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" /><span className="text-xs text-slate-500 shrink-0">climbix.agency/blog/</span><input value={permalink} onChange={(e) => onPermalinkChange(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))} placeholder="your-post-slug" className="flex-1 border-0 outline-none text-xs text-slate-900 bg-transparent" /></div>
      </div>
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between"><Label className="text-xs font-semibold text-slate-700">Meta description</Label><span className={`text-[10px] font-semibold ${descColor}`}>{descLen}/160</span></div>
        <Textarea value={metaDescription} onChange={(e) => onMetaDescriptionChange(e.target.value)} rows={3} placeholder="Brief description for search engines..." maxLength={200} className="text-xs resize-none" />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label className="text-xs font-semibold text-slate-700">Search engine preview</Label>
        <div className="p-3 rounded-md bg-white border border-[#E2E6EF]"><div className="text-[10px] text-slate-500 mb-0.5">{previewUrl}</div><div className="text-sm text-[#1a0dab] font-medium leading-tight mb-0.5 truncate">{title || "Your post title"}</div><div className="text-xs text-slate-600 line-clamp-2 leading-snug">{metaDescription || excerpt || "Your meta description will appear here..."}</div></div>
      </div>
      <div className="flex flex-col gap-1.5">
        <Label className="text-xs font-semibold text-slate-700">Tags</Label>
        <div className="flex gap-1"><div className="flex-1 flex items-center gap-1 px-2 py-1.5 rounded-md border border-[#E2E6EF] bg-white"><Tag className="w-3.5 h-3.5 text-slate-400 shrink-0" /><input value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }} placeholder="Add tag + Enter" className="flex-1 border-0 outline-none text-xs text-slate-900 bg-transparent" /></div><Button type="button" onClick={addTag} variant="outline" size="sm" className="h-8 px-2" disabled={!tagInput.trim()}><Plus className="w-3.5 h-3.5" /></Button></div>
        {tags.length > 0 && (<div className="flex flex-wrap gap-1 mt-1">{tags.map((t) => <Badge key={t} variant="secondary" className="text-[10px] bg-[#FFF3EC] text-[#FF6B2C] border border-[#FFD4BD] cursor-pointer hover:bg-[#FFE5D6]" onClick={() => removeTag(t)}>{t}<X className="w-2.5 h-2.5 ml-1" /></Badge>)}</div>)}
      </div>
      <div className="flex flex-col gap-1.5">
        <Label className="text-xs font-semibold text-slate-700 flex items-center gap-1"><FileImage className="w-3.5 h-3.5" />Social share image (OG)</Label>
        <ImageUpload value={ogImage} onChange={onOgImageChange} aspect="wide" hint="Custom image for social shares. Falls back to post thumbnail." />
      </div>
    </div>
  );
}
