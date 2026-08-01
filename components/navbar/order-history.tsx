import { useAppSelector } from "@/hooks/useRedux"
import { RootState } from "@/redux/makeStore"
import { GridComp } from "../grid-comp"
import { useEffect, useState } from "react"
import { ProductGroup } from "@/types/types"

export const OrderHistory = () => {

    const [openOrder, setOpenOrder] = useState<number | null>(null)
    const [productsOrder, setProductsOrder] = useState<Array<ProductGroup>>([])
    const ordersUser = useAppSelector((state: RootState) => state.user.data).orders

    useEffect(() => {
        if (openOrder !== null) {
            setTimeout(() => {
                setProductsOrder(ordersUser?.[openOrder]?.products as Array<ProductGroup>);
            }, 500);
        } else {
            setTimeout(() => {
                setProductsOrder([])
            }, 500);
        }
    }, [openOrder, ordersUser]);

    return (
        <div>
            <div className="flex flex-1 flex-wrap">
                {ordersUser?.map((m, i) => {
                    const fecha = new Date(m.created_at)

                    const year = fecha.getFullYear()
                    const month = String(fecha.getMonth() + 1).padStart(2, '0')
                    const day = String(fecha.getDate()).padStart(2, '0')

                    const isSelected = openOrder === i
                    const isAnyOpen = openOrder !== null
                    const isHidden = isAnyOpen && !isSelected

                    return (
                        <div
                            key={m.id}
                            className={`
                                relative overflow-hidden min-w-0
                                transition-[width,height] duration-500 ease-in-out
                                ${isHidden
                                    ? "w-0 h-0 delay-300"
                                    : "w-[98px] h-[24px] delay-500"
                                }
                        `}>
                            <button
                                onClick={() => setOpenOrder(isSelected ? null : i)}
                                className={`
                                    w-fit h-full whitespace-nowrap
                                    transition-opacity duration-300 ease-in-out
                                    ${isHidden
                                        ? "opacity-0 delay-0"
                                        : "opacity-100 delay-1000"
                                    }
                            `}>
                                {`${day}/${month}/${year}`}
                            </button>

                        </div>
                    )
                })}
            </div>
            <GridComp condition={openOrder !== null} class1fr="delay-800" class0fr="delay-0">
                {productsOrder?.map(p => {
                    return Object.entries(p).map(([key, value], i) => {
                        return (
                            <div key={i}>
                                <h3>{key}</h3>
                                {value?.map(v => {
                                    return (
                                        <div key={v.id}>{v.quantity}x {v.size}{v.unit}</div>
                                    )
                                }
                                )}
                            </div>
                        )
                    })
                }
                )}
            </GridComp>
        </div>
    )
}
