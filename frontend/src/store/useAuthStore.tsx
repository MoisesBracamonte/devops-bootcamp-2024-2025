import { create } from "zustand";

export const useAuthStore = create((set,get) => ({
    auth:{},
    setAuth: (setter:any) => set({ auth: { ...setter }})
}))