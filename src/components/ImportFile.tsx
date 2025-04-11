import { useState } from "react";
import { invoke } from '@tauri-apps/api/core';
import { Book } from "@/interfaces/Book";
import { Button } from "./ui/button";
import { toast } from "sonner"
import { open } from '@tauri-apps/plugin-dialog';
import { load } from '@tauri-apps/plugin-store';
import { getBookTitle } from "@/lib/utils";
import { IStore } from "@/interfaces/Store";
import useActiveBookStore from "@/state/useActiveBookStore";

export function ImportFile() {
  const [loading, setLoading] = useState(false);
  const triggerLatestUpdate = useActiveBookStore(state => state.triggerLatestUpdate);

  async function handleNativeFileDialog() {
    const filePath = await open({
      multiple: false,
      directory: false,
    })
    if (!filePath) return;
    parseBook(filePath);
  }

  async function saveBookAddressToStore({ title, author, filePath }: IStore) {
    const store = await load('bypage-store.json', { autoSave: false });
    await store.set(filePath, {
      value: {
        title,
        author,
        filePath
      }
    });
    triggerLatestUpdate();
  }

  async function parseBook(filePath: string) {
    try {
      setLoading(true);
      const book: Book = await invoke("open_file", {
        path: filePath
      });
      const { title, author } = getBookTitle(book);
      saveBookAddressToStore({ title, author, filePath });
      toast.success("Book has been added to the library");
    } catch (err) {
      toast.error((err as String));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Button disabled={loading} onClick={handleNativeFileDialog}>Import</Button>
    </div>
  )
}
