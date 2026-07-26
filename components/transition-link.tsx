'use client'

import { usePathname, useRouter } from 'next/navigation'
import { Dispatch, MouseEvent, ReactNode, SetStateAction } from 'react'

interface TransitionLinkProps {
    href: string
    children: ReactNode
    className?: string
    setShowCat?: Dispatch<SetStateAction<boolean>>
}

export const TransitionLink = ({ href, children, setShowCat, className }: TransitionLinkProps) => {
    const router = useRouter()
    const pathname = usePathname()

    const handleNavigation = (e: MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault()

        if (pathname === (href === "/" ? "/" : `/${href}`)) return

        const pageContainer = document.getElementById('page-wrapper')
        if (pageContainer) {
            pageContainer.classList.remove('opacity-100')
            pageContainer.classList.add('opacity-0')
        }

        router.push(href)
    }

    return (
        <a href={href} onClick={(e) => { handleNavigation(e); setShowCat && setShowCat(prev => !prev) }} className={className}>
            {children}
        </a>
    )
}