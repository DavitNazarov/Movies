import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Image } from "@/components/ui/Image";
import { Input } from "@/components/ui/input";
import { path } from "@/constants/routes.const";
// FIX: use your UI Label, not radix dropdown-menu
import { Label } from "@/components/ui/label";
import OtherAuth from "@/components/auth/OtherAuth";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";

function SignUp() {
  const { signUp, loading, error, clearError } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const nav = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await signUp(form);
      toast.success("Account created. Welcome to Movie Hub!");
      nav(path.home);
    } catch (err) {
      toast.error(err?.message || "Sign up failed");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mx-auto flex w-full max-w-[420px] flex-col items-center gap-6 px-4 py-8 sm:max-w-[520px] md:max-w-3xl lg:max-w-5xl"
    >
      <Card className="w-full overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form onSubmit={onSubmit} className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">
                  Welcome to the Movie Hub!
                </h1>
                <p className="text-muted-foreground text-balance">
                  Create your account
                </p>
              </div>

              <div className="grid gap-3">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={form.name}
                  onChange={(e) =>
                    setForm((s) => ({ ...s, name: e.target.value }))
                  }
                  required
                />
              </div>

              <div className="grid gap-3 select-none">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={form.email}
                  onChange={(e) => {
                    if (error) clearError();
                    setForm((s) => ({ ...s, email: e.target.value }));
                  }}
                  required
                />
              </div>

              <div className="grid gap-3 select-none">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => {
                    if (error) clearError();
                    setForm((s) => ({ ...s, password: e.target.value }));
                  }}
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full cursor-pointer select-none"
              >
                {loading ? "Creating..." : "Create Account"}
              </Button>

              <OtherAuth />

              <div className="text-center text-sm">
                Already have an account?{" "}
                <Link to={path.logIn} className="underline underline-offset-4">
                  Log In
                </Link>
              </div>
            </div>
          </form>

          <div className="bg-muted relative hidden md:block select-none">
            <Image
              src="signUp.jpg"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default SignUp;
