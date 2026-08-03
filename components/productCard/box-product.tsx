"use client"

import { PropsBoxProduct } from "@/types/types";
import { useMemo, useState, useEffect } from "react";
import { ProductHero } from "./product-hero";
import { DataProduct } from "./data-product";
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
    }, [catalog]);

    const [ids, setIds] = useState<number[]>([]);

    useEffect(() => {
        setIds(orderCatalog.map(m => m.id));
    }, [orderCatalog]);


    return (
        <div className="flex flex-col border border-[#fce49f] rounded-lg h-full">
            {title
                ? <div className="flex flex-row-reverse md:flex-col relative">
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
                :
                <DataFavs
                    name={name}
                />

            }
        </div>
    );
};