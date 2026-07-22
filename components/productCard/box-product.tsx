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
    title: string,
}

export const BoxProduct = ({
    name,
    catalog,
    title
}: Props) => {
    const orderCatalog = useMemo(() => {
        return [...catalog].sort((a, b) => {
            const valueA = a.unit === "kg" ? a.size * 1000 : a.size
            const valueB = b.unit === "kg" ? b.size * 1000 : b.size
            return valueB - valueA
        }).filter(f => f.public_price && f.visible)
    }, [catalog])

    const [ids, setIds] = useState<number[]>([])
    const [openOptions, setOpenOptions] = useState<number>(0)

    useEffect(() => {
        setIds(orderCatalog.map(m => m.id))
    }, [orderCatalog])

    return (
        <div className="flex flex-col border border-[#fce49f] rounded-lg h-full">
            <ProductHero ids={ids} orderCatalog={orderCatalog} />
            <h2 className="p-2 min-h-12 font-bold text-[#fea70e]">{name}</h2>

            {orderCatalog.length > 0 &&
                <div className="flex px-2">
                    {orderCatalog.map((m, i) => {
                        const haveStock = (m.bulk_stock + m.stored_stock) > m.min_stock && m.visible

                        return (
                            <button
                                key={`${title}-${m.id}`}
                                onClick={() => setOpenOptions(i)}
                                className={`border rounded-lg px-2 py-1 me-4 duration-500 ${openOptions === i ? "bg-[#fea70e50]" : ""} ${!haveStock ? "opacity-50" : "opacity-100"}`}
                                disabled={!haveStock}
                            >
                                {m.size}{m.unit}
                            </button>
                        )
                    })
                    }
                </div>
            }


            <div className="flex flex-col justify-between px-3 pb-3 pt-2 h-full">
                <div
                    className=" py-1 h-[40px] overflow-hidden"
                >
                    <div className="flex flex-col flex-grow gap-2 duration-300"
                        style={{ transform: `translateY(-${openOptions * 40}px)` }}
                    >
                        {orderCatalog.length > 0
                            ? orderCatalog.map(d => {
                                const haveStock = (d.bulk_stock + d.stored_stock) > d.min_stock && d.visible
                                const qStock = (d.bulk_stock + d.stored_stock) - d.min_stock
                                const id = d.id
                                const size = d.size
                                const unit = d.unit
                                const price = d.public_price

                                return (
                                    <div key={title + size} className={`flex items-center justify-between my-1 ${haveStock ? "opacity-100" : "opacity-50"}`}>
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
                            : <div>Próximamente disponible</div>
                        }
                    </div>
                </div>
                {/* <div className="flex">
                    Total:
                    <PriceAnimate cartProducts={orderCatalog} fontSize={16} />
                </div> */}
            </div>
        </div >
    )
}