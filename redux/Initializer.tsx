"use client"

import { useEffect, useMemo, useRef } from "react";
import { setData } from "./dataSlice";
import { useAppDispatch } from "@/hooks/useRedux";
import { dataProducts } from "@/types/types";
import { calculateFinalPrice } from "@/helpers/calculate-price";

export const Initializer = ({ initialData }: { initialData: any[] }) => {

    const dispatch = useAppDispatch();
    const initialized = useRef(false)

    const today = new Date().getTime()

    const allProducts = useMemo(() => {
        const productsFilter = initialData.map(m => {

            const products = m.products.filter((f: dataProducts) => f.catalog && f.show_product)
                .map((x: dataProducts) => {

                    const catalog = x.catalog.filter(p => p.visible).map(d => {
                        const start = new Date(d.start_discount).getTime()
                        const end = new Date(d.end_discount).getTime()
                        const price = (d.available_discount && (start < today && end > today))
                            ? calculateFinalPrice(d) : d.public_price

                        return { ...d, normal_price: d.public_price, public_price: price, show_discount: d.available_discount && (start < today && end > today) }
                    })

                    return ({
                        id: x.id,
                        name: x.name,
                        catalog: catalog,
                        show_product: x.show_product,
                    })
                }
                )

            return { ...m, products }
        }) || []

        return productsFilter

    }, [initialData]);

    useEffect(() => {
        if (!initialized.current) {
            dispatch(setData(allProducts))
            initialized.current = true
        }
    }, [])

    return null

}
