import { create } from "zustand";

type TOverrides = {
  name?: string | string[];
  email?: string | string[];
  subscribed?: string | string[];
  created_at?: string | string[];
};

type csvDataStore = {
  inputtedColumns: string[];
  parsedData: {
    columns: string[];
    data: {
      name: string;
      email: string;
      subscribed: string;
      created_at?: Date;
    }[];
  };
  setParsedData: ({
    data,
    overrides,
  }: {
    data: string;
    overrides: TOverrides;
  }) => void;
  overrides: TOverrides;
  setOverrides: (data: {
    name?: string | string[];
    email?: string | string[];
    subscribed?: string | string[];
    createdAt?: string | string[];
  }) => void;
  clearStore: () => void;
};

import { csvToJson, mapCsvProperties } from "~/utils/csv";

export const useCsvDataStore = create<csvDataStore>((set) => ({
  inputtedColumns: [],
  parsedData: { data: [], columns: [] },
  overrides: {
    name: undefined,
    email: undefined,
    subscribed: undefined,
    created_at: undefined,
  },
  setParsedData: (input) => {
    const { columns, data: csvAsJson } = csvToJson(input.data);
    return set({
      parsedData: {
        columns,
        data: mapCsvProperties(csvAsJson, input.overrides),
      },
    });
  },
  setOverrides: (data) => set({ overrides: data }),
  clearStore: () =>
    set({ parsedData: { data: [], columns: [] }, overrides: {} }),
}));
