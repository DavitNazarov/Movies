import OtherAuth from "@/components/auth/OtherAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Image } from "@/components/ui/Image";
import { Input } from "@/components/ui/input";
import { path } from "@/constants/routes.const";
import { Label } from "@radix-ui/react-dropdown-menu";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
function SignUp() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mx-auto flex w-full max-w-[420px] flex-col items-center gap-6 px-4 py-8 sm:max-w-[520px] md:max-w-3xl lg:max-w-5xl"
    >
      <Card className="w-full overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8">
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
                <div className="flex items-center">
                  <Label htmlFor="name">Name</Label>
                </div>
                <Input id="name" type="text" required />
              </div>

              <div className="grid gap-3 select-none ">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </div>

              <div className="grid gap-3 select-none ">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full cursor-pointer select-none"
              >
                Create Account
              </Button>

              <OtherAuth />

              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
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
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>
        and <a href="#">Privacy Policy</a>.
      </div>
    </motion.div>
  );
}

export default SignUp;
