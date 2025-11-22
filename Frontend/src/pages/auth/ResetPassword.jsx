import { useState, useEffect } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Image } from "@/components/ui/Image";
import { Input } from "@/components/ui/input";
import { path } from "@/constants/routes.const";
import { Label } from "@/components/ui/label";
import { toast } from "react-toastify";
import { api, getErr } from "@/lib/api";

function ResetPassword() {
  const { token } = useParams();
  const [form, setForm] = useState({ password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const nav = useNavigate();

  useEffect(() => {
    if (!token) {
      setError("Invalid reset link");
    }
  }, [token]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post(`/api/auth/reset-password/${token}`, {
        password: form.password,
      });
      if (data?.success) {
        setSuccess(true);
        toast.success(data.message || "Password reset successfully!");
        setTimeout(() => {
          nav(path.logIn);
        }, 2000);
      }
    } catch (err) {
      const msg = getErr(err);
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto flex w-full max-w-[420px] flex-col items-center gap-6 px-4 py-8 sm:max-w-[520px] md:max-w-3xl lg:max-w-5xl"
      >
        <Card className="w-full overflow-hidden">
          <CardContent className="grid p-0 md:grid-cols-2">
            <div className="p-6 md:p-8">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-2xl font-bold">Password Reset!</h1>
                  <p className="text-muted-foreground text-balance">
                    Your password has been reset successfully
                  </p>
                </div>
                <p className="text-sm text-muted-foreground">
                  Redirecting to login page...
                </p>
                <Button
                  onClick={() => nav(path.logIn)}
                  className="w-full cursor-pointer select-none"
                >
                  Go to Login
                </Button>
              </div>
            </div>
            <div className="bg-muted relative hidden md:block select-none">
              <Image
                src="logIn.jpg"
                alt="Image"
                className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>
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
                <h1 className="text-2xl font-bold">Reset Password</h1>
                <p className="text-muted-foreground text-balance">
                  Enter your new password
                </p>
              </div>

              {error && (
                <div className="p-3 bg-destructive/10 text-destructive text-sm rounded">
                  {error}
                </div>
              )}

              <div className="grid gap-3 select-none">
                <Label htmlFor="password">New Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => {
                    setForm((s) => ({ ...s, password: e.target.value }));
                    if (error) setError("");
                  }}
                  required
                  minLength={6}
                />
              </div>

              <div className="grid gap-3 select-none">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={form.confirmPassword}
                  onChange={(e) => {
                    setForm((s) => ({ ...s, confirmPassword: e.target.value }));
                    if (error) setError("");
                  }}
                  required
                  minLength={6}
                />
              </div>

              <Button
                type="submit"
                disabled={loading || !token}
                className="w-full cursor-pointer select-none"
              >
                {loading ? "Resetting..." : "Reset Password"}
              </Button>

              <div className="text-center text-sm">
                Remember your password?{" "}
                <Link to={path.logIn} className="underline underline-offset-4">
                  Log In
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

export default ResetPassword;

