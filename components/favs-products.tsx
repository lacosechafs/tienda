"use client"

import { useAppDispatch, useAppSelector } from '@/hooks/useRedux'
import { RootState } from '@/redux/makeStore'
import { dataCatalog, dataProducts } from '@/types/types'
import { useEffect, useMemo, useState } from 'react'
import { QuantityInput } from './productCard/quantity-input'
import { changeData } from '@/redux/userSlice'

export const FavsProducts = () => {

    const products = useAppSelector((state: RootState) => state.data.products)
    const favs = useAppSelector((state: RootState) => state.user.data).favs
    const dispatch = useAppDispatch()

    const visibleProducts = useMemo(() => {
        const productsFilter = products.flatMap(m => {
            return m.products.filter((f: dataProducts) => favs.includes(f.id) && f.catalog && f.show_product)
                .map((x: dataProducts) => ({
                    id: x.id,
                    name: x.name,
                    catalog: x.catalog.filter(p => p.visible),
                    show_product: x.show_product,
                }))
        }) || []

        const mapProducts = new Map(productsFilter.map(m => [m.id, m]))
        const estrictOrder = favs.map(m => mapProducts.get(m)).filter(Boolean)
        return estrictOrder

    }, [favs.length]);

    const [productSelected, setProductSelected] = useState<{ id: number | null, index: number }>({ id: null, index: 0 })

    const [favSelected, setFavSelected] = useState({
        name: '',
        id: 0,
        size: 0,
        finalPrice: 0,
        haveStock: false,
        qStock: 0,
        unit: '',
        i: 0
    })

    useEffect(() => {
        if (!visibleProducts.length) return

        if (favs) {
            setProductSelected({ id: favs[0], index: 0 })
        }
    }, [favs, visibleProducts])

    console.log(visibleProducts, favs)

    useEffect(() => {
        if (!visibleProducts.length) return

        const currentProduct = visibleProducts[productSelected.index] ?? visibleProducts[0]

        if (!visibleProducts[productSelected.index] && productSelected.index !== 0) {
            setProductSelected({ id: currentProduct.id, index: 0 })
            return
        }

        const hasStocked = currentProduct?.catalog
            ?.sort((a: dataCatalog, b: dataCatalog) => {
                const valueA = (a.unit === "kg" || a.unit === "l") ? a.size * 1000 : a.size
                const valueB = (b.unit === "kg" || b.unit === "l") ? b.size * 1000 : b.size
                return valueB - valueA
            })
            .find((d: dataCatalog) => (d.bulk_stock + d.stored_stock) > d.min_stock)

        if (!hasStocked) return

        const qStock = (hasStocked.bulk_stock + hasStocked.stored_stock) - hasStocked.min_stock

        setFavSelected(prev => ({
            ...prev,
            name: currentProduct.name,
            id: hasStocked.id,
            size: hasStocked.size,
            finalPrice: hasStocked.public_price,
            haveStock: qStock > 0,
            qStock: qStock,
            unit: hasStocked.unit
        }))

    }, [productSelected, visibleProducts])

    return (
        <div className='flex flex-col justify-between h-full'>
            <div className={`flex flex-1 content-start flex-wrap duration-500 pe-3 overflow-y-scroll scrollbar-thin ${visibleProducts.length > 0 ? "opacity-100 delay-500 transition-discrete starting:opacity-0 block" : "hidden opacity-0"}`}>
                {visibleProducts?.map((m, i) => {
                    return (
                        <div
                            key={m.id}
                            onClick={() => {
                                if (m.id !== productSelected.id) {
                                    setProductSelected({ id: m.id, index: i })
                                }
                            }}
                            className={`h-fit border me-1 mb-1 rounded-lg px-2 py-[2px] duration-500 opacity-100 starting:opacity-0 ${m.id === productSelected.id ? "bg-[#fea70e50]" : ""}`}
                        >
                            {m.name}
                            <button className={`h-full align-sub ms-2 cursor-pointer text-[red] duration-500 hover:text-[white] hover:bg-red-500 rounded-full`}
                                onClick={() => {
                                    let newFavs: Array<number> = []

                                    if (favs.includes(m.id)) {
                                        newFavs = favs.filter(f => f !== m.id)
                                    } else {
                                        return
                                    }

                                    dispatch(changeData({ key: 'favs', value: newFavs }))
                                }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M18.36 19.78L12 13.41l-6.36 6.37l-1.42-1.42L10.59 12L4.22 5.64l1.42-1.42L12 10.59l6.36-6.36l1.41 1.41L13.41 12l6.36 6.36z" />
                                </svg>
                            </button>
                        </div>

                    )
                })
                }
            </div>
            <div className={`duration-500 ${visibleProducts.length === 0 ? "opacity-100 delay-500 transition-discrete starting:opacity-0 block" : "hidden opacity-0"}`}>
                <p>No tienes productos favoritos</p>
            </div>
            <div className={`flex justify-between duration-500 overflow-hidden h-[46px] ${visibleProducts.length > 0 ? "opacity-100 delay-500 transition-discrete starting:opacity-0 block" : "hidden opacity-0"}`}>
                <div className='flex flex-col duration-500'
                    style={{ transform: `translateY(-${productSelected.index * 42}px)` }}
                >
                    {visibleProducts?.map((m, i) => {

                        return (
                            <div
                                key={m.id}
                                className='flex justify-between my-1'>
                                <div className='flex justify-between'>
                                    {m?.catalog
                                        .sort((a: dataCatalog, b: dataCatalog) => {
                                            const valueA = (a.unit === "kg" || a.unit === "l") ? a.size * 1000 : a.size
                                            const valueB = (b.unit === "kg" || b.unit === "l") ? b.size * 1000 : b.size
                                            return valueB - valueA
                                        }).map((d: dataCatalog) => {

                                            const qStock = (d.bulk_stock + d.stored_stock) - d.min_stock;
                                            const { id, size, unit, public_price } = d;

                                            return (
                                                <div key={id}>
                                                    <button
                                                        className={`border rounded-lg min-w-15 px-2 py-1 me-4 duration-500 ease-in-out
                                                        ${qStock > 0 ? "opacity-100" : "opacity-50"}
                                                        ${id === favSelected.id ? "bg-[#fea70e50]" : ""}
                                                        `}
                                                        onClick={() => {
                                                            setFavSelected({
                                                                name: m.name,
                                                                id,
                                                                size,
                                                                finalPrice: public_price,
                                                                haveStock: qStock > 0,
                                                                qStock,
                                                                unit,
                                                                i
                                                            })

                                                        }}
                                                        disabled={qStock === 0}
                                                    >
                                                        {size}{unit}
                                                    </button>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                                <QuantityInput
                                    id={favSelected.id}
                                    size={favSelected.size}
                                    name={m.name}
                                    haveStock={favSelected.haveStock}
                                    price={favSelected.finalPrice}
                                    qStock={favSelected.qStock}
                                    unit={favSelected.unit}
                                />
                            </div>
                        )
                    })
                    }
                </div>
            </div>
        </div >
    )
}