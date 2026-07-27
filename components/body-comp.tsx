"use client"

import { ReactNode, useEffect, useRef } from 'react'
import PageWrapper from './page-wrapper'
import { AlertStock } from './alert-stock'
import { MyCart } from './my-cart'
import { clickOutside, removeCLickOut } from '@/helpers/click-outside'
import { closeCart } from '@/redux/cartSlice'
import { useAppDispatch } from '@/hooks/useRedux'

export const BodyComp = ({ children }: Readonly<{
    children: ReactNode;
}>) => {

    const bodyRef = useRef(null)
    const dispatch = useAppDispatch()

    useEffect(() => {

        const handleGlobalClick = (e: MouseEvent) => {
            clickOutside(e, [bodyRef], () => dispatch(closeCart()))
        }

        return removeCLickOut(handleGlobalClick)

    }, [bodyRef])

    return (
        <div ref={bodyRef} className="flex w-full min-h-screen justify-center overflow-x-hidden">
            <PageWrapper>
                {children}
                <AlertStock />
            </PageWrapper>
            <MyCart />
        </div>
    )
}
