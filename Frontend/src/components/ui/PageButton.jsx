export default function PageButton({ active, children, onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={[
        "px-3 py-1.5 rounded-lg text-sm border transition-colors",
        active
          ? "bg-black text-white dark:bg-white dark:text-black border-transparent"
          : "bg-white text-black dark:bg-zinc-900 dark:text-zinc-100 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800",
        disabled ? "opacity-50 cursor-not-allowed" : "",
      ].join(" ")}
    >
      {children}
    </button>
  );
}
