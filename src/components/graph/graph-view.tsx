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
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { ArticleNode } from "@/components/graph/graph-node";
import type { Node, Edge } from "@xyflow/react";

const nodeTypes = { article: ArticleNode };

interface GraphViewProps {
  initialNodes: Node[];
  initialEdges: Edge[];
}

export function GraphView({ initialNodes, initialEdges }: GraphViewProps) {
  // 主题只有挂载后才能确定（SSR 阶段读不到 localStorage / 系统偏好），
  // 直接用 resolvedTheme 会让 ReactFlow 的内部属性出现水合不一致，
  // 因此先渲染同尺寸占位，挂载后再渲染真正的图谱。
  const [mounted, setMounted] = useState(false);
  // 必须用 resolvedTheme：用户选择"跟随系统"时 theme === "system"，
  // 用 theme 判断会让深色系统下的图谱渲染成浅色。
  const { resolvedTheme } = useTheme();
  useEffect(() => setMounted(true), []);

  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  if (!mounted) {
    return (
      <div className="h-[70vh] min-h-[520px] w-full rounded-card border border-hairline bg-surface" />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <div className="h-[70vh] min-h-[520px] w-full overflow-hidden rounded-card border border-hairline bg-surface">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.3}
        maxZoom={1.5}
        colorMode={isDark ? "dark" : "light"}
        proOptions={{ hideAttribution: true }}
      >
        <Background color={isDark ? "#232833" : "#e6e7eb"} gap={20} />
        <Controls
          className="overflow-hidden rounded-control border border-hairline"
          position="bottom-right"
        />
        <MiniMap
          className="overflow-hidden rounded-control border border-hairline"
          nodeColor={isDark ? "#2a3040" : "#e6e7eb"}
          maskColor={isDark ? "rgb(10 11 14 / 0.65)" : "rgb(255 255 255 / 0.6)"}
        />
      </ReactFlow>
    </div>
  );
}
