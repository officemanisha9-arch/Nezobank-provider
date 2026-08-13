import { useMutation } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ShieldCheck, Sparkles, Lock, Mail, ArrowRight } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-background p-4">
      {/* Decorative Background Glow Elements */}
      <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-primary/20 blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-accent/20 blur-[120px] pointer-events-none" />

      <Card className="relative animate-fade-in w-full max-w-md border-border/60 bg-card/75 shadow-2xl backdrop-blur-2xl rounded-2xl overflow-hidden border-t-primary/40">
        {/* Subtle Top Accent Border Glow */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent" />

        <CardHeader className="space-y-3 text-center pt-8 pb-4">
          <img src="/logo.png" alt="Nezo Bank Logo" className="mx-auto h-12 w-25" />
          <div>
            <CardTitle className="text-2xl font-bold tracking-tight">
              Sign in to <span className="panel-gradient-text">Nezo Bank</span>
            </CardTitle>
            <CardDescription className="mt-1.5 text-xs text-muted-foreground">
              Secure access to your assigned assets, token flows, and trade histories
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="pb-8 pt-2">
          <Form {...form}>
            <form onSubmit={onSubmit} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email Address</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input 
                          placeholder="you@nezobank.io" 
                          type="email" 
                          autoComplete="email" 
                          className="pl-10 bg-background/50 border-border/60 focus:ring-2 focus:ring-primary/40 transition-all" 
                          {...field} 
                        />
                      </div>
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
                    <FormLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input 
                          placeholder="••••••••" 
                          type="password" 
                          autoComplete="current-password" 
                          className="pl-10 bg-background/50 border-border/60 focus:ring-2 focus:ring-primary/40 transition-all" 
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center justify-between pt-1">
                <FormField
                  control={form.control}
                  name="rememberMe"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2 space-y-0">
                      <FormControl>
                        <Checkbox id={field.name} checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <FormLabel htmlFor={field.name} className="cursor-pointer text-xs font-normal text-muted-foreground select-none">
                        Remember this device
                      </FormLabel>
                    </FormItem>
                  )}
                />
              </div>

              <Button
                type="submit"
                className="w-full mt-2 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg hover:opacity-95 transition-all group py-5 font-semibold"
                disabled={isPending}
              >
                {isPending ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    <span>Signing in securely...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <span>Sign in to Dashboard</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                )}
              </Button>

              <div className="pt-2 text-center">
                <p className="inline-flex items-center gap-1.5 text-center text-[11px] text-muted-foreground bg-secondary/50 px-3 py-1 rounded-full border border-border/40">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                  End-to-end encrypted session & secure token authentication
                </p>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}