"use client";
import { Trash2, Eye, EyeOff, Star, Copy, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BulkActionsBarProps {
  selectedCount: number; onSelectNone: () => void; onBulkDelete: () => void;
  onBulkPublish?: () => void; onBulkUnpublish?: () => void;
  onBulkFeature?: () => void; onBulkUnfeature?: () => void; onBulkDuplicate?: () => void;
  showPublishActions?: boolean; showFeatureActions?: boolean; showDuplicate?: boolean;
}

export function BulkActionsBar({ selectedCount, onSelectNone, onBulkDelete, onBulkPublish, onBulkUnpublish, onBulkFeature, onBulkUnfeature, onBulkDuplicate, showPublishActions = false, showFeatureActions = false, showDuplicate = false }: BulkActionsBarProps) {
  if (selectedCount === 0) return null;
  return (
    <div className="sticky top-0 z-20 bg-[#0A0E1A] text-white rounded-xl shadow-2xl px-4 py-3 flex items-center gap-2 mb-4 animate-in fade-in slide-in-from-top-2 duration-200">
      <span className="text-sm font-semibold mr-2">{selectedCount} selected</span>
      <div className="w-px h-5 bg-white/20 mx-1" />
      {showPublishActions && onBulkPublish && <Button size="sm" variant="ghost" onClick={onBulkPublish} className="text-white hover:bg-white/10 h-8 text-xs"><Eye className="w-3.5 h-3.5 mr-1" />Publish</Button>}
      {showPublishActions && onBulkUnpublish && <Button size="sm" variant="ghost" onClick={onBulkUnpublish} className="text-white hover:bg-white/10 h-8 text-xs"><EyeOff className="w-3.5 h-3.5 mr-1" />Unpublish</Button>}
      {showFeatureActions && onBulkFeature && <Button size="sm" variant="ghost" onClick={onBulkFeature} className="text-white hover:bg-white/10 h-8 text-xs"><Star className="w-3.5 h-3.5 mr-1" />Feature</Button>}
      {showFeatureActions && onBulkUnfeature && <Button size="sm" variant="ghost" onClick={onBulkUnfeature} className="text-white hover:bg-white/10 h-8 text-xs"><Star className="w-3.5 h-3.5 mr-1" />Unfeature</Button>}
      {showDuplicate && onBulkDuplicate && <Button size="sm" variant="ghost" onClick={onBulkDuplicate} className="text-white hover:bg-white/10 h-8 text-xs"><Copy className="w-3.5 h-3.5 mr-1" />Duplicate</Button>}
      <Button size="sm" variant="ghost" onClick={onBulkDelete} className="text-red-300 hover:bg-red-500/20 hover:text-red-200 h-8 text-xs"><Trash2 className="w-3.5 h-3.5 mr-1" />Delete</Button>
      <div className="flex-1" />
      <button onClick={onSelectNone} className="p-1 rounded hover:bg-white/10 text-white/70" title="Clear selection"><X className="w-4 h-4" /></button>
    </div>
  );
}
