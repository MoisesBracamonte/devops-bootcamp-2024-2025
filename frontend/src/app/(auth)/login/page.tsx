import Image from "next/image"
import img from "@/assets/images/calendar-unbg.png";
import { FormLogin } from "./Form";

export default function LoginPage() {

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div className="w-full bg-stone-100 md:w-1/2  flex items-center justify-center border-r-4 border-dashed ">
        <Image
          src={img}
          alt="Imagen de una agenda"
          width={600}
          height={600}
          className=""
        />
      </div>
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-bold text-gray-900">
              Iniciar sesión
            </h2>
          </div>
          <FormLogin />
        </div>
      </div>
    </div>
  )
}