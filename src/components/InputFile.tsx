import { useState } from "react";
import { invoke } from '@tauri-apps/api/core';
import { Book } from "@/interfaces/Book";
import { Button } from "./ui/button";
import { open } from '@tauri-apps/plugin-dialog';

export function InputFile() {
  const [loading, setLoading] = useState(false);

  async function handleNativeFileDialog() {
    const filePath = await open({
      multiple: false,
      directory: false,
    })
    if (!filePath) return;
    parseBook(filePath);
  }

  async function parseBook(filePath: string) {
    setLoading(true);
    const book: Book | Error = await invoke("open_file", {
      path: filePath
    });
    setLoading(false);
    if (book instanceof Error) {
      console.log("Error")
    }
    console.log(book)
  }

  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Button disabled={loading} onClick={handleNativeFileDialog}>{loading ? 'Loading...' : 'Import'}</Button>
    </div>
  )
}
