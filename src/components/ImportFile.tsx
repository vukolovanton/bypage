import { useState } from "react";
import { invoke } from '@tauri-apps/api/core';
import { Book } from "@/interfaces/Book";
import { Button } from "./ui/button";
import { toast } from "sonner"
import { open } from '@tauri-apps/plugin-dialog';
import { load } from '@tauri-apps/plugin-store';
import { getBookTitle } from "@/lib/utils";

export function ImportFile() {
  const [loading, setLoading] = useState(false);

  async function handleNativeFileDialog() {
    const filePath = await open({
      multiple: false,
      directory: false,
    })
    if (!filePath) return;
    parseBook(filePath);
  }

  async function saveBookAddressToStore({ title, author, filePath }: { title: string, author: string, filePath: string }) {
    const store = await load('store.json', { autoSave: false });
    // await store.set(filePath, {
    //   value: {
    //     title,
    //     author
    //   }
    // });
    // const val = await store.get<{
    //   value: {
    //     title: string,
    //     author: string
    //   }
    // }>(filePath);
    const temp = await store.values()
    console.log(temp);
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
