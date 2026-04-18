"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Send, X, Sparkles, Pencil, Paperclip, FileText, ImageIcon, File } from "lucide-react";
import { cn } from "@/lib/utils/cn";

type Attachment = {
  name: string;
  size: number;
  type: string;
  url: string; // object URL for preview
};

type Message = {
  role: "user" | "ai";
  text: string;
  attachments?: Attachment[];
};

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function AttachmentIcon({ type }: { type: string }) {
  if (type.startsWith("image/")) return <ImageIcon className="w-3.5 h-3.5" />;
  if (type === "application/pdf") return <FileText className="w-3.5 h-3.5" />;
  return <File className="w-3.5 h-3.5" />;
}

function AttachmentChip({
  file,
  onRemove,
  variant = "preview",
}: {
  file: Attachment;
  onRemove?: () => void;
  variant?: "preview" | "sent" | "ai";
}) {
  const isImage = file.type.startsWith("image/");

  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-xl px-2.5 py-1.5 text-[11px] max-w-[200px]",
        variant === "preview" && "bg-gray-100 border border-gray-200 text-gray-700",
        variant === "sent" && "bg-white/20 text-white",
        variant === "ai" && "bg-white border border-gray-200 text-gray-700"
      )}
    >
      {isImage && variant === "preview" ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={file.url} alt={file.name} className="w-8 h-8 rounded-lg object-cover shrink-0" />
      ) : (
        <div
          className={cn(
            "w-7 h-7 rounded-lg flex items-center justify-center shrink-0",
            variant === "preview" && "bg-brown-50 text-brown-500",
            variant === "sent" && "bg-white/20 text-white",
            variant === "ai" && "bg-gray-100 text-gray-500"
          )}
        >
          <AttachmentIcon type={file.type} />
        </div>
      )}
      <div className="min-w-0">
        <p className="truncate font-medium leading-tight max-w-[120px]">{file.name}</p>
        <p className={cn("text-[10px] leading-tight", variant === "sent" ? "text-white/60" : "text-gray-400")}>
          {formatBytes(file.size)}
        </p>
      </div>
      {onRemove && (
        <button
          onClick={onRemove}
          className="ml-auto shrink-0 w-4 h-4 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-200 transition-all"
        >
          <X className="w-2.5 h-2.5" />
        </button>
      )}
    </div>
  );
}

export function AIChatWidget() {
  const [open, setOpen] = React.useState(false);
  const [messages, setMessages] = React.useState<Message[]>([
    { role: "ai", text: "Hi! I'm your support assistant. Ask me anything about tasks, payments, submissions, or account settings." },
  ]);
  const [input, setInput] = React.useState("");
  const [attachments, setAttachments] = React.useState<Attachment[]>([]);
  const [hoveredMsg, setHoveredMsg] = React.useState<number | null>(null);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleEdit = (index: number) => {
    const msg = messages[index];
    setMessages((prev) => prev.slice(0, index));
    setInput(msg.text);
    if (msg.attachments) setAttachments(msg.attachments);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const newAttachments: Attachment[] = files.map((f) => ({
      name: f.name,
      size: f.size,
      type: f.type,
      url: URL.createObjectURL(f),
    }));
    setAttachments((prev) => [...prev, ...newAttachments]);
    // reset input so same file can be re-selected
    e.target.value = "";
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => {
      URL.revokeObjectURL(prev[index].url);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSend = () => {
    const hasText = input.trim();
    const hasAttachments = attachments.length > 0;
    if (!hasText && !hasAttachments) return;

    const userMsg: Message = {
      role: "user",
      text: input.trim(),
      attachments: attachments.length > 0 ? [...attachments] : undefined,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setAttachments([]);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: hasAttachments
            ? `I've received your ${attachments.length === 1 ? "file" : `${attachments.length} files`}. Our team will review ${attachments.length === 1 ? "it" : "them"} and get back to you shortly. If you have any additional context, feel free to add it!`
            : "Thanks for your question! Based on the platform documentation, I'd recommend checking the Help Center articles for detailed guidance. If you need further assistance, feel free to submit a support ticket.",
        },
      ]);
    }, 800);
  };

  const suggestions = ["How do I submit work?", "When will I get paid?", "Extend my deadline"];
  const canSend = input.trim() || attachments.length > 0;

  return (
    <>
      {/* Floating button */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-brown-500 to-brown-700 text-white flex items-center justify-center shadow-lg shadow-brown-500/20 hover:shadow-xl hover:shadow-brown-500/30 transition-shadow cursor-pointer"
          >
            <Bot className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-forest-500 rounded-full border-2 border-white flex items-center justify-center">
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 z-50 w-[380px] rounded-2xl bg-white shadow-2xl shadow-black/10 flex flex-col overflow-hidden border border-gray-100"
            style={{ maxHeight: "calc(100vh - 48px)" }}
          >
            {/* Header */}
            <div className="px-5 py-4 bg-gradient-to-r from-brown-500 to-brown-600 text-white flex items-center gap-3 shrink-0">
              <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold">AI Support Assistant</p>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] text-white/70">Online — typically replies instantly</span>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3 min-h-0" style={{ maxHeight: "360px" }}>
              {messages.map((msg, i) =>
                msg.role === "ai" ? (
                  <div key={i} className="flex gap-2.5 items-start">
                    <div className="w-7 h-7 rounded-lg bg-brown-50 flex items-center justify-center shrink-0 mt-0.5">
                      <Sparkles className="w-3.5 h-3.5 text-brown-500" />
                    </div>
                    <div className="space-y-1.5 max-w-[85%]">
                      <div className="bg-gray-50 rounded-2xl rounded-tl-md px-3.5 py-2.5">
                        <p className="text-[12px] text-gray-600 leading-relaxed">{msg.text}</p>
                      </div>
                      {msg.attachments && msg.attachments.length > 0 && (
                        <div className="flex flex-col gap-1">
                          {msg.attachments.map((a, ai) => (
                            <AttachmentChip key={ai} file={a} variant="ai" />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div
                    key={i}
                    className="flex justify-end items-end gap-1.5 group"
                    onMouseEnter={() => setHoveredMsg(i)}
                    onMouseLeave={() => setHoveredMsg(null)}
                  >
                    {hoveredMsg === i && (
                      <button
                        onClick={() => handleEdit(i)}
                        className="w-6 h-6 rounded-lg flex items-center justify-center text-gray-400 hover:text-brown-500 hover:bg-brown-50 transition-all mb-0.5"
                        title="Edit message"
                      >
                        <Pencil className="w-3 h-3" />
                      </button>
                    )}
                    <div className="space-y-1.5 max-w-[85%]">
                      {msg.attachments && msg.attachments.length > 0 && (
                        <div className="flex flex-col gap-1 items-end">
                          {msg.attachments.map((a, ai) => (
                            <AttachmentChip key={ai} file={a} variant="sent" />
                          ))}
                        </div>
                      )}
                      {msg.text && (
                        <div className="bg-brown-500 rounded-2xl rounded-tr-md px-3.5 py-2.5">
                          <p className="text-[12px] text-white leading-relaxed">{msg.text}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )
              )}

              {/* Quick suggestions */}
              {messages.length === 1 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      onClick={() => {
                        setMessages((prev) => [...prev, { role: "user", text: s }]);
                        setTimeout(() => {
                          setMessages((prev) => [
                            ...prev,
                            { role: "ai", text: "Thanks for your question! Based on the platform documentation, I'd recommend checking the Help Center articles for detailed guidance. If you need further assistance, feel free to submit a support ticket." },
                          ]);
                        }, 800);
                      }}
                      className="text-[11px] text-brown-600 bg-brown-50 hover:bg-brown-100 px-3 py-1.5 rounded-full transition-colors cursor-pointer"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Input area */}
            <div className="px-4 py-3 border-t border-gray-100 bg-white shrink-0">
              {/* Attachment previews */}
              <AnimatePresence>
                {attachments.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex flex-wrap gap-1.5 mb-2.5 overflow-hidden"
                  >
                    {attachments.map((file, i) => (
                      <AttachmentChip key={i} file={file} variant="preview" onRemove={() => removeAttachment(i)} />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex items-center gap-2">
                {/* Attach button */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-400 hover:text-brown-500 hover:bg-brown-50 transition-all shrink-0"
                  title="Attach file"
                >
                  <Paperclip className="w-4 h-4" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.csv,.txt"
                  className="hidden"
                  onChange={handleFileChange}
                />

                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Type your question..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") handleSend(); }}
                  className="flex-1 text-[13px] text-gray-700 bg-gray-50 rounded-xl px-4 py-2.5 border border-gray-200 outline-none focus:border-brown-300 focus:ring-2 focus:ring-brown-100 transition-all placeholder:text-gray-400"
                />
                <button
                  onClick={handleSend}
                  disabled={!canSend}
                  className={cn(
                    "w-9 h-9 rounded-xl flex items-center justify-center transition-all shrink-0",
                    canSend
                      ? "bg-brown-500 text-white hover:bg-brown-600 cursor-pointer"
                      : "bg-gray-100 text-gray-300"
                  )}
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <p className="text-[9px] text-gray-400 text-center mt-2">AI may make mistakes. For critical issues, submit a ticket.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
