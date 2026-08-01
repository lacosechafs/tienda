"use client"
import { dataProducts } from "@/types/types"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { GridComp } from "../grid-comp"

export const InputBycat = ({
    categoryName,
    slug,
    currentProducts,
    findCat,
    setOpenOptions
}: {
    categoryName: string,
    currentProducts: Array<dataProducts>,
    slug: string,
    findCat: boolean
    setOpenOptions: Dispatch<SetStateAction<string | null>>
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
        <GridComp
            condition={isVisible}
            extraClass="w-auto lg:px-3"
        >
            <a href={slug} onClick={() => setOpenOptions(null)}>
                <p className='font-bold text-[18px] border-b my-2'>
                    {categoryName}
                </p>
            </a>

            {displayedProducts
                .map(p => {
                    return (
                        <GridComp
                            key={p.id}
                            condition={currentProducts.some(s => s.name === p.name)}
                        >
                            <p className='mb-1'>
                                {p.name}
                            </p>
                        </GridComp>

                    )
                })
            }
        </GridComp>
    )
}