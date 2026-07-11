// === Post ===
export interface PostRelations {
  parent: string | null;
  related: string[];
  children: string[];
}

export interface Post {
  slug: string;
  title: string;
  date: string;
  summary: string;
  tags: string[];
  readingTime: number;
  cover?: string;
  category: string[];
  relations: PostRelations;
}

// === TOC ===
export interface TocItem {
  level: 2 | 3;
  text: string;
  slug: string;
}

// === Activity (homepage mock data) ===
export type ActivityType = "star" | "commit" | "issue" | "pr";

export interface Activity {
  id: string;
  type: ActivityType;
  repo: string;
  description: string;
  url: string;
  date: string;
}

// === Explore ===
export interface ExploreEntry {
  slug: string;
  date: string;
  mood: string;
  tags: string[];
  content: string;
}

// === Knowledge Graph ===
export interface GraphNode {
  slug: string;
  title: string;
  date: string;
  category: string[];
  tags: string[];
  parent: string | null;
  children: string[];
  related: string[];
}

export interface GraphEdge {
  source: string;
  target: string;
  type: "parent_child" | "related";
}

export interface KnowledgeGraph {
  nodes: Map<string, GraphNode>;
  edges: GraphEdge[];
  roots: string[];
}

// === Timeline ===
export interface TimelineEntry {
  slug: string;
  year: number;
  title: string;
  description: string;
  tags: string[];
  content: string;
}

export interface Timeline {
  entries: TimelineEntry[];
  byYear: Map<number, TimelineEntry[]>;
  years: number[];
  tagIndex: Map<string, string[]>;
}
