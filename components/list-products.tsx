"use client"

import { useAppSelector } from "@/hooks/useRedux"
import { RootState } from "@/redux/makeStore"

export const ListProducts = async () => {

    const products = useAppSelector((state: RootState) => state.data.products)

    return (
        {/* <div className='flex flex-col w-full'>
                {products?.map(d => {
                    return (
                        <div key={d.slug} id={d.slug} className='my-4 @container'>
                            <p>{d.name}</p>
                            <div className="grid grid-cols-[repeat(auto-fill,minmax(266px,1fr))]">
                                {d.products.map((p: dataProducts) => {
                                    if (p.catalog.length === 0) return
                                    return (
                                        <BoxProduct
                                            key={p.id}
                                            {...{
                                                name: p.name,
                                                catalog: p.catalog,
                                                id: p.id,
                                            }} />

                                    )
                                })}
                            </div>
                        </div>
                    )
                })}
            </div> */}
    )
}
