import useActiveBookStore from "@/state/useActiveBookStore";
import { Controls } from "./Controls";
import Page from "./Page";
import { useState } from "react";
import { flattenBook } from "@/lib/utils";
import { InlineContent, TagValue } from "@/interfaces/InlineContent";

export default function Reader() {
  const PAGE_SIZE = 10;
  const [pageIndex, setPageIndex] = useState(0);
  const book = useActiveBookStore((state) => state.book);

  function isTagValue(node: any): node is TagValue {
    return typeof node === "object" && node !== null && "$value" in node;
  }

  function renderNode(node: InlineContent, key: string | number = 0): React.ReactNode {
    // If node is a plain string, return it directly.
    if (typeof node === "string") return node;
    // Get the first tag entry from the node.
    const entries = Object.entries(node);
    if (entries.length === 0) return null; // Safety: no tag present
    const [[tag, tagValues]] = entries;
    if (!Array.isArray(tagValues)) return null; // Safety: expect an array
    // Produce children by recursively rendering each content element.
    const children = tagValues.flatMap((child, childIndex) => {
      if (typeof child === "string") return [child];
      if (isTagValue(child) && child.$value) {
        return child.$value.map((v, valueIndex) =>
          renderNode(v, `${childIndex}-${valueIndex}`)
        );
      }
      console.warn("Unexpected inline content format", child);
      return [renderNode(child as InlineContent, childIndex)];
    });
    // Depending on the tag, wrap the children in an appropriate element.
    switch (tag) {
      case "a": {
        // Extract the href from the first tag value that has one.
        const tagWithHref = tagValues.find(
          (child) =>
            typeof child !== "string" && typeof child.href === "string"
        );
        const href = tagWithHref?.href || "#"; // Use a fallback if none found.
        return (
          <a key={key} href={href}>
            {children}
          </a>
        );
      }
      case "strong":
        return <strong key={key}>{children}</strong>;
      case "emphasis":
        return <em key={key}>{children}</em>;
      default:
        return <p key={key}>{children}</p>;
    }
  }

  function Paragraph({
    content,
  }: {
    content: {
      tag: string;
      content?: InlineContent[] | undefined;
    };
  }) {
    if (content.content) {
      return <p>{content.content.map((item, idx) => renderNode(item, idx))}</p>;
    }
  }
  const flattenedContent = flattenBook(book);
  const renderedParagraphs = flattenedContent.map((node, idx) => (
    <Paragraph key={idx} content={node} />
  ));

  const pageContent = renderedParagraphs.slice(
    pageIndex * PAGE_SIZE,
    (pageIndex + 1) * PAGE_SIZE
  );
  console.log(renderedParagraphs)

  return (
    <>
      <section className="grid grid-cols-2 gap-4 max-h-full">
        <Page content={pageContent} />
        <Page content={pageContent} />
      </section>
      <Controls setPageIndex={setPageIndex} />
    </>
  );
}
