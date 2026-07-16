'use client'

import { useRouter } from 'next/navigation'
import React, { ReactNode } from 'react'

interface TransitionLinkProps {
    href: string
    children: ReactNode
    className?: string
    setShowCat: React.Dispatch<React.SetStateAction<boolean>>
}

export const TransitionLink = ({ href, children, setShowCat, className }: TransitionLinkProps) => {
    const router = useRouter()

    const handleNavigation = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault()

        const pageContainer = document.getElementById('page-wrapper')
        if (pageContainer) {
            pageContainer.classList.remove('opacity-100')
            pageContainer.classList.add('opacity-0')
        }

        router.push(href)
    }

    return (
        <a href={href} onClick={(e) => { handleNavigation(e); setShowCat(prev => !prev) }} className={className}>
            {children}
        </a>
    )
}