import { useAppSelector } from "@/hooks/useRedux";
import { RootState } from "@/redux/makeStore";

interface Props {
    id: number;
    size: number;
    unit: string;
    haveStock: boolean;
    price: number;
}

export const SizeZone = ({
    id,
    size,
    unit,
    haveStock,
    price
}: Props) => {

    const product = useAppSelector((state: RootState) => state.data.products)

    const productsInCart = useAppSelector((state: RootState) => state.cart.products)

    const productInfo = productsInCart.find(f => f.id === id && f.size === size) || null

    const arrayOriginal = product.map(p => p.products.flatMap((m: any) => m.name)).flat()
    const arrayUnit = [...new Set(product.map(p => p.products.flatMap((m: any) => m.catalog).map((e: any) => e.unit)).flat())]

    return (
        <div
            className={`me-3 flex ${haveStock ? " opacity-100" : "opacity-50"}`}
        >
            <p>
                {size + unit}
            </p>
            <p className="ms-1 opacity-80">
                ({haveStock ? `$${price.toLocaleString('es-ES', { useGrouping: 'always' })}` : "Sin stock"})
            </p>
        </div >

    )
}
