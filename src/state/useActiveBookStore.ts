import { Book } from '@/interfaces/Book';
import { create } from 'zustand'

interface ActiveBookState {
  book: Book | null;
  setActiveBook: (book: Book) => void;
}

const useActiveBookStore = create<ActiveBookState>((set) => ({
  book: null,
  setActiveBook: (book: Book) => set({ book }),
}))

export default useActiveBookStore
