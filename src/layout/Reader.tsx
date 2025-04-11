import useActiveBookStore from "@/state/useActiveBookStore";
import { Controls } from "./Controls";
import Page from "./Page";
import { useState } from "react";
import { flattenBook } from "@/lib/utils";

export default function Reader() {
  const PAGE_SIZE = 10;
  const [pageIndex, setPageIndex] = useState(0);
  const book = useActiveBookStore(state => state.book);

  function renderNode(node, key = 0) {
    if (typeof node === 'string') {
      return node;
    }
    const [tag, childrenArray] = Object.entries(node)[0];
    if (!Array.isArray(childrenArray)) return;
    console.log({ childrenArray })
    const children = childrenArray.flatMap((child, index) => {
      if (typeof child === 'string') return child;
      if (child.$value) return child.$value.map((v, i) => renderNode(v, `${index}-${i}`));
      return renderNode(child, index);
    });
    switch (tag) {
      case 'a':
        return <a key={key} href={childrenArray[0].href}>{children}</a>;
      case 'strong':
        return <strong key={key}>{children}</strong>;
      case 'emphasis':
        return <em key={key}>{children}</em>;
      default:
        return <span key={key}>{children}</span>; // fallback
    }
  }

  function Paragraph({ content }) {
    return (
      <p>
        {content.content.map((item, idx) => renderNode(item, idx))}
      </p>
    );
  }
  const flattenedContent = flattenBook(book);
  const renderedParagraphs = flattenedContent.map((node, idx) => (
    <Paragraph key={idx} content={node} />
  ));

  const pageContent = renderedParagraphs.slice(
    pageIndex * PAGE_SIZE,
    (pageIndex + 1) * PAGE_SIZE
  );

  return (
    <>
      <section className="grid grid-cols-2 gap-4 max-h-full">
        <Page content={pageContent} />
        <Page content={pageContent} />
      </section>
      <Controls setPageIndex={setPageIndex} />
    </>
  )
}
