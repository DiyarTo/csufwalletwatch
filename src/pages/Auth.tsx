import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        toast({ title: "Login failed", description: error.message, variant: "destructive" });
      } else {
        navigate("/");
      }
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: window.location.origin },
      });
      if (error) {
        toast({ title: "Sign up failed", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Check your email", description: "We sent you a confirmation link." });
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <h1 className="font-heading text-3xl font-bold text-foreground text-center mb-8">
          Wallet Watch
        </h1>

        <div className="bg-card rounded-lg p-6">
          <p className="text-sm font-body text-muted-foreground tracking-wide uppercase mb-4">
            {isLogin ? "Log In" : "Sign Up"}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Loading…" : isLogin ? "Log In" : "Sign Up"}
            </Button>
          </form>

          <button
            type="button"
            className="mt-4 text-sm text-muted-foreground hover:text-foreground transition-colors w-full text-center"
            onClick={async () => {
              if (!email) {
                toast({
                  title: "Enter your email first",
                  description: "We need your email to send a reset link.",
                  variant: "destructive",
                });
                return;
              }
          
              const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`,
              });
          
              if (error) {
                toast({
                  title: "Reset failed",
                  description: error.message,
                  variant: "destructive",
                });
              } else {
                toast({
                  title: "Check your email",
                  description: "We sent you a password reset link.",
                });
              }
            }}
          >
            Forgot password?
          </button>
          
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="mt-4 text-sm text-muted-foreground hover:text-foreground transition-colors w-full text-center"
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Log in"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
