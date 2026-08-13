import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Newspaper, Search } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { ImageDropzone } from "@/components/panel/ImageDropzone";
import { RichTextEditor } from "@/components/panel/RichTextEditor";
import {
  createArticle,
  deleteArticle,
  listArticles,
  updateArticle,
  type Article,
  type ArticleInput,
} from "@/lib/api/articles";

export const Route = createFileRoute("/panel/app/articles")({
  component: ArticlesPage,
});

const empty: ArticleInput = {
  title: "",
  category: "",
  date: new Date().toLocaleString("en-US", { month: "long", year: "numeric" }),
  image: "",
  excerpt: "",
  content: "",
  status: "draft",
};

function ArticlesPage() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [draft, setDraft] = useState<ArticleInput>(empty);
  const [editingId, setEditingId] = useState<string | null>(null);

  const { data = [], isLoading } = useQuery({ queryKey: ["articles"], queryFn: listArticles });

  const createMut = useMutation({
    mutationFn: createArticle,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["articles"] });
      toast.success("Article created");
      setOpen(false);
      setEditingId(null);
      setDraft(empty);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const updateMut = useMutation({
    mutationFn: ({ id, input }: { id: string; input: ArticleInput }) => updateArticle(id, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["articles"] });
      toast.success("Article updated");
      setOpen(false);
      setEditingId(null);
      setDraft(empty);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteMut = useMutation({
    mutationFn: deleteArticle,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["articles"] });
      toast.success("Article deleted");
      setConfirmId(null);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const filtered = data.filter(
    (a) =>
      !search ||
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.category.toLowerCase().includes(search.toLowerCase()),
  );

  const submit = () => {
    if (!draft.title.trim()) return toast.error("Title is required");
    if (!draft.content.trim()) return toast.error("Content is required");
    if (!draft.image) return toast.error("Cover image is required");
    if (!draft.category.trim()) return toast.error("Category is required");

    if (editingId) {
      updateMut.mutate({ id: editingId, input: draft });
      return;
    }

    createMut.mutate(draft);
  };

  const startCreate = () => {
    setEditingId(null);
    setDraft(empty);
    setOpen(true);
  };

  const startEdit = (article: Article) => {
    setEditingId(article.id);
    setDraft({
      title: article.title,
      category: article.category,
      date: article.date,
      image: article.image,
      excerpt: article.excerpt,
      content: article.content,
      status: article.status,
    });
    setOpen(true);
  };

  return (
    <div className="mx-auto max-w-7xl animate-fade-in space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Articles</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {data.length} total - your editorial library.
          </p>
        </div>
        <Dialog
          open={open}
          onOpenChange={(value) => {
            setOpen(value);
            if (!value) {
              setEditingId(null);
              setDraft(empty);
            }
          }}
        >
          <DialogTrigger asChild>
            <Button onClick={startCreate} className="bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-95">
              <Plus className="mr-1.5 h-4 w-4" /> Create article
            </Button>
          </DialogTrigger>
          <ArticleFormDialog
            draft={draft}
            setDraft={setDraft}
            onSubmit={submit}
            isPending={createMut.isPending || updateMut.isPending}
            mode={editingId ? "edit" : "create"}
          />
        </Dialog>
      </header>

      <div className="relative max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by title or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {isLoading ? (
        <p className="py-12 text-center text-sm text-muted-foreground">Loading...</p>
      ) : filtered.length === 0 ? (
        <Card className="flex flex-col items-center justify-center gap-3 border-dashed border-border/60 bg-card/40 py-16">
          <Newspaper className="h-10 w-10 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            {search ? "No articles match your search." : "No articles yet - create your first one."}
          </p>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              onEdit={() => startEdit(article)}
              onDelete={() => setConfirmId(article.id)}
            />
          ))}
        </div>
      )}

      <AlertDialog open={!!confirmId} onOpenChange={(value) => !value && setConfirmId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this article?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => confirmId && deleteMut.mutate(confirmId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function ArticleCard({
  article,
  onEdit,
  onDelete,
}: {
  article: Article;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <Card className="group overflow-hidden border-border/60 bg-card/70 transition hover:-translate-y-0.5 hover:shadow-elegant">
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-muted">
        {article.image ? (
          <img src={article.image} alt={article.title} className="h-full w-full object-cover transition group-hover:scale-105" />
        ) : null}
        <Badge className="absolute left-3 top-3" variant={article.status === "published" ? "default" : "secondary"}>
          {article.status}
        </Badge>
      </div>
      <div className="space-y-2 p-4">
        <p className="text-[11px] uppercase tracking-wider text-primary">{article.category}</p>
        <h3 className="line-clamp-2 text-base font-semibold">{article.title}</h3>
        <p className="line-clamp-2 text-xs text-muted-foreground">{article.excerpt}</p>
        <div className="flex items-center justify-between pt-2 text-xs text-muted-foreground">
          <span>{article.date}</span>
        </div>
        <div className="flex justify-end gap-1 pt-2">
          <Button variant="ghost" size="sm" onClick={onEdit}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={onDelete} className="hover:bg-destructive/10 hover:text-destructive">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}

function ArticleFormDialog({
  draft,
  setDraft,
  onSubmit,
  isPending,
  mode,
}: {
  draft: ArticleInput;
  setDraft: (d: ArticleInput) => void;
  onSubmit: () => void;
  isPending: boolean;
  mode: "create" | "edit";
}) {
  const set = <K extends keyof ArticleInput>(key: K, value: ArticleInput[K]) => setDraft({ ...draft, [key]: value });

  return (
    <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
      <DialogHeader>
        <DialogTitle>{mode === "edit" ? "Edit article" : "Create article"}</DialogTitle>
        <DialogDescription>
          {mode === "edit"
            ? "Update this article and save the latest version."
            : "Compose a long-form article for your audience."}
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-5">
        <div className="space-y-2">
          <Label>Cover image *</Label>
          <ImageDropzone value={draft.image} onChange={(url) => set("image", url)} />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input id="title" value={draft.title} onChange={(e) => set("title", e.target.value)} placeholder="Trading Features" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Input id="category" value={draft.category} onChange={(e) => set("category", e.target.value)} placeholder="Features" />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="date">Date label</Label>
            <Input id="date" value={draft.date} onChange={(e) => set("date", e.target.value)} placeholder="April 2026" />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="excerpt">Excerpt</Label>
          <Textarea
            id="excerpt"
            value={draft.excerpt}
            onChange={(e) => set("excerpt", e.target.value)}
            placeholder="Short summary"
            rows={2}
          />
        </div>

        <div className="space-y-2">
          <Label>Content *</Label>
          <RichTextEditor value={draft.content} onChange={(html) => set("content", html)} />
        </div>

        <div className="flex items-center justify-end gap-3 rounded-lg border border-border/60 bg-muted/30 px-4 py-3">
          <Switch
            checked={draft.status === "published"}
            onCheckedChange={(value) => set("status", value ? "published" : "draft")}
            id="published-article"
          />
          <Label htmlFor="published-article" className="cursor-pointer">Publish now</Label>
        </div>
      </div>

      <DialogFooter>
        <Button onClick={onSubmit} disabled={isPending} className="bg-gradient-primary text-primary-foreground">
          {isPending ? "Saving..." : mode === "edit" ? "Update article" : "Save article"}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
