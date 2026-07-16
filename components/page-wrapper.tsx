'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState, ReactNode } from 'react'

export default function PageWrapper({ children }: { children: ReactNode }) {
    const pathname = usePathname()
    const [opacityClass, setOpacityClass] = useState('opacity-0')

    useEffect(() => {
        setOpacityClass('opacity-0')

        const timer = setTimeout(() => {
            setOpacityClass('opacity-100')
        }, 50)

        return () => clearTimeout(timer);
    }, [pathname])

    return (
        <div
            id="page-wrapper"
            className={`transition-opacity duration-300 ease-in-out ${opacityClass}`}
        >
            {children}
        </div>
    )
}