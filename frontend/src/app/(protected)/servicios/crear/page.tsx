import { FormService } from '@/components/template/FormService'
import { FormCategory } from '@/components/template/FormCategory'

export default function Dashboard() {
  
  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <FormService />
      <FormCategory />
    </div>
  )
}