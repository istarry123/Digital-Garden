import type { ExploreEntry } from "@/types";

const MOOD_MAP: Record<string, { emoji: string; label: string }> = {
  excited: { emoji: "🎉", label: "Excited" },
  happy: { emoji: "😊", label: "Happy" },
  thoughtful: { emoji: "🤔", label: "Thoughtful" },
  tired: { emoji: "😴", label: "Tired" },
  productive: { emoji: "💪", label: "Productive" },
  learning: { emoji: "📚", label: "Learning" },
  curious: { emoji: "🧐", label: "Curious" },
  grateful: { emoji: "🙏", label: "Grateful" },
  creative: { emoji: "🎨", label: "Creative" },
  focused: { emoji: "🎯", label: "Focused" },
  chill: { emoji: "🌿", label: "Chill" },
  inspired: { emoji: "✨", label: "Inspired" },
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function ExploreCard({ entry }: { entry: ExploreEntry }) {
  const mood = MOOD_MAP[entry.mood] ?? { emoji: "💬", label: entry.mood };

  return (
    <article className="rounded-xl border border-neutral-200 bg-white p-5 transition-shadow hover:shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
      {/* Header: mood + date */}
      <div className="mb-3 flex items-center gap-2">
        <span
          className="inline-flex items-center gap-1 rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400"
          title={mood.label}
        >
          <span aria-hidden="true">{mood.emoji}</span>
          {mood.label}
        </span>
        <span aria-hidden="true" className="text-neutral-300 dark:text-neutral-600">
          &middot;
        </span>
        <time
          dateTime={entry.date}
          className="text-xs text-neutral-400 dark:text-neutral-500"
        >
          {formatDate(entry.date)}
        </time>
      </div>

      {/* Body: rendered Markdown content */}
      <div
        className="prose prose-neutral prose-sm max-w-none text-neutral-700 dark:prose-invert dark:text-neutral-300"
        dangerouslySetInnerHTML={{ __html: entry.content }}
      />

      {/* Footer: tags */}
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
    </article>
  );
}
