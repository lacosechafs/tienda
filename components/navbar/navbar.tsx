import Image from "next/image"
import logo from "@/public/logo/LCtext.png"
import { InputSearch } from "./input-search"
import { InfoCart } from "../info-cart"
import { Categories } from "../categories"
import { FormSign } from "@/components/form-sign";
import Link from "next/link"
import { TransitionLink } from "../transition-link"
import { ListCategories } from "../list-categories"


export const Navbar = () => {

  return (
    <div className="sticky top-0 left-0 md:w-full bg-(--backgroundlt) text-(--foreground) z-9 relative">
      <div className="container-md mx-auto flex flex-wrap justify-around max-w-screen-lg">

        <TransitionLink href="/">
          <Image
            src={logo}
            alt="Diferentes frutos secos cubiertos de miel, nombre de empresa y slogan"
            className="h-auto max-h-[60px] w-auto p-1"
            loading="eager"
          />
        </TransitionLink>

        <div className="content-center w-1/3 md:w-fit order-1 md:order-1 justify-items-center">
          <Categories />
        </div>

        <div className="content-center w-full px-3 md:w-1/2 md:w-fit order-3 md:order-2">
          <InputSearch />
        </div>

        <div className="flex justify-between w-fit md:w-1/5 md:min-w-55 order-2 md:order-3">
          {/* Contacto */}

          <Link href="#" className="hidden md:block content-center p-2">Contacto</Link>

          {/* Carrito */}
          <InfoCart />
          {/* Login */}
          <FormSign />
        </div>
      </div>
    </div>
  )
}
