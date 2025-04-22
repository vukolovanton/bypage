import { Book } from '@/interfaces/Book';
import { create } from 'zustand'

interface ActiveBookState {
  book: Book | null;
  path: string | null;
  setActiveBook: (book: Book) => void;
  setActivePath: (path: string) => void;

  latesUpdate: number;
  triggerLatestUpdate: () => void;
}

const useActiveBookStore = create<ActiveBookState>((set) => ({
  book: null,
  setActiveBook: (book: Book) => set({ book }),

  latesUpdate: Date.now(),
  triggerLatestUpdate: () => set({ latesUpdate: Date.now() }),

  path: null,
  setActivePath: (path) => set({ path })
}))

export default useActiveBookStore
