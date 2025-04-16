import Page from "@/layout/Page";
import { LOREM_IPSUM } from "@/lib/utils";
import useActiveBookStore from "@/state/useActiveBookStore";

export default function AdvancedFB2Reader() {
  const book = useActiveBookStore((state) => state.book);
  console.log(book)

  return (
    <>
      <section className="grid grid-cols-2 gap-4 max-h-full">
        <Page content={LOREM_IPSUM} />
        <Page content={LOREM_IPSUM} />
      </section>
    </>
  );
}
