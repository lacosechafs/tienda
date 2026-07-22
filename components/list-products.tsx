"use client"

import { dataProductsPartial } from "@/types/types"
import { BoxProduct } from "./productCard/box-product"

export const ListProducts = ({ products, title }: { products: Array<dataProductsPartial>, title?: string }) => {

    const visibleProducts = products.filter(m => m.show_product && m.catalog.length);

    if (!visibleProducts.length) return

    return (
        <div>
            {title && (
                <h1 className="text-2xl font-bold mb-4">{title}</h1>
            )}
            <div className="grid [grid-template-columns:repeat(auto-fill,minmax(270px,1fr))] gap-4 max-w-full">
                {visibleProducts.map(m => (
                    <BoxProduct
                        key={m.id}
                        catalog={m.catalog}
                        name={m.name}
                        title={title || ""}
                    />
                ))}
            </div>
        </div>
    );
}