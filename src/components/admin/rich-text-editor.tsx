"use client";
import { useRef, useState, useCallback } from "react";
import { MDXEditor, type MDXEditorMethods, headingsPlugin, listsPlugin, quotePlugin, linkPlugin, linkDialogPlugin, imagePlugin, tablePlugin, thematicBreakPlugin, frontmatterPlugin, markdownShortcutPlugin, toolbarPlugin, BoldItalicUnderlineToggles, UndoRedo, BlockTypeSelect, ListsToggle, CreateLink, InsertImage, InsertTable, InsertThematicBreak, InsertFrontmatter, codeBlockPlugin, codeMirrorPlugin, diffSourcePlugin, type ImageUploadHandler } from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";

interface RichTextEditorProps { value: string; onChange: (markdown: string) => void; placeholder?: string; }

export function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const editorRef = useRef<MDXEditorMethods>(null);
  const imageUploadHandler: ImageUploadHandler = useCallback(async (image: File) => {
    const formData = new FormData(); formData.append("file", image);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const data = await res.json(); if (!res.ok) throw new Error(data.error || "Upload failed");
    return data.url;
  }, []);

  return (
    <div className="border border-[#E2E6EF] rounded-lg overflow-hidden bg-white">
      <MDXEditor ref={editorRef} markdown={value || ""} onChange={onChange} placeholder={placeholder || "Start writing your article..."}
        plugins={[
          headingsPlugin({ allowedHeadingLevels: [1, 2, 3] }), listsPlugin(), quotePlugin(), linkPlugin(), linkDialogPlugin(),
          imagePlugin({ imageUploadHandler }), tablePlugin(), thematicBreakPlugin(), frontmatterPlugin(),
          codeBlockPlugin({ defaultCodeBlockLanguage: "txt" }),
          codeMirrorPlugin({ codeBlockLanguages: { js: "JavaScript", ts: "TypeScript", jsx: "JSX", tsx: "TSX", css: "CSS", html: "HTML", json: "JSON", bash: "Bash", python: "Python", sql: "SQL", txt: "Plain text" } }),
          markdownShortcutPlugin(), diffSourcePlugin({ diffMarkdown: "", viewMode: "rich-text" }),
          toolbarPlugin({ toolbarContents: () => (<><UndoRedo /><BlockTypeSelect /><BoldItalicUnderlineToggles /><ListsToggle /><CreateLink /><InsertImage uploadHandler={imageUploadHandler} /><InsertTable /><InsertThematicBreak /><InsertFrontmatter /></>) }),
        ]}
        contentEditableClassName="min-h-[400px] p-6 prose prose-slate max-w-none focus:outline-none"
        className="min-h-[460px]"
      />
    </div>
  );
}
