"use client"

import { useAppSelector } from '@/hooks/useRedux'
import { RootState } from '@/redux/makeStore'
import { BoxProduct } from './productCard/box-product'
import { dataProducts } from '@/types/types'

export const FeaturedProducts = () => {

    const products = useAppSelector((state: RootState) => state.data.products)

    const flatFeatured = products.flatMap(m => {
        return m.products.filter((f: dataProducts) => f.catalog.some(s => s.featured))
            .map((x: dataProducts) => ({
                id: x.id,
                name: x.name,
                featured: x.catalog.filter(p => p.featured)
            }))
    })

    console.log(flatFeatured)

    return (
        <div>
            <h1>Destacados</h1>
            <div className="container mx-auto gap-4 grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] mt-10">
                {flatFeatured.map(m => {
                    return (
                        <BoxProduct catalog={m.featured} name={m.name} id={m.id} key={m.id} />
                    )
                })
                }
            </div>
        </div>
    )
}
