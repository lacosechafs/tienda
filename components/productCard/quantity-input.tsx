'use client';

import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { addToCart, manualQuantity, removeToCart, toggleStock } from "@/redux/cartSlice";
import { RootState } from "@/redux/makeStore";
import { useRef } from "react";

interface Props {
    id: number;
    size: number;
    name: string;
    haveStock: boolean;
    unit: string;
    price: number;
    qStock: number;
}

export const QuantityInput = ({ id, size, name, haveStock, unit, price, qStock }: Props) => {
    const dispatch = useAppDispatch();
    const value = useRef<HTMLInputElement>(null)
    const productsCart = useAppSelector((state: RootState) => state.cart.products) || []
    const inStock = useAppSelector((state: RootState) => state.cart.stock)
    const product = productsCart.find(f => f.id === id && f.size === size)
    const currentQuantity = product && product.size === size ? product.quantity : 0;

    return (
        <div className="flex justify-between whitespace-nowrap items-center min-w-1/4">
            <button
                className="rounded-full w-6 h-6 bg-zinc-500"
                onClick={() => {
                    dispatch(removeToCart({ id, name, size: size }))
                }}
                disabled={currentQuantity <= 0 || !haveStock}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M0 13H4.25v-2h7.5h7.5v2h-2z" /></svg>
            </button>

            <div className="relative flex items-center">
                {/* <input
                    id={id.toString()}
                    placeholder="1"
                    ref={value}
                    value={!haveStock ? 0 : currentQuantity || 0}
                    onChange={() => {
                        const q = value.current ? parseInt(value.current.value, 10) : 0;
                        dispatch(manualQuantity({ id, name, size, quantity: q || 0 }))
                    }}
                    disabled={!haveStock}
                    className="text-white text-center min-w-5 h-fit field-sizing-content"
                /> */}
                <div className="px-2">{currentQuantity}</div>
            </div>

            <button
                className={`rounded-full w-6 h-6 bg-zinc-500 duration-500 ${currentQuantity >= qStock && qStock > 0 ? "opacity-50" : "opacity-100"}`}
                onClick={() => {
                    if (currentQuantity < qStock && haveStock) {
                        dispatch(addToCart({ id, name, size, public_price: price, unit }))
                    } else {
                        if (currentQuantity !== 0 && !inStock) {

                            dispatch(toggleStock(true))

                            const timer = setTimeout(() => {
                                dispatch(toggleStock(false))
                            }, 4000);

                            return () => clearTimeout(timer)
                        }
                    }
                }}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M11 13H5v-2h6V5h2v6h6v2h-6v6h-2z" /></svg>
            </button>
        </div>
    )
}