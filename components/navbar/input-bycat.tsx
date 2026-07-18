import { dataProducts } from "@/types/types"
import { useEffect, useState } from "react"


export const InputBycat = ({
    categoryName,
    currentProducts
}: { categoryName: string, currentProducts: Array<dataProducts> }) => {

    const [displayedProducts, setDisplayedProducts] = useState(currentProducts)
    const isVisible = currentProducts.length > 0

    useEffect(() => {

        if (isVisible) {
            setDisplayedProducts(currentProducts)
        } else {
            const timer = setTimeout(() => {
                setDisplayedProducts([])
            }, 500);

            return () => clearTimeout(timer)
        }

    }, [currentProducts, isVisible])

    return (
        <div className={`grid overflow-hidden duration-500 
        ${isVisible ? "grid-rows-[1fr]" : "delay-50 grid-rows-[0fr]"}
        `}>
            <div className='min-h-0'>
                <p className='font-bold text-[18px] border-b my-2'>
                    {categoryName}
                </p>
                {displayedProducts
                    .map(p => {
                        return (
                            <p key={p.id} className='mb-1'>
                                {p.name}
                            </p>
                        )
                    })
                }
            </div>
        </div>
    )
}
