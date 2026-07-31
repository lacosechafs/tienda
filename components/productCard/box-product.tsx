"use client"

import { PropsBoxProduct } from "@/types/types";
import { useMemo, useState, useEffect } from "react";
import { ProductHero } from "./product-hero";
import { DataProduct } from "./data-product";
import { calculateFinalPrice } from "@/helpers/calculate-price";
import { DataFavs } from "./data-favs";

export const BoxProduct = ({
    id,
    name,
    catalog,
    title
}: PropsBoxProduct) => {

    const orderCatalog = useMemo(() => {
        return [...catalog]
            .filter(f => f.public_price && f.visible)
            .sort((a, b) => {
                const valueA = (a.unit === "kg" || a.unit === "l") ? a.size * 1000 : a.size
                const valueB = (b.unit === "kg" || b.unit === "l") ? b.size * 1000 : b.size
                return valueB - valueA;
            })
            .map(item => ({
                ...item,
                finalPrice: calculateFinalPrice(item)
            }));
    }, [catalog]);

    const [ids, setIds] = useState<number[]>([]);

    useEffect(() => {
        setIds(orderCatalog.map(m => m.id));
    }, [orderCatalog]);

    return (
        <div className="flex flex-col border border-[#fce49f] rounded-lg h-full">
            {title
                ? <>
                    <ProductHero ids={ids} orderCatalog={orderCatalog} />
                    <DataProduct
                        {...{
                            id,
                            name,
                            title,
                            orderCatalog
                        }}
                    />
                </>
                :
                <DataFavs
                    name={name}
                />

            }
        </div>
    );
};