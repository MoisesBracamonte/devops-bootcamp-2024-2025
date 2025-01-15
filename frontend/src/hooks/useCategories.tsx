import { useEffect, useState } from "react"
import { useAxios } from "./useAxios";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useCategoryStore } from "@/store/useCategoryStore";

export const useCategories = () => {
    const { categories, setCategories }:any = useCategoryStore(state => state);
    const { session,status,data } = useAxios({
        url: 'http://localhost:3000/api/categories'
    });
    useEffect( () => {
        if(data.length == 0) return
        const mapping:any = data.map((category:any) => ({ ...category, value:category.id, label:category.name }));
        setCategories(mapping)
        // setCategories( mapping )
    },[data]);
    return {
        categories,
    }
}