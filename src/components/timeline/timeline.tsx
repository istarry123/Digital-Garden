import { TimelineItem } from "@/components/timeline/timeline-item";
import type { TimelineEntry } from "@/types";

export function Timeline({ entries }: { entries: TimelineEntry[] }) {
  if (entries.length === 0) {
    return (
      <p className="text-neutral-500 dark:text-neutral-400">
        No timeline entries yet.
      </p>
    );
  }

  return (
    <div className="relative">
      {entries.map((entry) => (
        <TimelineItem key={entry.slug} entry={entry} />
      ))}
    </div>
  );
}
