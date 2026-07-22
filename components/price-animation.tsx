import React from 'react'
import { useAppSelector } from '../hooks/useRedux'
import { RootState } from '@/redux/makeStore'
import { dataCatalog } from '@/types/types'
import { SelectorNumber } from '@/components/productCard/selectorNumber'

export const PriceAnimate = ({ cartProducts, fontSize, delay, title }: { cartProducts: Array<dataCatalog>, fontSize: number, delay?: number, title?: string }) => {

    const productsInCart = useAppSelector((state: RootState) => state.cart.products) || []

    const subTotal = productsInCart.reduce((acc, item) => acc + ((cartProducts.find(f => f.id === item.id)?.public_price || 0) * item.quantity), 0).toLocaleString('es-ES', { useGrouping: 'always' }) || "0"
    const formatedNum = subTotal.split('')
    const fullArray = [...new Array((formatedNum.length <= 5 ? 5 - formatedNum.length : 0)).fill("0"), ...formatedNum]

    return (
        <div>
            <h2>{title}</h2>
            <div className={`flex overflow-hidden`}
                style={{ height: `calc(${fontSize + (fontSize / 2)}px)`, fontSize: `${fontSize}px` }}
            >
                $
                {fullArray.map((num: string, i: number) => {
                    const indexDot = fullArray.length - 4

                    if (num === '.' || num === ',') {
                        return (
                            <span key={`sep-${i}`} className="separator text-center">
                                {num}
                            </span>
                        );
                    }
                    if (i === indexDot) {
                        return (
                            <span key={`sep-${i}`} className="separator text-center">
                                .
                            </span>
                        );
                    }

                    const digit = parseInt(num, 10)

                    return (
                        <SelectorNumber
                            key={`digit-${fullArray.length - i}`}
                            digit={digit}
                            delay={delay}
                            fontSize={fontSize}
                        />
                    )
                })
                }
            </div>
        </div>

    )
}
