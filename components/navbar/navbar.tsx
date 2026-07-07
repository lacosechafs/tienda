import Image from "next/image"
import logo from "@/public/logo/LCtext.png"
import { InputSearch } from "../inputSearch"
import { InfoCart } from "../infoCart"

export const Navbar = () => {
  return (
    <div className="fixed top-0 left-0 w-full bg-(--background) text-(--foreground)">
      <div className="container-md mx-auto flex justify-around max-w-screen-lg relative">
        <Image
          src={logo}
          alt="Diferentes frutos secos cubiertos de miel, nombre de empresa y slogan"
          className="h-auto max-h-[60px] w-auto"
        />
        <InputSearch />
        <div className="flex">
          {/* Contacto */}
          <a className="content-center p-2">Contacto</a>
          {/* Login */}
          {/* Carrito */}
          <div className="content-center p-2">
            <InfoCart />
          </div>
        </div>
      </div>
    </div>
  )
}
