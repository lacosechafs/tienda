"use client"

import { ReactNode } from 'react'
import PageWrapper from './page-wrapper'
import { AlertStock } from './alert-stock'
import { MyCart } from './my-cart'

export const BodyComp = ({ children }: Readonly<{
    children: ReactNode;
}>) => {

    return (
        <div className="flex w-full min-h-screen justify-center overflow-x-hidden">
            <PageWrapper>
                {children}
                <AlertStock />
            </PageWrapper>
            <MyCart />
        </div>
    )
}
