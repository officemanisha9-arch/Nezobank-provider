import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, FileText, Search } from "lucide-react";
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
  createBlog,
  deleteBlog,
  listBlogs,
  updateBlog,
  type Blog,
  type BlogInput,
} from "@/lib/api/blogs";

export const Route = createFileRoute("/panel/app/blogs")({
  component: BlogsPage,
});

const empty: BlogInput = {
  title: "",
  excerpt: "",
  content: "",
  image: "",
  author: "",
  authorImage: "",
  readTime: "5 min read",
  category: "",
  premium: false,
  status: "draft",
};

function BlogsPage() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [draft, setDraft] = useState<BlogInput>(empty);
  const [editingId, setEditingId] = useState<string | null>(null);

  const { data = [], isLoading } = useQuery({ queryKey: ["blogs"], queryFn: listBlogs });

  const createMut = useMutation({
    mutationFn: createBlog,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["blogs"] });
      toast.success("Blog created");
      setOpen(false);
      setEditingId(null);
      setDraft(empty);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const updateMut = useMutation({
    mutationFn: ({ id, input }: { id: string; input: BlogInput }) => updateBlog(id, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["blogs"] });
      toast.success("Blog updated");
      setOpen(false);
      setEditingId(null);
      setDraft(empty);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteMut = useMutation({
    mutationFn: deleteBlog,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["blogs"] });
      toast.success("Blog deleted");
      setConfirmId(null);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const filtered = data.filter(
    (b) =>
      !search ||
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.category.toLowerCase().includes(search.toLowerCase()),
  );

  const submit = () => {
    if (!draft.title.trim()) return toast.error("Title is required");
    if (!draft.content.trim()) return toast.error("Content is required");
    if (!draft.image) return toast.error("Cover image is required");
    if (!draft.author.trim()) return toast.error("Author is required");
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

  const startEdit = (blog: Blog) => {
    setEditingId(blog.id);
    setDraft({
      title: blog.title,
      excerpt: blog.excerpt,
      content: blog.content,
      image: blog.image,
      author: blog.author,
      authorImage: blog.authorImage ?? "",
      readTime: blog.readTime,
      category: blog.category,
      premium: blog.premium,
      status: blog.status,
    });
    setOpen(true);
  };

  return (
    <div className="mx-auto max-w-7xl animate-fade-in space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Blogs</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {data.length} total - manage your blog history and create new posts.
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
              <Plus className="mr-1.5 h-4 w-4" /> Create blog
            </Button>
          </DialogTrigger>
          <BlogFormDialog
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
          <FileText className="h-10 w-10 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            {search ? "No blogs match your search." : "No blogs yet - create your first one."}
          </p>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((blog) => (
            <BlogCard key={blog.id} blog={blog} onEdit={() => startEdit(blog)} onDelete={() => setConfirmId(blog.id)} />
          ))}
        </div>
      )}

      <AlertDialog open={!!confirmId} onOpenChange={(value) => !value && setConfirmId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this blog?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The blog will be permanently removed.
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

function BlogCard({
  blog,
  onEdit,
  onDelete,
}: {
  blog: Blog;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <Card className="group overflow-hidden border-border/60 bg-card/70 transition hover:-translate-y-0.5 hover:shadow-elegant">
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-muted">
        {blog.image ? (
          <img src={blog.image} alt={blog.title} className="h-full w-full object-cover transition group-hover:scale-105" />
        ) : null}
        <div className="absolute left-3 top-3 flex gap-1.5">
          <Badge variant={blog.status === "published" ? "default" : "secondary"}>{blog.status}</Badge>
          {blog.premium ? <Badge className="bg-accent text-accent-foreground">Premium</Badge> : null}
        </div>
      </div>
      <div className="space-y-2 p-4">
        <p className="text-[11px] uppercase tracking-wider text-primary">{blog.category}</p>
        <h3 className="line-clamp-2 text-base font-semibold">{blog.title}</h3>
        <p className="line-clamp-2 text-xs text-muted-foreground">{blog.excerpt}</p>
        <div className="flex items-center justify-between pt-2 text-xs text-muted-foreground">
          <span>{blog.author} - {blog.readTime}</span>
          <span>{blog.date}</span>
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

function BlogFormDialog({
  draft,
  setDraft,
  onSubmit,
  isPending,
  mode,
}: {
  draft: BlogInput;
  setDraft: (d: BlogInput) => void;
  onSubmit: () => void;
  isPending: boolean;
  mode: "create" | "edit";
}) {
  const set = <K extends keyof BlogInput>(key: K, value: BlogInput[K]) => setDraft({ ...draft, [key]: value });

  return (
    <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
      <DialogHeader>
        <DialogTitle>{mode === "edit" ? "Edit blog post" : "Create blog post"}</DialogTitle>
        <DialogDescription>
          {mode === "edit"
            ? "Update the existing post and save it back to the database."
            : "Fill in the details - the post will appear in your blog history."}
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
            <Input id="title" value={draft.title} onChange={(e) => set("title", e.target.value)} placeholder="Safe & Fast Transactions..." />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Input id="category" value={draft.category} onChange={(e) => set("category", e.target.value)} placeholder="Transactions" />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="excerpt">Excerpt</Label>
          <Textarea
            id="excerpt"
            value={draft.excerpt}
            onChange={(e) => set("excerpt", e.target.value)}
            placeholder="Short summary shown in listings"
            rows={2}
          />
        </div>

        <div className="space-y-2">
          <Label>Content *</Label>
          <RichTextEditor value={draft.content} onChange={(html) => set("content", html)} />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="author">Author *</Label>
            <Input id="author" value={draft.author} onChange={(e) => set("author", e.target.value)} placeholder="Nezobank Team" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="readTime">Read time</Label>
            <Input id="readTime" value={draft.readTime} onChange={(e) => set("readTime", e.target.value)} placeholder="5 min read" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="authorImage">Author image URL</Label>
            <Input id="authorImage" value={draft.authorImage ?? ""} onChange={(e) => set("authorImage", e.target.value)} placeholder="https://..." />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-lg border border-border/60 bg-muted/30 px-4 py-3">
          <div className="flex items-center gap-3">
            <Switch checked={draft.premium} onCheckedChange={(value) => set("premium", value)} id="premium" />
            <Label htmlFor="premium" className="cursor-pointer">Premium content</Label>
          </div>
          <div className="flex items-center gap-3">
            <Switch
              checked={draft.status === "published"}
              onCheckedChange={(value) => set("status", value ? "published" : "draft")}
              id="published"
            />
            <Label htmlFor="published" className="cursor-pointer">Publish now</Label>
          </div>
        </div>
      </div>

      <DialogFooter>
        <Button onClick={onSubmit} disabled={isPending} className="bg-gradient-primary text-primary-foreground">
          {isPending ? "Saving..." : mode === "edit" ? "Update blog" : "Save blog"}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
