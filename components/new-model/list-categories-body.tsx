import { useDeferredValue, useMemo, useRef, useState } from 'react'
import { AddCartFixed } from './add-cart-fixed'
import { ListProdByCat } from './list-products-bycat'
import { useAppSelector } from '@/hooks/useRedux'
import { RootState } from '@/redux/makeStore'
import { dataCategories, dataProductsPartial } from '@/types/types'

export const ListCategoriesBody = () => {
    const data = useAppSelector((state: RootState) => state.data.products)
    const catListRef = useRef<HTMLDivElement>(null)

    const [prodSelected, setProdSelected] = useState<{
        category: number | null
        catalog: number | null
        index: number
    }>({
        category: null,
        catalog: null,
        index: 0
    })

    const deferredSelected = useDeferredValue(prodSelected)

    const [floatingCategory, setFloatingCategory] = useState(deferredSelected.category)

    if (deferredSelected.catalog && deferredSelected.category !== floatingCategory) {
        setFloatingCategory(deferredSelected.category)
    }

    const activeCategory = useMemo(() => {
        return data?.find(f => f.id === floatingCategory)
    }, [data, floatingCategory])

    const activeProducts = activeCategory?.products.filter((m: dataProductsPartial) => m.catalog.length) ?? []

    const validCategories = useMemo(() => {
        return data?.filter(c => c.products?.some((d: dataProductsPartial) => d.catalog?.length)) ?? []
    }, [data])

    const isOpen = Boolean(deferredSelected.catalog && deferredSelected.category)

    console.log(deferredSelected)

    return (
        <div ref={catListRef}>
            <div className="md:container-md mx-auto flex flex-col justify-center md:justify-start flex-wrap max-w-full-lg pb-5 px-2">
                {validCategories.map(c => (
                    <ListProdByCat
                        key={c.id}
                        id={c.id}
                        name={c.name}
                        prods={c.products}
                        setProdSelected={setProdSelected}
                        prodSelected={prodSelected}
                    />
                ))}
            </div>

            <div
                className={`fixed bottom-2 left-0 right-0 overflow-hidden transition-transform duration-500 ease-out ${isOpen ? 'translate-y-0 pointer-events-auto' : 'translate-y-[calc(100%+16px)] pointer-events-none'
                    }`}
            >
                <div className='flex justify-end'>
                    <button
                        onClick={() => {
                            setProdSelected(prev => ({ ...prev, catalog: null, index: 0 }))
                            setFloatingCategory(null)
                        }}
                    >Canc</button>
                </div>
                <div
                    key={floatingCategory ?? 'no-cat'}
                    className={`flex w-screen transition-transform ease-in-out ${isOpen ? "duration-500" : "duration-0"}`}
                    style={{ transform: `translateX(-${100 * (deferredSelected.index ?? 0)}%)` }}
                >
                    {activeProducts.map((p: dataProductsPartial) => {
                        const visibleProd = prodSelected.catalog === p.id
                        return (
                            <div key={p.id} className='w-full shrink-0 content-end'>
                                <div className='bg-red-500 mx-5 px-2 rounded-lg'>
                                    <p>{p.name}</p>
                                    <AddCartFixed
                                        name={p.name}
                                        title=""
                                        catalog={p.catalog}
                                        visibleProd={visibleProd}
                                    />
                                </div>
                            </div>
                        )
                    }
                    )}
                </div>
            </div>
        </div>
    )
}