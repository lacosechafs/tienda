"use client"

import { useAppSelector } from '@/hooks/useRedux'
import { RootState } from '@/redux/makeStore'
import { dataProducts } from '@/types/types'
import { ListProducts } from './list-products'

export const FeaturedProducts = () => {

    const products = useAppSelector((state: RootState) => state.data.products)

    const flatFeatured = products.flatMap(m => {
        return m.products.filter((f: dataProducts) => f.catalog.some(s => s.featured))
            .map((x: dataProducts) => ({
                id: x.id,
                name: x.name,
                catalog: x.catalog.filter(p => p.featured),
                show_product: x.show_product
            }))
    }) || []

    return (
        <ListProducts products={flatFeatured} title="Destacados" />
    )
}
