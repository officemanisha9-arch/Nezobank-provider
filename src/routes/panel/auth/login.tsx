import { useMutation } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ShieldCheck, Sparkles } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { SessionUser } from "@/lib/api/auth";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/panel/auth/login")({
  component: LoginPage,
});

const FormSchema = z.object({
  email: z.string().trim().email("Invalid email").max(255),
  password: z.string().trim().min(6, "Password must be at least 6 characters").max(128),
  rememberMe: z.boolean(),
});

type FormData = z.infer<typeof FormSchema>;

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const form = useForm<FormData>({
    defaultValues: { email: "", password: "", rememberMe: false },
  });

  const { mutateAsync, isPending } = useMutation<SessionUser, Error, FormData>({
    mutationFn: (data) => login(data),
    onSuccess: (user) => {
      toast.success(`Welcome back, ${user.name}`);
      navigate({ to: "/panel/app/dashboard" });
    },
    onError: (error) => toast.error(error.message),
  });

  const onSubmit = form.handleSubmit(async (values) => {
    const parsed = FormSchema.safeParse(values);

    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        const field = issue.path[0];
        if (typeof field === "string") {
          form.setError(field as keyof FormData, { message: issue.message });
        }
      }
      return;
    }

    await mutateAsync(parsed.data);
  });

  return (
    <Card className="animate-fade-in w-full max-w-md border-border/60 bg-card/80 shadow-elegant backdrop-blur-xl">
      <CardHeader className="space-y-3 text-center">
        <img src="/logo.png" alt="Nezo Panel" className="mx-auto h-10 w-25" />
        <div>
          <CardTitle className="text-2xl font-semibold tracking-tight">
            Sign in to <span className="panel-gradient-text">Nezo Panel</span>
          </CardTitle>
          <p className="mt-1.5 text-sm text-muted-foreground">Manage your assigned blogs and articles</p>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-5">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="you@nezobank.io" type="email" autoComplete="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="********" type="password" autoComplete="current-password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="rememberMe"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2 space-y-0">
                  <FormControl>
                    <Checkbox id={field.name} checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <FormLabel htmlFor={field.name} className="cursor-pointer text-sm font-normal text-muted-foreground">
                    Remember me on this device
                  </FormLabel>
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-95"
              disabled={isPending}
            >
              {isPending ? "Signing in..." : "Sign in"}
            </Button>

            <p className="flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
              <ShieldCheck className="h-3.5 w-3.5 text-accent" />
              Secure session, encrypted at rest
            </p>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
