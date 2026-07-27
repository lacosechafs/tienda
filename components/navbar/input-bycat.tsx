"use client"
import { dataProducts } from "@/types/types"
import { Dispatch, SetStateAction, useEffect, useState } from "react"

export const InputBycat = ({
    categoryName,
    slug,
    currentProducts,
    findCat,
    setFocusItem
}: {
    categoryName: string,
    currentProducts: Array<dataProducts>,
    slug: string,
    findCat: boolean
    setFocusItem: Dispatch<SetStateAction<boolean>>
}) => {

    const [displayedProducts, setDisplayedProducts] = useState(currentProducts)
    const isVisible = currentProducts.length > 0 || findCat

    useEffect(() => {

        if (isVisible) {

            if (currentProducts.length < displayedProducts.length) {
                const timer = setTimeout(() => {
                    setDisplayedProducts(currentProducts)
                }, 500);

                return () => clearTimeout(timer)
            } else {
                setDisplayedProducts(currentProducts)
            }


        } else {
            const timer = setTimeout(() => {
                setDisplayedProducts([])
            }, 500);

            return () => clearTimeout(timer)
        }

    }, [currentProducts, isVisible])

    return (
        <div className={`grid overflow-hidden duration-500 w-auto md:px-3
                ${isVisible
                ? "grid-rows-[1fr]"
                : "delay-50 grid-rows-[0fr]"}
                `}>
            <div className='min-h-0'>
                <a href={slug} onClick={() => setFocusItem(prev => !prev)}>
                    <p className='font-bold text-[18px] border-b my-2'>
                        {categoryName}
                    </p>
                </a>

                {displayedProducts
                    .map(p => {
                        return (
                            <div key={p.id} className={`grid overflow-hidden duration-500 
                                    ${currentProducts.some(s => s.name === p.name)
                                    ? "grid-rows-[1fr] starting:grid-rows-[0fr]"
                                    : "grid-rows-[0fr]"}
                                    `}>
                                <div className='min-h-0'>
                                    <p className='mb-1'>
                                        {p.name}
                                    </p>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}