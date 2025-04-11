import { Book } from '@/interfaces/Book';
import { create } from 'zustand'

interface ActiveBookState {
  book: Book | null;
  setActiveBook: (book: Book) => void;

  latesUpdate: number;
  triggerLatestUpdate: () => void;
}

const useActiveBookStore = create<ActiveBookState>((set) => ({
  book: null,
  setActiveBook: (book: Book) => set({ book }),

  latesUpdate: Date.now(),
  triggerLatestUpdate: () => set({ latesUpdate: Date.now() })
}))

export default useActiveBookStore
