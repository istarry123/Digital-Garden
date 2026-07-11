"use client";

import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useTheme } from "next-themes";
import { ArticleNode } from "@/components/graph/graph-node";
import type { Node, Edge } from "@xyflow/react";

const nodeTypes = { article: ArticleNode };

interface GraphViewProps {
  initialNodes: Node[];
  initialEdges: Edge[];
}

export function GraphView({ initialNodes, initialEdges }: GraphViewProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  return (
    <div className="h-[600px] w-full rounded-xl border border-neutral-200 dark:border-neutral-800">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        minZoom={0.3}
        maxZoom={1.5}
        colorMode={isDark ? "dark" : "light"}
        proOptions={{ hideAttribution: true }}
      >
        <Background color={isDark ? "#30363d" : "#e5e7eb"} gap={20} />
        <Controls
          className="rounded-lg border-neutral-200 dark:border-neutral-700"
          position="bottom-right"
        />
        <MiniMap
          className="rounded-lg border-neutral-200 dark:border-neutral-700"
          nodeColor={isDark ? "#30363d" : "#e5e7eb"}
          maskColor={isDark ? "rgb(0 0 0 / 0.5)" : "rgb(0 0 0 / 0.1)"}
        />
      </ReactFlow>
    </div>
  );
}
