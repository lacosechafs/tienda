import { dataCatalog, SliceType } from '@/types/types'

export const getTotal = (productsInCart: Array<SliceType>, cartProducts: Array<dataCatalog>) => {

    const calc = productsInCart.reduce((acc, item) => {
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

        return acc + finalPrice * (item.quantity || 0)
    }, 0)

    return calc
}
