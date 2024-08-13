import { create } from "zustand";
import { PrismaModels } from "@/types/interface";

type System = PrismaModels["System"];
type Platform = PrismaModels["Platform"];

type DicStore = {
  systems: System[];
  platforms: Platform[];
  init: (payload: { systems: System[]; platforms: Platform[] }) => void;
  reset: () => void;
};

const initialState = {
  systems: [],
  platforms: [],
};

const useDicStore = create<DicStore>()((set) => ({
  ...initialState,
  init: ({ systems, platforms }) => set(() => ({ systems, platforms })),
  reset: () => set(initialState),
}));

export default useDicStore;
