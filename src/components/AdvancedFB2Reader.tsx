import { Book } from "@/interfaces/Book";
import { MixedContent, TagElement, TagValue } from "@/interfaces/InlineContent";
import Page from "@/layout/Page";
import { isObject } from "@/lib/utils";
import useActiveBookStore from "@/state/useActiveBookStore";
import React, { useState } from "react";

export default function AdvancedFB2Reader() {
  const [pageIndex, setPageIndex] = useState(0);
  const book = useActiveBookStore((state) => state.book)!;
  const flattenBook = flatten(book);
  const processedJSX = processDataToJSX(flattenBook);
  const pages = generatePagesJSX(processedJSX, 2);


  function flatten(book: Book) {
    const result: MixedContent[] = [];
    book.body.forEach(body => {
      body.section.forEach(section => {
        if (Array.isArray(section.$value) && section.$value.length > 0) {
          section.$value.forEach(sectionValue => {
            if (isObject(sectionValue)) {
              Object.entries(sectionValue).forEach(([_, v]) => {
                if (v && v?.$value) {
                  if (typeof v.$value === 'string') {
                    result.push(v.$value)
                  } else if (Array.isArray(v.$value)) {
                    v.$value.forEach(item =>
                      result.push(item)
                    )
                  }
                }
              })
            }
          })
        }
      })
    })
    return result;
  }

  function processDataToJSX(dataArr: MixedContent[]) {
    return dataArr.map((item, index) => {
      if (typeof item === 'string') {
        return <span key={index}>{item}</span>;
      }
      if (typeof item === 'object' && item !== null) {
        const tagName = Object.keys(item)[0];
        const content = item[tagName];
        if (Array.isArray(content)) {
          const innerContent = content.map((innerItem, _) => {
            if (innerItem && innerItem.$value && Array.isArray(innerItem.$value)) {
              return innerItem.$value.join(" ");
            }
            return null;
          }).join(" ");
          return React.createElement(tagName, { key: index }, innerContent);
        }
      }
      return null;
    });
  };

  function generatePagesJSX(nodes: (JSX.Element | null)[], nodesPerPage: number) {
    const pages = [];
    for (let i = 0; i < nodes.length; i += nodesPerPage) {
      pages.push(nodes.slice(i, i + nodesPerPage));
    }
    return pages;
  };

  const nextPage = () => {
    if (pageIndex < pages.length - 1) {
      setPageIndex(pageIndex + 1);
    }
  };

  const prevPage = () => {
    if (pageIndex > 0) {
      setPageIndex(pageIndex - 1);
    }
  };


  return (
    <>
      <section className="grid grid-cols-2 gap-4 max-h-full">
        <Page content={pages[pageIndex]} />
        <Page content={pages[pageIndex]} />
      </section>
    </>
  );
}
