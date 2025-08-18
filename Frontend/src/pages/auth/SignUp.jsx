import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Image } from "@/components/ui/Image";
import { Input } from "@/components/ui/input";
import { path } from "@/constants/routes.const";
import { Label } from "@radix-ui/react-dropdown-menu";
import OtherAuth from "@/components/auth/OtherAuth";
import { useAuth } from "@/context/AuthContext";

function SignUp() {
  const { signUp, verifyEmail, loading, error, clearError } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [code, setCode] = useState("");
  const [step, setStep] = useState("form"); // form -> verify
  const nav = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await signUp(form);
      setStep("verify");
    } catch {}
  };

  const onVerify = async (e) => {
    e.preventDefault();
    try {
      await verifyEmail(code);
      nav("/");
    } catch {}
  };

  if (step === "verify") {
    return (
      <form
        onSubmit={onVerify}
        className="max-w-sm mx-auto p-6 flex flex-col gap-4"
      >
        <h1 className="text-xl font-bold">Verify your email</h1>
        {error && (
          <div
            className="text-red-600 text-sm cursor-pointer"
            onClick={clearError}
          >
            {error}
          </div>
        )}
        <Input
          placeholder="Enter 6-digit code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
        />
        <Button type="submit" disabled={loading}>
          {loading ? "Verifying..." : "Verify"}
        </Button>
      </form>
    );
  }

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

              {error && (
                <div
                  className="text-red-600 text-sm cursor-pointer"
                  onClick={clearError}
                >
                  {error}
                </div>
              )}

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
                  onChange={(e) =>
                    setForm((s) => ({ ...s, email: e.target.value }))
                  }
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
