import { dataCategories } from '@/types/types'
import { useMemo } from 'react'

export const FlatStock = ({ products }: { products: Array<dataCategories> }) => {
    const flatProductsSet = useMemo(() => {
        const set = new Set<string | number>()
        const len = products.length

        for (let i = 0; i < len; i++) {
            const subProducts = products[i].products;
            const subLen = subProducts.length;

            for (let j = 0; j < subLen; j++) {
                const catalog = subProducts[j].catalog;
                const catLen = catalog.length;

                for (let k = 0; k < catLen; k++) {
                    const d = catalog[k];

                    const hasEnoughStock = (d.bulk_stock + d.stored_stock) > d.min_stock;
                    const isVisible = d.visible;
                    const isShowProduct = subProducts[j].show_product


                    if (!hasEnoughStock || !isVisible || !isShowProduct) {
                        set.add(d.id);
                    }
                }
            }
        }
        return set
    }, [products])

    return flatProductsSet
}