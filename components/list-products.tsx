"use client"

import { dataProductsPartial } from "@/types/types"
import { BoxProduct } from "./productCard/box-product"

export const ListProducts = ({ products, title }: { products: Array<dataProductsPartial>, title?: string }) => {

    return (
        <div className='w-full max-w-[calc(100%-350px)] mt-10'>
            {title &&
                <h1>{title}</h1>
            }
            <div className="gap-4 grid grid-cols-[repeat(auto-fit,minmax(min(100%,270px),1fr))] max-w-full [grid-template-columns:repeat(auto-fit,minmax(max(270px,calc(25%-1rem)),1fr))]">
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