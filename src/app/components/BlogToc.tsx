interface BlogTocProps {
  entries: { id: string; text: string }[];
}

export function BlogToc({ entries }: BlogTocProps) {
  if (entries.length < 3) return null;

  return (
    <nav
      aria-label="Table of contents"
      className="mb-10 rounded-2xl border border-gray-200 bg-gray-50 p-5"
    >
      <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">In this article</p>
      <ul className="space-y-2">
        {entries.map((entry) => (
          <li key={entry.id}>
            <a
              href={`#${entry.id}`}
              className="text-sm font-semibold text-gray-700 hover:text-primary transition-colors"
            >
              {entry.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
