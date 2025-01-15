'use client';
import { useRef, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MultiSelect } from './MultiSelect'
import { useCategories } from '@/hooks/useCategories'
import { ServicesDto } from '@/dtos/services.dto';
import { FormMessage } from '../ui/form';
import { registerService } from '@/actions/services/action';
import { IService } from "@/interfaces/services.interface";
import { toast } from 'sonner';



export const FormService = () =>  {
  const refCategories = useRef();
  const [error,setError] = useState<Record<string,any> | undefined>(undefined);
  const [service, setService] = useState({
    name: '',
    prices: '',
    percentage: '',
    status: 'active',
    categories: [] as string[]
  });

  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setService({ ...service, [name]: value })
  }
  const { categories } = useCategories();

  const handleStatusChange = (value: string) => {
    setService({ ...service, status: value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(undefined);
    const [_e, serviceDto] = ServicesDto.validate(service);
    if(_e){
      setError(_e);
      return;
    }
    const formData = ServicesDto.toJson(serviceDto!);

    const response = await registerService(formData);
    if(response.errors){
      setError(response);
      return;
    }
    setService({
      name: '',
      prices: '',
      percentage: '',
      status: 'active',
      categories: [] as string[]
    })
    setSelectedOptions([]);
    toast.success(response.message);
  }

  const handleSelectionChange = (selected: any) => {
    setService({ ...service, categories: selected.map((_s:any) => _s.value )})
    setSelectedOptions(selected || []);
  };

  return (
    <Card className="flex-grow sm:order-1 sx:order-1">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Registrar Nuevo Servicio {process.env.NEXT_PUBLIC_API_URL} </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre del Servicio</Label>
            <Input
              id="name"
              name="name"
              value={service.name}
              onChange={handleInputChange}
            />
            {
              error && error.errors.name && ( <Label className='text-red-500' >{ error.message }</Label>)
            }
          </div>
          <div className="space-y-2">
            <Label htmlFor="price">Precio</Label>
            <Input
              id="price"
              name="prices"
              type="number"
              value={service.prices}
              onChange={handleInputChange}
            />
            {
              error && error.errors.prices && ( <Label className='text-red-500' >{ error.message }</Label>)
            }
          </div>
          <div className="space-y-2">
            <Label htmlFor="percentage">Porcentaje</Label>
            <Input
              id="percentage"
              name="percentage"
              type="number"
              value={service.percentage}
              onChange={handleInputChange}
            />
            {
              error && error.errors.percentage && ( <Label className='text-red-500' >{ error.message }</Label>)
            }
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Estado</Label>
            <Select onValueChange={handleStatusChange} defaultValue={service.status}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Activo</SelectItem>
                <SelectItem value="inactive">Inactivo</SelectItem>
              </SelectContent>
            </Select>
            {
              error && error.errors.status && ( <Label className='text-red-500' >{ error.message }</Label>)
            }
          </div>
          <div className="space-y-2">
            <Label>Categorías</Label>
            <MultiSelect 
                ref={refCategories.current}
                instanceId="select-1"
                isMulti
                options={categories}
                placeholder="Selecciona las categorias..."
                value={selectedOptions}
                onChange={handleSelectionChange}
            />
            {
              error && error.errors.categories && ( <Label className='text-red-500' >{ error.message }</Label>)
            }
          </div>
          <Button type="submit" className="w-full">Registrar Servicio</Button>
        </form>
      </CardContent>
    </Card>
  )
} 