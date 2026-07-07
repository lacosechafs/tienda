"use client"

import { RootState } from '@/redux/makeStore'
import { dataProducts } from '@/types/types'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

export const InputSearch = () => {

    const products = useSelector((state: RootState) => state.data.products)

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

    return (
        <div className="flex h-fit self-center relative p-2">
            <input id='search' type="text" placeholder='Busqueda de producto' onChange={(e) => setFindProduct(e.target.value.trim())} />
            {/* Resultados */}
            <div className="absolute top-[calc(100%-8px)] left-2 px-2 bg-red-500">
                {products.map(f => {
                    const productosDeEstaCategoria = flatProducts.filter(m =>
                        m.category === f.name
                    );

                    if (productosDeEstaCategoria.length === 0) return null;

                    return (
                        <div key={f.name}>
                            <p>
                                {f.name}
                            </p>
                            {productosDeEstaCategoria
                                .map(p => {
                                    return (
                                        <div>
                                            <p key={p.id}>
                                                {p.name}
                                            </p>

                                        </div>
                                    )
                                })
                            }

                        </div>
                    )
                })
                }
            </div>
        </div>
    )
}
