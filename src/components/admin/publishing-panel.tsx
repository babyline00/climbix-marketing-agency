"use client";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar, Send, FileText, Clock, Eye, Save } from "lucide-react";

interface PublishingPanelProps {
  status: "draft" | "published" | "scheduled"; onStatusChange: (s: "draft" | "published" | "scheduled") => void;
  scheduledAt: string; onScheduledAtChange: (v: string) => void;
  featured: boolean; onFeaturedChange: (v: boolean) => void;
  onPreview: () => void; onSaveDraft: () => void; onPublish: () => void;
  saving: boolean; lastSaved?: string;
}

export function PublishingPanel({ status, onStatusChange, scheduledAt, onScheduledAtChange, featured, onFeaturedChange, onPreview, onSaveDraft, onPublish, saving, lastSaved }: PublishingPanelProps) {
  const minDate = new Date().toISOString().slice(0, 16);
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-2 pb-2 border-b border-slate-200"><Send className="w-4 h-4 text-[#FF6B2C]" /><h3 className="text-sm font-bold text-slate-900" style={{ fontFamily: "var(--font-space-grotesk)" }}>Publishing</h3></div>
      <div className="flex flex-col gap-2">
        <Label className="text-xs font-semibold text-slate-700">Status</Label>
        <RadioGroup value={status} onValueChange={(v) => onStatusChange(v as any)} className="flex flex-col gap-1">
          <label className={`flex items-start gap-3 p-2.5 rounded-md border cursor-pointer transition-all ${status === "draft" ? "border-[#FF6B2C] bg-[#FFF3EC]" : "border-[#E2E6EF] hover:border-slate-300"}`}><RadioGroupItem value="draft" className="mt-0.5" /><div className="flex-1"><div className="flex items-center gap-1.5 text-xs font-semibold text-slate-900"><FileText className="w-3.5 h-3.5 text-slate-500" />Draft</div><p className="text-[10px] text-slate-500 mt-0.5">Not visible on the public site.</p></div></label>
          <label className={`flex items-start gap-3 p-2.5 rounded-md border cursor-pointer transition-all ${status === "published" ? "border-[#FF6B2C] bg-[#FFF3EC]" : "border-[#E2E6EF] hover:border-slate-300"}`}><RadioGroupItem value="published" className="mt-0.5" /><div className="flex-1"><div className="flex items-center gap-1.5 text-xs font-semibold text-slate-900"><Send className="w-3.5 h-3.5 text-emerald-600" />Published</div><p className="text-[10px] text-slate-500 mt-0.5">Live on the public blog immediately.</p></div></label>
          <label className={`flex items-start gap-3 p-2.5 rounded-md border cursor-pointer transition-all ${status === "scheduled" ? "border-[#FF6B2C] bg-[#FFF3EC]" : "border-[#E2E6EF] hover:border-slate-300"}`}><RadioGroupItem value="scheduled" className="mt-0.5" /><div className="flex-1"><div className="flex items-center gap-1.5 text-xs font-semibold text-slate-900"><Clock className="w-3.5 h-3.5 text-amber-600" />Scheduled</div><p className="text-[10px] text-slate-500 mt-0.5">Publish automatically at a future date/time.</p></div></label>
        </RadioGroup>
      </div>
      {status === "scheduled" && (
        <div className="flex flex-col gap-1.5"><Label className="text-xs font-semibold text-slate-700 flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />Publish on</Label><Input type="datetime-local" value={scheduledAt} onChange={(e) => onScheduledAtChange(e.target.value)} min={minDate} className="text-xs" />{scheduledAt && <p className="text-[10px] text-slate-500">Will go live {new Date(scheduledAt).toLocaleString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" })}</p>}</div>
      )}
      <div className="flex items-center justify-between p-2.5 rounded-md border border-[#E2E6EF]"><div><div className="text-xs font-semibold text-slate-900">Feature on homepage</div><p className="text-[10px] text-slate-500">Pinned to the top of the blog</p></div><button type="button" onClick={() => onFeaturedChange(!featured)} className={`relative w-9 h-5 rounded-full transition-colors ${featured ? "bg-[#FF6B2C]" : "bg-slate-300"}`} aria-label="Toggle featured"><span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${featured ? "translate-x-4" : ""}`} /></button></div>
      <div className="flex flex-col gap-2 pt-2 border-t border-slate-200">
        <Button type="button" onClick={onPreview} variant="outline" size="sm" className="w-full h-9"><Eye className="w-4 h-4 mr-1.5" />Preview</Button>
        <Button type="button" onClick={onSaveDraft} variant="outline" size="sm" className="w-full h-9" disabled={saving}><Save className="w-4 h-4 mr-1.5" />{saving ? "Saving..." : "Save Draft"}</Button>
        <Button type="button" onClick={onPublish} size="sm" className="w-full h-9 gradient-bg text-white border-0 hover:opacity-90" disabled={saving}><Send className="w-4 h-4 mr-1.5" />{status === "published" ? "Update Published" : "Publish Now"}</Button>
      </div>
      {lastSaved && <p className="text-[10px] text-slate-400 text-center">Last saved: {lastSaved}</p>}
    </div>
  );
}
