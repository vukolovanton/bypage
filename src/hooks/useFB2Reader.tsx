import { Book } from "@/interfaces/Book"
import { getFileName, isObject } from "@/lib/utils";
import React, { useEffect, useMemo, useState } from "react";
import { invoke } from '@tauri-apps/api/core';
import { toast } from "sonner"
import { readTextFile, BaseDirectory, mkdir, writeTextFile, exists } from '@tauri-apps/plugin-fs';

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
                      if (item["emphasis"] && Array.isArray(item["emphasis"]) && item["emphasis"][0]) {
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
      const content: any[] = item[tagName];
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

function useFB2Reader(book: Book, path: string) {
  const [pageIndex, setPageIndex] = useState(0);
  const [translatedPages, setTranslatedPages] = useState<(JSX.Element | null)[][]>([]);
  const flattenBook = useMemo(() => flatten(book), []);
  const processedJSX = useMemo(() => processDataToJSX(flattenBook), []);
  const pages = generatePagesJSX(processedJSX, 5);

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

  async function writeTranslatedBookToAFile(translated: string[]) {
    const filename = getFileName(path);
    const data = JSON.stringify({
      data: translated
    });
    try {
      await mkdir('translated', { baseDir: BaseDirectory.AppData, recursive: true })
      await writeTextFile(`translated/${filename}.json`, data, {
        baseDir: BaseDirectory.AppConfig,
      });
      toast.success("Translated book successfully saved to a file")
    } catch (err) {
      toast.error(JSON.stringify(err));
    }
  }

  async function translate(book: string[]) {
    const { isTranslated, fullPath } = await checkIfBookAlreadyTranslated();
    if (isTranslated) {
      const translated = await readTextFile(fullPath, {
        baseDir: BaseDirectory.AppConfig,
      });
      const json = JSON.parse(translated);
      const processedJSX = processDataToJSX(json.data);
      const pages = generatePagesJSX(processedJSX, 5);
      setTranslatedPages(pages);
      return;
    }
    const translated: string[] = await invoke("translate_book", {
      book
    });
    console.log({ flattenBook: book, translated });
    const processedJSX = processDataToJSX(translated);
    const pages = generatePagesJSX(processedJSX, 5);
    setTranslatedPages(pages);
    await writeTranslatedBookToAFile(translated);
  }

  async function checkIfBookAlreadyTranslated() {
    const filename = getFileName(path);
    const fullPath = `translated/${filename}.json`;
    const isTranslated = await exists(fullPath, { baseDir: BaseDirectory.AppData });
    return { isTranslated, fullPath };
  }

  useEffect(() => {
    translate(flattenBook);
  }, [flattenBook])

  return {
    nextPage,
    prevPage,
    pages: {
      original: pages,
      translated: translatedPages
    },
    pageIndex
  }
}

export { useFB2Reader }
