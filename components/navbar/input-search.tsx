"use client"

import { useAppSelector } from '@/hooks/useRedux'
import { RootState } from '@/redux/makeStore'
import { dataProducts } from '@/types/types'
import { useEffect, useRef, useState } from 'react'
import { InputBycat } from './input-bycat'

export const InputSearch = () => {

    const products = useAppSelector((state: RootState) => state.data.products)

    const [findProduct, setFindProduct] = useState<string>("");

    const normalizeText = (text: string) =>
        text
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase()

    const search = normalizeText(findProduct.trim())
    const searchSplit = search.split(/\s+/).filter(Boolean);

    const flatProducts = products.flatMap(fmap => {
        const cat = fmap.name
        const element = fmap.products.map((e: dataProducts) => ({ ...e, category: cat }))

        return element
    }).filter(f => {

        if (findProduct.length < 3) return false;
        const nameProd = normalizeText(f.name)

        return searchSplit.every(s =>
            nameProd.includes(s)
        )
    })

    const hasCatMatch = search.length >= 3 && products.some(c => normalizeText(c.name).includes(search))
    const anyResult = flatProducts.length > 0 || hasCatMatch

    const searchRef = useRef<HTMLDivElement>(null)
    const [focusItem, setFocusItem] = useState(true)

    const isFocus = (e: MouseEvent) => {
        if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
            setFocusItem(false)
        } else {
            setFocusItem(true)
        }
    }

    useEffect(() => {
        document.addEventListener("mousedown", isFocus);

        return () => {
            document.removeEventListener("mousedown", isFocus);
        };
    }, []);

    return (
        <div className="flex flex-col w-full h-fit self-center relative p-2" ref={searchRef} >
            <input id='search' className='px-2 placeholder:text-center' type="text" placeholder='Busqueda de producto' onChange={(e) => setFindProduct(e.target.value)} autoComplete='off' />
            {/* Resultados */}
            <div className={`grid md:absolute top-[calc(100%-8px)] left-0 right-0 px-3 bg-(--backgroundlt) transition-discrete duration-500 ${focusItem && anyResult ? "opacity-100 block starting:opacity-0 grid-rows-[1fr]" : "opacity-0 hidden grid-rows-[0fr]"}`}>
                {products.map(f => {
                    const productsByCategory = flatProducts.filter(m =>
                        m.category === f.name
                    );

                    const findCat = (search.length >= 3 && normalizeText(f.name).includes(search) || search === "")

                    return (
                        <InputBycat
                            key={f.name}
                            categoryName={f.name}
                            slug={f.slug}
                            currentProducts={productsByCategory}
                            findCat={findCat}
                        />
                    )
                })
                }
            </div>
        </div>
    )
}