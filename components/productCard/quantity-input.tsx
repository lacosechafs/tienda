'use client';


import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { addToCart, manualQuantity, removeToCart } from "@/redux/cartSlice";
import { RootState } from "@/redux/makeStore";
import { useEffect, useRef, useState } from "react";

interface Props {
    id: number;
    size: number;
    unit: string;
    name: string;
    haveStock: boolean;
}

export const QuantityInput = ({ id, size, name, haveStock, unit }: Props) => {

    const dispatch = useAppDispatch();

    const value = useRef<HTMLInputElement>(null)

    const [quantity, setQuantity] = useState<number>(0)

    const productsCart = useAppSelector((state: RootState) => state.cart.products)
    const product = productsCart.find(f => f.id === id && f.size === size)
    const currentQuantity = product && product.size === size ? product.quantity : 0;

    console.log(currentQuantity)

    useEffect(() => {
        setQuantity(currentQuantity)
    }, [currentQuantity])

    console.log(productsCart)

    return (
        <div className="flex justify-between whitespace-nowrap items-center min-w-1/4">
            <button
                className="rounded-full w-6 h-6 bg-zinc-500"
                onClick={() => {
                    dispatch(removeToCart({ id, name, size: size }))
                }
                }
                disabled={currentQuantity <= 0}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M0 13H4.25v-2h7.5h7.5v2h-2z" /></svg>
            </button>

            <div className="relative flex items-center">
                <input
                    id={id.toString()}
                    placeholder="1"
                    ref={value}
                    value={currentQuantity || 0}
                    onChange={() => {
                        const q = value.current ? parseInt(value.current.value, 10) : 0;
                        dispatch(manualQuantity({ id, name, size, quantity: q || 0 }))
                    }}
                    className="text-white text-center min-w-5  h-fit field-sizing-content"
                />
            </div>

            <button
                className="rounded-full w-6 h-6 bg-zinc-500"
                onClick={() => {
                    dispatch(addToCart({ id, name, size: size }))
                }
                }
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M11 13H5v-2h6V5h2v6h6v2h-6v6h-2z" /></svg>
            </button>
        </div>
    )
}
