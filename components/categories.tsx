"use client"

import { useEffect, useRef, useState } from 'react'
import { clickOutside, removeCLickOut } from '@/helpers/click-outside'
import { ListCategories } from './list-categories'

export const Categories = () => {

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
            className='flex flex-col'
            ref={buttonRef}

        >
            <a
                className='content-center y-2 cursor-pointer'
                onClick={() => setShowCat(prev => !prev)}
            >
                Categorias
            </a>
            <ListCategories showCat={showCat} setShowCat={setShowCat} />
        </div>
    )
}
