import PageButton from "../ui/PageButton";

export default function Pagination({ page, totalPages, setPage, windowPages }) {
  return (
    <nav className="mt-8 flex items-center justify-center gap-2">
      <PageButton
        disabled={page <= 1}
        onClick={() => setPage((p) => Math.max(1, p - 1))}
      >
        Prev
      </PageButton>

      {windowPages[0] > 1 && (
        <>
          <PageButton onClick={() => setPage(1)} active={page === 1}>
            1
          </PageButton>
          {windowPages[0] > 2 && <span className="px-1 text-zinc-400">…</span>}
        </>
      )}

      {windowPages.map((p) => (
        <PageButton key={p} onClick={() => setPage(p)} active={p === page}>
          {p}
        </PageButton>
      ))}

      {windowPages.at(-1) < totalPages && (
        <>
          {windowPages.at(-1) < totalPages - 1 && (
            <span className="px-1 text-zinc-400">…</span>
          )}
          <PageButton
            onClick={() => setPage(totalPages)}
            active={page === totalPages}
          >
            {totalPages}
          </PageButton>
        </>
      )}

      <PageButton
        disabled={page >= totalPages}
        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
      >
        Next
      </PageButton>
    </nav>
  );
}
