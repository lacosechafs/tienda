"use client"

import { RootState } from '@/redux/makeStore'
import { dataProducts } from '@/types/types'
import { useAppSelector } from '@/hooks/useRedux'
import { useEffect, useRef, useState } from 'react'
import { clickOutside, removeCLickOut } from '@/helpers/click-outside'
import { TransitionLink } from './transition-link'

export const Categories = () => {

    const data = useAppSelector((state: RootState) => state.data.products)

    const [showCat, setShowCat] = useState<boolean>(false)
    const buttonRef = useRef<HTMLDivElement>(null);

    useEffect(() => {

        const handleGlobalClick = (e: MouseEvent) => {
            clickOutside(e, buttonRef, setShowCat)
        }

        return removeCLickOut(handleGlobalClick)

    }, [buttonRef])

    return (
        <div
            className='flex relative'
            ref={buttonRef}

        >
            <a
                className='content-center y-2 cursor-pointer'
                onClick={() => setShowCat(prev => !prev)}
            >
                Categorias
            </a>
            <div className={`top-[calc(100%-16px)] absolute bg-(--background) border border-(--foreground) ${showCat ? "block" : "hidden"}`}>
                <div className="flex flex-col top-15">
                    {data.map(c => {
                        const haveProducts = c.products.some((d: dataProducts) => d.catalog.length)
                        if (haveProducts) {
                            return (
                                <TransitionLink key={c.id} href={c.slug} setShowCat={setShowCat} className="py-px px-2 whitespace-nowrap">
                                    {c.name}
                                </TransitionLink>
                            )
                        }
                    })}
                </div>
            </div>
        </div>
    )
}
