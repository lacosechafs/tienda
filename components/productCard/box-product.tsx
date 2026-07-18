"use client"

import { dataCatalog } from "@/types/types";
import { SizeZone } from "./size-zone";
import { QuantityInput } from "./quantity-input";
import { useMemo, useState, useEffect } from "react";
import { ProductHero } from "./product-hero";
import { PriceAnimate } from "@/components/price-animation";

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
        }).filter(f => f.public_price && f.visible)
    }, [catalog])

    const [ids, setIds] = useState<number[]>([])

    useEffect(() => {
        setIds(orderCatalog.map(m => m.id))
    }, [orderCatalog])

    return (
        <div className="flex flex-col border border-[#fce49f] rounded-lg m-2">
            <ProductHero ids={ids} orderCatalog={orderCatalog} />
            <h2 className="p-2 min-h-12 font-bold text-[#fea70e]">{name}</h2>
            <div className="flex flex-col justify-between px-3 pb-3 h-full">
                <div className="flex flex-col flex-grow justify-center gap-2 p-1">
                    {orderCatalog.length > 0
                        ? orderCatalog.map(d => {
                            const haveStock = (d.bulk_stock + d.stored_stock) > d.min_stock && d.visible
                            const qStock = (d.bulk_stock + d.stored_stock) - d.min_stock
                            const id = d.id
                            const size = d.size
                            const unit = d.unit
                            const price = d.public_price

                            return (
                                <div key={id} className={`flex items-center justify-between my-1 ${haveStock ? "opacity-100" : "opacity-50"}`}>
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
                                            name,
                                            haveStock: haveStock,
                                            price,
                                            qStock,
                                            unit
                                        }}
                                    />
                                </div>
                            )
                        })
                        : <div>Proximamente disponible</div>
                    }
                </div>
                <PriceAnimate cartProducts={orderCatalog} />
            </div>
        </div >
    )
}