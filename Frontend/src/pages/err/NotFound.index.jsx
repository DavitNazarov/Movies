// src/pages/error/NotFound.index.jsx
import React from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { path } from "@/constants/routes.const";
import { Home, ArrowLeft, Sparkles } from "lucide-react";

const float = (delay = 0) => ({
  initial: { y: 0 },
  animate: { y: [0, -12, 0] },
  transition: { duration: 2.2, repeat: Infinity, repeatType: "mirror", delay },
});

export default function NotFound() {
  const nav = useNavigate();

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 px-6">
      {/* Ambient blobs */}
      <motion.div
        className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-indigo-500/30 blur-3xl"
        animate={{ scale: [1, 1.1, 1], rotate: [0, 20, 0] }}
        transition={{ duration: 14, repeat: Infinity, repeatType: "mirror" }}
      />
      <motion.div
        className="pointer-events-none absolute -bottom-32 -right-24 h-96 w-96 rounded-full bg-fuchsia-500/25 blur-3xl"
        animate={{ scale: [1, 1.12, 1], rotate: [0, -15, 0] }}
        transition={{ duration: 16, repeat: Infinity, repeatType: "mirror" }}
      />

      <div className="relative z-10 flex max-w-3xl flex-col items-center text-center">
        {/* Sparkles accent */}
        <motion.div
          className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70 backdrop-blur"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Sparkles className="size-3.5" />
          Fancy 404
        </motion.div>

        {/* 404 digits */}
        <div className="mb-4 flex items-end gap-2 md:gap-3">
          <motion.span
            {...float(0)}
            className="select-none text-7xl font-black leading-none text-transparent md:text-8xl bg-gradient-to-br from-white to-slate-300 bg-clip-text drop-shadow-[0_10px_30px_rgba(0,0,0,0.35)]"
          >
            4
          </motion.span>
          <motion.span
            {...float(0.15)}
            className="select-none text-[5.5rem] font-black leading-none text-transparent md:text-[7rem] bg-gradient-to-br from-violet-200 to-pink-200 bg-clip-text drop-shadow-[0_10px_30px_rgba(0,0,0,0.35)]"
          >
            0
          </motion.span>
          <motion.span
            {...float(0.3)}
            className="select-none text-7xl font-black leading-none text-transparent md:text-8xl bg-gradient-to-br from-white to-slate-300 bg-clip-text drop-shadow-[0_10px_30px_rgba(0,0,0,0.35)]"
          >
            4
          </motion.span>
        </div>

        {/* Heading + copy */}
        <motion.h1
          className="mb-2 text-2xl font-semibold text-white md:text-3xl"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
        >
          Page not found
        </motion.h1>
        <motion.p
          className="mb-6 max-w-xl text-white/70"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          The page you’re looking for doesn’t exist or has moved. Let’s get you
          back on track.
        </motion.p>

        {/* Actions */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-3"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
        >
          <Button asChild className="gap-2">
            <Link to={path.home}>
              <Home className="size-4" />
              Go home
            </Link>
          </Button>
          <Button variant="secondary" className="gap-2" onClick={() => nav(-1)}>
            <ArrowLeft className="size-4" />
            Go back
          </Button>
        </motion.div>

        {/* Subtle hover tilt on the whole block */}
        <motion.div
          className="absolute inset-0 -z-10"
          initial={false}
          whileHover={{ rotateZ: -0.3, scale: 1.005 }}
          transition={{ type: "spring", stiffness: 150, damping: 12 }}
        />
      </div>
    </div>
  );
}
