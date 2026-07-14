"use client"

import { useAppSelector } from "@/hooks/useRedux"
import { RootState } from "@/redux/makeStore"
import { ShoppingCart } from "lucide-react"

export const InfoCart = () => {

    const productsCart = useAppSelector((state: RootState) => state.cart.products)

    return (
        <button className="relative">
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-5 h-5 rounded-full bg-red-500 text-[length:14px]">{productsCart.length}</div>
            <ShoppingCart className="h-5 w-5" />
        </button>
    )
}
