import { useFB2Reader } from "@/hooks/useFB2Reader";
import { Controls } from "@/layout/Controls";
import Page from "@/layout/Page";
import useActiveBookStore from "@/state/useActiveBookStore";

export default function AdvancedFB2Reader() {
  const book = useActiveBookStore((state) => state.book)!;
  const { pages, prevPage, nextPage, pageIndex } = useFB2Reader(book);

  return (
    <>
      <section className="grid grid-cols-2 gap-4 p-4">
        <Page content={pages[pageIndex]} />
        <Page content={pages[pageIndex]} />
      </section>
      <Controls pageNumber={pageIndex} prevPage={prevPage} nextPage={nextPage} />
    </>
  );
}
