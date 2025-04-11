import useActiveBookStore from "@/state/useActiveBookStore";
import { Controls } from "./Controls";
import Page from "./Page";

export default function Reader() {
  const book = useActiveBookStore(state => state.book);
  return (
    <>
      <section className="grid grid-cols-2 gap-4 max-h-full">
        <Page />
        <Page />
      </section>
      <Controls />
    </>
  )
}
