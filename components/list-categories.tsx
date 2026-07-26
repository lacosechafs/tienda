import { useAppSelector } from '@/hooks/useRedux'
import { RootState } from '@/redux/makeStore'
import { dataProducts } from '@/types/types'
import React, { Dispatch, SetStateAction } from 'react'
import { TransitionLink } from './transition-link'

export const ListCategories = ({ showCat, setShowCat }: { showCat: boolean, setShowCat: Dispatch<SetStateAction<boolean>> }) => {

    const data = useAppSelector((state: RootState) => state.data.products)

    return (
        <div className={`top-full left-0 right-0 absolute bg-(--backgroundlt) duration-500 overflow-hidden grid ${showCat ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
            <div className='min-h-0'>
                <div className="md:container-md mx-auto flex flex-row justify-around md:justify-start flex-wrap max-w-screen-lg pb-5">
                    {data.map(c => {
                        const haveProducts = c.products.some((d: dataProducts) => d.catalog.length)
                        if (haveProducts) {
                            return (
                                <TransitionLink key={c.id} href={c.slug} setShowCat={setShowCat} className="text-[#fea70e] bg-(--background) px-2 me-1 md:me-2 whitespace-nowrap border w-fit rounded-full mt-5">
                                    {c.name}
                                </TransitionLink>
                            )
                        }
                    })
                    }
                </div>
            </div>
        </div>
    )
}
