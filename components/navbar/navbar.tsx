"use client"
import Image from "next/image"
import logo from "@/public/logo/LCtext.png"
import { InputSearch } from "./input-search"
import { InfoCart } from "../info-cart"
import { Categories } from "../categories"
import { FormSign } from "@/components/form-sign";
import Link from "next/link"
import { TransitionLink } from "../transition-link"
import { ListCategories } from "../list-categories"
import { ResultSearch } from "../result-search"
import { useRef, useState } from "react"
import { ButtonSign } from "../button-sing"

export const Navbar = () => {

  const [findProduct, setFindProduct] = useState<string>("");
  const [showCat, setShowCat] = useState<boolean>(false)
  const [focusItem, setFocusItem] = useState(true)
  const inputRef = useRef<HTMLDivElement>(null);
  const signRef = useRef<HTMLDivElement>(null);
  const catRef = useRef<HTMLDivElement>(null);
  const [showMenu, setShowMenu] = useState<boolean>(false)



  return (
    <div className="sticky top-0 left-0 md:w-full bg-(--backgroundlt) text-(--foreground) z-9 relative">
      <div className="container-md mx-auto flex flex-wrap md:flex-nowrap justify-between max-w-screen-lg min-h-15">

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
            <Categories setShowCat={setShowCat} catRef={catRef} />
          </div>

          <div className="content-center w-full md:w-1/2 md:w-fit">
            <InputSearch setFindProduct={setFindProduct} setFocusItem={setFocusItem} inputRef={inputRef} />
          </div>
        </div>

        <div className="flex justify-between w-fit min-w-[117px] md:w-1/5 md:min-w-55 order-1 md:order-2">
          {/* Contacto */}

          <Link href="#" className="hidden md:block content-center p-2">Contacto</Link>

          {/* Carrito */}
          <InfoCart />
          {/* Login */}
          <ButtonSign signRef={signRef} setShowMenu={setShowMenu} />
        </div>
      </div>

      <div>

        <ListCategories showCat={showCat} setShowCat={setShowCat} catRef={catRef} />

        <ResultSearch findProduct={findProduct} focusItem={focusItem} setFocusItem={setFocusItem} inputRef={inputRef} />

        <FormSign showMenu={showMenu} setShowMenu={setShowMenu} signRef={signRef} />
      </div>


    </div>
  )
}
