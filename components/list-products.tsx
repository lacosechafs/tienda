"use client"

import { dataProductsPartial } from "@/types/types"
import { BoxProduct } from "./productCard/box-product"

export const ListProducts = ({ products, title }: { products: Array<dataProductsPartial>, title?: string }) => {

    return (
        <div className='w-full mt-10'>
            {title &&
                <h1>{title}</h1>
            }
            <div className="container justify-self-center justify-center gap-4 grid grid-cols-[repeat(auto-fill,minmax(270px,23%))]">
                {products.map(m => {
                    if (!m.show_product) return

                    return (
                        <BoxProduct catalog={m.catalog} name={m.name} id={m.id} key={m.id} />
                    )
                })}
            </div>
        </div>
    )
}