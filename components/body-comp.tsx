"use client"

import { ReactNode } from 'react'
import PageWrapper from './page-wrapper'
import { AlertStock } from './alert-stock'
import { MyCart } from './my-cart'

export const BodyComp = ({ children }: Readonly<{
    children: ReactNode;
}>) => {

    return (
        <div className="w-full max-w-screen-2xl self-center flex justify-center">
            <PageWrapper>
                {children}
                <AlertStock />
            </PageWrapper>
            <MyCart />
        </div>
    )
}
