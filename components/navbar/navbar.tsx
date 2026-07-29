"use client"
import Image from "next/image"
import logo from "@/public/logo/LCtext.png"
import { InputSearch } from "./input-search"
import { InfoCart } from "../info-cart"
import { Categories } from "../categories"
import { FormSign } from "@/components/form-sign";
import { TransitionLink } from "../transition-link"
import { ListCategories } from "../list-categories"
import { ResultSearch } from "../result-search"
import { useState } from "react"
import { ButtonSign } from "../button-sing"
import { useAppSelector } from "@/hooks/useRedux"
import { RootState } from "@/redux/makeStore"

export const Navbar = () => {

  const [findProduct, setFindProduct] = useState<string>("");
  const isCartOpen = useAppSelector((state: RootState) => state.cart.isOpen)

  const [openOptions, setOpenOptions] = useState<string | null>(null)

  return (
    <div className="sticky top-0 left-0 md:w-full bg-(--backgroundlt) text-(--foreground) z-9 relative">
      <div className="mx-auto flex flex-wrap md:flex-nowrap justify-between max-w-screen-lg min-h-15">

        <TransitionLink href="/">
          <Image
            src={logo}
            alt="Diferentes frutos secos cubiertos de miel, nombre de empresa y slogan"
            className="h-15 w-auto p-1"
            loading="eager"
          />
        </TransitionLink>

        <div className="flex justify-around flex-row-reverse md:flex-row w-full md:w-1/2 px-2 order-2 md:order-1">
          <div className="content-center w-1/3 md:w-fit justify-items-center px-2">
            <Categories setOpenOptions={setOpenOptions} />
          </div>

          <div className="content-center w-full md:w-1/2 md:w-fit">
            <InputSearch setFindProduct={setFindProduct} setOpenOptions={setOpenOptions} />
          </div>
        </div>

        <div className="flex justify-between w-fit min-w-[117px] md:w-1/5 md:min-w-55 order-1 md:order-2">

          {/* Contacto */}
          <TransitionLink href="/contacto" className="hidden md:block content-center p-2">Contacto</TransitionLink>

          {/* Carrito */}
          <InfoCart />

          {/* Login */}
          <ButtonSign setOpenOptions={setOpenOptions} />
        </div>
      </div>

      <div className={`max-w-screen-lg md:w-[calc(100%-350px)] px-3 justify-self-center duration-1000 ease-in-out ${isCartOpen ? "-translate-x-[175px]" : "translate-none"}`}>

        <ListCategories setOpenOptions={setOpenOptions} openOptions={openOptions} />

        <ResultSearch findProduct={findProduct} setOpenOptions={setOpenOptions} openOptions={openOptions} />

        <FormSign openOptions={openOptions} />
      </div>


    </div>
  )
}
