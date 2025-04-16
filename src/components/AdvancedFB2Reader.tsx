import { Book } from "@/interfaces/Book";
import { MixedConrent, TagElement, TagValue } from "@/interfaces/InlineContent";
import Page from "@/layout/Page";
import { isObject, LOREM_IPSUM } from "@/lib/utils";
import useActiveBookStore from "@/state/useActiveBookStore";
import { useState } from "react";

export default function AdvancedFB2Reader() {
  const [pageIndex, setPageIndex] = useState(0);
  const book = useActiveBookStore((state) => state.book)!;
  const flattenBook = flatten(book);
  const processed = processData(flattenBook);
  const pages = generatePages(processed, 200);
  console.log(pages)


  function flatten(book: Book) {
    const result: MixedConrent[] = [];
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

  function processData(dataArr: MixedConrent[]) {
    return dataArr.map((item, i) => {
      if (typeof item === 'string') {
        return item;
      }
      // Process objects - this example assumes only one key per object.
      if (typeof item === 'object') {
        const tag = Object.keys(item)[0];
        const contentArr = item[tag]; // e.g., the array under "strong"
        // Assuming one nested object with "$value"
        if (Array.isArray(contentArr)) {
          // For simplicity: join values from the nested structure.
          const innerObj = contentArr[0];
          if (innerObj && innerObj.$value) {
            return `<${tag}>${innerObj.$value.join(" ")}</${tag}>`;
          }
        }
      }
      return '';
    }).join(" "); // Join everything into one string (or you can choose to keep an array for more control)
  };

  function generatePages(text: string, maxCharsPerPage: number) {
    const pages = [];
    let start = 0;
    while (start < text.length) {
      pages.push(text.substring(start, start + maxCharsPerPage));
      start += maxCharsPerPage;
    }
    return pages;
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
