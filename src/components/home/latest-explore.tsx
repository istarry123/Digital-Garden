import Link from "next/link";
import type { ActivityType } from "@/types";
import { mockActivities } from "@/lib/mock-data";
import { blogConfig } from "@/config/blog.config";

const explorePage = blogConfig.pages.explore;

const BADGE: Record<ActivityType, { label: string; className: string }> = {
  star: {
    label: "Star",
    className:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  },
  commit: {
    label: "Commit",
    className:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  },
  issue: {
    label: "Issue",
    className:
      "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  },
  pr: {
    label: "PR",
    className:
      "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  },
};

function formatRelativeDate(dateStr: string): string {
  const then = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - then.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 30) return `${diffDays} days ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
}

export function LatestExplore() {
  const latest = mockActivities.slice(0, 5);

  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-2xl">
        <div className="mb-10 flex items-end justify-between">
          <h2 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
            {explorePage.latestHeading}
          </h2>
          <Link
            href="/explore"
            className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
          >
            {explorePage.viewAll} &rarr;
          </Link>
        </div>

        <ul className="space-y-1">
          {latest.map((activity) => {
            const badge = BADGE[activity.type];
            return (
              <li key={activity.id}>
                <a
                  href={activity.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-4 rounded-lg px-3 py-2.5 transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-900"
                >
                  <span
                    className={`mt-0.5 shrink-0 rounded px-1.5 py-0.5 text-xs font-medium ${badge.className}`}
                  >
                    {badge.label}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm leading-snug text-neutral-800 dark:text-neutral-200">
                      {activity.description}
                    </span>
                    <span className="block text-xs text-neutral-500 dark:text-neutral-400">
                      {activity.repo}
                    </span>
                  </span>
                  <time
                    dateTime={activity.date}
                    className="shrink-0 text-xs text-neutral-400 dark:text-neutral-500"
                  >
                    {formatRelativeDate(activity.date)}
                  </time>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
