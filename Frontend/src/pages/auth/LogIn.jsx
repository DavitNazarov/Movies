import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Image } from "@/components/ui/Image";
import { Input } from "@/components/ui/input";
import { path } from "@/constants/routes.const";
import { Label } from "@/components/ui/label";
import OtherAuth from "@/components/auth/OtherAuth";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";

function LogIn() {
  const { login, loading, error, clearError } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const nav = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(form.email, form.password);
      toast.success("Logged in successfully");
      nav("/");
    } catch (err) {
      toast.error(err?.message || "Login failed");
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
                <h1 className="text-2xl font-bold">Welcome back!</h1>
                <p className="text-balance text-muted-foreground">
                  Log in to your account
                </p>
              </div>

              <div className="grid select-none gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={form.email}
                  onChange={(e) =>
                    setForm((s) => ({ ...s, email: e.target.value }))
                  }
                  required
                />
              </div>

              <div className="grid select-none gap-3">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) =>
                    setForm((s) => ({ ...s, password: e.target.value }))
                  }
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full cursor-pointer select-none"
              >
                {loading ? "Logging in..." : "Log In"}
              </Button>

              <div className="text-center text-sm">
                <Link to={path.forgotPassword} className="underline underline-offset-4">
                  Forgot password?
                </Link>
              </div>

              <OtherAuth />

              <div className="text-center text-sm">
                Don’t have an account?{" "}
                <Link to={path.signUp} className="underline underline-offset-4">
                  Sign up
                </Link>
              </div>
            </div>
          </form>

          <div className="relative hidden select-none md:block">
            <div className="h-60 w-full md:h-full">
              <Image
                src="logIn.jpg"
                alt="Image"
                className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default LogIn;
