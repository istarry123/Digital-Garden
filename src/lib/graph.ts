import type { Post, GraphNode, GraphEdge, KnowledgeGraph } from "@/types";
import { getAllPosts } from "@/lib/posts";

function postToNode(post: Post): GraphNode {
  return {
    slug: post.slug,
    title: post.title,
    date: post.date,
    category: post.category,
    tags: post.tags,
    parent: post.relations.parent,
    children: [...post.relations.children],
    related: [...post.relations.related],
  };
}

/**
 * Build the full knowledge graph from all posts.
 * Automatically fills in reverse relations:
 *   A.parent = B   →  B.children += A
 *   A.related = B  →  B.related += A (if missing)
 */
export async function buildKnowledgeGraph(): Promise<KnowledgeGraph> {
  const posts = await getAllPosts();
  const nodes = new Map<string, GraphNode>();
  const edges: GraphEdge[] = [];
  const roots: string[] = [];

  // First pass: create all nodes
  for (const post of posts) {
    nodes.set(post.slug, postToNode(post));
  }

  // Second pass: fill reverse relations + build edges
  for (const post of posts) {
    // parent → child
    if (post.relations.parent) {
      const parent = nodes.get(post.relations.parent);
      if (parent && !parent.children.includes(post.slug)) {
        parent.children.push(post.slug);
      }
      if (parent) {
        edges.push({
          source: post.relations.parent,
          target: post.slug,
          type: "parent_child",
        });
      }
    } else {
      roots.push(post.slug);
    }

    // related → bidirectional
    for (const targetSlug of post.relations.related) {
      edges.push({ source: post.slug, target: targetSlug, type: "related" });
      const target = nodes.get(targetSlug);
      if (target && !target.related.includes(post.slug)) {
        target.related.push(post.slug);
      }
    }
  }

  return { nodes, edges, roots };
}

interface FlowNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: {
    slug: string;
    title: string;
    category: string[];
    tags: string[];
  };
}

interface FlowEdge {
  id: string;
  source: string;
  target: string;
  type: "smoothstep" | "default";
  animated: boolean;
  style: {
    stroke: string;
    strokeWidth: number;
    strokeDasharray?: string;
  };
}

/**
 * Simple vertical tree layout for parent_child relations.
 * Roots at top, children below. Related edges drawn between existing positions.
 */
function layoutTree(graph: KnowledgeGraph): void {
  const { nodes, roots } = graph;
  const visited = new Set<string>();
  const COL_GAP = 240;
  const ROW_GAP = 140;
  const pos = new Map<string, { x: number; y: number }>();

  function layoutSubtree(slug: string, depth: number, startX: number): number {
    if (visited.has(slug)) return startX;
    visited.add(slug);
    const node = nodes.get(slug);
    if (!node) return startX;

    // Layout children first
    let childX = startX;
    for (const childSlug of node.children) {
      childX = layoutSubtree(childSlug, depth + 1, childX);
    }

    // Center over children or place at startX
    const x =
      node.children.length > 0 ? (startX + childX - COL_GAP) / 2 : startX;
    const y = depth * ROW_GAP;
    pos.set(slug, { x, y });

    return Math.max(childX, startX + COL_GAP);
  }

  let x = 0;
  for (const root of roots) {
    x = layoutSubtree(root, 0, x);
  }

  // Store positions on nodes (temporary, consumed by toReactFlowWithLayout)
  for (const [slug, p] of pos) {
    const node = nodes.get(slug);
    if (node) {
      ;(node as GraphNode & { _x: number; _y: number })._x = p.x;
      ;(node as GraphNode & { _x: number; _y: number })._y = p.y;
    }
  }
}

export function toReactFlowWithLayout(graph: KnowledgeGraph): {
  nodes: FlowNode[];
  edges: FlowEdge[];
} {
  layoutTree(graph);

  const flowNodes: FlowNode[] = Array.from(graph.nodes.values()).map((node) => ({
    id: node.slug,
    type: "article",
    position: {
      x: (node as GraphNode & { _x?: number })._x ?? 0,
      y: (node as GraphNode & { _y?: number })._y ?? 0,
    },
    data: {
      slug: node.slug,
      title: node.title,
      category: node.category,
      tags: node.tags,
    },
  }));

  const flowEdges: FlowEdge[] = graph.edges.map((edge, idx) => ({
    id: `${edge.source}→${edge.target}→${idx}`,
    source: edge.source,
    target: edge.target,
    type: (edge.type === "parent_child" ? "smoothstep" : "default") as
      | "smoothstep"
      | "default",
    animated: edge.type === "related",
    style: {
      stroke: edge.type === "parent_child" ? "#636d83" : "#58a6ff",
      strokeWidth: edge.type === "parent_child" ? 2 : 1,
      strokeDasharray: edge.type === "related" ? "5 5" : undefined,
    },
  }));

  return { nodes: flowNodes, edges: flowEdges };
}
