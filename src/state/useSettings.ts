import { create } from 'zustand'

interface SettingsState {
  model: string;
  setModel: (model: string) => void;

  language: string;
  setLanguage: (lang: string) => void;
}

const useSettingsState = create<SettingsState>((set) => ({
  model: '',
  setModel: (model: string) => set({ model }),

  language: 'Russian',
  setLanguage: (lang: string) => set({ language: lang })
}))

export default useSettingsState
