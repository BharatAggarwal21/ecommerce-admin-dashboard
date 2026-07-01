const Pagination = ({ page, totalPages, onChange }) => {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center gap-1 justify-end mt-4">
      <button
        onClick={() => onChange(Math.max(page - 1, 1))}
        disabled={page === 1}
        className="px-3 py-1.5 text-sm rounded-md border border-slate-300 disabled:opacity-40 hover:bg-slate-100"
      >
        Prev
      </button>
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={`px-3 py-1.5 text-sm rounded-md border ${
            p === page
              ? "bg-slate-900 text-white border-slate-900"
              : "border-slate-300 hover:bg-slate-100"
          }`}
        >
          {p}
        </button>
      ))}
      <button
        onClick={() => onChange(Math.min(page + 1, totalPages))}
        disabled={page === totalPages}
        className="px-3 py-1.5 text-sm rounded-md border border-slate-300 disabled:opacity-40 hover:bg-slate-100"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
