import Image from "next/image"
import logo from "@/public/logo/LCtext.png"
import { InputSearch } from "./input-search"
import { InfoCart } from "../info-cart"
import { Categories } from "../categories"
import { FormSign } from "@/components/form-sign";
import Link from "next/link"


export const Navbar = () => {

  return (
    <div className="sticky top-0 left-0 w-full bg-(--background) text-(--foreground) z-9">
      <div className="container-md mx-auto flex justify-around max-w-screen-lg relative">
        <Link href="/">
          <Image
            src={logo}
            alt="Diferentes frutos secos cubiertos de miel, nombre de empresa y slogan"
            className="h-auto max-h-[60px] w-auto"
            loading="eager"
          />
        </Link>
        <Categories />
        <InputSearch />
        <div className="flex justify-between w-1/4">
          {/* Contacto */}
          <Link href="#" className="content-center p-2">Contacto</Link>
          {/* Login */}
          {/* Carrito */}
          <div className="content-center p-2">
            <InfoCart />
          </div>
          <FormSign />
        </div>
      </div>
    </div>
  )
}
