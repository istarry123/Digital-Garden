import type { Metadata } from "next";
import { buildKnowledgeGraph, toReactFlowWithLayout } from "@/lib/graph";
import { GraphView } from "@/components/graph/graph-view";
import { blogConfig } from "@/config/blog.config";

const { site, pages } = blogConfig;
const { graph: graphPage } = pages;

export const metadata: Metadata = {
  title: graphPage.title,
  description: graphPage.description,
  openGraph: {
    title: `${graphPage.title} | ${site.name}`,
    description: graphPage.description,
    url: `${site.url}/graph`,
  },
};

export default async function GraphPage() {
  const graph = await buildKnowledgeGraph();
  const { nodes, edges } = toReactFlowWithLayout(graph);

  return (
    <main className="mx-auto max-w-7xl px-6 py-20">
      <h1 className="mb-10 text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
        {graphPage.title}
      </h1>

      <GraphView initialNodes={nodes} initialEdges={edges} />
    </main>
  );
}
