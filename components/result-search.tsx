import { useAppSelector } from '@/hooks/useRedux'
import { RootState } from '@/redux/makeStore'
import { dataProducts, InputResultsType } from '@/types/types'
import { Dispatch, SetStateAction, useEffect, useRef } from 'react'
import { InputBycat } from './navbar/input-bycat'
import { clickOutside, removeCLickOut } from '@/helpers/click-outside'

export const ResultSearch = ({ findProduct, focusItem, setFocusItem, inputRef }: InputResultsType) => {

    const products = useAppSelector((state: RootState) => state.data.products)

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

    const resultRef = useRef<HTMLDivElement>(null)

    useEffect(() => {

        const handleGlobalClick = (e: MouseEvent) => {
            clickOutside(e, [inputRef, resultRef], setFocusItem)
        }

        return removeCLickOut(handleGlobalClick)

    }, [inputRef, resultRef, setFocusItem])

    const hasCatMatch = search.length >= 3 && products.some(c => normalizeText(c.name).includes(search))
    const anyResult = flatProducts.length > 0 || hasCatMatch

    return (
        <div ref={resultRef} className={`grid px-3 bg-(--backgroundlt) md:grid-flow-row-dense md:[grid-template-columns:repeat(auto-fill,minmax(270px,1fr))] transition-discrete duration-500 ${focusItem && anyResult ? "opacity-100 block starting:opacity-0 grid-rows-[1fr]" : "opacity-0 hidden grid-rows-[0fr]"}`}>
            {products.map(f => {
                const productsByCategory = flatProducts.filter(m =>
                    m.category === f.name
                );

                const findCat = (search.length >= 3 && normalizeText(f.name).includes(search) || search === "")

                if (!productsByCategory.length) return


                return (
                    <InputBycat
                        key={f.name}
                        categoryName={f.name}
                        slug={f.slug}
                        currentProducts={productsByCategory}
                        findCat={findCat}
                        setFocusItem={setFocusItem}
                    />
                )
            })
            }
        </div>
    )
}
