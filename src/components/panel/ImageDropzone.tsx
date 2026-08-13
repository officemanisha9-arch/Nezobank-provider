import { useState, type ChangeEvent } from "react";
import { ImagePlus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fileToDataUrl } from "@/lib/api/upload";
import { cn } from "@/lib/utils";

type Props = {
  value: string;
  onChange: (dataUrl: string) => void;
  className?: string;
};

export function ImageDropzone({ value, onChange, className }: Props) {
  const [busy, setBusy] = useState(false);

  const handleFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return;
    setBusy(true);
    try {
      const url = await fileToDataUrl(file);
      onChange(url);
    } finally {
      setBusy(false);
      e.target.value = "";
    }
  };

  return (
    <div className={cn("relative", className)}>
      {value ? (
        <div className="group relative overflow-hidden rounded-xl border border-border bg-muted">
          <img src={value} alt="Cover preview" className="h-56 w-full object-cover" />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute right-2 top-2 rounded-full bg-background/80 p-1.5 opacity-0 backdrop-blur transition group-hover:opacity-100 hover:bg-destructive hover:text-destructive-foreground"
            aria-label="Remove image"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <label className="flex h-56 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 text-center transition hover:border-primary hover:bg-muted/50">
          <ImagePlus className="mb-2 h-8 w-8 text-muted-foreground" />
          <span className="text-sm font-medium">{busy ? "Reading…" : "Click to upload cover image"}</span>
          <span className="mt-1 text-xs text-muted-foreground">PNG, JPG, WEBP — picked from your device</span>
          <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
        </label>
      )}
      {value ? (
        <div className="mt-2 flex justify-end">
          <Button type="button" variant="ghost" size="sm" asChild>
            <label className="cursor-pointer">
              Replace image
              <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
            </label>
          </Button>
        </div>
      ) : null}
    </div>
  );
}
