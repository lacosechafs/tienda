"use client"

import { FlatStock } from "@/helpers/flat-stock"
import { useAppSelector } from "@/hooks/useRedux"
import { toggleCart } from "@/redux/cartSlice"
import { RootState } from "@/redux/makeStore"
import { ShoppingCart } from "lucide-react"
import { useMemo, useRef, useState } from "react"
import { useDispatch } from "react-redux"

export const InfoCart = () => {
    const dispatch = useDispatch()

    const productsCart = useAppSelector((state: RootState) => state.cart.products)
    const products = useAppSelector((state: RootState) => state.data.products)
    const isCartOpen = useAppSelector((state: RootState) => state.cart.isOpen)
    const cartRef = useRef<HTMLDivElement>(null)

    const productsInCart = FlatStock({ products })

    const [firstClick, setFirstClick] = useState(true)

    const hasAllStock = useMemo(() => {
        if (productsCart.length === 0) return true
        return productsCart.some(f => productsInCart.has(f.id))
    }, [productsCart, productsInCart])

    const showWarning = hasAllStock && firstClick && !isCartOpen

    return (
        <div ref={cartRef} className="relative flex content-center justify-center m-2">
            <button onClick={() => { dispatch(toggleCart()); setFirstClick(false) }} className="w-15 cursor-pointer">
                {productsCart && (
                    <div className={`absolute top-0 right-2 w-5 h-5 rounded-full text-[length:14px] duration-500 ${showWarning ? "bg-yellow-700" : "bg-green-700"} ${productsCart.length === 0 ? "opacity-0" : "opacity-100"}`}>
                        <span className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${showWarning ? "scale-100 opacity-100" : "scale-0 opacity-0"}`}>
                            !
                        </span>
                        <span className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${showWarning ? "scale-0 opacity-0" : "scale-100 opacity-100"}`}>
                            {productsCart.length}
                        </span>
                    </div>
                )}
                <ShoppingCart className="h-6 w-6 justify-self-center" />
            </button>
        </div>
    )
}