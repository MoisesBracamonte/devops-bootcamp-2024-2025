import { create }  from 'zustand';
export const useCategoryStore = create((set, get) => ({
    categories: [],
    setCategories: (setter:any) => set({categories: [...setter] })
}))