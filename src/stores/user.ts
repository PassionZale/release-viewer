import { create } from "zustand";
import { PrismaModels } from "@/types/interface";

type User = Omit<PrismaModels["User"], "hashedPassword">;

type UserStore = {
  user?: User;
  init: (payload: User) => void;
  reset: () => void;
};

const initialState = {
  user: undefined,
};

const useUserStore = create<UserStore>()((set) => ({
  ...initialState,
  init: (payload) => set(() => ({ user: payload })),
  reset: () => set(initialState),
}));

export default useUserStore;
