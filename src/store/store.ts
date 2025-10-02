import { create } from "zustand";

type State = {
  search: string;
};
type Actions = {
  setSearch: (value: string) => void;
};

export const useSearchStore = create<State & Actions>((set) => ({
  search: "",
  setSearch: (newSearch: string) => set({ search: newSearch }),
}));
