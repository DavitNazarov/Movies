import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Image } from "@/components/ui/Image";
import { Input } from "@/components/ui/input";
import { path } from "@/constants/routes.const";
import { Label } from "@/components/ui/label";
import { toast } from "react-toastify";
import { api, getErr } from "@/lib/api";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const nav = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post("/api/auth/forgot-password", { email });
      if (data?.success) {
        setSent(true);
        toast.success(data.message || "Password reset link sent to your email");
      }
    } catch (err) {
      const msg = getErr(err);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
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
                  <h1 className="text-2xl font-bold">Check Your Email</h1>
                  <p className="text-muted-foreground text-balance">
                    We've sent a password reset link to {email}
                  </p>
                </div>
                <p className="text-sm text-muted-foreground">
                  Click the link in the email to reset your password. The link will expire in 1 hour.
                </p>
                <Button
                  onClick={() => nav(path.logIn)}
                  className="w-full cursor-pointer select-none"
                >
                  Back to Login
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
                <h1 className="text-2xl font-bold">Forgot Password?</h1>
                <p className="text-muted-foreground text-balance">
                  Enter your email and we'll send you a reset link
                </p>
              </div>

              <div className="grid gap-3 select-none">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full cursor-pointer select-none"
              >
                {loading ? "Sending..." : "Send Reset Link"}
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

export default ForgotPassword;

