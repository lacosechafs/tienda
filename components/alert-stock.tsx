"use client"

import { useAppSelector } from '@/hooks/useRedux'
import { RootState } from '@/redux/makeStore'

export const AlertStock = () => {

    const showAlert = useAppSelector((state: RootState) => state.cart.stock)

    return (
        <div
            className={`flex items-center fixed bottom-5 left-1/2 -translate-x-1/2 text-center 
                duration-500 transition-discrete bg-red-600 text-white font-medium px-4 py-3 
                rounded-lg shadow-2xl border border-red-500 backdrop-blur-sm tracking-wide z-50
                ${showAlert
                    ? "opacity-100 scale-100 block starting:opacity-0 starting:scale-95"
                    : "opacity-0 scale-95 hidden"
                }`}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                className="flex-shrink-0 animate-pulse text-red-100"
            >
                <path fill="currentColor" d="M12 2L1 21h22M12 6l7.53 13H4.47M11 10v4h2v-4m-2 6v2h2v-2" />
            </svg>
            <p className="ms-3 text-sm whitespace-nowrap">
                No es posible agregar más unidades de este producto.
            </p>
        </div>
    )
}
