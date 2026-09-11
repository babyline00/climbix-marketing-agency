"use client";
import { useState } from "react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

interface DragDropItem { id: string; order: number; }
interface DragDropListProps<T extends DragDropItem> { items: T[]; onReorder: (newItems: T[]) => void; renderItem: (item: T, index: number) => React.ReactNode; className?: string; }

export function DragDropList<T extends DragDropItem>({ items, onReorder, renderItem, className = "" }: DragDropListProps<T>) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event; if (!over || active.id === over.id) return;
    const oldIndex = items.findIndex((i) => i.id === active.id); const newIndex = items.findIndex((i) => i.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;
    const newItems = arrayMove(items, oldIndex, newIndex).map((item, idx) => ({ ...item, order: idx }));
    onReorder(newItems);
  };
  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
        <div className={className}>{items.map((item, index) => <SortableItemWrapper key={item.id} id={item.id}>{renderItem(item, index)}</SortableItemWrapper>)}</div>
      </SortableContext>
    </DndContext>
  );
}

function SortableItemWrapper({ id, children }: { id: string; children: React.ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1, zIndex: isDragging ? 50 : "auto" as any };
  return (
    <div ref={setNodeRef} style={style} className="relative group" {...attributes}>
      <button type="button" className="absolute top-3 right-3 z-10 p-1.5 rounded-md bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-400 hover:text-[#FF6B2C] hover:bg-white cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity shadow-sm" title="Drag to reorder" {...listeners}><GripVertical className="w-4 h-4" /></button>
      {children}
    </div>
  );
}
