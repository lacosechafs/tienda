"use client"

import { PropsBoxProduct } from "@/types/types";
import { useMemo, useState, useEffect } from "react";
import { ProductHero } from "./product-hero";
import { DataProduct } from "./data-product";
import { DataFavs } from "./data-favs";
import { DisplayWidth } from "@/helpers/display-width";

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
    }, [catalog]);

    const [ids, setIds] = useState<number[]>([]);

    useEffect(() => {
        setIds(orderCatalog.map(m => m.id));
    }, [orderCatalog]);


    const displayWidth = DisplayWidth()
    const maxDiscount = Math.max(...orderCatalog.map(m => m.percentage_discount))

    return (
        <div className="flex flex-col border border-[#fce49f] rounded-lg h-full">
            <div className="flex flex-row-reverse md:flex-col relative">
                <ProductHero ids={ids} orderCatalog={orderCatalog} />
                <DataProduct
                    {...{
                        id,
                        name,
                        title,
                        orderCatalog,
                        ids
                    }}
                />
            </div>
        </div>
    );
};