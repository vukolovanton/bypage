import { Book } from "@/interfaces/Book"
import { MixedContent } from "@/interfaces/InlineContent";
import { isObject } from "@/lib/utils";
import React, { useState } from "react";

function useFB2Reader(book: Book) {
  const [pageIndex, setPageIndex] = useState(0);
  const flattenBook = flatten(book);
  const processedJSX = processDataToJSX(flattenBook);
  const pages = generatePagesJSX(processedJSX, 5);

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
        return <p className="p-1" key={index}>{item}</p>;
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

  return {
    nextPage,
    prevPage,
    pages,
    pageIndex
  }
}

export { useFB2Reader }
