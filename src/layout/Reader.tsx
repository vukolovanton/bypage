import { Controls } from "./Controls";
import Page from "./Page";

export default function Reader() {
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
