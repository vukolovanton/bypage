import { useFB2Reader } from "@/hooks/useFB2Reader";
import { Controls } from "@/layout/Controls";
import Page from "@/layout/Page";
import useActiveBookStore from "@/state/useActiveBookStore";
import useSettingsState from "@/state/useSettings";

export default function AdvancedFB2Reader() {
  const book = useActiveBookStore((state) => state.book)!;
  const path = useActiveBookStore((state) => state.path)!;
  const model = useSettingsState(state => state.model);
  const language = useSettingsState(state => state.language);
  const { pages, prevPage, nextPage, pageIndex } = useFB2Reader(book, path, model, language);

  return (
    <>
      <section className="grid grid-cols-2 gap-4 p-4">
        <Page content={pages.original[pageIndex]} />
        <Page translate={true} content={pages.translated[pageIndex]} />
      </section>
      <Controls pageNumber={pageIndex} prevPage={prevPage} nextPage={nextPage} />
    </>
  );
}
