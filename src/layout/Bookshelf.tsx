import { useEffect, useState } from "react";
import { invoke } from '@tauri-apps/api/core';
import { load } from '@tauri-apps/plugin-store';
import BookPreview from "./BookPreview";
import { IStore } from "@/interfaces/Store";
import useActiveBookStore from "@/state/useActiveBookStore";

export default function Bookshelf() {
  const [library, setLibray] = useState<{ value: IStore }[]>([]);
  const latestUpdate = useActiveBookStore(state => state.latesUpdate);

  async function loadStore() {
    const store = await load('bypage-store.json', { autoSave: false });
    const values: Array<{ value: IStore }> = await store.values();
    checkBooksAvailability(values);
  }

  async function checkBooksAvailability(values: Array<{ value: IStore }>) {
    const paths = collectPaths(values);
    const validPaths: Array<string> = await invoke("validate_paths", {
      paths,
    });
    const filtered = values.filter(item => validPaths.includes(item.value.filePath));
    setLibray(filtered);
  }

  function collectPaths(store: Array<{ value: IStore }>) {
    return store.map(s => s.value.filePath);
  }

  useEffect(() => {
    loadStore();
  }, [latestUpdate]);

  return (
    <div className="min-h-screen flex flex-wrap gap-4 p-12">
      {
        library.map(book => <BookPreview book={book.value} key={book.value.filePath} />)
      }
    </div>
  )
}
