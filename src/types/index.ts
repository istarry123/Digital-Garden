export interface Post {
  slug: string;
  title: string;
  date: string;
  summary: string;
  tags: string[];
  readingTime: number;
  cover?: string;
}

export interface TocItem {
  level: 2 | 3;
  text: string;
  slug: string;
}

export type ActivityType = "star" | "commit" | "issue" | "pr";

export interface Activity {
  id: string;
  type: ActivityType;
  repo: string;
  description: string;
  url: string;
  date: string;
}

export interface ExploreEntry {
  slug: string;
  date: string;
  mood: string;
  tags: string[];
  content: string;
}
