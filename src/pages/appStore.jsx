import { create } from "zustand";
import { persist } from "zustand/middleware";

let appStore1 = (set) => ({
  dopen: true,
  rows: [],
  updateOpen: (dopen) => set((state) => ({ dopen: dopen })),
});

appStore = persist(appStore, { name: "my_app_store" });
export const useAppStore1 = create(appStore);