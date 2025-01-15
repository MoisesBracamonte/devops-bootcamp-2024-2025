'use client'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { PlusCircle } from 'lucide-react'
import {toast } from 'sonner'
import { useCategoryStore } from '@/store/useCategoryStore'
import { registerCategory } from '@/actions/categories/actions'

type Category = {
  id: string;
  name: string;
}

export const FormCategory = () =>  {
  const {categories,setCategories}:any = useCategoryStore(state => state);
  const [category, setCategory] = useState({ name: '', description: ''});
  const [error, setError] = useState< Record<string, any>| null >();
  const handleAddCategory = async (e:any) => {
    e.preventDefault();
    setError(null);
    const response = await registerCategory(category);
    if(response.errors){
        setError(response);
        return;
    }
      setCategory({ name:'',description:''})
      setCategories([
        ...categories,
        {
          ...response.data, 
          label: response.data.name,
          value: response.data.id
        }
      ]);
      toast.success('Categoria creada',{ duration: 1000})
  }

  useEffect( () => {

  },[])
  return (
    <Card className="w-full lg:w-80 sm:order-2 sx:order-2">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Agregar Categoría</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={ handleAddCategory } className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="newCategory">Nueva Categoría</Label>
            <Input
              id="newCategory"
              name="category"
              onChange={ (e) => setCategory({ ...category, name: e.target.value })}
              placeholder="Nombre de la categoría"
              required
              value=  { category.name }
            />
          </div>
          {
            (error && error.errors?.name) && (<label className={`text-red-500`}> { error?.message }</label>)
          }
          <div className="space-y-2">
            <Label htmlFor="newCategory">Descripción</Label>
            <Input
              id="descriptionCategory"
              name="description"
              onChange={ (e) => setCategory({ ...category, description: e.target.value }) }
              placeholder="Descripción de la categoría"
              required
              value=  { category.description }

            />
          </div>
          <Button type="submit" className="w-full">
            <PlusCircle className="w-4 h-4 mr-2" />
            Agregar Categoría
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}