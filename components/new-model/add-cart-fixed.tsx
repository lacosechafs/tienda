"use client"
import { useMemo, useState } from 'react'
import { SizeZone } from '../productCard/size-zone';
import { QuantityInput } from '../productCard/quantity-input';
import { dataCatalog } from '@/types/types';

export const AddCartFixed = ({
    name,
    title,
    catalog,
    visibleProd
}: { name: string, title: string, catalog: Array<dataCatalog>; visibleProd: boolean; }) => {

    const [openOptions, setOpenOptions] = useState<Record<string, number>>({ index: 0, id: 0 });
    const [openAddOptions, setOpenAddOptions] = useState<boolean>(false);

    const orderCatalog = useMemo(() => {
        return [...catalog]
            .filter(f => f.public_price && f.visible)
            .sort((a, b) => {
                const valueA = (a.unit === "kg" || a.unit === "l") ? a.size * 1000 : a.size
                const valueB = (b.unit === "kg" || b.unit === "l") ? b.size * 1000 : b.size
                return valueB - valueA;
            })
    }, [catalog]);

    return (
        <div className="flex flex-col justify-between md:pb-2 h-fit">
            <div
                className="flex flex-col flex-grow gap-2 duration-300 ease-in-out"
            // style={{ transform: `translateY(-${openOptions.index * 40}px)` }}
            >
                {orderCatalog.length > 0
                    && orderCatalog.map(d => {
                        const qStock = (d.bulk_stock + d.stored_stock) - d.min_stock;
                        const { id, size, unit, public_price, show_discount, percentage_discount } = d;
                        const selected = openOptions.id === d.id

                        return (
                            <div key={title + size} className={`flex items-center justify-between my-1 ${qStock > 0 ? "opacity-100" : "opacity-50"}`}>
                                <SizeZone
                                    obj={d}
                                    openAddOptions={visibleProd}
                                    show_discount={show_discount}
                                    percentage_discount={percentage_discount}
                                />
                                <QuantityInput
                                    id={id}
                                    size={size}
                                    name={name}
                                    haveStock={qStock > 0}
                                    price={public_price}
                                    qStock={qStock}
                                    unit={unit}
                                />
                            </div>
                        );
                    })
                }
            </div>
        </div>
    )
}
