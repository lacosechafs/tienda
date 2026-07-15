"use client"

import { dataCatalog } from "@/types/types";
import { SizeZone } from "./size-zone";
import { QuantityInput } from "./quantity-input";
import { useAppSelector } from "@/hooks/useRedux";
import { RootState } from "@/redux/makeStore";
import { useEffect, useMemo, useState } from "react";
import { SelectorNumber } from "./selectorNumber";
import { ProductHero } from "./product-hero";

interface Props {
    name: string,
    catalog: Array<dataCatalog>;
    id: number;
}

export const BoxProduct = ({
    name,
    catalog
}: Props) => {

    const orderCatalog = useMemo(() => {
        return [...catalog].sort((a, b) => {
            const valueA = a.unit === "kg" ? a.size * 1000 : a.size
            const valueB = b.unit === "kg" ? b.size * 1000 : b.size
            return valueB - valueA
        })
    }, [catalog])

    const productsInCart = useAppSelector((state: RootState) => state.cart.products)

    const [ids, setIds] = useState<number[]>([])

    useEffect(() => {
        setIds(orderCatalog.map(m => m.id))
    }, [orderCatalog])

    const subTotal = productsInCart.reduce((acc, item) => acc + ((orderCatalog.find(f => f.id === item.id)?.public_price || 0) * item.quantity), 0).toLocaleString('es-ES', { useGrouping: 'always' })

    const formatedNum = subTotal.split('')
    const fullArray = [...new Array((formatedNum.length <= 5 ? 5 - formatedNum.length : 0)).fill("0"), ...formatedNum]

    return (
        <div className="flex flex-col border border-[#fce49f] rounded-lg m-2">
            <ProductHero ids={ids} orderCatalog={orderCatalog} />
            <h2 className="p-2 min-h-12 font-bold text-[#fea70e]">{name}</h2>
            <div className="flex flex-col justify-between px-3 pb-3 h-full">
                <div className="flex flex-col gap-2 p-1">
                    {orderCatalog.map(d => {
                        const haveStock = (d.bulk_stock + d.stored_stock) > 1
                        const id = d.id
                        const size = d.size
                        const unit = d.unit
                        const price = d.public_price

                        return (
                            <div key={id} className="flex items-center justify-between my-1">
                                <SizeZone
                                    {...{
                                        id,
                                        size,
                                        unit,
                                        haveStock: haveStock,
                                        price
                                    }} />
                                <QuantityInput
                                    {...{
                                        id,
                                        size,
                                        unit,
                                        name,
                                        haveStock: haveStock,
                                        price
                                    }}
                                />
                            </div>
                        )
                    })}
                </div>
                <div className="flex  h-5 overflow-hidden">
                    $
                    {fullArray.map((num: string, i: number) => {
                        const indexDot = fullArray.length - 4

                        if (num === '.' || num === ',') {
                            return (
                                <span key={`sep-${i}`} className="separator w-[9px] text-center">
                                    {num}
                                </span>
                            );
                        }
                        if (i === indexDot) {
                            return (
                                <span key={`sep-${i}`} className="separator w-[9px] text-center">
                                    .
                                </span>
                            );
                        }

                        const digit = parseInt(num, 10)

                        return (
                            <SelectorNumber
                                key={`digit-${fullArray.length - i}`}
                                digit={digit}
                            />
                        )
                    })}

                </div>
            </div>
        </div >
    )
}
