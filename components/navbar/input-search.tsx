"use client"

import { useAppSelector } from '@/hooks/useRedux'
import { RootState } from '@/redux/makeStore'
import { dataProducts } from '@/types/types'
import { useEffect, useRef, useState } from 'react'
import { InputBycat } from './input-bycat'

export const InputSearch = () => {

    const products = useAppSelector((state: RootState) => state.data.products)

    const [findProduct, setFindProduct] = useState<string>("");

    const flatProducts = products.flatMap(fmap => {
        const cat = fmap.name
        const element = fmap.products.map((e: dataProducts) => e = { ...e, category: cat })

        return element
    }).filter(f => {
        const search = findProduct
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase()
            .split(/\s+/);

        const nameProd = f.name.normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase()

        if (findProduct.length < 3) return false;

        return search.some(s =>
            nameProd.includes(s)
        )
    }).sort((a, b) => {

        const resA = a.name.normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase()
        const resB = b.name.normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase()
        const search = findProduct.normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase()

        const indexA = resA.indexOf(search);
        const indexB = resB.indexOf(search);

        if (indexA === 0 && indexB !== 0) return -1;
        if (indexB === 0 && indexA !== 0) return 1;

        if (indexA !== indexB) {
            return indexA - indexB;
        }

        return a.name.localeCompare(b.name);
    })

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
        <div className="flex h-fit self-center relative p-2" ref={searchRef} >
            <input id='search' className='px-2' type="text" placeholder='Busqueda de producto' onChange={(e) => setFindProduct(e.target.value.trim())} autoComplete='off' />
            {/* Resultados */}
            <div className={`grid absolute top-[calc(100%-8px)] left-0 px-3 bg-(--background) transition-discrete duration-500 ${focusItem && flatProducts.length ? "opacity-100 block starting:opacity-0 grid-rows-[1fr]" : "opacity-0 hidden grid-rows-[0fr]"}`}>
                {products.map(f => {
                    const productsByCategory = flatProducts.filter(m =>
                        m.category === f.name
                    );

                    return (
                        <InputBycat
                            key={f.name}
                            categoryName={f.name}
                            currentProducts={productsByCategory}
                        />
                    )
                })
                }
            </div>
        </div>
    )
}
