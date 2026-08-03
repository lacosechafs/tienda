import logo from "@/public/logo/LCtext.png"
import { HeroProductType } from "@/types/types";
import Image from "next/image";
import { ProductsCart } from "./products-cart";

export const ProductHero = ({ ids, orderCatalog }: HeroProductType) => {

    return (
        <div className="hidden md:block relative">
            <Image
                src={logo}
                alt="Imagen productos"
                loading="eager"
                className="md:h-21 object-contain"
            />

            <ProductsCart
                ids={ids}
                orderCatalog={orderCatalog}
            />
        </div >
    )
}
