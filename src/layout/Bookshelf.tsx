import { useEffect } from "react";
import { load } from '@tauri-apps/plugin-store';
import BookPreview from "./BookPreview";

export default function Bookshelf() {
  async function loadStore() {
    const store = await load('store.json', { autoSave: false });
    const temp = await store.values()
    console.log(temp);
  }

  useEffect(() => {
    loadStore();
  }, []);

  return (
    <div className="min-h-screen flex flex-wrap gap-4 p-12">
      <BookPreview />
      <BookPreview />
      <BookPreview />
    </div>
  )
}
