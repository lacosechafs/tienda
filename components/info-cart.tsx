"use client"

import { useAppSelector } from "@/hooks/useRedux"
import { RootState } from "@/redux/makeStore"
import { ShoppingCart } from "lucide-react"
import { useRef } from "react"

export const InfoCart = () => {

    const productsCart = useAppSelector((state: RootState) => state.cart.products)
    const cartRef = useRef<HTMLDivElement>(null)

    return (
        <div ref={cartRef} className="relative flex content-center justify-center p-2">
            <button className="w-15 cursor-pointer">
                <div className={`absolute top-2 right-4 w-5 h-5 rounded-full bg-red-500 text-[length:14px] duration-500 ${productsCart.length === 0 ? "opacity-0" : "opacity-100"}`}>{productsCart.length}</div>
                <ShoppingCart className="h-6 w-6 justify-self-center" />
            </button>
        </div>
    )
}
