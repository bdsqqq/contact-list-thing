import { create } from "zustand";

type TOverrides = {
  name?: string | string[];
  email?: string | string[];
  subscribed?: string | string[];
  created_at?: string | string[];
};

type csvDataStore = {
  columns: string[];
  setColumns: (columns: string[]) => void;
  overrides: TOverrides;
  setOverrides: (data: TOverrides) => void;
  clearStore: () => void;
};

import { csvToJson, mapCsvProperties } from "~/utils/csv";

export const useCsvDataStore = create<csvDataStore>((set) => ({
  columns: [],
  setColumns: (columns) => set({ columns }),
  overrides: {
    name: undefined,
    email: undefined,
    subscribed: undefined,
    created_at: undefined,
  },
  setOverrides: (data) => set({ overrides: data }),
  clearStore: () => set({ columns: [], overrides: {} }),
}));
