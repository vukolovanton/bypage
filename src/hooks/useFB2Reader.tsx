import { Book } from "@/interfaces/Book"
import { isObject } from "@/lib/utils";
import React, { useState } from "react";

function useFB2Reader(book: Book) {
  const [pageIndex, setPageIndex] = useState(0);
  const [startIndex, setStartIndex] = useState(0);
  const [translatedChunks, setTranslatedChunks] = useState<Array<string>>([]);

  const flattenBook = flatten(book);
  const processedJSX = processDataToJSX(flattenBook);
  const pages = generatePagesJSX(processedJSX, 5);

  React.useEffect(() => {
    if (Array.isArray(flattenBook) && flattenBook.length > 0) {
      console.log('123')
    }
  }, [flattenBook])

  const isComplete = startIndex >= flattenBook.length;

  function flatten(book: Book) {
    const result: string[] = [];
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
                    v.$value.forEach(item => {
                      if (typeof item === 'string') {
                        result.push(item)
                      } else {
                        if (item["emphasis"] && Array.isArray(item["empasis"]) && item["empasis"][0]) {
                          result.push(item["emphasis"][0].$value[0]);
                        }
                        if (item["a"] && Array.isArray(item["a"]) && item["a"][0]) {
                          result.push(item["a"][0].$value[0]);
                        }
                      }
                    }
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

  function processDataToJSX(dataArr: string[]) {
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


  async function translate(text: any) {
    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "model": "gemma3:12b",
        "prompt": `Translate this text from english to russian: "${text}"`,
        "stream": false
      })
    });
    const data = await response.json();
  }

  const handleSlice = () => {
    if (isComplete) {
      console.log("Already complete. No action taken.");
      return;
    }
    console.log(`Button clicked. Current start index: ${startIndex}`);
    const endIndex = startIndex + 5;
    const chunk = flattenBook.slice(startIndex, endIndex);
    setStartIndex(endIndex);
    setTranslatedChunks(prev => [...prev, ...chunk]);
  };

  return {
    nextPage,
    prevPage,
    pages: {
      original: pages,
      translated: pages
    },
    pageIndex
  }
}

export { useFB2Reader }
