import { TypographyH3 } from "@/components/TypographyH3";
import { Book } from "@/interfaces/Book";
import { IStore } from "@/interfaces/Store";
import useActiveBookStore from "@/state/useActiveBookStore";
import { invoke } from '@tauri-apps/api/core';
import { useNavigate } from "react-router";

export default function BookPreview({ book }: { book: IStore }) {
  let navigate = useNavigate();
  const setActiveBook = useActiveBookStore(state => state.setActiveBook);

  async function handleBookClick() {
    const currentBook: Book = await invoke("open_file", {
      path: book.filePath
    });
    setActiveBook(currentBook);
    navigate("/reader");
  }

  return (
    <div onClick={handleBookClick} className="border-2 rounded-md p-4 h-60 w-44 shadow-sm cursor-pointer hover:shadow-xl text-balance break-words">
      <TypographyH3>{book.title}</TypographyH3>
      <i>{book.author}</i>
    </div>
  )
}
