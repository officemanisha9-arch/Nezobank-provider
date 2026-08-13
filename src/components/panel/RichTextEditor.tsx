import { useEffect, useRef } from "react";
import {
  Bold, Italic, Underline as UnderlineIcon, List, ListOrdered, Heading1, Heading2,
  Quote, Link as LinkIcon, Image as ImageIcon, Undo2, Redo2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { fileToDataUrl } from "@/lib/api/upload";

type Props = {
  value: string;
  onChange: (html: string) => void;
};

/**
 * Lightweight contentEditable rich-text editor (no extra deps).
 * Authors write naturally; output is HTML stored in `content`.
 */
export function RichTextEditor({ value, onChange }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);

  // Keep DOM in sync only when external value differs (avoid caret jumps while typing).
  useEffect(() => {
    if (ref.current && value !== ref.current.innerHTML) {
      ref.current.innerHTML = value || "";
    }
  }, [value]);

  const exec = (cmd: string, arg?: string) => {
    ref.current?.focus();
    document.execCommand(cmd, false, arg);
    onChange(ref.current?.innerHTML ?? "");
  };

  const wrapBlock = (tag: "h1" | "h2" | "blockquote" | "p") => exec("formatBlock", tag);

  const insertLink = () => {
    const url = window.prompt("Link URL");
    if (!url) return;
    exec("createLink", url);
  };

  const insertImage = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      const url = await fileToDataUrl(file);
      exec("insertImage", url);
    };
    input.click();
  };

  const Btn = ({ icon: Icon, label, onClick }: { icon: typeof Bold; label: string; onClick: () => void }) => (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
    >
      <Icon className="h-4 w-4" />
    </button>
  );

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-input">
      <div className="flex flex-wrap items-center gap-1 border-b border-border bg-muted/40 px-2 py-1.5">
        <Btn icon={Heading1} label="Heading 1" onClick={() => wrapBlock("h1")} />
        <Btn icon={Heading2} label="Heading 2" onClick={() => wrapBlock("h2")} />
        <Btn icon={Bold} label="Bold" onClick={() => exec("bold")} />
        <Btn icon={Italic} label="Italic" onClick={() => exec("italic")} />
        <Btn icon={UnderlineIcon} label="Underline" onClick={() => exec("underline")} />
        <span className="mx-1 h-5 w-px bg-border" />
        <Btn icon={List} label="Bulleted list" onClick={() => exec("insertUnorderedList")} />
        <Btn icon={ListOrdered} label="Numbered list" onClick={() => exec("insertOrderedList")} />
        <Btn icon={Quote} label="Quote" onClick={() => wrapBlock("blockquote")} />
        <span className="mx-1 h-5 w-px bg-border" />
        <Btn icon={LinkIcon} label="Insert link" onClick={insertLink} />
        <Btn icon={ImageIcon} label="Insert image" onClick={insertImage} />
        <span className="mx-1 h-5 w-px bg-border" />
        <Btn icon={Undo2} label="Undo" onClick={() => exec("undo")} />
        <Btn icon={Redo2} label="Redo" onClick={() => exec("redo")} />
        <div className="ml-auto">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => wrapBlock("p")}
            className="h-7 text-xs"
          >
            Paragraph
          </Button>
        </div>
      </div>
      <div
        ref={ref}
        contentEditable
        onInput={(e) => onChange((e.target as HTMLDivElement).innerHTML)}
        className="prose prose-invert min-h-[260px] max-w-none px-4 py-3 text-sm focus:outline-none [&_h1]:text-2xl [&_h1]:font-semibold [&_h2]:text-xl [&_h2]:font-semibold [&_blockquote]:border-l-2 [&_blockquote]:border-primary [&_blockquote]:pl-3 [&_blockquote]:italic [&_img]:rounded-lg [&_a]:text-primary"
        suppressContentEditableWarning
      />
    </div>
  );
}
