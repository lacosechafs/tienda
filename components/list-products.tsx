"use client"

import { dataProductsPartial } from "@/types/types"
import { BoxProduct } from "./productCard/box-product"
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux"
import { RootState } from "@/redux/makeStore"
import { useEffect } from "react"
import { toggleStock } from "@/redux/cartSlice"

export const ListProducts = ({ products, title }: { products: Array<dataProductsPartial>, title?: string }) => {
    const dispatch = useAppDispatch()
    const productsCart = useAppSelector((state: RootState) => state.cart.products) || []

    useEffect(() => {
        const isAnyProductAtMaxStock = products.some(p => {
            if (!p.show_product || !p.catalog) return false

            return p.catalog.some(d => {
                if (!d.visible || !d.public_price) return false

                const productInCart = productsCart.find(f => f.id === d.id && f.size === d.size)

                if (!productInCart) return false

                const currentQuantity = productInCart.quantity
                const qStock = (d.bulk_stock + d.stored_stock) - d.min_stock

                return currentQuantity >= qStock
            })
        })

        dispatch(toggleStock(isAnyProductAtMaxStock))
    }, [productsCart, products, dispatch])

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