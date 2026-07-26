import React from 'react'
import { useAppSelector } from '../hooks/useRedux'
import { RootState } from '@/redux/makeStore'
import { dataCatalog } from '@/types/types'
import { SelectorNumber } from './productCard/selectorNumber'

export const PriceAnimate = ({
    cartProducts,
    fontSize,
    delay,
    title,
}: {
    cartProducts: Array<dataCatalog>
    fontSize: number
    delay?: number
    title?: string
}) => {
    const productsInCart = useAppSelector((state: RootState) => state.cart.products) || []

    const rawSubTotal = productsInCart.reduce((acc, item) => {
        const product = cartProducts.find((f) => f.id === item.id)

        if (!product) return acc

        let hasActiveDiscount = false

        if (product.available_discount && product.start_discount && product.end_discount) {
            const today = new Date().getTime()
            const start = new Date(product.start_discount).getTime()
            const end = new Date(product.end_discount).getTime()

            hasActiveDiscount = start < today && end > today
        }

        const discount = hasActiveDiscount ? product.percentage_discount / 100 : 0
        const finalPrice = product.public_price * (1 - discount)

        return acc + finalPrice * item.quantity
    }, 0)

    const formattedSubTotal = rawSubTotal.toLocaleString('es-ES', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        useGrouping: true,
    })

    const formatedNum = formattedSubTotal.split('')

    const MIN_LENGTH = 8
    const fullArray = [
        ...new Array(formatedNum.length < MIN_LENGTH ? MIN_LENGTH - formatedNum.length : 0).fill('0'),
        ...formatedNum,
    ]

    return (
        <div className='flex md:flex-col'>
            {title && <h2 className='me-1'>{title}</h2>}
            <div
                className="flex overflow-hidden"
                style={{ height: `calc(${fontSize + fontSize / 2}px)`, fontSize: `${fontSize}px` }}
            >
                <span>$</span>
                {fullArray.map((char: string, i: number) => {
                    if (char === '.' || char === ',') {
                        return (
                            <span key={`sep-${i}`} className="separator text-center">
                                {char}
                            </span>
                        )
                    }

                    const indexDot = fullArray.length - 7

                    if (i === indexDot) {
                        return (
                            <span key={`sep-${i}`} className="separator text-center">
                                .
                            </span>
                        );
                    }




                    const digit = parseInt(char, 10)

                    if (isNaN(digit)) {
                        return <span key={`char-${i}`}>{char}</span>
                    }

                    return (
                        <SelectorNumber
                            key={`digit-${fullArray.length - i}`}
                            digit={digit}
                            delay={delay}
                            fontSize={fontSize}
                        />
                    )
                })}
            </div>
        </div>
    )
}