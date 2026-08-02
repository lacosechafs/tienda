import logo from "@/public/logo/LCtext.png"
import { HeroProductType } from "@/types/types";
import Image from "next/image";
import { ProductsCart } from "./products-cart";

export const ProductHero = ({ ids, orderCatalog }: HeroProductType) => {

    const maxDiscount = Math.max(...orderCatalog.map(m => m.percentage_discount || 0))

    console.log(maxDiscount)

    return (
        <div className="hidden md:block relative">
            <Image
                src={logo}
                alt="Imagen productos"
                loading="eager"
                className="md:h-21 object-contain"
            />
            {/* {maxDiscount > 0 &&
                <div className="absolute top-0 left-0 bg-[#fea70e] w-full rounded-t-md ps-4 pe-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 14 14"><path fill="currentColor" fill-rule="evenodd" d="M6.203 1.533a1.26 1.26 0 0 1 1.594 0l.331.27c.138.112.318.16.494.132l.422-.068a1.26 1.26 0 0 1 1.38.797l.152.4a.63.63 0 0 0 .36.36l.4.153c.56.213.892.789.797 1.38l-.068.421a.63.63 0 0 0 .132.494l.27.331c.377.464.377 1.13 0 1.594l-.27.331a.63.63 0 0 0-.132.494l.068.422a1.26 1.26 0 0 1-.797 1.38l-.4.152a.63.63 0 0 0-.36.36l-.153.4c-.213.56-.789.892-1.38.797l-.421-.068a.63.63 0 0 0-.494.132l-.331.27a1.26 1.26 0 0 1-1.594 0l-.331-.27a.63.63 0 0 0-.494-.132l-.422.068a1.26 1.26 0 0 1-1.38-.797l-.152-.4a.63.63 0 0 0-.36-.36l-.4-.153a1.26 1.26 0 0 1-.797-1.38l.068-.421a.63.63 0 0 0-.132-.494l-.27-.331a1.26 1.26 0 0 1 0-1.594l.27-.331a.63.63 0 0 0 .132-.494l-.068-.422a1.26 1.26 0 0 1 .797-1.38l.4-.152a.63.63 0 0 0 .36-.36l.153-.4c.213-.56.789-.892 1.38-.797l.421.068a.63.63 0 0 0 .494-.132zm2.382-.97a2.51 2.51 0 0 0-3.17 0L5.3.656L5.155.633a2.51 2.51 0 0 0-2.746 1.586l-.053.137l-.137.053A2.51 2.51 0 0 0 .633 5.155l.023.145l-.093.115a2.51 2.51 0 0 0 0 3.17l.093.115l-.023.145a2.51 2.51 0 0 0 1.586 2.746l.137.053l.053.138a2.51 2.51 0 0 0 2.746 1.585l.145-.023l.115.093a2.51 2.51 0 0 0 3.17 0l.115-.093l.145.023a2.51 2.51 0 0 0 2.746-1.585l.053-.138l.138-.053a2.51 2.51 0 0 0 1.585-2.746l-.023-.145l.093-.115a2.51 2.51 0 0 0 0-3.17l-.093-.115l.023-.145a2.51 2.51 0 0 0-1.585-2.746l-.138-.053l-.053-.137A2.51 2.51 0 0 0 8.845.633L8.7.656zm1.357 4.379a.625.625 0 0 0-.884-.884l-5 5a.625.625 0 1 0 .884.884zM5 3.875a1.125 1.125 0 1 0 0 2.25a1.125 1.125 0 0 0 0-2.25M7.875 9a1.125 1.125 0 1 1 2.25 0a1.125 1.125 0 0 1-2.25 0" clip-rule="evenodd" /></svg>
                    <p className="font-bold">Hasta {maxDiscount}% de descuento</p>
                </div>
            } */}

            <ProductsCart
                ids={ids}
                orderCatalog={orderCatalog}
            />
        </div >
    )
}
