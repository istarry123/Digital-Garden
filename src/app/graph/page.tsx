import type { Metadata } from "next";
import { buildKnowledgeGraph, toReactFlowWithLayout } from "@/lib/graph";
import { GraphView } from "@/components/graph/graph-view";
import { Container } from "@/components/layout/container";
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
    <Container as="main" width="wide" className="py-20">
      <header className="mb-10 border-b border-hairline pb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          {graphPage.title}
        </h1>
        <p className="mt-3 max-w-2xl leading-relaxed text-muted">
          {graphPage.description}
        </p>
        <p className="mt-5 flex flex-wrap items-center gap-2.5 font-mono text-xs text-faint">
          <span>{nodes.length} 个节点</span>
          <span aria-hidden="true" className="h-3 w-px bg-hairline-strong" />
          <span>{edges.length} 条关系</span>
        </p>
      </header>

      <GraphView initialNodes={nodes} initialEdges={edges} />
    </Container>
  );
}
