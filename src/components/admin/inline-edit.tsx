"use client";
import { useState, useRef, useEffect, type ReactNode } from "react";
import { Check, X, Pencil } from "lucide-react";

interface InlineEditProps { value: string; onSave: (newValue: string) => void; as?: "div" | "span" | "h3" | "p"; className?: string; placeholder?: string; multiline?: boolean; maxLength?: number; showEditIcon?: boolean; children?: ReactNode; }

export function InlineEdit({ value, onSave, as: Tag = "div", className = "", placeholder = "Click to edit...", multiline = false, maxLength, showEditIcon = true }: InlineEditProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => { setDraft(value); }, [value]);
  useEffect(() => { if (editing && ref.current) { ref.current.focus(); const range = document.createRange(); range.selectNodeContents(ref.current); const sel = window.getSelection(); sel?.removeAllRanges(); sel?.addRange(range); } }, [editing]);

  const startEdit = () => { setDraft(value); setEditing(true); };
  const save = () => { const newVal = draft.trim(); if (newVal !== value) onSave(newVal || value); setEditing(false); };
  const cancel = () => { setDraft(value); setEditing(false); };
  const handleKeyDown = (e: React.KeyboardEvent) => { if (e.key === "Enter" && !multiline && !e.shiftKey) { e.preventDefault(); save(); } else if (e.key === "Escape") { e.preventDefault(); cancel(); } };

  if (editing) {
    return (
      <div className={`relative inline-flex items-start gap-1 ${className}`}>
        <div ref={ref} contentEditable suppressContentEditableWarning onInput={(e) => { let text = (e.target as HTMLDivElement).innerText; if (maxLength && text.length > maxLength) { text = text.slice(0, maxLength); (e.target as HTMLDivElement).innerText = text; const range = document.createRange(); range.selectNodeContents(e.target as HTMLDivElement); range.collapse(false); const sel = window.getSelection(); sel?.removeAllRanges(); sel?.addRange(range); } setDraft(text); }} onKeyDown={handleKeyDown} onBlur={save} data-placeholder={placeholder} className="outline-none ring-2 ring-[#FF6B2C] ring-offset-1 rounded px-1 -mx-1 min-w-[100px] inline-block whitespace-pre-wrap" style={{ minHeight: "1.2em" }} />
        <div className="flex items-center gap-0.5 ml-1"><button type="button" onMouseDown={(e) => { e.preventDefault(); save(); }} className="p-0.5 rounded text-emerald-600 hover:bg-emerald-50" title="Save"><Check className="w-3.5 h-3.5" /></button><button type="button" onMouseDown={(e) => { e.preventDefault(); cancel(); }} className="p-0.5 rounded text-red-500 hover:bg-red-50" title="Cancel"><X className="w-3.5 h-3.5" /></button></div>
      </div>
    );
  }

  return (
    <Tag className={`${className} ${showEditIcon ? "group/edit relative cursor-text hover:bg-slate-50 hover:ring-2 hover:ring-[#FF6B2C]/20 rounded px-1 -mx-1 transition-all" : ""}`} onClick={showEditIcon ? startEdit : undefined} title={showEditIcon ? "Click to edit" : undefined}>
      {value || <span className="text-slate-400 italic">{placeholder}</span>}
      {showEditIcon && <Pencil className="inline-block w-3 h-3 ml-1 text-slate-300 opacity-0 group-hover/edit:opacity-100 transition-opacity" />}
    </Tag>
  );
}
