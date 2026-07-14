"use client"

import { RootState } from '@/redux/makeStore'
import { dataProducts } from '@/types/types'
import { useAppSelector } from '@/hooks/useRedux'
import { useEffect, useRef, useState } from 'react'

export const Categories = () => {

    const data = useAppSelector((state: RootState) => state.data.products)

    const [showCat, setShowCat] = useState<boolean>(false)
    const buttonRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const clickOutside = (e: MouseEvent) => {
            if (buttonRef.current && !buttonRef.current.contains(e.target as Node)) {
                setShowCat(false)
            }
        }

        document.addEventListener('mousedown', clickOutside)
        return () => {
            document.removeEventListener('mousedown', clickOutside)
        }

    }, [])

    return (
        <div
            className='flex relative'
            ref={buttonRef}

        >
            <a
                className='content-center p-2'
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
                                <div key={c.id} className="my-1 px-2 whitespace-nowrap">
                                    <a
                                        href={c.slug}
                                        onClick={() => setShowCat(prev => !prev)}
                                    >
                                        {c.name}
                                    </a>
                                </div>
                            )
                        }
                    })}
                </div>
            </div>
        </div>
    )
}
