"use client"

import { useAppSelector } from '@/hooks/useRedux'
import { RootState } from '@/redux/makeStore'
import { dataProducts } from '@/types/types'
import { ListProducts } from './list-products'

export const ProductsOffers = () => {

    const products = useAppSelector((state: RootState) => state.data.products)

    const offersDeadLine = new Date().getTime()

    const flatOffers = products.flatMap(m => {
        return m.products.filter((f: dataProducts) => f.catalog.some(s => {
            if (!s.end_discount || !s.start_discount) return

            const today = new Date().getTime()
            const start = new Date(s.start_discount).getTime()
            const end = new Date(s.end_discount).getTime()

            return s.available_discount && (s.bulk_stock + s.stored_stock) - s.min_stock && (start < today && end > today)
        }))
            .map((x: dataProducts) => ({
                id: x.id,
                name: x.name,
                catalog: x.catalog.filter(p => p.available_discount && p.visible),
                show_product: x.show_product
            }))
    }) || []

    // console.log(today)
    // console.log(flatOffers)

    return (
        <ListProducts products={flatOffers} title="Ofertas" />
    )
}
