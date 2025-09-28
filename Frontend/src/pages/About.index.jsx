import MovieRowRender from "@/components/movies/MovieRowRender";
import MoviesSimilar from "@/components/movies/MoviesSimilar";
import { useMoviesSlider } from "@/hooks/useMovies";
import { motion } from "framer-motion";

export default function AboutApp() {
  const repoUrl = "https://github.com/DavitNazarov/Movies";

  const { popular, drama, fiction, loading } = useMoviesSlider();
  const features = [
    "Browse popular films with pagination",
    "Responsive grid cards with posters and ratings",
    "Genre views (e.g. Drama)",
    "Client-side route for each list page",
    "Content filtering options",
  ];

  const backend = [
    "Node.js + Express API",
    "MongoDB with Mongoose models",
    "JWT authentication and httpOnly cookies",
    "Rate limiting and CORS configuration",
    "Email service for auth flows (verification / reset)",
  ];

  const tech = {
    frontend: ["React", "Vite/CRA", "Tailwind CSS"],
    backend: ["Node.js", "Express"],
    database: ["MongoDB"],
    email: ["SendGrid / Mailtrap / Nodemailer"],
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
  };

  const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
  };

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="mx-auto max-w-5xl px-4 py-12 text-zinc-900 dark:text-zinc-100"
    >
      <motion.header
        variants={fadeUp}
        initial="hidden"
        animate="show"
        className="mb-8"
      >
        <h1 className="text-3xl font-semibold">Movies App</h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-300">
          A MERN portfolio project to explore films, built with a clean
          component architecture and a lightweight API layer.
        </p>
        <motion.a
          className="mt-3 inline-flex items-center gap-2 rounded-xl border border-zinc-200 px-3 py-2 text-sm underline-offset-4 transition hover:underline dark:border-zinc-800"
          href={repoUrl}
          target="_blank"
          rel="noreferrer"
          whileHover={{ y: -2, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          GitHub repository
        </motion.a>
      </motion.header>

      <section className="grid gap-8 md:grid-cols-2">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
        >
          <h2 className="text-xl font-semibold">Core features</h2>
          <motion.ul
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="mt-3 list-disc space-y-2 pl-5 text-zinc-700 dark:text-zinc-300"
          >
            {features.map((f) => (
              <motion.li key={f} variants={item}>
                {f}
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
        >
          <h2 className="text-xl font-semibold">Backend capabilities</h2>
          <motion.ul
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="mt-3 list-disc space-y-2 pl-5 text-zinc-700 dark:text-zinc-300"
          >
            {backend.map((f) => (
              <motion.li key={f} variants={item}>
                {f}
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>
      </section>

      <motion.section
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="mt-8 grid gap-8 md:grid-cols-3"
      >
        <div>
          <h3 className="font-medium">Frontend</h3>
          <motion.ul
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="mt-2 list-disc pl-5 text-sm text-zinc-600 dark:text-zinc-400"
          >
            {tech.frontend.map((t) => (
              <motion.li key={t} variants={item}>
                {t}
              </motion.li>
            ))}
          </motion.ul>
        </div>
        <div>
          <h3 className="font-medium">Backend</h3>
          <motion.ul
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="mt-2 list-disc pl-5 text-sm text-zinc-600 dark:text-zinc-400"
          >
            {tech.backend.map((t) => (
              <motion.li key={t} variants={item}>
                {t}
              </motion.li>
            ))}
          </motion.ul>
        </div>
        <div>
          <h3 className="font-medium">Database & Email</h3>
          <motion.ul
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="mt-2 list-disc pl-5 text-sm text-zinc-600 dark:text-zinc-400"
          >
            {tech.database.map((t) => (
              <motion.li key={t} variants={item}>
                {t}
              </motion.li>
            ))}
            {tech.email.map((t) => (
              <motion.li key={t} variants={item}>
                {t}
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </motion.section>

      <motion.section
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="mt-10"
      >
        <h2 className="text-xl font-semibold">Architecture</h2>
        <p className="mt-3 text-zinc-700 dark:text-zinc-300">
          React client consumes a Node/Express backend. Data persistence via
          MongoDB. The UI is componentised (MovieCard, MovieGrid, Pagination)
          and stateful hooks manage fetching and pagination. Environment
          variables keep secrets separate.
        </p>
      </motion.section>

      <motion.section
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="mt-10"
      >
        <h2 className="text-xl font-semibold">Run locally</h2>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-zinc-700 dark:text-zinc-300">
          <motion.li
            variants={item}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            Clone the repo and install dependencies: <code>npm install</code>
          </motion.li>
          <motion.li
            variants={item}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            Set environment variables for both Backend and Frontend (API keys,
            DB URI).
          </motion.li>
          <motion.li
            variants={item}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            Start both servers in one command: <code>npm run dev</code>
          </motion.li>
        </ol>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          Scripts: <code>dev</code> runs backend with nodemon and the frontend
          client concurrently.
        </p>
      </motion.section>

      <motion.section
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="mt-10"
      >
        <h2 className="text-xl font-semibold">Credits</h2>
        <p className="mt-3 text-zinc-700 dark:text-zinc-300">
          Film data and images provided by third‑party movie APIs (e.g. TMDB).
          This product uses the TMDB API but is not endorsed or certified by
          TMDB.
        </p>
      </motion.section>
    </motion.main>
  );
}
