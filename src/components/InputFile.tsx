import { useState } from "react";
import { invoke } from '@tauri-apps/api/core';
import { Book } from "@/interfaces/Book";
import { Button } from "./ui/button";
import { toast } from "sonner"
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
    try {
      setLoading(true);
      const book: Book = await invoke("open_file", {
        path: filePath
      });
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
