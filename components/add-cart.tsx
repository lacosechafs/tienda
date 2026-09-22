"use client"
import React, { useEffect, useMemo, useState } from 'react'
import { SizeZone } from './productCard/size-zone';
import { QuantityInput } from './productCard/quantity-input';
import { dataCatalog } from '@/types/types';

export const AddCart = ({
    name,
    title,
    orderCatalog
}) => {

    const [openOptions, setOpenOptions] = useState<Record<string, number>>({ index: 0, id: 0 });
    const [openAddOptions, setOpenAddOptions] = useState<boolean>(false);

    return (
        <div className="flex flex-col justify-between md:pb-2 h-fit">
            <div className="py-1 h-[40px] overflow-hidden">
                <div
                    className="flex flex-col flex-grow gap-2 duration-300 ease-in-out"
                    style={{ transform: `translateY(-${openOptions.index * 40}px)` }}
                >
                    {orderCatalog.length > 0
                        ? orderCatalog.map(d => {
                            const qStock = (d.bulk_stock + d.stored_stock) - d.min_stock;
                            const { id, size, unit, public_price, show_discount, percentage_discount } = d;
                            const selected = openOptions.id === d.id

                            return (
                                <div key={title + size} className={`flex items-center justify-between my-1 ${qStock > 0 ? "opacity-100" : "opacity-50"}`}>
                                    <SizeZone
                                        obj={d}
                                        selected={selected}
                                        openAddOptions={openAddOptions}
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
                        : <div>Próximamente disponible</div>
                    }
                </div>
            </div>
        </div>
    )
}
