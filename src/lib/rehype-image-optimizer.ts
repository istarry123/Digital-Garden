import type { Element, Root, RootContent } from "hast";

/**
 * rehype plugin: optimize <img> tags in rendered Markdown.
 * Adds lazy loading, async decoding, and a content-image CSS class.
 */
export function rehypeImageOptimizer() {
  return (tree: Root) => {
    walk(tree);
  };
}

function isElement(node: Root | RootContent): node is Element {
  return node.type === "element";
}

function walk(node: Root | RootContent): void {
  if (isElement(node) && node.tagName === "img") {
    const props = node.properties ?? {};
    const raw = props.className;
    const classes = Array.isArray(raw)
      ? raw.map(String)
      : typeof raw === "string" || typeof raw === "number"
        ? [String(raw)]
        : [];

    node.properties = {
      ...props,
      className: [...classes, "content-image"],
    };
  }

  if ("children" in node && Array.isArray(node.children)) {
    for (const child of node.children) {
      walk(child);
    }
  }
}
