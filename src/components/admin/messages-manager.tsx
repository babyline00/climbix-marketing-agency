"use client";

import { useEffect, useState } from "react";
import { Mail, Trash2, MailOpen, ArrowLeft, Inbox } from "lucide-react";
import {
  Card, CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface Message {
  id: string;
  name: string;
  email: string;
  subject?: string | null;
  message: string;
  read: boolean;
  createdAt: string;
}

export function MessagesManager() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Message | null>(null);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/contact");
      const d = await res.json();
      setMessages(d.messages || []);
    } catch {
      toast.error("Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMessages(); }, []);

  const markRead = async (m: Message) => {
    setSelected(m);
    if (!m.read) {
      try {
        await fetch("/api/contact", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: m.id, read: true }),
        });
        fetchMessages();
      } catch {}
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this message?")) return;
    try {
      await fetch(`/api/contact?id=${id}`, { method: "DELETE" });
      toast.success("Message deleted");
      if (selected?.id === id) setSelected(null);
      fetchMessages();
    } catch {
      toast.error("Failed to delete");
    }
  };

  const unreadCount = messages.filter((m) => !m.read).length;

  if (selected) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 space-y-4">
        <button
          onClick={() => setSelected(null)}
          className="inline-flex items-center gap-1.5 text-sm text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to inbox
        </button>

        <Card className="border-slate-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full gradient-bg flex items-center justify-center text-white font-bold">
                  {selected.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">{selected.name}</h2>
                  <a href={`mailto:${selected.email}`} className="text-sm text-teal-600 hover:underline">
                    {selected.email}
                  </a>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => remove(selected.id)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4 mr-1.5" />
                Delete
              </Button>
            </div>

            {selected.subject && (
              <div className="mb-3">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1">Subject</div>
                <div className="text-sm font-semibold text-slate-900">{selected.subject}</div>
              </div>
            )}

            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">Message</div>
              <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap p-4 bg-slate-50 rounded-lg border border-slate-100">
                {selected.message}
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Received {new Date(selected.createdAt).toLocaleString()}
              </span>
              <Button asChild size="sm" className="gradient-bg text-white border-0 hover:opacity-90">
                <a href={`mailto:${selected.email}?subject=Re: ${selected.subject || "Your inquiry"}`}>
                  <Mail className="w-4 h-4 mr-1.5" />
                  Reply
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-slate-900" style={{ fontFamily: "var(--font-sora)" }}>
          Messages
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          {messages.length} total · {unreadCount} unread
        </p>
      </div>

      <Card className="border-slate-200 shadow-sm">
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-16 bg-slate-100 rounded animate-pulse" />
              ))}
            </div>
          ) : messages.length === 0 ? (
            <div className="p-12 text-center">
              <Inbox className="w-10 h-10 mx-auto text-slate-300 mb-3" />
              <p className="text-sm text-slate-500">No messages yet.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {messages.map((m) => (
                <button
                  key={m.id}
                  onClick={() => markRead(m)}
                  className="w-full flex items-center gap-3 p-4 hover:bg-slate-50 transition-colors text-left"
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 ${m.read ? "bg-slate-400" : "gradient-bg"}`}>
                    {m.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm truncate ${m.read ? "font-medium text-slate-700" : "font-bold text-slate-900"}`}>
                        {m.name}
                      </span>
                      {!m.read && (
                        <span className="w-2 h-2 rounded-full bg-teal-500 shrink-0" />
                      )}
                    </div>
                    <div className="text-xs text-slate-500 truncate">
                      {m.subject || m.message.slice(0, 60) + "..."}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className="text-[10px] text-slate-400">
                      {new Date(m.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </span>
                    {!m.read && (
                      <Badge className="bg-teal-100 text-teal-700 text-[10px]">New</Badge>
                    )}
                  </div>
                  {!m.read ? (
                    <Mail className="w-4 h-4 text-teal-500 shrink-0" />
                  ) : (
                    <MailOpen className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
