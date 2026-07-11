import type { TimelineEntry } from "@/types";

export function TimelineItem({ entry }: { entry: TimelineEntry }) {
  return (
    <div className="group relative pl-10 pb-14 last:pb-0">
      {/* Vertical line connector (from dot downward) */}
      <div
        className="absolute left-[10px] top-6 h-full w-px bg-neutral-200 group-last:hidden dark:bg-neutral-700"
        aria-hidden="true"
      />

      {/* Year dot on the vertical line */}
      <div
        className="absolute left-0 top-5 flex h-[22px] w-[22px] items-center justify-center"
        aria-hidden="true"
      >
        <div className="h-3 w-3 rounded-full border-2 border-neutral-300 bg-white dark:border-neutral-600 dark:bg-neutral-950" />
      </div>

      {/* Year label — sits directly to the right of the dot */}
      <span className="mb-2 block text-sm font-bold tracking-tight text-blue-600 dark:text-blue-400">
        {entry.year}
      </span>

      {/* Content card */}
      <div className="rounded-xl border border-neutral-200 bg-white p-5 transition-shadow hover:shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <h3 className="mb-1 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
          {entry.title}
        </h3>
        <p className="mb-3 text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
          {entry.description}
        </p>

        {entry.content && (
          <div
            className="prose prose-sm prose-neutral max-w-none text-neutral-600 dark:prose-invert dark:text-neutral-400"
            dangerouslySetInnerHTML={{ __html: entry.content }}
          />
        )}

        {entry.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {entry.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-md bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
