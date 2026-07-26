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

const calculateFinalPrice = (item: dataCatalog) => {
    if (!item.available_discount || !item.percentage_discount) {
        return item.public_price;
    }

    const now = Date.now();

    const hasStarted = item.start_discount
        ? new Date(item.start_discount).getTime() <= now
        : true;

    const hasNotEnded = item.end_discount
        ? new Date(item.end_discount).getTime() >= now
        : true;

    const isDiscountActive = hasStarted && hasNotEnded;

    if (isDiscountActive) {
        const discountAmount = item.public_price * (item.percentage_discount / 100);
        return Math.round((item.public_price - discountAmount) * 100) / 100;
    }

    return item.public_price;
};

export const BoxProduct = ({
    name,
    catalog,
    title
}: Props) => {
    const orderCatalog = useMemo(() => {
        return [...catalog]
            .filter(f => f.public_price && f.visible)
            .sort((a, b) => {
                const valueA = a.unit === "kg" ? a.size * 1000 : a.size;
                const valueB = b.unit === "kg" ? b.size * 1000 : b.size;
                return valueB - valueA;
            })
            .map(item => ({
                ...item,
                finalPrice: calculateFinalPrice(item)
            }));
    }, [catalog]);

    const [ids, setIds] = useState<number[]>([]);
    const [openOptions, setOpenOptions] = useState<number>(0);

    useEffect(() => {
        setIds(orderCatalog.map(m => m.id));
    }, [orderCatalog]);

    return (
        <div className="flex justify-between flex-col border border-[#fce49f] rounded-lg h-full">
            <ProductHero ids={ids} orderCatalog={orderCatalog} />
            <div className="p-2">
                <div className="w-full">
                    <h2 className="md:min-h-12 font-bold text-[#fea70e] content-center">{name}</h2>
                </div>
                <div className="flex flex-col w-full justify-around md:p-0">
                    {orderCatalog.length > 0 &&
                        <div className="flex py-2">
                            {orderCatalog.map((m, i) => {
                                const haveStock = (m.bulk_stock + m.stored_stock) > m.min_stock && m.visible;

                                return (
                                    <button
                                        key={`${title}-${m.id}`}
                                        onClick={() => setOpenOptions(i)}
                                        className={`border rounded-lg px-2 py-1 me-4 duration-500 ${openOptions === i ? "bg-[#fea70e50]" : ""} ${!haveStock ? "opacity-50" : "opacity-100"}`}
                                        disabled={!haveStock}
                                    >
                                        {m.size}{m.unit}
                                    </button>
                                );
                            })}
                        </div>
                    }

                    <div className="flex flex-col justify-between md:pb-2 h-fit">
                        <div className="py-1 h-[40px] overflow-hidden">
                            <div
                                className="flex flex-col flex-grow gap-2 duration-300"
                                style={{ transform: `translateY(-${openOptions * 40}px)` }}
                            >
                                {orderCatalog.length > 0
                                    ? orderCatalog.map(d => {
                                        const haveStock = (d.bulk_stock + d.stored_stock) > d.min_stock && d.visible;
                                        const qStock = (d.bulk_stock + d.stored_stock) - d.min_stock;
                                        const { id, size, unit, finalPrice } = d;

                                        return (
                                            <div key={title + size} className={`flex items-center justify-between my-1 ${haveStock ? "opacity-100" : "opacity-50"}`}>
                                                <SizeZone
                                                    id={id}
                                                    size={size}
                                                    unit={unit}
                                                    haveStock={haveStock}
                                                    price={finalPrice}
                                                />
                                                <QuantityInput
                                                    id={id}
                                                    size={size}
                                                    name={name}
                                                    haveStock={haveStock}
                                                    price={finalPrice}
                                                    qStock={qStock}
                                                    unit={unit}
                                                />
                                            </div>
                                        );
                                    })
                                    : <div>Próximamente disponible</div>
                                }
                            </div>
                        </div>
                    </div>
                    <div className="flex md:hidden justify-end">
                        <PriceAnimate cartProducts={orderCatalog} fontSize={16} title="Subtotal" />
                    </div>
                </div>
            </div>
        </div>
    );
};