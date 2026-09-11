"use client";
import { useRef, useState } from "react";
import { Upload, X, Link as LinkIcon, Image as ImageIcon, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ImageUploadProps { value: string; onChange: (url: string) => void; label?: string; aspect?: "square" | "wide" | "tall"; hint?: string; }

export function ImageUpload({ value, onChange, label, aspect = "square", hint }: ImageUploadProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [urlMode, setUrlMode] = useState(false);
  const aspectClass = aspect === "wide" ? "aspect-[16/9]" : aspect === "tall" ? "aspect-[3/4]" : "aspect-square";

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData(); fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json(); if (!res.ok) throw new Error(data.error || "Upload failed");
      onChange(data.url); toast.success("Image uploaded");
    } catch (e: any) { toast.error(e?.message || "Upload failed"); }
    finally { setUploading(false); if (fileRef.current) fileRef.current.value = ""; }
  };

  return (
    <div className="flex flex-col gap-2">
      {label && <label className="text-xs font-semibold text-slate-700">{label}</label>}
      <div className="flex items-start gap-3">
        <div className={`relative ${aspectClass} w-24 shrink-0 rounded-lg border border-slate-200 bg-slate-50 overflow-hidden`}>
          {value ? (<><img src={value} alt="Preview" className="w-full h-full object-cover" /><button type="button" onClick={() => onChange("")} className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center text-white"><X className="w-3 h-3" /></button></>) : (<div className="w-full h-full flex items-center justify-center text-slate-300"><ImageIcon className="w-6 h-6" /></div>)}
        </div>
        <div className="flex-1 flex flex-col gap-2">
          {!urlMode ? (
            <div className="flex gap-2">
              <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml" onChange={onFile} className="hidden" />
              <Button type="button" variant="outline" size="sm" onClick={() => fileRef.current?.click()} disabled={uploading} className="h-9">{uploading ? <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> : <Upload className="w-3.5 h-3.5 mr-1.5" />}{uploading ? "Uploading..." : "Upload"}</Button>
              <Button type="button" variant="outline" size="sm" onClick={() => setUrlMode(true)} className="h-9"><LinkIcon className="w-3.5 h-3.5 mr-1.5" />URL</Button>
            </div>
          ) : (
            <div className="flex gap-2"><Input placeholder="/images/team/photo.png or https://..." value={value} onChange={(e) => onChange(e.target.value)} className="h-9 text-xs" /><Button type="button" variant="outline" size="sm" onClick={() => setUrlMode(false)} className="h-9">File</Button></div>
          )}
          {hint && <p className="text-[10px] text-slate-400">{hint}</p>}
        </div>
      </div>
    </div>
  );
}
